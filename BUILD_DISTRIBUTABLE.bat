@echo off
title HIVE DESKTOP - Package Windows Distributable (.exe)
echo ==============================================================================
echo    📦 HIVE DESKTOP - ELECTRON WINDOWS DISTRIBUTABLE BUILDER
echo ==============================================================================
echo.
cd /d "%~dp0desktop"
echo Building production assets and packaging Windows installer...
echo.
npm run dist:win
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Windows installer packaged in desktop\dist!
) else (
    echo [ERROR] Packaging failed with code %errorlevel%.
)
pause
