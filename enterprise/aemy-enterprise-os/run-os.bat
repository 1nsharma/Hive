@echo off
title Aemy Enterprise OS - Live Server
echo ====================================================
echo   AEMY ENTERPRISE OS (BHARAT NEXUS)
echo   One Shared Core - 4 Business Units
echo ====================================================
echo.
echo Running automated verification tests...
node --test units/commerce/commerce.test.js units/logistics/logistics.test.js units/cleantech/cleantech.test.js units/talent/talent.test.js server/server.test.js
if %errorlevel% neq 0 (
  echo [ERROR] Verification tests failed!
  pause
  exit /b %errorlevel%
)
echo.
echo [SUCCESS] 100%% Tests Verified! Starting Enterprise Server...
echo Open your browser at: http://localhost:3000
echo.
node server/app.js
pause
