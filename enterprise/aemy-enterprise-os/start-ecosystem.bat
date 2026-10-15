@echo off
title Aemy Enterprise OS - Master Ecosystem (8 Services)
echo ======================================================
echo    AEMY ENTERPRISE OS (BHARAT NEXUS)
echo    Micro-Frontend & Multi-Studio Architecture
echo ======================================================
echo.
echo Running automated verification tests across all 8 services + gateway...
node --test shared/core/blueprint-contracts.test.js services/commerce-dukaanmitra/service.test.js services/logistics-truckwala/service.test.js services/cleantech-solarhub/service.test.js services/talent-hiresaathi/service.test.js services/studio-ai-agents/service.test.js services/studio-gaming-arcade/service.test.js services/govtech-services/service.test.js services/petcare-petsjanu/service.test.js gateway/gateway.test.js
if %errorlevel% neq 0 (
  echo [ERROR] Verification failed!
  pause
  exit /b %errorlevel%
)
echo.
echo [100%% VERIFIED] Launching all 8 Full-Stack Services + Master Gateway in parallel...
echo.
start http://localhost:3000
node orchestrator.js
pause
