# Autonomous AI Agent System Architecture

## Overview

This document outlines the architecture for a fully autonomous AI agent system powered by self-hosted LLMs and utilizing MCP (Model Context Protocol) for tool execution.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORCHESTRATOR AGENT                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Goal Parser & Task Decomposer                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Worker Agent Manager                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
        │  RESEARCH AGENT │ │ CODE AGENT  │ │ ANALYSIS AGENT  │
        │  (Specialized)  │ │(Specialized)│ │ (Specialized)   │
        └─────────────────┘ └─────────────┘ └─────────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COGNITIVE EXECUTION LOOP                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  PLAN    │───▶│  ACT     │───▶│ OBSERVE  │───▶│ REFLECT  │──┐          │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │          │
│       ▲                                                        │          │
│       └────────────────────────────────────────────────────────┘          │
│                         Self-Correction Loop                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
        │  SHORT-TERM     │ │  LONG-TERM  │ │  MCP TOOL       │
        │  MEMORY         │ │  MEMORY     │ │  EXECUTOR       │
        │  (Context)      │ │  (VectorDB) │ │  (MCP Client)   │
        └─────────────────┘ └─────────────┘ └─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
        │  FILESYSTEM     │ │  WEB SEARCH │ │  CODE           │
        │  MCP SERVER     │ │  MCP SERVER │ │  INTERPRETER    │
        └─────────────────┘ └─────────────┘ └─────────────────┘
```

## Cognitive Loop: LATS (Language Agent Tree Search)

The system implements an enhanced LATS algorithm with the following phases:

### 1. PLAN Phase
- Parse high-level goal into sub-tasks
- Generate multiple candidate plans
- Score and select the best plan using tree search
- Store plan in short-term memory

### 2. ACT Phase
- Select appropriate MCP tools based on current task
- Execute tool calls with proper parameters
- Monitor execution time and resource usage
- Handle timeouts and failures gracefully

### 3. OBSERVE Phase
- Collect tool outputs and environment feedback
- Validate outputs against expected schemas
- Detect anomalies and potential hallucinations
- Update observation history

### 4. REFLECT Phase
- Compare outcomes with expected results
- Identify errors or suboptimal actions
- Generate self-correction strategies
- Update long-term memory with learnings
- Decide: continue, replan, or request human intervention

## Memory Architecture

### Short-Term Memory (STM)
- Sliding window context management
- Automatic summarization when approaching token limits
- Priority-based retention (recent > important > old)
- Thread-safe access for multi-agent scenarios

### Long-Term Memory (LTM)
- Vector database integration (Qdrant/Chroma)
- Semantic search for experience retrieval
- Episodic memory storage (task → outcome pairs)
- RAG pipeline for knowledge augmentation

## MCP Tool Integration

### Tool Discovery
- Dynamic loading of MCP server configurations
- Capability-based tool selection
- Health checking of MCP endpoints

### Tool Execution
- Async execution with timeout controls
- Input/output validation via Pydantic schemas
- Sandboxed execution for code tools
- Rollback mechanisms for destructive operations

## Safety Mechanisms

1. **Iteration Limits**: Maximum steps per task (default: 50)
2. **Token Budgets**: Prevent runaway token consumption
3. **Timeout Controls**: Per-tool and per-task timeouts
4. **HITL Checkpoints**: Human approval for high-risk actions
5. **Sandboxing**: Isolated execution environment for code
6. **Audit Logging**: Complete trace of all actions and decisions

## Tech Stack

- **Core Framework**: Python 3.11+ with asyncio
- **Agent Orchestration**: LangGraph (for state machine management)
- **LLM Backend**: Ollama/vLLM with OpenAI-compatible API
- **Vector Database**: Qdrant (self-hosted)
- **MCP Client**: Custom async implementation
- **Configuration**: YAML with Pydantic validation
- **Testing**: pytest with async support
