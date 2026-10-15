#!/usr/bin/env python3
"""
Test runner for the Autonomous AI Agent System using Python standard library.
"""

import sys
import os
import unittest
import asyncio
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

# Setup path
agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import get_logger, BaseModel, ValidationError, yaml_load, yaml_dump
from config.schemas import ModelConfig, ModelProvider, SafetyConfig, RiskLevel, SystemConfig
from core.cognitive_loop import CognitiveLoop, LoopStatus, LoopState
from core.mcp_client import MCPToolExecutor, MCPClient
from memory.memory_manager import ShortTermMemory, MemoryManager
from agents.multi_agent import WorkerAgent
from sandbox.code_executor import CodeSandbox

logger = get_logger("tests")


class TestCognitiveLoop(unittest.TestCase):
    def test_loop_initialization(self):
        llm_client = AsyncMock()
        mcp_executor = AsyncMock()
        memory_manager = AsyncMock()
        config = {"max_iterations": 10, "timeout_seconds": 60}
        
        loop = CognitiveLoop(
            llm_client=llm_client,
            mcp_executor=mcp_executor,
            memory_manager=memory_manager,
            config=config
        )
        self.assertEqual(loop.max_iterations, 10)
        self.assertEqual(loop.timeout_seconds, 60)
        self.assertIsNone(loop.state)

    def test_safety_limits(self):
        async def _run():
            llm_client = AsyncMock()
            mcp_executor = AsyncMock()
            memory_manager = AsyncMock()
            config = {"max_iterations": 5}
            loop = CognitiveLoop(llm_client, mcp_executor, memory_manager, config)
            loop.state = LoopState(goal="test", iteration=5, max_iterations=5)
            result = await loop._check_safety_limits()
            self.assertFalse(result)
            self.assertEqual(loop.state.status, LoopStatus.MAX_ITERATIONS)
        asyncio.run(_run())


class TestMCPClient(unittest.TestCase):
    def test_tool_validation(self):
        mcp_client = MCPClient()
        executor = MCPToolExecutor(mcp_client)
        schema = {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "count": {"type": "integer"}
            },
            "required": ["name"]
        }
        res_valid = executor._validate_input({"name": "test"}, schema)
        self.assertTrue(res_valid["valid"])
        res_missing = executor._validate_input({}, schema)
        self.assertFalse(res_missing["valid"])
        res_wrong = executor._validate_input({"name": 123}, schema)
        self.assertFalse(res_wrong["valid"])


class TestMemoryManager(unittest.TestCase):
    def test_short_term_memory(self):
        async def _run():
            stm = ShortTermMemory(max_context_length=1000, sliding_window_size=10)
            await stm.add("First memory", importance=0.5)
            await stm.add("Second memory", importance=0.8)
            context = await stm.get_context()
            self.assertIn("First memory", context)
            self.assertIn("Second memory", context)
        asyncio.run(_run())

    def test_sliding_window(self):
        async def _run():
            stm = ShortTermMemory(max_context_length=10000, sliding_window_size=5)
            for i in range(10):
                await stm.add(f"Memory {i}", importance=0.5)
            self.assertLessEqual(len(stm.entries), 5)
        asyncio.run(_run())


class TestMultiAgent(unittest.TestCase):
    def test_worker_agent_status(self):
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
        self.assertEqual(status["name"], "test_agent")
        self.assertEqual(status["role"], "Test Role")
        self.assertFalse(status["is_busy"])
        self.assertIn("tool1", status["available_tools"])


class TestSandbox(unittest.TestCase):
    def test_safe_code_execution(self):
        async def _run():
            sandbox = CodeSandbox(timeout_seconds=5)
            code = 'print("Hello, World!")\nresult = 2 + 2\nprint(f"Result: {result}")'
            result = await sandbox.execute_python(code)
            self.assertTrue(result.success)
            self.assertIn("Hello, World!", result.stdout)
            self.assertEqual(result.exit_code, 0)
            await sandbox.cleanup()
        asyncio.run(_run())

    def test_blocked_imports(self):
        async def _run():
            sandbox = CodeSandbox(timeout_seconds=5)
            code = 'import os\nprint(os.getcwd())'
            result = await sandbox.execute_python(code)
            self.assertFalse(result.success)
            await sandbox.cleanup()
        asyncio.run(_run())


class TestConfiguration(unittest.TestCase):
    def test_model_config(self):
        config = ModelConfig(
            provider=ModelProvider.OLLAMA,
            base_url="http://localhost:11434/v1",
            model_name="llama3.1:8b"
        )
        self.assertEqual(config.provider, ModelProvider.OLLAMA)
        self.assertEqual(config.model_name, "llama3.1:8b")

    def test_safety_config(self):
        config = SafetyConfig(
            max_iterations=100,
            require_human_approval_for=[RiskLevel.HIGH, RiskLevel.CRITICAL]
        )
        self.assertEqual(config.max_iterations, 100)
        self.assertIn(RiskLevel.HIGH, config.require_human_approval_for)


class TestEndToEndMock(unittest.TestCase):
    def test_end_to_end_mock(self):
        async def _run():
            llm_client = AsyncMock()
            llm_client.generate = AsyncMock(return_value='{"steps": [{"description": "Test step"}]}')
            mcp_client = MCPClient()
            mcp_executor = MCPToolExecutor(mcp_client)
            memory_manager = MemoryManager(
                stm_config={"max_context_length": 1000},
                ltm_config={"backend": "qdrant"}
            )
            await memory_manager.initialize()
            loop = CognitiveLoop(
                llm_client=llm_client,
                mcp_executor=mcp_executor,
                memory_manager=memory_manager,
                config={"max_iterations": 5, "timeout_seconds": 30}
            )
            result = await loop.execute("Test goal")
            self.assertEqual(result["goal"], "Test goal")
            self.assertIn("status", result)
        asyncio.run(_run())


if __name__ == "__main__":
    unittest.main()
