@echo off
REM Script de démarrage du serveur multijoueur pour Windows
REM Usage: start-server.bat [port]

SET PORT=%1
IF "%PORT%"=="" SET PORT=3000

echo ╔═══════════════════════════════════════════════════════╗
echo ║  ⚔️  Le Coeur du Dragon - Serveur Multijoueur LAN  ⚔️  ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Node.js n'est pas installé
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js installé
node --version
echo.

REM Vérifier si les dépendances sont installées
IF NOT EXIST "node_modules" (
    echo 📦 Installation des dépendances...
    call npm install
    echo.
)

REM Afficher les adresses IP
echo 📡 Adresses réseau:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    echo   - http://%%a:%PORT%
)
echo   - http://localhost:%PORT%
echo.
echo 💡 Partagez l'une de ces adresses avec votre famille !
echo.

REM Démarrer le serveur
SET PORT=%PORT%
node server.js
