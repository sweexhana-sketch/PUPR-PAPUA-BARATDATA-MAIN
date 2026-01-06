@echo off
TITLE WebGIS Launcher
CLS

ECHO ========================================================
ECHO    PUPR PAPUA BARAT DAYA - WEBGIS LAUNCHER
ECHO ========================================================
ECHO.

REM 1. Check Node.js
ECHO [1/3] Checking Node.js installation...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    COLOR 4F
    ECHO [ERROR] Node.js is NOT installed!
    ECHO.
    ECHO Please download and install Node.js from:
    ECHO https://nodejs.org/
    ECHO.
    ECHO After installing, restart this script.
    PAUSE
    EXIT
)
ECHO [OK] Node.js is ready.
ECHO.

REM 2. Install Dependencies (if needed)
ECHO [2/3] Checking dependencies...
IF NOT EXIST "node_modules" (
    ECHO Node modules missing. Installing... (This may take a few minutes)
    call npm install
) ELSE (
    ECHO [OK] Dependencies found.
)
ECHO.

REM 3. Start Server
ECHO [3/3] Starting Server...
ECHO.
ECHO    ---------------------------------------------------
ECHO    Please wait until you see: "Local: http://..."
ECHO    Then open your browser to: http://localhost:3000/webgis
ECHO    (Do NOT close this window)
ECHO    ---------------------------------------------------
ECHO.

call npm run dev
PAUSE
