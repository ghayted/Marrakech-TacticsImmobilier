@echo off
echo ========================================
echo    DEMARRAGE DES SERVEURS
echo ========================================
echo.

echo [1/3] Demarrage du Backend...
start "Backend Server" cmd /k "cd backend && dotnet run"

echo.
echo [2/3] Attente du demarrage du backend...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Demarrage du Frontend...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo    SERVEURS DEMARRES !
echo ========================================
echo.
echo Backend: http://localhost:5257
echo Frontend: http://localhost:3000
echo Admin: http://localhost:3000/admin-secret
echo.
echo Appuyez sur une touche pour fermer...
pause > nul
