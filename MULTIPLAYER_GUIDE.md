# 🌐 Guide Complet du Mode Multijoueur LAN

## Vue d'Ensemble

Le jeu "Le Coeur du Dragon" supporte maintenant le mode multijoueur en réseau local (LAN), permettant à plusieurs joueurs sur le même réseau de partager un classement commun en temps réel.

## Fonctionnalités Principales

### 1. Identification des Joueurs
- Chaque joueur reçoit un **ID unique** stocké dans `localStorage`
- L'ID est généré automatiquement au premier lancement
- Format: `player_[timestamp]_[random]`
- Visible dans Statistiques → Sauvegardes → Paramètres Multijoueur

### 2. Serveur Multijoueur
- **Technologies**: Node.js, Express, Socket.IO
- **Port par défaut**: 3000
- **Persistance**: Fichier JSON (`scores.json`)
- **API REST** pour soumettre et récupérer les scores
- **WebSocket** pour mises à jour en temps réel

### 3. Classement en Temps Réel
- Synchronisation automatique entre tous les joueurs connectés
- Tri par: Niveau → Nombre de victoires → Or
- Affichage des 10 meilleurs scores
- Mise à jour instantanée via WebSocket

### 4. Soumission Automatique des Scores
- Les scores sont envoyés au serveur après chaque combat gagné
- Fonctionne en arrière-plan (pas d'interruption du jeu)
- Gestion intelligente des erreurs (continue de jouer si serveur indisponible)

## Installation et Configuration

### Étape 1: Prérequis
- Node.js version 16 ou supérieure ([télécharger](https://nodejs.org/))
- Tous les appareils doivent être sur le même réseau local (Wi-Fi ou Ethernet)

### Étape 2: Installation du Serveur

1. **Ouvrir un terminal** dans le dossier du projet
2. **Naviguer vers le dossier serveur**:
   ```bash
   cd server
   ```
3. **Installer les dépendances**:
   ```bash
   npm install
   ```

### Étape 3: Démarrer le Serveur

#### Option 1 - Script de démarrage (Recommandé)

**Linux/Mac**:
```bash
./start-server.sh
```

**Windows**:
```batch
start-server.bat
```

#### Option 2 - Commande manuelle
```bash
npm start
```

Le serveur affichera:
```
╔═══════════════════════════════════════════════════════╗
║  ⚔️  Le Coeur du Dragon - Serveur Multijoueur LAN  ⚔️  ║
╚═══════════════════════════════════════════════════════╝

✓ Serveur HTTP démarré sur le port 3000
✓ WebSocket (Socket.IO) actif
```

### Étape 4: Trouver l'Adresse IP du Serveur

**Windows**:
```cmd
ipconfig
```
Cherchez "Adresse IPv4" (ex: 192.168.1.100)

**Mac/Linux**:
```bash
ifconfig
# ou
ip addr show
```
Cherchez une adresse 192.168.x.x ou 10.x.x.x

### Étape 5: Configuration dans le Jeu

1. Ouvrir le jeu dans un navigateur
2. Aller dans **Statistiques** (bouton 5)
3. Cliquer sur **Sauvegardes**
4. Cliquer sur **Paramètres Multijoueur**
5. Entrer l'adresse IP et le port (ex: `192.168.1.100:3000`)
6. Cliquer sur **Tester** pour vérifier la connexion
7. Cliquer sur **Sauvegarder**

### Étape 6: Jouer sur d'Autres Appareils

1. Sur un autre appareil (téléphone, tablette, PC), ouvrir le navigateur
2. Aller à `http://[IP-DU-SERVEUR]:3000` (ex: `http://192.168.1.100:3000`)
3. Configurer le serveur comme à l'étape 5
4. Jouer ! Les scores sont automatiquement partagés

## Architecture Technique

### API REST Endpoints

#### GET `/api/health`
Vérifier l'état du serveur
```bash
curl http://localhost:3000/api/health
```
Réponse:
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-11-09T01:56:15.106Z"
}
```

#### GET `/api/leaderboard`
Obtenir le classement
```bash
curl http://localhost:3000/api/leaderboard?limit=10
```
Réponse:
```json
{
  "success": true,
  "scores": [
    {
      "playerId": "player_123",
      "playerName": "Héros",
      "level": 15,
      "kills": 75,
      "gold": 2500,
      "className": "Guerrier",
      "race": "humain",
      "gender": "male",
      "timestamp": "2025-11-09T01:56:38.640Z",
      "date": "2025-11-09"
    }
  ],
  "count": 1
}
```

#### POST `/api/score`
Soumettre un score
```bash
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "player_123",
    "playerName": "Héros",
    "level": 10,
    "kills": 50,
    "gold": 1000
  }'
```

#### GET `/api/player/:playerId`
Obtenir les scores personnels d'un joueur
```bash
curl http://localhost:3000/api/player/player_123
```

### WebSocket Events

Le serveur utilise Socket.IO pour les mises à jour en temps réel:

- **`connection`**: Émis quand un client se connecte
- **`leaderboard-update`**: Envoyé à tous les clients quand le classement change
- **`request-leaderboard`**: Le client peut demander une mise à jour
- **`disconnect`**: Émis quand un client se déconnecte

### Structure des Fichiers

```
lecoeurdudragon/
├── js/
│   ├── network.js           # Module client réseau
│   ├── multiplayer-ui.js    # Interface utilisateur multijoueur
│   ├── game-logic.js        # Logique du jeu (mise à jour)
│   ├── combat.js            # Système de combat (mise à jour)
│   └── main.js              # Point d'entrée (mise à jour)
├── server/
│   ├── server.js            # Serveur Node.js principal
│   ├── package.json         # Dépendances Node.js
│   ├── scores.json          # Base de données des scores (créé auto)
│   ├── start-server.sh      # Script de démarrage Linux/Mac
│   ├── start-server.bat     # Script de démarrage Windows
│   ├── .env.example         # Configuration exemple
│   └── README.md            # Documentation serveur
└── index.html               # Interface web (mise à jour)
```

## Dépannage

### Le serveur ne démarre pas

**Problème**: `node: command not found`
- **Solution**: Installer Node.js depuis https://nodejs.org/

**Problème**: Erreur de port déjà utilisé
- **Solution**: Changer le port: `PORT=8080 npm start`

### Les autres ne peuvent pas se connecter

**Problème**: Connexion refusée
- **Solution 1**: Vérifier le pare-feu (autoriser le port 3000)
- **Solution 2**: Vérifier que tous les appareils sont sur le même réseau
- **Solution 3**: Vérifier l'adresse IP du serveur

**Problème**: Timeout de connexion
- **Solution**: Redémarrer le routeur ou vérifier les paramètres réseau

### Les scores ne se sauvegardent pas

**Problème**: Les scores disparaissent au redémarrage
- **Solution**: Vérifier les permissions d'écriture dans `server/`
- **Solution**: Regarder les logs du serveur pour voir les erreurs

### Le classement ne se met pas à jour

**Problème**: Scores figés
- **Solution 1**: Rafraîchir la page du classement
- **Solution 2**: Vérifier la connexion WebSocket dans la console du navigateur
- **Solution 3**: Redémarrer le serveur

## Sécurité

⚠️ **Important**: Ce serveur est conçu pour un usage en réseau local uniquement.

### Recommandations:
- Ne PAS exposer le serveur sur Internet sans mesures de sécurité
- Utiliser uniquement sur un réseau privé de confiance
- Le serveur n'a pas d'authentification par défaut
- Les données sont stockées en clair dans `scores.json`

### Pour une utilisation avancée:
Si vous souhaitez exposer le serveur sur Internet:
1. Ajouter un système d'authentification
2. Utiliser HTTPS (SSL/TLS)
3. Implémenter une limitation de taux (rate limiting)
4. Valider et nettoyer toutes les entrées utilisateur
5. Utiliser une vraie base de données au lieu de JSON

## Performance

### Optimisations Appliquées:
- Limite de 1000 scores maximum dans `scores.json`
- Tri côté serveur pour alléger les clients
- WebSocket pour éviter le polling constant
- Soumission de scores asynchrone (pas de blocage du jeu)

### Recommandations:
- Pour 2-10 joueurs: Configuration par défaut suffisante
- Pour 10+ joueurs: Envisager une vraie base de données (MongoDB, PostgreSQL)
- Pour 50+ joueurs: Implémenter un cache (Redis) et load balancing

## Tests

Un script de test complet est fourni pour vérifier l'installation:

```bash
./test-multiplayer.sh
```

Ce script teste:
- ✓ Santé du serveur
- ✓ Soumission de scores
- ✓ Récupération du classement
- ✓ Persistance des données
- ✓ Chargement des modules client
- ✓ Structure des fichiers

## FAQ

**Q: Puis-je jouer sans serveur?**
R: Oui ! Le jeu fonctionne normalement en mode solo sans serveur configuré.

**Q: Les scores locaux sont-ils perdus en activant le multijoueur?**
R: Non, les scores locaux restent dans `localStorage`. Le classement multijoueur est séparé.

**Q: Combien de joueurs peuvent se connecter?**
R: Théoriquement illimité, mais recommandé pour 2-20 joueurs en LAN.

**Q: Puis-je voir mes anciens scores?**
R: Oui, utilisez l'endpoint `/api/player/[votre-id]` pour voir tous vos scores.

**Q: Le serveur consomme-t-il beaucoup de ressources?**
R: Non, très léger (environ 30-50 MB de RAM pour 10 joueurs).

**Q: Puis-je personnaliser le serveur?**
R: Oui ! Le code est ouvert et commenté. Modifiez `server/server.js`.

## Support et Contribution

Pour signaler un bug ou proposer une amélioration:
1. Créer une issue sur GitHub
2. Fournir les logs du serveur (`/tmp/server.log`)
3. Décrire les étapes pour reproduire le problème

Pour contribuire au code:
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Soumettre une Pull Request

## Changelog

### Version 1.0.0 (2025-11-09)
- ✨ Ajout du mode multijoueur LAN
- ✨ Serveur Node.js avec Express et Socket.IO
- ✨ API REST pour scores
- ✨ WebSocket pour mises à jour temps réel
- ✨ Interface de configuration dans le jeu
- ✨ Scripts de démarrage cross-platform
- ✨ Tests automatisés complets
- 📚 Documentation complète

## Licence

MIT License - Libre d'utilisation et de modification

---

**Bon jeu ! ⚔️**
