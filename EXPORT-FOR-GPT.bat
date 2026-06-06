@echo off
setlocal
cd /d "%~dp0"

set "ZIP_NAME=stocklock-os-for-gpt.zip"

if exist "%ZIP_NAME%" del "%ZIP_NAME%"

echo Creating %ZIP_NAME% without node_modules, .next, or .git...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$root = (Get-Location).Path; " ^
  "$zip = Join-Path $root '%ZIP_NAME%'; " ^
  "$items = Get-ChildItem -Force | Where-Object { $_.Name -notin @('node_modules', '.next', '.git', '%ZIP_NAME%') }; " ^
  "Compress-Archive -Path $items.FullName -DestinationPath $zip -Force"

echo.
echo Created %ZIP_NAME%
echo Upload this zip to GPT, then paste the prompt from GPT-HANDOFF.md.
pause
