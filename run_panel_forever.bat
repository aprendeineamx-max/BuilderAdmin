@echo off
:loop
echo Cleaning port 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001"') do taskkill /f /pid %%a >nul 2>&1

echo Starting VPS Manager...
cd vps-manager
call npm run dev -- -p 3001 -H 0.0.0.0
echo VPS Manager crashed! Restarting in 5 seconds...
timeout /t 5
goto loop
