@echo off
title Coworker CLI Dispatcher
echo ======================================================================
echo    💻 Munder Difflin Multi-Model CLI Dispatcher
echo ======================================================================
echo.
echo Available Coworker CLIs:
echo  1. Antigravity CLI (agy --model "Gemini 3.1 Pro (High)")
echo  2. Claude Code CLI (claude --model "claude-sonnet-4-6[1m]")
echo  3. Google Gemini CLI (gemini)
echo  4. Cursor Agent CLI (cursor-agent)
echo.
set /p coworker="Enter coworker name (e.g. michael, dwight, oscar, pam): "
set /p prompt="Enter prompt or task: "
echo.
echo Dispatching to %coworker%...
agy --dangerously-skip-permissions -p "%prompt%"
pause
