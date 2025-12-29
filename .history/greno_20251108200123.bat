@echo off
title Finito Development Starter

:: --- Start Frontend in a new window ---
start "Finito Frontend (npm run dev)" cmd /k "cd frontend && npm run dev"

:: --- Start Backend in a new window ---
start "Finito Backend (nodemon root.js)" cmd /k "cd backend && npx nodemon root.js"

exit