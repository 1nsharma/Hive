# 🗺️ Hive System Directory Map & Navigation Guide

| Directory / File | Type | Purpose & Scope |
| :--- | :---: | :--- |
| **`START_HIVE_SYSTEM.bat`** | Batch Script | **Master Launcher**: 8-option interactive menu to launch web, desktop, test suite, research, closing, and cloud deploy. |
| **`LAUNCH_MUNDER_DIFFLIN_DESKTOP.bat`** | Batch Script | Direct launcher for the compiled Electron 32 desktop app. |
| **`BUILD_DISTRIBUTABLE.bat`** | Batch Script | Builds Windows `.exe` production installer using electron-builder. |
| **`VISUAL_COMMAND_CENTER.html`** | HTML UI | Offline operational control room with agent tiles, live status, and task feeds. |
| **`hive-system-hub.mjs`** | Node.js | Comprehensive health diagnostic utility checking agents, registries, and modules. |
| **`web/`** | Core Subsystem | **Full-Stack Virtual Office & Gateway**: Runs on Port 3300. Includes public retro UI, 8 department workspaces, 8 microservices, reverse proxy gateway, and 24 unit tests. |
| **`agents/`** | Fleet Workspaces | Contains workspaces for all 17 canonical agents (Michael/God, Jim, Andy, Phyllis, Kevin, Toby, etc.). |
| **`munder-difflin/`** | Desktop Subsystem | Source code & compiled artifacts for the Munder Difflin Electron app (Monaco code editor, Pixi.js viewport). |
| **`client-research-engine/`** | CLI Engine | Phyllis Vance's autonomous B2B prospect research engine. |
| **`closing-engine/`** | CLI Engine | Andy Bernard's proposal generator and deal closing engine. |
| **`akafolder/`** | Baseline | AEMY Enterprise OS reference microservices and blueprint contracts. |
| **`connections/`** | Adapters | API connectors, webhooks, and third-party MCP provider configurations. |
| **`docs/`** | Knowledge Base | B2B Playbooks, Biometric Compliance, 200-Agent Swarm Rosters, and Git infrastructure plans. |
| **`bin/`** | Tools | Standalone command-line tools and helper scripts. |
| **`spawn-requests/`** | Queue | Temporary IPC communication pipe for spawning sub-agents. |
| **`fleet.json`** | Telemetry | Live JSON record of agent active status, token consumption, and latency. |
| **`registry.json`** | Registry | Canonical registry of all agents, assigned department roles, and tools. |
| **`tasks.json`** | Ledger | Active swarm task board state. |
| **`board.md`** | Kanban | Human-readable Markdown sync of the active task board. |
| **`COMMANDS.md`** | Reference | Complete catalog of slash commands and CLI commands for Claude Code & agents. |
| **`PROTOCOL.md`** | Rules | Standard operating procedure for inter-agent communication and task claiming. |
| **`memory-index.md`** | Memory | Master index of agent episodic memory and learned procedures. |
