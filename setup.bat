@echo off
echo ================================================
echo   GLearn Platform - Quick Start Setup
echo ================================================
echo.

REM Check if MongoDB is running
echo [1/5] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is running!
) else (
    echo WARNING: MongoDB is not running!
    echo Please start MongoDB before continuing.
    echo.
    pause
)

REM Install server dependencies
echo.
echo [2/5] Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install server dependencies!
    pause
    exit /b 1
)

REM Seed database
echo.
echo [3/5] Seeding database with sample data...
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo Failed to seed database!
    pause
    exit /b 1
)

REM Install client dependencies
echo.
echo [4/5] Installing client dependencies...
cd ..\client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install client dependencies!
    pause
    exit /b 1
)

echo.
echo [5/5] Setup complete!
echo.
echo ================================================
echo   Ready to start the application!
echo ================================================
echo.
echo To start the server:
echo   cd server
echo   npm run dev
echo.
echo To start the client (in a new terminal):
echo   cd client
echo   npm run dev
echo.
echo Server will run on: http://localhost:5000
echo Client will run on: http://localhost:5173
echo API Docs will be at: http://localhost:5000/api/docs
echo.
echo Test Student Login:
echo   Email: alex@example.com
echo   Password: student123
echo.
pause
