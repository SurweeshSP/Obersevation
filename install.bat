@echo off
echo Installing Observation Port Application...
echo.

echo Step 1: Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo Step 2: Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo Installation complete!
echo.
echo To start the application:
echo   1. Open two terminals
echo   2. In terminal 1: cd server ^&^& npm run dev
echo   3. In terminal 2: npm run dev
echo.
echo Or install concurrently globally and run: npm run dev:all
echo.
pause
