"""
Configuration schemas for the autonomous agent system.
Defines goals, tools, model parameters, and safety settings.
"""

import sys
from pathlib import Path
agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import BaseModel, Field, HttpUrl, ValidationError, yaml_load, yaml_dump
from typing import Optional, List, Dict, Any
from enum import Enum



class ModelProvider(str, Enum):
    OLLAMA = "ollama"
    VLLM = "vllm"
    LLAMA_CPP = "llama_cpp"


class MemoryBackend(str, Enum):
    QDRANT = "qdrant"
    CHROMA = "chroma"
    MILVUS = "milvus"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ToolConfig(BaseModel):
    """Configuration for a single MCP tool."""
    name: str
    description: str
    mcp_server: str
    enabled: bool = True
    timeout_seconds: int = 30
    max_retries: int = 3
    requires_approval: bool = False
    risk_level: RiskLevel = RiskLevel.LOW
    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None


class MCPServerConfig(BaseModel):
    """Configuration for an MCP server connection."""
    name: str
    url: HttpUrl
    description: str
    tools: List[str] = []
    auth_token: Optional[str] = None
    health_check_endpoint: Optional[str] = "/health"
    enabled: bool = True


class ModelConfig(BaseModel):
    """Configuration for the LLM backend."""
    provider: ModelProvider = ModelProvider.OLLAMA
    base_url: str = "http://localhost:11434/v1"
    model_name: str = "llama3.1:8b"
    temperature: float = 0.7
    max_tokens: int = 4096
    top_p: float = 0.9
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    stop_sequences: List[str] = []
    timeout_seconds: int = 120


class MemoryConfig(BaseModel):
    """Configuration for memory systems."""
    short_term: Dict[str, Any] = Field(default_factory=lambda: {
        "max_context_length": 8000,
        "summary_threshold": 0.8,
        "sliding_window_size": 50
    })
    long_term: Dict[str, Any] = Field(default_factory=lambda: {
        "backend": MemoryBackend.QDRANT.value,
        "host": "localhost",
        "port": 6333,
        "collection_name": "agent_memory",
        "embedding_model": "all-MiniLM-L6-v2",
        "vector_size": 384
    })


class SafetyConfig(BaseModel):
    """Safety and guardrail configurations."""
    max_iterations: int = 50
    max_tokens_per_task: int = 100000
    tool_timeout_seconds: int = 60
    task_timeout_seconds: int = 600
    require_human_approval_for: List[RiskLevel] = [RiskLevel.HIGH, RiskLevel.CRITICAL]
    enable_sandboxing: bool = True
    sandbox_timeout_seconds: int = 30
    audit_logging: bool = True
    log_file: str = "agent_audit.log"


class AgentConfig(BaseModel):
    """Configuration for a single agent."""
    name: str
    role: str
    system_prompt: str
    specialized_tools: List[str] = []
    can_delegate: bool = False
    max_subtasks: int = 5


class OrchestratorConfig(BaseModel):
    """Configuration for the orchestrator agent."""
    name: str = "orchestrator"
    role: str = "Task Coordinator and Manager"
    decomposition_strategy: str = "hierarchical"
    worker_agents: List[str] = []
    parallel_execution: bool = True
    max_parallel_tasks: int = 3


class GoalConfig(BaseModel):
    """Configuration for a high-level goal."""
    id: str
    description: str
    priority: int = 1
    constraints: List[str] = []
    success_criteria: List[str] = []
    assigned_agent: Optional[str] = None
    deadline: Optional[str] = None


class SystemConfig(BaseModel):
    """Main system configuration."""
    model: ModelConfig
    memory: MemoryConfig = Field(default_factory=MemoryConfig)
    safety: SafetyConfig = Field(default_factory=SafetyConfig)
    mcp_servers: List[MCPServerConfig] = []
    tools: List[ToolConfig] = []
    agents: List[AgentConfig] = []
    orchestrator: OrchestratorConfig = Field(default_factory=OrchestratorConfig)
    goals: List[GoalConfig] = []
    
    class Config:
        json_schema_extra = {
            "example": {
                "model": {
                    "provider": "ollama",
                    "base_url": "http://localhost:11434/v1",
                    "model_name": "llama3.1:8b",
                    "temperature": 0.7
                },
                "safety": {
                    "max_iterations": 50,
                    "require_human_approval_for": ["high", "critical"]
                }
            }
        }


def load_config(config_path: str) -> SystemConfig:
    """Load configuration from YAML file."""
    with open(config_path, 'r') as f:
        config_data = yaml_load(f)
    return SystemConfig(**config_data)


def save_config(config: SystemConfig, config_path: str) -> None:
    """Save configuration to YAML file."""
    with open(config_path, 'w') as f:
        yaml_dump(config.model_dump(), f)

