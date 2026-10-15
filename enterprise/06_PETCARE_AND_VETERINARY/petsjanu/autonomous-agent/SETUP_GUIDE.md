# Setup Guide for Autonomous AI Agent System

This guide provides step-by-step instructions to set up and run the autonomous agent system locally.

## Prerequisites

### 1. Python Environment

```bash
# Ensure Python 3.11+ is installed
python --version

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
cd autonomous-agent
pip install -r requirements.txt
```

### 3. Set Up Self-Hosted LLM (Ollama)

**Install Ollama:**
```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Download from https://ollama.com/download
```

**Pull a Model:**
```bash
# Recommended models for autonomous agents:
ollama pull llama3.1:8b       # Good balance of speed/capability
ollama pull llama3.1:70b      # More capable, requires more resources
ollama pull qwen2:7b          # Alternative with good reasoning
ollama pull mistral:7b        # Lightweight option
```

**Verify Ollama is Running:**
```bash
ollama list
curl http://localhost:11434/api/tags
```

### 4. (Optional) Set Up Vector Database for Long-Term Memory

**Using Docker (Recommended):**
```bash
# Qdrant
docker run -d -p 6333:6333 -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage:z \
  qdrant/qdrant

# Verify
curl http://localhost:6333/
```

**Alternative: Chroma (simpler, no Docker needed):**
```bash
pip install chromadb
# Update config/default_config.yaml to use chroma backend
```

## Configuration

### Basic Configuration

Edit `config/default_config.yaml`:

```yaml
model:
  provider: ollama
  base_url: "http://localhost:11434/v1"
  model_name: "llama3.1:8b"  # Change to your model
  temperature: 0.7
  max_tokens: 4096

memory:
  long_term:
    backend: qdrant  # or 'chroma' or 'in_memory'
    host: localhost
    port: 6333
```

### Configure MCP Servers

Add MCP server configurations:

```yaml
mcp_servers:
  - name: filesystem
    url: "http://localhost:8081"
    description: "File operations"
    tools: [read_file, write_file, list_directory]
    enabled: true

  - name: web_search
    url: "http://localhost:8082"
    description: "Web search capabilities"
    tools: [search, get_content]
    enabled: true
```

## Running the System

### 1. Demo Mode (First Run)

```bash
python main.py --demo
```

This shows the system architecture and usage examples without requiring actual LLM/MCP connections.

### 2. Single Goal Execution

```bash
python main.py --config config/default_config.yaml \
    --goal "Research and summarize recent developments in quantum computing"
```

### 3. Interactive Mode

```bash
python main.py --config config/default_config.yaml --interactive
```

Then enter goals one at a time:
```
> Enter your goal: Write a Python script to analyze CSV data
[Processing...]
=== Result ===
Status: completed

[Aggregated result here]
```

### 4. Verbose Mode (Debugging)

```bash
python main.py --config config/default_config.yaml \
    --goal "Your goal" --verbose
```

## Troubleshooting

### LLM Connection Issues

**Problem:** "LLM generation failed"

**Solutions:**
1. Check Ollama is running: `ollama list`
2. Test endpoint: `curl http://localhost:11434/api/tags`
3. Restart Ollama: `systemctl restart ollama` (Linux) or restart app (Mac/Windows)
4. Verify model name matches: `ollama show llama3.1:8b`

### Memory Backend Issues

**Problem:** "long_term_memory_init_failed"

**Solutions:**
1. Check Qdrant is running: `curl http://localhost:6333/`
2. Start Qdrant: `docker start <container_id>`
3. Use in-memory fallback: set `backend: in_memory` in config

### Tool Execution Failures

**Problem:** Tools not executing or returning errors

**Solutions:**
1. Verify MCP servers are running on configured ports
2. Check MCP server logs for errors
3. Test MCP endpoints manually: `curl http://localhost:8081/tools`
4. Review `agent_audit.log` for detailed error messages

### Out of Memory Issues

**Problem:** System runs out of memory during execution

**Solutions:**
1. Reduce `max_context_length` in config
2. Lower `sliding_window_size`
3. Use smaller LLM model (e.g., `llama3.1:8b` instead of `70b`)
4. Reduce `max_parallel_tasks` in orchestrator config

## Advanced Configuration

### Custom Agent Definition

```yaml
agents:
  - name: legal_analyst
    role: "Legal document analysis specialist"
    system_prompt: |
      You are a legal analysis expert. Your responsibilities:
      1. Analyze legal documents for key clauses
      2. Identify potential risks and issues
      3. Summarize complex legal language
      4. Cite relevant sections accurately
      
      Always maintain precision and note uncertainties.
    specialized_tools:
      - read_file
      - write_file
      - search_legal_database
    can_delegate: false
```

### Safety Tuning

```yaml
safety:
  max_iterations: 30          # Lower for faster failure detection
  task_timeout_seconds: 300   # 5 minutes per task
  require_human_approval_for:
    - high
    - critical
  enable_sandboxing: true
  sandbox_timeout_seconds: 10  # Quick fail for hanging code
```

### Performance Optimization

For faster execution:
```yaml
model:
  temperature: 0.5           # Lower = more deterministic, faster
  max_tokens: 1024           # Limit response length
  
orchestrator:
  parallel_execution: true
  max_parallel_tasks: 5      # Increase if you have resources
```

For better quality:
```yaml
model:
  temperature: 0.8           # Higher = more creative
  max_tokens: 4096           # Allow longer responses
  
safety:
  max_iterations: 100        # Allow more refinement cycles
```

## Monitoring and Logging

### View Logs

```bash
# Real-time structured logs
tail -f agent_audit.log | jq .

# Search for errors
grep '"level":"error"' agent_audit.log | jq .

# View tool executions
grep 'tool_execution' agent_audit.log | jq .
```

### Enable Debug Logging

Add to your code or environment:
```python
import structlog
structlog.configure(wrapper_class=structlog.stdlib.BoundLogger)
```

Or set environment variable:
```bash
export LOG_LEVEL=debug
```

## Next Steps

1. **Start Simple**: Begin with single-agent, single-goal tasks
2. **Add Tools Gradually**: Integrate one MCP server at a time
3. **Monitor Performance**: Watch iteration counts and success rates
4. **Tune Prompts**: Adjust agent system prompts based on outputs
5. **Expand Capabilities**: Add more specialized agents as needed

## Getting Help

- Review `ARCHITECTURE.md` for system design details
- Check `README.md` for feature overview
- Examine test files for usage examples
- Review logs for specific error messages
