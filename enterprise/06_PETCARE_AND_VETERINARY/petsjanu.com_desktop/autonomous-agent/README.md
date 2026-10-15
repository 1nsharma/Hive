# Autonomous AI Agent System

A fully autonomous multi-agent system powered by self-hosted LLMs and utilizing MCP (Model Context Protocol) for tool execution.

## Features

- **Autonomous Cognitive Architecture**: LATS (Language Agent Tree Search) implementation with PLAN → ACT → OBSERVE → REFLECT loop
- **MCP Tool Integration**: Dynamic discovery and execution of tools via Model Context Protocol
- **Memory Management**: Short-term context management + Long-term vector storage (Qdrant/Chroma)
- **Multi-Agent Collaboration**: Orchestrator agent with specialized worker agents
- **Self-Hosted Infrastructure**: Compatible with Ollama, vLLM, and llama.cpp
- **Safety & Guardrails**: Iteration limits, timeouts, HITL approval, sandboxing

## Quick Start

### Prerequisites

1. Python 3.11+
2. Self-hosted LLM (Ollama recommended):
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Pull a model
   ollama pull llama3.1:8b
   ```

3. (Optional) Qdrant for long-term memory:
   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

### Installation

```bash
# Clone the repository
cd autonomous-agent

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Edit `config/default_config.yaml` to customize:
- LLM model and parameters
- MCP server connections
- Agent definitions
- Safety settings

### Running

**Demo Mode** (recommended first run):
```bash
python main.py --demo
```

**Single Goal Execution**:
```bash
python main.py --config config/default_config.yaml \
    --goal "Research and summarize recent developments in quantum computing"
```

**Interactive Mode**:
```bash
python main.py --config config/default_config.yaml --interactive
```

## Architecture

```
┌─────────────────────────────────────────┐
│         ORCHESTRATOR AGENT              │
│  (Goal Parser & Task Coordinator)       │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Research│ │ Code   │ │Analysis│
│ Agent  │ │ Agent  │ │ Agent  │
└────────┘ └────────┘ └────────┘
    │          │          │
    └──────────┼──────────┘
               ▼
    ┌──────────────────────┐
    │   COGNITIVE LOOP     │
    │  PLAN → ACT → OBSERVE│
    │      → REFLECT       │
    └──────────┬───────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│  STM   │ │  LTM   │ │  MCP   │
│Memory  │ │VectorDB│ │ Tools  │
└────────┘ └────────┘ └────────┘
```

## Project Structure

```
autonomous-agent/
├── main.py                 # Entry point
├── requirements.txt        # Dependencies
├── ARCHITECTURE.md         # Detailed architecture docs
├── README.md              # This file
├── config/
│   ├── schemas.py         # Pydantic configuration schemas
│   └── default_config.yaml # Default configuration
├── core/
│   ├── cognitive_loop.py  # LATS implementation
│   └── mcp_client.py      # MCP protocol client
├── memory/
│   └── memory_manager.py  # STM + LTM management
├── agents/
│   └── multi_agent.py     # Multi-agent orchestration
├── sandbox/
│   └── code_executor.py   # Safe code execution
├── utils/                 # Utility functions
└── tests/                 # Test suite
```

## Cognitive Loop (LATS)

The system implements a Language Agent Tree Search with four phases:

### 1. PLAN
- Parse high-level goal into sub-tasks
- Generate multiple candidate plans
- Score and select best plan using tree search

### 2. ACT
- Select appropriate MCP tools
- Execute tool calls with proper parameters
- Monitor execution time and resources

### 3. OBSERVE
- Collect tool outputs and feedback
- Validate outputs against expected schemas
- Detect anomalies and hallucinations

### 4. REFLECT
- Compare outcomes with expectations
- Identify errors or suboptimal actions
- Generate self-correction strategies
- Decide: continue, replan, or request help

## Configuration Schema

```yaml
model:
  provider: ollama
  base_url: "http://localhost:11434/v1"
  model_name: "llama3.1:8b"
  temperature: 0.7

memory:
  short_term:
    max_context_length: 8000
    sliding_window_size: 50
  long_term:
    backend: qdrant
    host: localhost
    port: 6333

safety:
  max_iterations: 50
  require_human_approval_for: [high, critical]
  enable_sandboxing: true

mcp_servers:
  - name: filesystem
    url: "http://localhost:8081"
    tools: [read_file, write_file]

agents:
  - name: researcher
    role: "Information gathering specialist"
    system_prompt: "..."
    specialized_tools: [search, read_file]
```

## MCP Tool Integration

The system supports dynamic MCP server connections:

```python
from core.mcp_client import MCPClient, MCPToolExecutor

async with MCPClient() as client:
    # Register MCP server
    await client.register_server(
        name="filesystem",
        base_url="http://localhost:8081"
    )
    
    # Execute tool
    executor = MCPToolExecutor(client)
    result = await executor.execute(
        server_name="filesystem",
        tool_name="read_file",
        arguments={"path": "/tmp/data.txt"}
    )
```

## Memory Systems

### Short-Term Memory (STM)
- Sliding window context management
- Automatic summarization when approaching token limits
- Priority-based retention

### Long-Term Memory (LTM)
- Vector database integration (Qdrant, Chroma, Milvus)
- Semantic search for experience retrieval
- RAG pipeline for knowledge augmentation

## Safety Features

| Feature | Description |
|---------|-------------|
| Max Iterations | Prevents infinite loops (default: 50) |
| Timeout Controls | Per-tool and per-task timeouts |
| HITL Approval | Human approval for high-risk actions |
| Code Sandboxing | Isolated execution environment |
| Audit Logging | Complete trace of all actions |
| Token Budgets | Prevent runaway consumption |

## Customization

### Adding New Agents

```yaml
agents:
  - name: custom_agent
    role: "Your agent's role"
    system_prompt: |
      You are a specialized agent for...
      Follow these guidelines...
    specialized_tools:
      - tool1
      - tool2
    can_delegate: false
```

### Adding MCP Tools

1. Deploy an MCP server following the [MCP specification](https://modelcontextprotocol.io/)
2. Add server configuration to `config/default_config.yaml`
3. The system will auto-discover available tools

## Troubleshooting

### LLM Connection Issues
```bash
# Check Ollama is running
ollama list

# Test endpoint
curl http://localhost:11434/api/tags
```

### Memory Backend Issues
```bash
# Check Qdrant is running
curl http://localhost:6333/

# View collections
curl http://localhost:6333/collections
```

### Tool Execution Failures
- Check MCP server logs
- Verify tool input schemas match expectations
- Review audit logs in `agent_audit.log`

## Development

### Running Tests
```bash
pytest tests/ -v
```

### Code Style
```bash
# Format code
black .

# Type checking
mypy .
```

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.
