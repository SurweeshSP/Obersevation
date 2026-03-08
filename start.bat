@echo off
echo Starting Observation Port Application...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo Application is starting...
echo Backend: http://localhost:3001
echo Frontend: Check the Frontend terminal for the URL
echo.
