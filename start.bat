@echo off
echo ================================================
echo   Starting GLearn Platform Servers
echo ================================================
echo.

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB: Running
) else (
    echo MongoDB: NOT RUNNING - Please start MongoDB first!
    pause
    exit /b 1
)

echo.
echo Starting servers...
echo.
echo Backend Server: http://localhost:5000
echo Frontend Client: http://localhost:5173
echo API Documentation: http://localhost:5000/api/docs
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both servers in separate windows
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Client" cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Close this window when done.
pause
