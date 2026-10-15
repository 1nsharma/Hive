@echo off
title AI Super Intelligence Company - Deployment Center
cls
echo =====================================================================
echo    🏢 AI SUPER INTELLIGENCE COMPANY - CLOUD & WEB DEPLOYMENT 
echo =====================================================================
echo.
echo Select your preferred deployment method:
echo.
echo  [1] Vercel (Instant serverless cloud deployment)
echo  [2] Render / Railway / Koyeb (Push to GitHub)
echo  [3] Docker Container (Local / Cloud Run / VPS)
echo  [4] Quick Live Public URL (Instant Tunnel via Cloudflare / Localtunnel)
echo  [5] Run Local Production Server (http://localhost:3300)
echo  [6] Exit
echo.
set /p opt="Enter option [1-6]: "

if "%opt%"=="1" goto vercel
if "%opt%"=="2" goto github
if "%opt%"=="3" goto docker
if "%opt%"=="4" goto tunnel
if "%opt%"=="5" goto run
if "%opt%"=="6" goto end

:vercel
echo.
echo [*] Deploying to Vercel...
call npx vercel --prod
goto end

:github
echo.
echo [*] Preparing GitHub remote push...
echo Enter your GitHub repository URL (e.g. https://github.com/username/my-ai-company.git):
set /p repo="Repository URL: "
git remote remove origin 2>nul
git remote add origin %repo%
git branch -M main
git push -u origin main
echo.
echo [OK] Pushed to GitHub! Now link this repo in:
echo   - Render.com (Web Service -> New from Git -> Auto-deploys via render.yaml)
echo   - Railway.app (New Project -> GitHub Repo)
echo   - Vercel.com (Add New Project -> Import Git Repo)
goto end

:docker
echo.
echo [*] Building and running Docker container...
docker build -t ai-super-intelligence-company .
docker run -d -p 3300:3300 --name ai-company ai-super-intelligence-company
echo [OK] Running inside Docker on http://localhost:3300
goto end

:tunnel
echo.
echo [*] Launching local production server and public HTTPS tunnel...
start "AI Company Server" node server.js
timeout /t 3 /nobreak >nul
call npx localtunnel --port 3300
goto end

:run
echo.
echo [*] Starting local production server...
node server.js
goto end

:end
echo.
pause
