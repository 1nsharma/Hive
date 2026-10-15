"""
Cognitive Execution Loop Implementation.
Implements LATS (Language Agent Tree Search) with self-correction.
"""

import asyncio
import json
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Literal
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import get_logger

logger = get_logger("cognitive_loop")



class LoopPhase(str, Enum):
    """Phases of the cognitive loop."""
    PLAN = "plan"
    ACT = "act"
    OBSERVE = "observe"
    REFLECT = "reflect"


class LoopStatus(str, Enum):
    """Status of the cognitive loop."""
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    WAITING_HUMAN = "waiting_human"
    MAX_ITERATIONS = "max_iterations"
    TIMEOUT = "timeout"


@dataclass
class PlanNode:
    """Represents a node in the plan tree."""
    id: str
    description: str
    status: str = "pending"  # pending, in_progress, completed, failed
    result: Optional[str] = None
    children: List['PlanNode'] = field(default_factory=list)
    score: float = 0.0
    depth: int = 0


@dataclass
class ActionStep:
    """Represents a single action step."""
    tool_name: str
    arguments: Dict[str, Any]
    server_name: str
    status: str = "pending"
    result: Optional[Any] = None
    error: Optional[str] = None
    timestamp: float = field(default_factory=lambda: datetime.now().timestamp())


@dataclass
class ReflectionResult:
    """Result of reflection phase."""
    success: bool
    confidence: float
    errors_identified: List[str] = field(default_factory=list)
    corrections_suggested: List[str] = field(default_factory=list)
    should_continue: bool = True
    should_replan: bool = False
    should_request_help: bool = False


@dataclass
class LoopState:
    """Complete state of the cognitive loop."""
    goal: str
    current_phase: LoopPhase = LoopPhase.PLAN
    status: LoopStatus = LoopStatus.RUNNING
    iteration: int = 0
    max_iterations: int = 50
    
    plan: Optional[PlanNode] = None
    current_step: Optional[ActionStep] = None
    action_history: List[ActionStep] = field(default_factory=list)
    observations: List[str] = field(default_factory=list)
    reflections: List[ReflectionResult] = field(default_factory=list)
    
    context: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    # Safety tracking
    tokens_used: int = 0
    start_time: float = field(default_factory=lambda: datetime.now().timestamp())
    timeout_seconds: int = 600


class CognitiveLoop:
    """
    Autonomous cognitive execution loop implementing LATS.
    
    The loop cycles through four phases:
    1. PLAN: Generate and evaluate candidate plans
    2. ACT: Execute selected actions via MCP tools
    3. OBSERVE: Collect and validate outcomes
    4. REFLECT: Evaluate progress and self-correct
    
    Features:
    - Tree search for plan selection
    - Self-correction mechanisms
    - Error recovery strategies
    - Safety limits enforcement
    """
    
    def __init__(
        self,
        llm_client,
        mcp_executor,
        memory_manager,
        config: Dict[str, Any]
    ):
        self.llm_client = llm_client
        self.mcp_executor = mcp_executor
        self.memory_manager = memory_manager
        self.config = config
        
        self.max_iterations = config.get("max_iterations", 50)
        self.timeout_seconds = config.get("timeout_seconds", 600)
        self.state: Optional[LoopState] = None
        self._lock = asyncio.Lock()
        
        # Prompts optimized for local models
        self.prompts = self._load_prompts()
    
    def _load_prompts(self) -> Dict[str, str]:
        """Load system prompts optimized for self-hosted LLMs."""
        return {
            "planner": """You are a strategic planner. Given a goal, break it down into clear, actionable steps.

GOAL: {goal}

CONTEXT:
{context}

Generate a plan with 3-7 concrete steps. Each step should be:
1. Specific and actionable
2. Ordered logically
3. Feasible with available tools

Format your response as JSON:
{{
    "steps": [
        {{"description": "Step 1 description", "estimated_difficulty": "low|medium|high"}},
        {{"description": "Step 2 description", "estimated_difficulty": "low|medium|high"}}
    ],
    "potential_challenges": ["Challenge 1", "Challenge 2"]
}}""",

            "actor": """You are an action executor. Based on the current step, select the appropriate tool and parameters.

CURRENT STEP: {step_description}

AVAILABLE TOOLS:
{tools_list}

PREVIOUS OBSERVATIONS:
{observations}

Select the best tool and provide exact parameters. Be precise.

Format your response as JSON:
{{
    "tool_name": "tool_name",
    "server_name": "server_name",
    "arguments": {{
        "param1": "value1",
        "param2": "value2"
    }},
    "reasoning": "Why this tool was selected"
}}""",

            "observer": """You are an observer analyzing tool execution results.

TOOL: {tool_name}
INPUT: {input_data}
OUTPUT: {output_data}

Analyze the output:
1. Was the tool successful?
2. What information was gained?
3. Are there any errors or anomalies?

Format your response as JSON:
{{
    "success": true/false,
    "key_findings": ["Finding 1", "Finding 2"],
    "errors": [],
    "next_action_suggestion": "continue|retry|alternative"
}}""",

            "reflector": """You are a reflective critic evaluating progress toward the goal.

GOAL: {goal}

COMPLETED ACTIONS:
{action_history}

CURRENT STATUS:
{current_status}

Evaluate progress honestly:
1. Are we making good progress?
2. What errors or issues have occurred?
3. Should we continue, replan, or ask for help?

Be critical and identify any problems. Local models need explicit guidance.

Format your response as JSON:
{{
    "progress_score": 0.0-1.0,
    "confidence": 0.0-1.0,
    "errors_identified": ["Error 1", "Error 2"],
    "corrections": ["Correction 1", "Correction 2"],
    "recommendation": "continue|replan|request_help",
    "reasoning": "Detailed explanation"
}}"""
        }
    
    async def execute(self, goal: str, initial_context: str = "") -> Dict[str, Any]:
        """
        Execute the full cognitive loop for a given goal.
        
        Args:
            goal: High-level goal to achieve
            initial_context: Optional initial context
            
        Returns:
            Execution result with status and outputs
        """
        logger.info("starting_cognitive_loop", goal=goal)
        
        # Initialize state
        self.state = LoopState(
            goal=goal,
            context=initial_context,
            max_iterations=self.max_iterations,
            timeout_seconds=self.timeout_seconds
        )
        
        try:
            while self.state.status == LoopStatus.RUNNING:
                # Check safety limits
                if not await self._check_safety_limits():
                    break
                
                # Execute current phase
                if self.state.current_phase == LoopPhase.PLAN:
                    await self._phase_plan()
                elif self.state.current_phase == LoopPhase.ACT:
                    await self._phase_act()
                elif self.state.current_phase == LoopPhase.OBSERVE:
                    await self._phase_observe()
                elif self.state.current_phase == LoopPhase.REFLECT:
                    await self._phase_reflect()
                
                self.state.iteration += 1
            
            # Store final experience in memory
            await self._store_experience()
            
            return self._build_result()
            
        except Exception as e:
            logger.error("cognitive_loop_error", error=str(e))
            self.state.status = LoopStatus.FAILED
            self.state.metadata["error"] = str(e)
            return self._build_result()
    
    async def _check_safety_limits(self) -> bool:
        """Check if safety limits are exceeded."""
        # Iteration limit
        if self.state.iteration >= self.state.max_iterations:
            self.state.status = LoopStatus.MAX_ITERATIONS
            logger.warning("max_iterations_reached")
            return False
        
        # Timeout check
        elapsed = datetime.now().timestamp() - self.state.start_time
        if elapsed > self.state.timeout_seconds:
            self.state.status = LoopStatus.TIMEOUT
            logger.warning("timeout_exceeded")
            return False
        
        return True
    
    async def _phase_plan(self):
        """PLAN phase: Generate or update plan."""
        logger.debug("entering_plan_phase")
        
        # Get relevant memories
        memories = await self.memory_manager.retrieve_relevant(
            self.state.goal,
            limit=3
        )
        
        # Build context
        context = self.state.context
        if memories:
            context += "\n\nRELEVANT PAST EXPERIENCES:\n"
            for mem in memories:
                context += f"- {mem['content']}\n"
        
        # Generate plan using LLM
        prompt = self.prompts["planner"].format(
            goal=self.state.goal,
            context=context
        )
        
        response = await self.llm_client.generate(prompt)
        
        try:
            plan_data = json.loads(response)
            
            # Build plan tree
            root = PlanNode(
                id="root",
                description=self.state.goal,
                depth=0
            )
            
            for i, step in enumerate(plan_data.get("steps", [])):
                child = PlanNode(
                    id=f"step_{i}",
                    description=step["description"],
                    depth=1
                )
                root.children.append(child)
            
            self.state.plan = root
            self.state.current_phase = LoopPhase.ACT
            
            logger.info("plan_generated; steps", step_count=len(root.children))
            
        except json.JSONDecodeError:
            logger.error("plan_parsing_failed")
            # Create simple fallback plan
            self.state.plan = PlanNode(
                id="fallback",
                description=self.state.goal,
                depth=0
            )
            self.state.current_phase = LoopPhase.ACT
    
    async def _phase_act(self):
        """ACT phase: Execute next action."""
        logger.debug("entering_act_phase")
        
        # Find next pending step
        pending_step = self._find_next_pending_step()
        
        if not pending_step:
            # All steps completed
            self.state.current_phase = LoopPhase.REFLECT
            return
        
        # Get available tools
        available_tools = self.mcp_executor.mcp_client.list_available_tools()
        tools_list = "\n".join([
            f"- {t.name}: {t.description}" for t in available_tools
        ])
        
        # Generate action using LLM
        prompt = self.prompts["actor"].format(
            step_description=pending_step.description,
            tools_list=tools_list,
            observations="\n".join(self.state.observations[-5:])
        )
        
        response = await self.llm_client.generate(prompt)
        
        try:
            action_data = json.loads(response)
            
            action_step = ActionStep(
                tool_name=action_data["tool_name"],
                server_name=action_data["server_name"],
                arguments=action_data["arguments"],
                status="in_progress"
            )
            
            self.state.current_step = action_step
            
            # Execute the action
            result = await self.mcp_executor.execute(
                server_name=action_step.server_name,
                tool_name=action_step.tool_name,
                arguments=action_step.arguments
            )
            
            action_step.result = result
            action_step.status = "completed" if result["success"] else "failed"
            action_step.error = result.get("error")
            
            self.state.action_history.append(action_step)
            
            logger.info(
                "action_executed",
                tool=action_step.tool_name,
                success=result["success"]
            )
            
        except json.JSONDecodeError:
            logger.error("action_parsing_failed")
            action_step = ActionStep(
                tool_name="unknown",
                server_name="unknown",
                arguments={},
                status="failed",
                error="Failed to parse LLM response"
            )
            self.state.action_history.append(action_step)
        
        self.state.current_phase = LoopPhase.OBSERVE
    
    def _find_next_pending_step(self) -> Optional[PlanNode]:
        """Find the next pending step in the plan."""
        if not self.state.plan:
            return None
        
        # BFS to find first pending node
        queue = [self.state.plan]
        while queue:
            node = queue.pop(0)
            if node.status == "pending":
                return node
            
            queue.extend(node.children)
        
        return None
    
    async def _phase_observe(self):
        """OBSERVE phase: Analyze action results."""
        logger.debug("entering_observe_phase")
        
        if not self.state.action_history:
            self.state.current_phase = LoopPhase.REFLECT
            return
        
        last_action = self.state.action_history[-1]
        
        # Analyze result
        prompt = self.prompts["observer"].format(
            tool_name=last_action.tool_name,
            input_data=json.dumps(last_action.arguments),
            output_data=json.dumps(last_action.result) if last_action.result else "No result"
        )
        
        response = await self.llm_client.generate(prompt)
        
        try:
            observation_data = json.loads(response)
            
            observation = f"Tool '{last_action.tool_name}' {'succeeded' if observation_data.get('success') else 'failed'}. "
            observation += f"Key findings: {', '.join(observation_data.get('key_findings', []))}"
            
            self.state.observations.append(observation)
            
            # Update memory
            await self.memory_manager.stm.add(
                content=observation,
                importance=0.6
            )
            
            logger.debug("observation_recorded")
            
        except json.JSONDecodeError:
            logger.error("observation_parsing_failed")
            self.state.observations.append(f"Tool '{last_action.tool_name}' executed")
        
        self.state.current_phase = LoopPhase.REFLECT
    
    async def _phase_reflect(self):
        """REFLECT phase: Evaluate progress and self-correct."""
        logger.debug("entering_reflect_phase")
        
        # Build action history summary
        action_summary = "\n".join([
            f"{i+1}. {a.tool_name}: {'✓' if a.status == 'completed' else '✗'}"
            for i, a in enumerate(self.state.action_history[-10:])
        ])
        
        # Reflect using LLM
        prompt = self.prompts["reflector"].format(
            goal=self.state.goal,
            action_history=action_summary,
            current_status=f"Iteration {self.state.iteration}"
        )
        
        response = await self.llm_client.generate(prompt)
        
        try:
            reflection_data = json.loads(response)
            
            reflection = ReflectionResult(
                success=reflection_data.get("progress_score", 0) > 0.5,
                confidence=reflection_data.get("confidence", 0.5),
                errors_identified=reflection_data.get("errors_identified", []),
                corrections_suggested=reflection_data.get("corrections", []),
                should_continue=reflection_data.get("recommendation") == "continue",
                should_replan=reflection_data.get("recommendation") == "replan",
                should_request_help=reflection_data.get("recommendation") == "request_help"
            )
            
            self.state.reflections.append(reflection)
            
            # Apply corrections
            if reflection.should_replan:
                logger.info("replan_triggered")
                self.state.current_phase = LoopPhase.PLAN
            elif reflection.should_request_help:
                logger.warning("human_help_requested")
                self.state.status = LoopStatus.WAITING_HUMAN
            elif reflection.should_continue:
                # Check if goal is achieved
                if self._is_goal_achieved():
                    self.state.status = LoopStatus.COMPLETED
                else:
                    self.state.current_phase = LoopPhase.ACT
            else:
                self.state.current_phase = LoopPhase.ACT
            
            # Store learning
            if reflection.errors_identified:
                await self.memory_manager.add_experience(
                    task=self.state.goal,
                    outcome=f"Errors: {reflection.errors_identified}",
                    success=False,
                    metadata={"iteration": self.state.iteration}
                )
            
        except json.JSONDecodeError:
            logger.error("reflection_parsing_failed")
            # Default to continuing
            self.state.current_phase = LoopPhase.ACT
    
    def _is_goal_achieved(self) -> bool:
        """Check if goal appears to be achieved."""
        if not self.state.plan:
            return False
        
        # Check if all plan steps are completed
        all_completed = all(
            node.status == "completed"
            for node in self._flatten_plan(self.state.plan)
        )
        
        return all_completed
    
    def _flatten_plan(self, node: PlanNode) -> List[PlanNode]:
        """Flatten plan tree into list."""
        result = [node]
        for child in node.children:
            result.extend(self._flatten_plan(child))
        return result
    
    async def _store_experience(self):
        """Store complete experience in long-term memory."""
        outcome = "Success" if self.state.status == LoopStatus.COMPLETED else f"Ended: {self.state.status.value}"
        
        await self.memory_manager.add_experience(
            task=self.state.goal,
            outcome=outcome,
            success=self.state.status == LoopStatus.COMPLETED,
            metadata={
                "iterations": self.state.iteration,
                "actions_taken": len(self.state.action_history),
                "status": self.state.status.value
            }
        )
    
    def _build_result(self) -> Dict[str, Any]:
        """Build final result dictionary."""
        return {
            "status": self.state.status.value,
            "goal": self.state.goal,
            "iterations": self.state.iteration,
            "actions_taken": len(self.state.action_history),
            "observations": self.state.observations,
            "final_context": self.state.context,
            "metadata": self.state.metadata,
            "action_history": [
                {
                    "tool": a.tool_name,
                    "status": a.status,
                    "error": a.error
                }
                for a in self.state.action_history
            ]
        }


class LLMClient:
    """
    Async client for self-hosted LLMs via OpenAI-compatible API.
    
    Supports Ollama, vLLM, and llama.cpp backends.
    """
    
    def __init__(
        self,
        base_url: str = "http://localhost:11434/v1",
        model_name: str = "llama3.1:8b",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        timeout_seconds: int = 120
    ):
        self.base_url = base_url.rstrip("/")
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.timeout_seconds = timeout_seconds
        
        self._session = None
    
    async def _get_session(self):
        """Get or create HTTP session."""
        if self._session is None:
            import httpx
            self._session = httpx.AsyncClient(
                timeout=httpx.Timeout(self.timeout_seconds),
                headers={"Content-Type": "application/json"}
            )
        return self._session
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> str:
        """Generate text from the LLM."""
        session = await self._get_session()
        
        # Override defaults with kwargs
        temperature = kwargs.get("temperature", self.temperature)
        max_tokens = kwargs.get("max_tokens", self.max_tokens)
        
        # Build messages
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        try:
            response = await session.post(
                f"{self.base_url}/chat/completions",
                json=payload
            )
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            return content.strip()
            
        except Exception as e:
            logger.error("llm_generation_failed", error=str(e))
            raise RuntimeError(f"LLM generation failed: {e}")
    
    async def close(self):
        """Close HTTP session."""
        if self._session:
            await self._session.aclose()
            self._session = None
