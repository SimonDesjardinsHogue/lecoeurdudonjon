#!/bin/bash

# Script de démarrage du serveur multijoueur
# Usage: ./start-server.sh [port]

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Port par défaut ou argument
PORT=${1:-3000}

echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ⚔️  Le Coeur du Dragon - Serveur Multijoueur LAN  ⚔️  ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js n'est pas installé${NC}"
    echo "Veuillez installer Node.js depuis https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js version: $(node --version)"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    npm install
    echo ""
fi

# Afficher l'adresse IP locale
echo ""
echo -e "${GREEN}📡 Adresses réseau détectées:${NC}"
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    # Linux ou Mac
    if command -v ip &> /dev/null; then
        ip addr show | grep "inet " | grep -v "127.0.0.1" | awk '{print "  - http://"$2}' | sed 's/\/.*/:'"$PORT"'/'
    elif command -v ifconfig &> /dev/null; then
        ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print "  - http://"$2":'"$PORT"'"}'
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    ipconfig | grep "IPv4" | awk '{print "  - http://"$NF":'"$PORT"'"}'
fi

echo "  - http://localhost:$PORT"
echo ""
echo -e "${YELLOW}💡 Partagez l'une de ces adresses avec votre famille !${NC}"
echo ""

# Démarrer le serveur
PORT=$PORT node server.js
