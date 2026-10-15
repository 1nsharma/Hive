@echo off
title HIVE DESKTOP - Autonomous AI Office & Multi-Agent Orchestrator
echo ==============================================================================
echo    🐝 HIVE DESKTOP - AUTONOMOUS AI OFFICE & ORCHESTRATION ENGINE
echo ==============================================================================
echo    Shell:             Electron 32 & TypeScript (Cross-platform)
echo    UI:                React 18 + Zustand
echo    2D Simulation:     Pixi.js 8 (Virtual Office Floor, Agent Spatial Canvas)
echo    Embedded IDE:      Monaco Editor 0.52 (Code Editor & Diff Viewer)
echo    Persistence:       SQLite (better-sqlite3) & File-Based Hive Ledger
echo    PTY Orchestration: Authentic PTY Processes (node-pty / ConPTY)
echo    Isolation:         Git Worktrees Layer per agent
echo    Memory:            Markdown Memory Palaces (agents/<id>/memory.md)
echo    Telemetry:         OpenTelemetry Token & Cost Waterfall Metrics
echo    12 AI Engines:     Claude Code, Antigravity, Codex, Grok, Copilot, Cursor,
echo                       Qwen, Kimi, OpenCode, Crush, Pi, Ollama / Local
echo ==============================================================================
echo.
cd /d "%~dp0desktop"
echo [1/2] Verifying Native ConPTY and SQLite Addons...
if not exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
    echo [WARN] Native better-sqlite3 addon not found.
)
if not exist "node_modules\node-pty\build\Release\conpty.node" (
    echo [WARN] Native ConPTY addon not found.
)
echo.
echo [2/2] Launching Hive Desktop Application in Development Mode...
echo Press Ctrl+C anytime to close the application.
echo.
npm run dev
pause
