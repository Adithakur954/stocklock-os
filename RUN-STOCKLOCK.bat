@echo off
cd /d "%~dp0"

echo Opening StockLock OS server window...
start "StockLock OS Server" cmd /k "cd /d %~dp0 && call npm.cmd run start:local"

echo Waiting for server startup...
timeout /t 8 /nobreak >nul

start "" "http://127.0.0.1:3005/dashboard"

echo.
echo If Chrome still says connection refused, look at the StockLock OS Server window for the error.
echo Keep that server window open while using the app.
pause
