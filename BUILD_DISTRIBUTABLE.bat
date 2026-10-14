@echo off
title MUNDER DIFFLIN - Package Windows Distributable (.exe)
echo ==============================================================================
echo    📦 MUNDER DIFFLIN - ELECTRON WINDOWS DISTRIBUTABLE BUILDER
echo ==============================================================================
echo.
cd /d "%~dp0munder-difflin"
echo Building production assets and packaging Windows installer...
echo.
npm run dist:win
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Windows installer packaged in munder-difflin\dist!
) else (
    echo [ERROR] Packaging failed with code %errorlevel%.
)
pause
