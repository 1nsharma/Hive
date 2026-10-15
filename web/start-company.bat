@echo off
title AI Super Intelligence Holding Company - Unified Autonomous Enterprise
echo ======================================================================
echo    🏢 AI SUPER INTELLIGENCE HOLDING COMPANY (UNIFIED ECOSYSTEM)
echo    Powered by Munder Difflin Virtual Office + AEMY Enterprise OS
echo ======================================================================
echo.
echo Running unified automated verification tests across all 24 components...
echo [1/4] Office & Coworkers Fleet Tests
echo [2/4] Full-Time / Part-Time Workforce & Shift Schedule Tests
echo [3/4] Core Blueprint Capability Contracts (TenantContext, RAG, Memory, Routing, Guardrails)
echo [4/4] 8 Microservices (Commerce, Logistics, CleanTech, Talent, AI Studio, Games, Gov, Pets)
echo.
npm test
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Verification failed! One or more tests did not pass.
  pause
  exit /b %errorlevel%
)
echo.
echo ======================================================================
echo    [100%% VERIFIED] ALL 24 TESTS PASSED! ZERO BREAKAGES!
echo    Launching Virtual Office & Master Enterprise Server on Port 3300...
echo ======================================================================
echo.
start http://localhost:3300
node server.js
pause
