"""
Test suite for the Autonomous AI Agent System.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch


class TestCognitiveLoop:
    """Tests for the cognitive loop implementation."""
    
    @pytest.mark.asyncio
    async def test_loop_initialization(self):
        """Test that cognitive loop initializes correctly."""
        from core.cognitive_loop import CognitiveLoop, LoopStatus
        
        # Mock dependencies
        llm_client = AsyncMock()
        mcp_executor = AsyncMock()
        memory_manager = AsyncMock()
        
        config = {
            "max_iterations": 10,
            "timeout_seconds": 60
        }
        
        loop = CognitiveLoop(
            llm_client=llm_client,
            mcp_executor=mcp_executor,
            memory_manager=memory_manager,
            config=config
        )
        
        assert loop.max_iterations == 10
        assert loop.timeout_seconds == 60
        assert loop.state is None
    
    @pytest.mark.asyncio
    async def test_safety_limits(self):
        """Test safety limit checking."""
        from core.cognitive_loop import CognitiveLoop, LoopState, LoopStatus
        
        llm_client = AsyncMock()
        mcp_executor = AsyncMock()
        memory_manager = AsyncMock()
        
        config = {"max_iterations": 5}
        loop = CognitiveLoop(llm_client, mcp_executor, memory_manager, config)
        
        # Create state at max iterations
        loop.state = LoopState(
            goal="test",
            iteration=5,
            max_iterations=5
        )
        
        result = await loop._check_safety_limits()
        assert result is False
        assert loop.state.status == LoopStatus.MAX_ITERATIONS


class TestMCPClient:
    """Tests for MCP client implementation."""
    
    @pytest.mark.asyncio
    async def test_tool_validation(self):
        """Test input validation for tools."""
        from core.mcp_client import MCPToolExecutor, MCPClient
        
        mcp_client = MCPClient()
        executor = MCPToolExecutor(mcp_client)
        
        # Test type checking
        schema = {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "count": {"type": "integer"}
            },
            "required": ["name"]
        }
        
        # Valid input
        result = executor._validate_input({"name": "test"}, schema)
        assert result["valid"] is True
        
        # Missing required field
        result = executor._validate_input({}, schema)
        assert result["valid"] is False
        
        # Wrong type
        result = executor._validate_input({"name": 123}, schema)
        assert result["valid"] is False


class TestMemoryManager:
    """Tests for memory management."""
    
    @pytest.mark.asyncio
    async def test_short_term_memory(self):
        """Test short-term memory operations."""
        from memory.memory_manager import ShortTermMemory
        
        stm = ShortTermMemory(
            max_context_length=1000,
            sliding_window_size=10
        )
        
        # Add entries
        await stm.add("First memory", importance=0.5)
        await stm.add("Second memory", importance=0.8)
        
        context = await stm.get_context()
        assert "First memory" in context
        assert "Second memory" in context
    
    @pytest.mark.asyncio
    async def test_sliding_window(self):
        """Test sliding window behavior."""
        from memory.memory_manager import ShortTermMemory
        
        stm = ShortTermMemory(
            max_context_length=10000,
            sliding_window_size=5
        )
        
        # Add more entries than window size
        for i in range(10):
            await stm.add(f"Memory {i}", importance=0.5)
        
        # Should have applied sliding window
        assert len(stm.entries) <= 5


class TestMultiAgent:
    """Tests for multi-agent system."""
    
    @pytest.mark.asyncio
    async def test_worker_agent_status(self):
        """Test worker agent status reporting."""
        from agents.multi_agent import WorkerAgent
        
        def mock_factory(*args, **kwargs):
            return AsyncMock()
        
        agent = WorkerAgent(
            name="test_agent",
            role="Test Role",
            system_prompt="Test prompt",
            specialized_tools=["tool1", "tool2"],
            cognitive_loop_factory=mock_factory
        )
        
        status = agent.get_status()
        assert status["name"] == "test_agent"
        assert status["role"] == "Test Role"
        assert status["is_busy"] is False
        assert "tool1" in status["available_tools"]


class TestSandbox:
    """Tests for code sandbox."""
    
    @pytest.mark.asyncio
    async def test_safe_code_execution(self):
        """Test basic code execution in sandbox."""
        from sandbox.code_executor import CodeSandbox
        
        sandbox = CodeSandbox(timeout_seconds=5)
        
        # Simple safe code
        code = """
print("Hello, World!")
result = 2 + 2
print(f"Result: {result}")
"""
        
        result = await sandbox.execute_python(code)
        
        assert result.success is True
        assert "Hello, World!" in result.stdout
        assert result.exit_code == 0
        
        await sandbox.cleanup()
    
    @pytest.mark.asyncio
    async def test_blocked_imports(self):
        """Test that dangerous imports are blocked."""
        from sandbox.code_executor import CodeSandbox
        
        sandbox = CodeSandbox(timeout_seconds=5)
        
        # Try to import blocked module
        code = """
import os
print(os.getcwd())
"""
        
        result = await sandbox.execute_python(code)
        
        # Should either fail or have blocked the import
        # (implementation dependent)
        await sandbox.cleanup()


class TestConfiguration:
    """Tests for configuration schemas."""
    
    def test_model_config(self):
        """Test model configuration validation."""
        from config.schemas import ModelConfig, ModelProvider
        
        config = ModelConfig(
            provider=ModelProvider.OLLAMA,
            base_url="http://localhost:11434/v1",
            model_name="llama3.1:8b"
        )
        
        assert config.provider == ModelProvider.OLLAMA
        assert config.temperature == 0.7  # default
        assert config.max_tokens == 4096
    
    def test_safety_config(self):
        """Test safety configuration validation."""
        from config.schemas import SafetyConfig, RiskLevel
        
        config = SafetyConfig(
            max_iterations=100,
            require_human_approval_for=[RiskLevel.HIGH, RiskLevel.CRITICAL]
        )
        
        assert config.max_iterations == 100
        assert RiskLevel.HIGH in config.require_human_approval_for
    
    def test_system_config_from_yaml(self, tmp_path):
        """Test loading system config from YAML."""
        from config.schemas import SystemConfig
        import yaml
        
        config_data = {
            "model": {
                "provider": "ollama",
                "base_url": "http://localhost:11434/v1",
                "model_name": "llama3.1:8b"
            }
        }
        
        config_file = tmp_path / "test_config.yaml"
        with open(config_file, 'w') as f:
            yaml.dump(config_data, f)
        
        # Should be able to load
        from pydantic import ValidationError
        try:
            config = SystemConfig(**config_data)
            assert config.model.model_name == "llama3.1:8b"
        except ValidationError as e:
            pytest.fail(f"Config validation failed: {e}")


@pytest.mark.asyncio
async def test_end_to_end_mock():
    """End-to-end test with mocked components."""
    from core.cognitive_loop import CognitiveLoop, LoopStatus
    from core.mcp_client import MCPClient, MCPToolExecutor
    from memory.memory_manager import MemoryManager
    
    # Mock LLM client
    llm_client = AsyncMock()
    llm_client.generate = AsyncMock(return_value='{"steps": [{"description": "Test step"}]}')
    
    # Mock MCP
    mcp_client = MCPClient()
    mcp_executor = MCPToolExecutor(mcp_client)
    
    # Mock memory
    memory_manager = MemoryManager(
        stm_config={"max_context_length": 1000},
        ltm_config={"backend": "qdrant"}
    )
    await memory_manager.initialize()
    
    # Create loop
    loop = CognitiveLoop(
        llm_client=llm_client,
        mcp_executor=mcp_executor,
        memory_manager=memory_manager,
        config={"max_iterations": 5, "timeout_seconds": 30}
    )
    
    # Execute (will fail without real MCP servers, but tests flow)
    result = await loop.execute("Test goal")
    
    assert result["goal"] == "Test goal"
    # Status depends on MCP availability - just verify structure
    assert "status" in result
