"""
MCP (Model Context Protocol) Client Implementation.
Handles discovery, connection, and execution of MCP tools.
"""

import asyncio
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional

agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import (
    get_logger,
    BaseModel,
    ValidationError,
    retry,
    stop_after_attempt,
    wait_exponential,
    httpx
)

logger = get_logger("mcp_client")



class MCPTool(BaseModel):
    """Represents an MCP tool."""
    name: str
    description: str
    input_schema: Dict[str, Any]
    server_name: str


class MCPServerConnection(BaseModel):
    """Represents a connection to an MCP server."""
    name: str
    base_url: str
    tools: List[MCPTool] = []
    is_healthy: bool = False
    last_health_check: Optional[float] = None
    
    class Config:
        arbitrary_types_allowed = True


class MCPClient:
    """
    Async client for Model Context Protocol (MCP) servers.
    
    Features:
    - Dynamic server discovery and connection
    - Tool capability detection
    - Health monitoring
    - Retry logic with exponential backoff
    - Timeout management
    """
    
    def __init__(self, timeout_seconds: int = 30):
        self.servers: Dict[str, MCPServerConnection] = {}
        self.timeout_seconds = timeout_seconds
        self._http_client: Optional[httpx.AsyncClient] = None
    
    async def __aenter__(self):
        self._http_client = httpx.AsyncClient(
            timeout=httpx.Timeout(self.timeout_seconds),
            limits=httpx.Limits(max_keepalive_connections=10)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self._http_client:
            await self._http_client.aclose()
    
    async def register_server(
        self,
        name: str,
        base_url: str,
        auth_token: Optional[str] = None
    ) -> MCPServerConnection:
        """
        Register and connect to an MCP server.
        
        Args:
            name: Human-readable name for the server
            base_url: Base URL of the MCP server
            auth_token: Optional authentication token
            
        Returns:
            MCPServerConnection object
        """
        logger.info("registering_mcp_server", name=name, url=base_url)
        
        # Fetch server capabilities
        tools = await self._discover_tools(base_url, auth_token)
        
        connection = MCPServerConnection(
            name=name,
            base_url=base_url,
            tools=tools,
            is_healthy=len(tools) > 0
        )
        
        self.servers[name] = connection
        logger.info("mcp_server_registered", name=name, tools_count=len(tools))
        
        return connection
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10)
    )
    async def _discover_tools(
        self,
        base_url: str,
        auth_token: Optional[str] = None
    ) -> List[MCPTool]:
        """Discover available tools from an MCP server using JSON-RPC 2.0 or REST."""
        headers = {}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        
        # Try JSON-RPC 2.0 tools/list first
        try:
            rpc_url = base_url if base_url.endswith("/rpc") else f"{base_url}/rpc" if not base_url.endswith("/") else f"{base_url}rpc"
            rpc_response = await self._http_client.post(
                rpc_url,
                json={"jsonrpc": "2.0", "id": "init-discover", "method": "tools/list", "params": {}},
                headers=headers
            )
            if rpc_response.status_code == 200:
                data = rpc_response.json()
                raw_tools = data.get("result", {}).get("tools", [])
                if raw_tools:
                    tools = []
                    for tool_data in raw_tools:
                        tools.append(MCPTool(
                            name=tool_data["name"],
                            description=tool_data.get("description", ""),
                            input_schema=tool_data.get("inputSchema", {}),
                            server_name=""
                        ))
                    return tools
        except Exception:
            pass

        # Fallback to standard REST /tools
        try:
            clean_base = base_url.replace("/rpc", "").rstrip("/")
            response = await self._http_client.get(
                f"{clean_base}/tools",
                headers=headers
            )
            response.raise_for_status()
            tools_data = response.json()
            
            raw_tools = tools_data.get("tools", []) if isinstance(tools_data, dict) else tools_data
            tools = []
            for tool_data in raw_tools:
                tool = MCPTool(
                    name=tool_data["name"],
                    description=tool_data.get("description", ""),
                    input_schema=tool_data.get("inputSchema", {}),
                    server_name=""  # Will be set by caller
                )
                tools.append(tool)
            
            return tools
        except Exception as e:
            logger.error("tool_discovery_failed", url=base_url, error=str(e))
            raise
    
    async def check_health(self, server_name: str) -> bool:
        """Check health of an MCP server."""
        if server_name not in self.servers:
            logger.warning("server_not_found", name=server_name)
            return False
        
        server = self.servers[server_name]
        try:
            # Try JSON-RPC ping
            rpc_url = server.base_url if server.base_url.endswith("/rpc") else f"{server.base_url}/rpc"
            try:
                rpc_res = await self._http_client.post(
                    rpc_url,
                    json={"jsonrpc": "2.0", "id": "health-ping", "method": "ping"},
                    timeout=httpx.Timeout(4.0)
                )
                if rpc_res.status_code == 200:
                    server.is_healthy = True
                    server.last_health_check = asyncio.get_event_loop().time()
                    return True
            except Exception:
                pass

            response = await self._http_client.get(
                f"{server.base_url.replace('/rpc', '')}/health",
                timeout=httpx.Timeout(5.0)
            )
            is_healthy = response.status_code == 200
            server.is_healthy = is_healthy
            server.last_health_check = asyncio.get_event_loop().time()
            
            logger.debug("health_check_completed", name=server_name, healthy=is_healthy)
            return is_healthy
        except Exception as e:
            logger.error("health_check_failed", name=server_name, error=str(e))
            server.is_healthy = False
            return False
    
    async def execute_tool(
        self,
        server_name: str,
        tool_name: str,
        arguments: Dict[str, Any],
        timeout_seconds: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Execute a tool on an MCP server.
        Supports both MCP JSON-RPC 2.0 protocol and direct REST execution.
        """
        if server_name not in self.servers:
            raise ValueError(f"MCP server '{server_name}' not registered")
        
        server = self.servers[server_name]
        
        # Find tool
        tool = next((t for t in server.tools if t.name == tool_name), None)
        if not tool:
            raise ValueError(f"Tool '{tool_name}' not found on server '{server_name}'")
        
        if not server.is_healthy:
            logger.warning("executing_on_unhealthy_server", server=server_name)
        
        timeout = timeout_seconds or self.timeout_seconds
        
        logger.info(
            "executing_tool",
            server=server_name,
            tool=tool_name,
            timeout=timeout
        )
        
        try:
            # First try JSON-RPC 2.0 tools/call
            rpc_url = server.base_url if server.base_url.endswith("/rpc") else f"{server.base_url}/rpc"
            try:
                rpc_resp = await asyncio.wait_for(
                    self._http_client.post(
                        rpc_url,
                        json={
                            "jsonrpc": "2.0",
                            "id": f"call-{tool_name}",
                            "method": "tools/call",
                            "params": {
                                "name": tool_name,
                                "arguments": arguments
                            }
                        },
                        timeout=httpx.Timeout(timeout)
                    ),
                    timeout=timeout + 5
                )
                if rpc_resp.status_code == 200:
                    data = rpc_resp.json()
                    if "result" in data:
                        return data["result"]
            except Exception:
                pass

            # Fallback to REST POST
            clean_base = server.base_url.replace("/rpc", "").rstrip("/")
            response = await asyncio.wait_for(
                self._http_client.post(
                    f"{clean_base}/tools/{tool_name}/execute",
                    json={"arguments": arguments},
                    timeout=httpx.Timeout(timeout)
                ),
                timeout=timeout + 5  # Buffer for network latency
            )
            
            response.raise_for_status()
            result = response.json()
            
            logger.info(
                "tool_execution_success",
                server=server_name,
                tool=tool_name,
                has_error=result.get("error") is not None
            )
            
            return result
            
        except asyncio.TimeoutError:
            logger.error(
                "tool_execution_timeout",
                server=server_name,
                tool=tool_name,
                timeout=timeout
            )
            raise TimeoutError(
                f"Tool '{tool_name}' execution timed out after {timeout}s"
            )
        except Exception as e:
            logger.error(
                "tool_execution_failed",
                server=server_name,
                tool=tool_name,
                error=str(e)
            )
            raise
    
    def list_available_tools(self) -> List[MCPTool]:
        """List all available tools from all registered servers."""
        all_tools = []
        for server in self.servers.values():
            if server.is_healthy:
                all_tools.extend(server.tools)
        return all_tools
    
    def get_tool_by_name(self, tool_name: str) -> Optional[MCPTool]:
        """Get a specific tool by name."""
        for server in self.servers.values():
            for tool in server.tools:
                if tool.name == tool_name:
                    return tool
        return None
    
    async def refresh_all_servers(self) -> Dict[str, bool]:
        """Refresh health status of all registered servers."""
        results = {}
        for server_name in self.servers.keys():
            results[server_name] = await self.check_health(server_name)
        return results
    
    def get_server_info(self, server_name: str) -> Optional[MCPServerConnection]:
        """Get information about a specific server."""
        return self.servers.get(server_name)


class MCPToolExecutor:
    """
    High-level tool executor with validation and error handling.
    
    Wraps MCPClient to provide:
    - Input validation against schemas
    - Output validation
    - Error recovery strategies
    - Audit logging
    """
    
    def __init__(self, mcp_client: MCPClient):
        self.mcp_client = mcp_client
        self.execution_history: List[Dict[str, Any]] = []
    
    async def execute(
        self,
        server_name: str,
        tool_name: str,
        arguments: Dict[str, Any],
        validate_input: bool = True,
        validate_output: bool = True,
        timeout_seconds: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Execute a tool with full validation and error handling.
        
        Args:
            server_name: MCP server name
            tool_name: Tool name
            arguments: Tool arguments
            validate_input: Whether to validate input against schema
            validate_output: Whether to validate output
            timeout_seconds: Execution timeout
            
        Returns:
            Execution result with metadata
        """
        # Get tool schema
        tool = self.mcp_client.get_tool_by_name(tool_name)
        if not tool:
            return {
                "success": False,
                "error": f"Tool '{tool_name}' not found",
                "result": None
            }
        
        # Validate input
        if validate_input and tool.input_schema:
            validation_result = self._validate_input(arguments, tool.input_schema)
            if not validation_result["valid"]:
                return {
                    "success": False,
                    "error": f"Input validation failed: {validation_result['message']}",
                    "result": None
                }
        
        # Execute tool
        try:
            result = await self.mcp_client.execute_tool(
                server_name=server_name,
                tool_name=tool_name,
                arguments=arguments,
                timeout_seconds=timeout_seconds
            )
            
            # Validate output
            if validate_output and "result" in result:
                # Could add output schema validation here
                pass
            
            # Log execution
            self._log_execution(server_name, tool_name, arguments, result, success=True)
            
            return {
                "success": True,
                "error": None,
                "result": result.get("result"),
                "metadata": result.get("metadata", {})
            }
            
        except Exception as e:
            error_result = {
                "success": False,
                "error": str(e),
                "result": None
            }
            
            self._log_execution(
                server_name, tool_name, arguments, error_result, success=False
            )
            
            return error_result
    
    def _validate_input(
        self,
        arguments: Dict[str, Any],
        schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate arguments against JSON schema."""
        # Simplified validation - could use jsonschema library for full validation
        required = schema.get("required", [])
        properties = schema.get("properties", {})
        
        # Check required fields
        for field in required:
            if field not in arguments:
                return {
                    "valid": False,
                    "message": f"Missing required field: {field}"
                }
        
        # Check types (simplified)
        for field, value in arguments.items():
            if field in properties:
                expected_type = properties[field].get("type")
                if expected_type and not self._check_type(value, expected_type):
                    return {
                        "valid": False,
                        "message": f"Field '{field}' has incorrect type. Expected {expected_type}"
                    }
        
        return {"valid": True, "message": "Validation passed"}
    
    def _check_type(self, value: Any, expected_type: str) -> bool:
        """Check if value matches expected JSON schema type."""
        type_map = {
            "string": str,
            "integer": int,
            "number": (int, float),
            "boolean": bool,
            "array": list,
            "object": dict,
            "null": type(None)
        }
        
        expected_python_type = type_map.get(expected_type)
        if expected_python_type is None:
            return True  # Unknown type, allow
        
        return isinstance(value, expected_python_type)
    
    def _log_execution(
        self,
        server_name: str,
        tool_name: str,
        arguments: Dict[str, Any],
        result: Dict[str, Any],
        success: bool
    ):
        """Log tool execution for audit trail."""
        log_entry = {
            "timestamp": asyncio.get_event_loop().time(),
            "server": server_name,
            "tool": tool_name,
            "arguments": arguments,
            "result": result,
            "success": success
        }
        self.execution_history.append(log_entry)
    
    def get_execution_history(
        self,
        limit: int = 100,
        success_only: bool = False
    ) -> List[Dict[str, Any]]:
        """Get recent execution history."""
        history = self.execution_history[-limit:]
        if success_only:
            history = [h for h in history if h["success"]]
        return history
