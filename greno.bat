@echo off
title Greno Social - Fullstack Launcher
color 0A

echo ========================================================
echo               STARTING GRENO SOCIAL 
echo ========================================================
echo.

:: Navigate to root directory where this batch file is located
cd /d "%~dp0"

:: Check and install backend dependencies if missing
if not exist "backend\node_modules\" (
    echo [Setup] Backend dependencies not found. Installing...
    cd backend && call npm install && cd ..
)

:: Check and install frontend dependencies if missing
if not exist "frontend\node_modules\" (
    echo [Setup] Frontend dependencies not found. Installing...
    cd frontend && call npm install && cd ..
)

:: 1. Start Backend in a dedicated window
echo [1/2] Starting Backend Server (Node.js/Express)...
start "Greno Backend (Port 3000/5000)" cmd /k "cd backend && npm start"

:: Wait 2 seconds before launching frontend
timeout /t 2 /nobreak >nul

:: 2. Start Frontend in a dedicated window
echo [2/2] Starting Frontend (React + Vite)...
start "Greno Frontend (Vite Dev Server)" cmd /k "cd frontend && npm run dev"

:: Wait 3 seconds for Vite dev server to initialize, then open default browser
timeout /t 3 /nobreak >nul
echo.
echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ========================================================
echo  Both services launched successfully!
echo  - Backend terminal: running 'npm start'
echo  - Frontend terminal: running 'npm run dev'
echo ========================================================
echo.
pause
