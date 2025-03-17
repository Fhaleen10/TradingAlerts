@echo off
echo Killing any existing Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak

echo Starting backend server...
start "Backend Server" /D "c:\Users\HP\Desktop\neki kodovi\idea\tradingview-alerts\backend" cmd /k "node server.js"
timeout /t 2 /nobreak

echo Starting frontend server...
start "Frontend Server" /D "c:\Users\HP\Desktop\neki kodovi\idea\tradingview-alerts\frontend" cmd /k "npm run dev"

echo Servers are starting...
echo Frontend will be available at http://localhost:5173
echo Backend will be available at http://localhost:3001
echo.
echo To stop the servers, simply close this window or the terminal windows.
pause
