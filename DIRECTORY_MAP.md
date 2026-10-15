# 🐝 Hive System Directory Map & Navigation Guide

| Directory / File | Type | Purpose & Scope |
| :--- | :---: | :--- |
| **`START_HIVE_SYSTEM.bat`** | Batch Script | **Master Launcher**: 8-option interactive menu to launch unified web, desktop orchestrator, test suite, research, closing, and cloud deploy. |
| **`LAUNCH_HIVE_DESKTOP.bat`** | Batch Script | Direct 1-click launcher for the compiled Hive Desktop Orchestrator (Electron 32 + Monaco + Pixi.js). |
| **`BUILD_DISTRIBUTABLE.bat`** | Batch Script | Builds Windows `.exe` production installer using electron-builder. |
| **`VISUAL_COMMAND_CENTER.html`** | HTML UI | Offline operational control room with agent tiles, live status, and task feeds. |
| **`hive-system-hub.mjs`** | Node.js | Comprehensive health diagnostic utility checking agents, registries, and modules. |
| **`web/`** | Core Subsystem | **Unified Master Web Platform & Gateway**: Runs on Port 3300. Includes retro glass UI connecting ALL modules (Floor, Workforce, Schedule, Director, Engines, Desktop, Enterprise OS, Workspaces, Microservices, Kanban, CLI) with 24 automated unit tests. |
| **`desktop/`** | Desktop Engine | **Hive Desktop & Multi-Agent Orchestrator**: Electron 32, React 18, Monaco Editor 0.52, Pixi.js 8 canvas, native ConPTY, SQLite ledger, and local agent harnesses. |
| **`enterprise/`** | Enterprise OS | **AEMY Enterprise OS & 8 Business Divisions**: Retail/MSME, Logistics, CleanTech, Talent, PetCare, GovTech, Media/Gaming, and AI Core. Contains executive blueprints, portfolio manifest, and portfolio inventory. |
| **`agents/`** | Fleet Swarm | Canonical workspaces for all 17 AI agents (Michael, Jim, Andy, Phyllis, Kevin, Toby, Kelly, Meredith, Erin, etc.). |
| **`client-research-engine/`** | CLI Engine | Phyllis Vance's autonomous B2B prospect research and authority scoring engine. |
| **`closing-engine/`** | CLI Engine | Andy Bernard's proposal generator and enterprise deal closing engine. |
| **`connections/`** | Adapters | API connectors, webhooks, and third-party MCP provider configurations. |
| **`docs/`** | Knowledge Base | B2B Playbooks, Biometric Compliance, 200-Agent Swarm Rosters, and Git infrastructure plans. |
| **`bin/`** | Tools | Standalone command-line tools and helper scripts. |
| **`spawn-requests/`** | Queue | IPC communication queue for spawning sub-agents. |
| **`fleet.json`** | Telemetry | Live JSON record of agent active status, token consumption, and latency. |
| **`registry.json`** | Registry | Canonical registry of all 17 agents, assigned department roles, and tools. |
| **`tasks.json`** | Ledger | Active swarm task board state. |
| **`board.md`** | Kanban | Human-readable Markdown sync of the active task board. |
| **`COMMANDS.md`** | Reference | Catalog of commands and CLI directives. |
| **`PROTOCOL.md`** | Rules | Standard operating procedure for inter-agent communication and task claiming. |
| **`memory-index.md`** | Memory | Master index of agent episodic memory and learned procedures. |
