@echo off
cd /d "%~dp0"

echo Starting StockLock OS on http://127.0.0.1:3005/dashboard
echo.
echo Keep this window open while using the app.
echo Press Ctrl+C in this window to stop the server.
echo.

call npm.cmd run start:local

echo.
echo StockLock OS server stopped or failed to start.
pause
