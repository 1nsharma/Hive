@echo off
TITLE AI HIVE & MUNDER DIFFLIN — MASTER SYSTEM OS
COLOR 0B
CLS

echo ==============================================================================
echo        ___    ____   __  ___________    ______
echo       /   \  /  _/  / / / /  _/_  / /   / ____/
echo      / /| |  / /   / /_/ // /  / / / /   / __/   
echo     / ___ |_/ /   / __  // /  / / / /___/ /___   
echo    /_/  |_/___/  /_/ /_/___/ /_/ /_____/_____/   
echo.
echo    MUNDER DIFFLIN AI COMPANY & ENTERPRISE AUTONOMOUS SYSTEM
echo ==============================================================================
echo.
echo  [1] Start Web Virtual Office & Dashboard (http://localhost:3300)
echo  [2] Launch Munder Difflin Desktop App (Electron 32 + Monaco + Pixi.js)
echo  [3] Launch BOTH Web + Desktop App Simultaneously (Full System)
echo  [4] Run Master System Hub Diagnostics
echo  [5] Run Phyllis's B2B Research Engine CLI
echo  [6] Run Andy's Deal Closing Engine CLI
echo  [7] Deploy / Sync Web App to Vercel Cloud
echo  [8] Run Comprehensive Unit Tests
echo  [0] Exit
echo.
set /p opt="Select an option [1-8]: "

if "%opt%"=="1" goto start_web
if "%opt%"=="2" goto start_desktop
if "%opt%"=="3" goto start_both
if "%opt%"=="4" goto run_diag
if "%opt%"=="5" goto run_research
if "%opt%"=="6" goto run_closing
if "%opt%"=="7" goto deploy_vercel
if "%opt%"=="8" goto run_tests
if "%opt%"=="0" goto exit_app

:start_web
echo Starting Web Dashboard on http://localhost:3300...
start "" http://localhost:3300
cd /d "%~dp0web"
node server.js
pause
goto exit_app

:start_desktop
echo Launching Munder Difflin Desktop Engine...
call "%~dp0LAUNCH_MUNDER_DIFFLIN_DESKTOP.bat"
goto exit_app

:start_both
echo Launching Web Server in background...
start "AI Hive Web Server" cmd /k "cd /d "%~dp0web" && node server.js"
timeout /t 2 >nul
start "" http://localhost:3300
echo Launching Munder Difflin Desktop App...
call "%~dp0LAUNCH_MUNDER_DIFFLIN_DESKTOP.bat"
goto exit_app

:run_diag
node "%~dp0hive-system-hub.mjs"
pause
goto exit_app

:run_research
node "%~dp0client-research-engine\engine.mjs"
pause
goto exit_app

:run_closing
node "%~dp0closing-engine\engine.mjs"
pause
goto exit_app

:deploy_vercel
cd /d "%~dp0web"
echo Deploying to Vercel...
call vercel --prod
pause
goto exit_app

:run_tests
cd /d "%~dp0web"
node --test tests/company.test.js
pause
goto exit_app

:exit_app
exit /b 0
