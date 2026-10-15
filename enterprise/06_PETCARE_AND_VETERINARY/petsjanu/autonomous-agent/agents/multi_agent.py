"""
Multi-Agent System Implementation.
Orchestrator and specialized worker agents.
"""

import asyncio
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime

agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import get_logger

logger = get_logger("multi_agent")



@dataclass
class SubTask:
    """Represents a delegated sub-task."""
    id: str
    description: str
    assigned_agent: str
    status: str = "pending"  # pending, running, completed, failed
    result: Optional[str] = None
    error: Optional[str] = None
    parent_task_id: Optional[str] = None
    dependencies: List[str] = field(default_factory=list)


@dataclass
class AgentState:
    """State of a worker agent."""
    name: str
    role: str
    system_prompt: str
    specialized_tools: List[str]
    is_busy: bool = False
    current_task: Optional[str] = None
    tasks_completed: int = 0
    tasks_failed: int = 0


class WorkerAgent:
    """
    Specialized worker agent for specific task types.
    
    Each worker has:
    - Defined role and expertise
    - Specialized tool access
    - Own cognitive loop instance
    """
    
    def __init__(
        self,
        name: str,
        role: str,
        system_prompt: str,
        specialized_tools: List[str],
        cognitive_loop_factory
    ):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.specialized_tools = specialized_tools
        self.cognitive_loop_factory = cognitive_loop_factory
        
        self.state = AgentState(
            name=name,
            role=role,
            system_prompt=system_prompt,
            specialized_tools=specialized_tools
        )
        
        self._current_loop = None
    
    async def execute_task(
        self,
        task_description: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute a task using the cognitive loop."""
        logger.info(
            "worker_executing_task",
            agent=self.name,
            task=task_description
        )
        
        self.state.is_busy = True
        self.state.current_task = task_description
        
        try:
            # Create cognitive loop with agent-specific configuration
            loop = self.cognitive_loop_factory(
                agent_name=self.name,
                system_prompt=self.system_prompt,
                allowed_tools=self.specialized_tools
            )
            
            self._current_loop = loop
            
            # Build initial context
            initial_context = f"Agent Role: {self.role}\n"
            if context:
                initial_context += f"Additional Context: {context}\n"
            
            # Execute
            result = await loop.execute(
                goal=task_description,
                initial_context=initial_context
            )
            
            # Update statistics
            if result["status"] == "completed":
                self.state.tasks_completed += 1
            else:
                self.state.tasks_failed += 1
            
            return result
            
        finally:
            self.state.is_busy = False
            self.state.current_task = None
            self._current_loop = None
    
    async def cancel_current_task(self):
        """Cancel the currently executing task."""
        if self._current_loop and self.state.is_busy:
            logger.warning("cancelling_task", agent=self.name)
            # In production, would need to signal cancellation to the loop
            self.state.is_busy = False
            self.state.current_task = None
    
    def get_status(self) -> Dict[str, Any]:
        """Get current agent status."""
        return {
            "name": self.state.name,
            "role": self.state.role,
            "is_busy": self.state.is_busy,
            "current_task": self.state.current_task,
            "tasks_completed": self.state.tasks_completed,
            "tasks_failed": self.state.tasks_failed,
            "available_tools": self.specialized_tools
        }


class OrchestratorAgent:
    """
    Manager agent that coordinates worker agents.
    
    Responsibilities:
    - Parse high-level goals
    - Decompose into sub-tasks
    - Assign tasks to appropriate workers
    - Monitor progress and handle failures
    - Aggregate results
    """
    
    def __init__(
        self,
        worker_agents: List[WorkerAgent],
        llm_client,
        mcp_executor,
        memory_manager,
        config: Dict[str, Any]
    ):
        self.workers = {agent.name: agent for agent in worker_agents}
        self.llm_client = llm_client
        self.mcp_executor = mcp_executor
        self.memory_manager = memory_manager
        self.config = config
        
        self.max_parallel_tasks = config.get("max_parallel_tasks", 3)
        self.decomposition_strategy = config.get("decomposition_strategy", "hierarchical")
        
        self.active_tasks: Dict[str, SubTask] = {}
        self.completed_tasks: List[SubTask] = []
        self._lock = asyncio.Lock()
        
        # Prompts for orchestration
        self.prompts = self._load_prompts()
    
    def _load_prompts(self) -> Dict[str, str]:
        """Load orchestration prompts."""
        return {
            "decompose": """You are a task decomposition expert. Break down complex goals into manageable sub-tasks.

GOAL: {goal}

AVAILABLE AGENTS:
{agents_info}

Decompose the goal into 2-{max_subtasks} sub-tasks. Each sub-task should:
1. Be clear and specific
2. Be assignable to a single agent type
3. Have minimal dependencies on other sub-tasks
4. Contribute directly to achieving the goal

Format your response as JSON:
{{
    "subtasks": [
        {{
            "description": "Sub-task description",
            "assigned_agent": "agent_name",
            "dependencies": [],
            "priority": 1
        }}
    ],
    "overall_strategy": "Brief explanation of the approach"
}}""",

            "assign": """You are a task assignment manager. Match sub-tasks to the best available agent.

SUB-TASK: {subtask_description}

AVAILABLE AGENTS:
{agents_info}

AGENT CURRENT LOAD:
{agent_load}

Select the most appropriate agent considering:
1. Agent specialization and tools
2. Current workload
3. Past performance (if known)

Respond with JSON:
{{
    "assigned_agent": "agent_name",
    "reasoning": "Why this agent was chosen"
}}"""
        }
    
    async def execute_goal(self, goal: str) -> Dict[str, Any]:
        """
        Execute a high-level goal by coordinating workers.
        
        Args:
            goal: High-level goal description
            
        Returns:
            Execution result with aggregated outputs
        """
        logger.info("orchestrator_executing_goal", goal=goal)
        
        start_time = datetime.now().timestamp()
        
        try:
            # Phase 1: Decompose goal
            subtasks = await self._decompose_goal(goal)
            
            if not subtasks:
                return {
                    "status": "failed",
                    "error": "Failed to decompose goal",
                    "goal": goal
                }
            
            # Phase 2: Create task plan
            task_plan = await self._create_task_plan(subtasks, goal)
            
            # Phase 3: Execute tasks (with parallelism)
            results = await self._execute_task_plan(task_plan)
            
            # Phase 4: Aggregate results
            final_result = await self._aggregate_results(goal, results)
            
            execution_time = datetime.now().timestamp() - start_time
            
            return {
                "status": final_result.get("status", "completed"),
                "goal": goal,
                "execution_time_seconds": execution_time,
                "subtasks_created": len(subtasks),
                "subtasks_completed": sum(
                    1 for t in self.completed_tasks if t.status == "completed"
                ),
                "aggregated_result": final_result.get("content", ""),
                "task_details": [
                    {
                        "id": t.id,
                        "description": t.description,
                        "agent": t.assigned_agent,
                        "status": t.status
                    }
                    for t in self.completed_tasks
                ]
            }
            
        except Exception as e:
            logger.error("orchestration_failed", error=str(e))
            return {
                "status": "failed",
                "error": str(e),
                "goal": goal
            }
    
    async def _decompose_goal(self, goal: str) -> List[Dict[str, Any]]:
        """Decompose goal into sub-tasks."""
        agents_info = "\n".join([
            f"- {agent.name}: {agent.role} (Tools: {', '.join(agent.specialized_tools)})"
            for agent in self.workers.values()
        ])
        
        max_subtasks = self.config.get("max_subtasks", 5)
        
        prompt = self.prompts["decompose"].format(
            goal=goal,
            agents_info=agents_info,
            max_subtasks=max_subtasks
        )
        
        response = await self.llm_client.generate(prompt)
        
        try:
            data = __import__("json").loads(response)
            subtasks = data.get("subtasks", [])
            logger.info("goal_decomposed", subtask_count=len(subtasks))
            return subtasks
        except Exception as e:
            logger.error("decomposition_failed", error=str(e))
            # Fallback: create single task
            return [{
                "description": goal,
                "assigned_agent": list(self.workers.keys())[0] if self.workers else "unknown",
                "dependencies": [],
                "priority": 1
            }]
    
    async def _create_task_plan(
        self,
        subtasks: List[Dict[str, Any]],
        goal: str
    ) -> List[SubTask]:
        """Create executable task plan."""
        task_plan = []
        
        for i, subtask in enumerate(subtasks):
            task = SubTask(
                id=f"task_{i}_{datetime.now().timestamp()}",
                description=subtask["description"],
                assigned_agent=subtask.get("assigned_agent", "unknown"),
                parent_task_id=goal,
                dependencies=subtask.get("dependencies", [])
            )
            task_plan.append(task)
            self.active_tasks[task.id] = task
        
        logger.info("task_plan_created", task_count=len(task_plan))
        return task_plan
    
    async def _execute_task_plan(
        self,
        task_plan: List[SubTask]
    ) -> List[Dict[str, Any]]:
        """Execute task plan with parallelism."""
        results = []
        completed_ids = set()
        
        async def execute_task(task: SubTask) -> Dict[str, Any]:
            """Execute a single task."""
            # Wait for dependencies
            for dep_id in task.dependencies:
                while dep_id not in completed_ids:
                    await asyncio.sleep(0.5)
            
            # Get agent
            agent = self.workers.get(task.assigned_agent)
            if not agent:
                return {
                    "task_id": task.id,
                    "status": "failed",
                    "error": f"Agent '{task.assigned_agent}' not found"
                }
            
            # Execute
            task.status = "running"
            result = await agent.execute_task(task.description)
            
            task.status = "completed" if result["status"] == "completed" else "failed"
            task.result = result.get("aggregated_result", str(result))
            if result["status"] != "completed":
                task.error = result.get("error", "Unknown error")
            
            completed_ids.add(task.id)
            async with self._lock:
                self.completed_tasks.append(task)
                if task.id in self.active_tasks:
                    del self.active_tasks[task.id]
            
            return {
                "task_id": task.id,
                "status": task.status,
                "result": task.result,
                "error": task.error
            }
        
        # Execute with parallelism limit
        semaphore = asyncio.Semaphore(self.max_parallel_tasks)
        
        async def limited_execute(task: SubTask):
            async with semaphore:
                return await execute_task(task)
        
        tasks = [limited_execute(task) for task in task_plan]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append({
                    "task_id": task_plan[i].id,
                    "status": "failed",
                    "error": str(result)
                })
            else:
                processed_results.append(result)
        
        return processed_results
    
    async def _aggregate_results(
        self,
        goal: str,
        task_results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Aggregate results from all tasks."""
        successful_results = [
            r for r in task_results if r.get("status") == "completed"
        ]
        
        failed_results = [
            r for r in task_results if r.get("status") != "completed"
        ]
        
        if not successful_results:
            return {
                "status": "failed",
                "content": "No tasks completed successfully",
                "failures": failed_results
            }
        
        # Use LLM to aggregate results
        results_summary = "\n\n".join([
            f"Task Result {i+1}:\n{r.get('result', 'No result')}"
            for i, r in enumerate(successful_results)
        ])
        
        prompt = f"""Aggregate the following task results into a coherent final answer for the original goal.

ORIGINAL GOAL: {goal}

TASK RESULTS:
{results_summary}

Provide a comprehensive final answer that synthesizes all the results.
If there are any gaps or inconsistencies, note them.

FINAL ANSWER:"""
        
        aggregated_content = await self.llm_client.generate(prompt)
        
        return {
            "status": "completed" if not failed_results else "partial",
            "content": aggregated_content,
            "successful_tasks": len(successful_results),
            "failed_tasks": len(failed_results)
        }
    
    def get_orchestration_status(self) -> Dict[str, Any]:
        """Get current orchestration status."""
        return {
            "active_tasks": len(self.active_tasks),
            "completed_tasks": len(self.completed_tasks),
            "workers": {
                name: agent.get_status()
                for name, agent in self.workers.items()
            }
        }


class MultiAgentSystem:
    """
    Complete multi-agent system factory and manager.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.llm_client = None
        self.mcp_executor = None
        self.memory_manager = None
        self.orchestrator = None
        self.workers: List[WorkerAgent] = []
        self._initialized = False
    
    async def initialize(self):
        """Initialize all system components."""
        if self._initialized:
            return
        
        logger.info("initializing_multi_agent_system")
        
        # Initialize LLM client
        model_config = self.config.get("model", {})
        from .cognitive_loop import LLMClient
        self.llm_client = LLMClient(
            base_url=model_config.get("base_url", "http://localhost:11434/v1"),
            model_name=model_config.get("model_name", "llama3.1:8b"),
            temperature=model_config.get("temperature", 0.7),
            max_tokens=model_config.get("max_tokens", 2048)
        )
        
        # Initialize MCP client and executor
        from .mcp_client import MCPClient, MCPToolExecutor
        self.mcp_client = MCPClient(
            timeout_seconds=self.config.get("safety", {}).get("tool_timeout_seconds", 30)
        )
        await self.mcp_client.__aenter__()
        
        # Register MCP servers
        for server_config in self.config.get("mcp_servers", []):
            if server_config.get("enabled", True):
                await self.mcp_client.register_server(
                    name=server_config["name"],
                    base_url=str(server_config["url"]),
                    auth_token=server_config.get("auth_token")
                )
        
        self.mcp_executor = MCPToolExecutor(self.mcp_client)
        
        # Initialize memory manager
        from .memory_manager import MemoryManager
        memory_config = self.config.get("memory", {})
        self.memory_manager = MemoryManager(
            stm_config=memory_config.get("short_term", {}),
            ltm_config=memory_config.get("long_term", {})
        )
        await self.memory_manager.initialize()
        
        # Create cognitive loop factory
        def create_cognitive_loop(
            agent_name: str,
            system_prompt: str,
            allowed_tools: List[str]
        ):
            from .cognitive_loop import CognitiveLoop
            loop_config = {
                **self.config.get("safety", {}),
                "agent_name": agent_name,
                "system_prompt": system_prompt,
                "allowed_tools": allowed_tools
            }
            return CognitiveLoop(
                llm_client=self.llm_client,
                mcp_executor=self.mcp_executor,
                memory_manager=self.memory_manager,
                config=loop_config
            )
        
        # Create worker agents
        for agent_config in self.config.get("agents", []):
            worker = WorkerAgent(
                name=agent_config["name"],
                role=agent_config["role"],
                system_prompt=agent_config["system_prompt"],
                specialized_tools=agent_config.get("specialized_tools", []),
                cognitive_loop_factory=create_cognitive_loop
            )
            self.workers.append(worker)
        
        # Create orchestrator
        orchestrator_config = self.config.get("orchestrator", {})
        self.orchestrator = OrchestratorAgent(
            worker_agents=self.workers,
            llm_client=self.llm_client,
            mcp_executor=self.mcp_executor,
            memory_manager=self.memory_manager,
            config=orchestrator_config
        )
        
        self._initialized = True
        logger.info("multi_agent_system_initialized")
    
    async def execute_goal(self, goal: str) -> Dict[str, Any]:
        """Execute a high-level goal."""
        if not self._initialized:
            await self.initialize()
        
        return await self.orchestrator.execute_goal(goal)
    
    async def shutdown(self):
        """Shutdown the system gracefully."""
        logger.info("shutting_down_multi_agent_system")
        
        if self.mcp_client:
            await self.mcp_client.__aexit__(None, None, None)
        
        if self.llm_client:
            await self.llm_client.close()
        
        self._initialized = False
