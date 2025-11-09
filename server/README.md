# 🌐 Serveur Multijoueur LAN - Le Coeur du Dragon

Ce serveur permet de jouer en réseau local avec votre famille et de partager un classement commun.

## ⚡ Démarrage Rapide

### Windows
1. Installer Node.js: https://nodejs.org/ (choisir la version LTS)
2. Redémarrer l'ordinateur
3. Double-cliquer sur `start-server.bat` dans le dossier `server`
4. Partager l'adresse affichée (ex: `http://192.168.1.100:3000`) avec votre famille

### Ubuntu/Linux
1. Installer Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
2. Démarrer le serveur:
   ```bash
   cd server
   ./start-server.sh
   ```
3. Partager l'adresse affichée avec votre famille

---

## 📋 Prérequis

### Qu'est-ce que Node.js ?

**Node.js** est un logiciel gratuit et open-source qui permet d'exécuter du code JavaScript sur votre ordinateur (en dehors d'un navigateur web). C'est une application autonome qui s'installe comme n'importe quel autre programme.

- 🆓 **Gratuit** et sans publicité
- 🔒 **Sûr** et largement utilisé (des millions d'utilisateurs)
- 📦 **Inclut npm** (Node Package Manager) pour gérer les dépendances
- 🚫 **Pas besoin de Docker** - Installation simple et directe

### Qu'est-ce que npm ?

**npm** (Node Package Manager) est installé automatiquement avec Node.js. C'est un outil qui télécharge et gère les bibliothèques (dépendances) nécessaires pour le serveur.

Quand vous exécutez `npm install`, npm télécharge:
- **express**: Framework pour créer le serveur web
- **socket.io**: Bibliothèque pour la communication en temps réel
- **cors**: Permet les connexions depuis différents appareils

Ces fichiers sont téléchargés dans un dossier `node_modules` (qui peut être gros, ~50 MB). C'est normal et nécessaire.

### Pour Windows

1. **Node.js** (version 16 ou supérieure)
   - Télécharger depuis: https://nodejs.org/
   - Choisir la version LTS (Long Term Support)
   - L'installeur inclut automatiquement npm (Node Package Manager)
   - Après installation, redémarrer l'ordinateur

2. **Vérifier l'installation**
   - Ouvrir l'Invite de commandes (cmd) ou PowerShell
   - Taper:
     ```cmd
     node --version
     npm --version
     ```
   - Vous devriez voir les numéros de version (ex: v20.10.0 et 10.2.3)

### Pour Ubuntu/Linux

1. **Node.js et npm**
   
   **Méthode recommandée (via NodeSource):**
   ```bash
   # Installer curl si nécessaire
   sudo apt update
   sudo apt install -y curl
   
   # Ajouter le dépôt NodeSource pour Node.js 20.x
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   
   # Installer Node.js et npm
   sudo apt install -y nodejs
   ```
   
   **Méthode alternative (via apt - version plus ancienne):**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   ```

2. **Vérifier l'installation**
   ```bash
   node --version
   npm --version
   ```

### Docker (Optionnel)

**Docker n'est PAS nécessaire** pour ce serveur. 

Node.js est une application autonome (standalone) qui s'installe directement sur votre système d'exploitation, comme n'importe quel autre logiciel. Il n'y a **aucun besoin de Docker, de conteneurs, ou de virtualisation**.

Le serveur fonctionne avec Node.js natif sur:
- ✅ Windows (7, 8, 10, 11)
- ✅ Ubuntu/Linux (toutes versions récentes)
- ✅ macOS

**Note:** Si quelqu'un mentionne Docker, c'est probablement pour des cas d'usage avancés (déploiement en production, isolation, etc.). Pour jouer en LAN avec votre famille, installez simplement Node.js comme indiqué ci-dessus.

## 🚀 Installation

### Windows

1. **Ouvrir l'Invite de commandes** dans le dossier du projet
   - Maintenir Shift + Clic droit dans le dossier
   - Choisir "Ouvrir la fenêtre de commande ici" ou "Ouvrir PowerShell ici"

2. **Naviguer vers le dossier server**
   ```cmd
   cd server
   ```

3. **Installer les dépendances**
   ```cmd
   npm install
   ```
   
   Cette commande va télécharger et installer:
   - express (serveur web)
   - socket.io (communication temps réel)
   - cors (gestion des requêtes cross-origin)

### Ubuntu/Linux

1. **Ouvrir un terminal** (Ctrl+Alt+T)

2. **Naviguer vers le dossier server**
   ```bash
   cd /chemin/vers/lecoeurdudragon/server
   ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```

## 🎮 Démarrer le serveur

### Méthode 1 : Script de démarrage automatique (Recommandé)

Ces scripts vérifient automatiquement que Node.js est installé, installent les dépendances si nécessaire, et affichent les adresses réseau.

**Windows:**
1. Ouvrir le dossier `server` dans l'Explorateur de fichiers
2. Double-cliquer sur `start-server.bat`
3. Une fenêtre noire (Invite de commandes) s'ouvrira avec les informations du serveur

**Ubuntu/Linux:**
1. Ouvrir un terminal dans le dossier `server`
2. Exécuter:
   ```bash
   ./start-server.sh
   ```
   Si vous obtenez "Permission denied", d'abord exécuter:
   ```bash
   chmod +x start-server.sh
   ./start-server.sh
   ```

### Méthode 2 : Démarrage manuel

**Windows (Invite de commandes ou PowerShell):**
```cmd
cd server
npm start
```

**Ubuntu/Linux (Terminal):**
```bash
cd server
npm start
```

### Méthode 3 : Mode développement (redémarre automatiquement)

Utile si vous modifiez le code du serveur.

**Windows:**
```cmd
cd server
npm run dev
```

**Ubuntu/Linux:**
```bash
cd server
npm run dev
```

Le serveur démarre sur le port **3000** par défaut.

## 🔧 Configuration

### Changer le port

**Windows:**
```cmd
set PORT=8080
npm start
```

**Ubuntu/Linux:**
```bash
PORT=8080 npm start
```

Ou avec les scripts de démarrage:

**Windows:**
```cmd
start-server.bat 8080
```

**Ubuntu/Linux:**
```bash
./start-server.sh 8080
```

## 🌐 Accès depuis le réseau local

### 1. Trouver votre adresse IP locale

Les scripts `start-server.bat` (Windows) et `start-server.sh` (Linux) affichent automatiquement vos adresses IP. Sinon:

**Windows:**
1. Ouvrir l'Invite de commandes (Win+R, taper `cmd`, Enter)
2. Taper:
   ```cmd
   ipconfig
   ```
3. Chercher "Adresse IPv4" dans la section de votre connexion active
   - Exemple: `192.168.1.100` ou `10.0.0.50`

**Ubuntu/Linux:**
1. Ouvrir un terminal
2. Taper:
   ```bash
   ip addr show
   ```
   Ou:
   ```bash
   ifconfig
   ```
3. Chercher une adresse commençant par:
   - `192.168.x.x` (réseau Wi-Fi domestique typique)
   - `10.x.x.x` (autre réseau local)
   - Ignorer `127.0.0.1` (c'est localhost, pas accessible depuis d'autres appareils)

### 2. Partager l'adresse avec votre famille

Si votre adresse IP est `192.168.1.100` et le serveur tourne sur le port 3000:

Les membres de votre famille peuvent accéder au jeu via:
```
http://192.168.1.100:3000
```

## 📊 Fonctionnalités

### Classement en temps réel
- Les scores sont automatiquement synchronisés entre tous les joueurs connectés
- Le classement se met à jour instantanément grâce à WebSocket

### Identification des joueurs
- Chaque joueur a un identifiant unique stocké dans son navigateur
- Les scores sont associés au nom et à l'ID du joueur

### Persistance des données
- Les scores sont sauvegardés dans `scores.json`
- Les données persistent même si le serveur redémarre

## 🔌 API Endpoints

### GET /api/health
Vérifier que le serveur fonctionne
```bash
curl http://localhost:3000/api/health
```

### GET /api/leaderboard
Obtenir le classement
```bash
curl http://localhost:3000/api/leaderboard
```

Avec limite personnalisée:
```bash
curl http://localhost:3000/api/leaderboard?limit=20
```

### POST /api/score
Soumettre un score (utilisé automatiquement par le jeu)
```bash
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "abc123",
    "playerName": "Héros",
    "level": 10,
    "kills": 50,
    "gold": 1000,
    "className": "Guerrier",
    "race": "Humain"
  }'
```

### GET /api/player/:playerId
Obtenir les scores personnels d'un joueur
```bash
curl http://localhost:3000/api/player/abc123
```

## 🔥 WebSocket Events

Le serveur utilise Socket.IO pour les mises à jour en temps réel:

- **`connection`** : Quand un joueur se connecte
- **`leaderboard-update`** : Envoyé à tous les clients quand le classement change
- **`request-leaderboard`** : Le client peut demander une mise à jour du classement

## 📁 Structure des fichiers

```
server/
├── package.json      # Configuration du projet Node.js
├── server.js         # Code principal du serveur
├── scores.json       # Base de données des scores (créé automatiquement)
└── README.md         # Ce fichier
```

## 🛡️ Sécurité

⚠️ **Important**: Ce serveur est conçu pour un usage en réseau local uniquement.

- Pas d'authentification par défaut
- Ne pas exposer sur Internet sans mesures de sécurité supplémentaires
- Utiliser uniquement sur un réseau privé de confiance

## 🐛 Dépannage

### Problèmes d'installation

#### Le serveur ne démarre pas

**Problème**: `node: command not found` ou `'node' n'est pas reconnu`
- **Windows:** Node.js n'est pas installé ou pas dans le PATH
  - Réinstaller Node.js depuis https://nodejs.org/
  - Redémarrer l'ordinateur après l'installation
  - Vérifier: Ouvrir une **nouvelle** Invite de commandes et taper `node --version`
- **Ubuntu/Linux:** Installer Node.js (voir section Prérequis)

**Problème**: Erreur de port déjà utilisé (`EADDRINUSE`)
- Un autre programme utilise le port 3000
- **Solution 1**: Arrêter l'autre programme
- **Solution 2**: Changer le port: `start-server.bat 8080` ou `PORT=8080 npm start`

**Problème**: Erreur `npm: command not found`
- npm devrait être installé avec Node.js
- **Solution**: Réinstaller Node.js (la version complète, pas juste le runtime)

#### Caractères bizarres dans la console Windows

Si vous voyez des symboles étranges comme `ÔòöÔòÉ` au lieu de lignes:
- C'est normal avec l'ancienne version du script
- La nouvelle version (après cette mise à jour) utilise des caractères ASCII simples
- **Solution**: Utiliser la version mise à jour de `start-server.bat`

### Problèmes de connexion réseau
### Problèmes de connexion réseau

#### Les autres ne peuvent pas se connecter

**Problème**: Connexion refusée ou timeout
- **Vérification 1 - Même réseau**: Tous les appareils doivent être sur le même réseau Wi-Fi
- **Vérification 2 - Pare-feu Windows**:
  1. Ouvrir "Pare-feu Windows Defender"
  2. Cliquer "Autoriser une application via le pare-feu"
  3. Chercher "Node.js" et cocher "Privé" et "Public"
  4. Si absent, cliquer "Autoriser une autre application" et ajouter Node.js
     - Chemin typique: `C:\Program Files\nodejs\node.exe`
- **Vérification 3 - Pare-feu Ubuntu**:
  ```bash
  sudo ufw allow 3000/tcp
  sudo ufw status
  ```
- **Vérification 4 - Adresse IP correcte**: Vérifier avec `ipconfig` (Windows) ou `ip addr` (Linux)

**Problème**: "ERR_CONNECTION_REFUSED" dans le navigateur
- Le serveur n'est pas démarré
- **Solution**: Lancer `start-server.bat` ou `npm start` dans le dossier server

#### Les scores ne se sauvegardent pas

**Problème**: Les scores disparaissent au redémarrage
- **Windows**: Vérifier les permissions du dossier `server`
  - Clic droit sur le dossier → Propriétés → Sécurité
  - Votre compte utilisateur doit avoir "Contrôle total"
- **Ubuntu/Linux**: Vérifier les permissions
  ```bash
  ls -la scores.json
  chmod 644 scores.json  # Si nécessaire
  ```
- Regarder les logs du serveur dans la console pour voir les erreurs

## 📝 Exemple d'utilisation

1. **Sur le PC hôte** (celui qui héberge le serveur):
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Sur les autres appareils** (téléphones, tablettes, autres PCs):
   - Ouvrir le navigateur
   - Aller à `http://[IP-DU-SERVEUR]:3000`
   - Configurer le serveur dans les paramètres du jeu
   - Jouer et partager le classement !

## 🎯 Prochaines étapes

Pour activer la fonctionnalité multijoueur dans le jeu:
1. Le serveur doit être démarré
2. Les joueurs configurent l'adresse du serveur dans les paramètres du jeu
3. Les scores sont automatiquement envoyés au serveur à la fin de chaque partie
4. Le classement se met à jour en temps réel

Bon jeu ! ⚔️
