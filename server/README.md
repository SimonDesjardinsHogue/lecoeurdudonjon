# 🌐 Serveur Multijoueur LAN - Le Coeur du Dragon

Ce serveur permet de jouer en réseau local avec votre famille et de partager un classement commun.

## 🚀 Installation

1. **Assurez-vous d'avoir Node.js installé** (version 16 ou supérieure)
   ```bash
   node --version  # Vérifier l'installation
   ```

2. **Installer les dépendances**
   ```bash
   cd server
   npm install
   ```

## 🎮 Démarrer le serveur

### Méthode 1 : Démarrage simple
```bash
cd server
npm start
```

### Méthode 2 : Mode développement (redémarre automatiquement)
```bash
cd server
npm run dev
```

Le serveur démarre sur le port **3000** par défaut.

## 🔧 Configuration

### Changer le port
```bash
PORT=8080 npm start
```

## 🌐 Accès depuis le réseau local

### 1. Trouver votre adresse IP locale

**Windows:**
```bash
ipconfig
# Cherchez "Adresse IPv4"
```

**Mac/Linux:**
```bash
ifconfig
# ou
ip addr show
# Cherchez l'adresse 192.168.x.x ou 10.x.x.x
```

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

### Le serveur ne démarre pas
- Vérifiez que Node.js est installé: `node --version`
- Vérifiez que les dépendances sont installées: `npm install`
- Vérifiez qu'aucun autre programme n'utilise le port 3000

### Les autres ne peuvent pas se connecter
- Vérifiez que le pare-feu autorise les connexions sur le port 3000
- Assurez-vous que tous les appareils sont sur le même réseau Wi-Fi
- Vérifiez l'adresse IP du serveur avec `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)

### Les scores ne se sauvegardent pas
- Vérifiez les permissions d'écriture dans le dossier `server/`
- Regardez les logs du serveur pour voir les erreurs

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
