# Architecture du Mode Multijoueur LAN

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RÉSEAU LOCAL (LAN)                                │
│                                                                          │
│  ┌────────────────┐      ┌────────────────┐      ┌────────────────┐   │
│  │   Navigateur   │      │   Navigateur   │      │   Navigateur   │   │
│  │   Joueur 1     │      │   Joueur 2     │      │   Joueur 3     │   │
│  │                │      │                │      │                │   │
│  │  ┌──────────┐  │      │  ┌──────────┐  │      │  ┌──────────┐  │   │
│  │  │ Client   │  │      │  │ Client   │  │      │  │ Client   │  │   │
│  │  │ JS       │  │      │  │ JS       │  │      │  │ JS       │  │   │
│  │  │          │  │      │  │          │  │      │  │          │  │   │
│  │  │ network  │  │      │  │ network  │  │      │  │ network  │  │   │
│  │  │ .js      │  │      │  │ .js      │  │      │  │ .js      │  │   │
│  │  └────┬─────┘  │      │  └────┬─────┘  │      │  └────┬─────┘  │   │
│  │       │        │      │       │        │      │       │        │   │
│  │       │ HTTP + │      │       │ HTTP + │      │       │ HTTP + │   │
│  │       │ WebSocket    │       │ WebSocket    │       │ WebSocket   │
│  │       │        │      │       │        │      │       │        │   │
│  └───────┼────────┘      └───────┼────────┘      └───────┼────────┘   │
│          │                       │                       │            │
│          │                       │                       │            │
│          │   ┌───────────────────▼───────────────────────▼─────────┐  │
│          └──►│           Serveur Multijoueur (Node.js)             │  │
│              │                                                      │  │
│              │  ┌────────────────────────────────────────────────┐ │  │
│              │  │         Express.js (API REST)                  │ │  │
│              │  │                                                 │ │  │
│              │  │  GET  /api/health                              │ │  │
│              │  │  GET  /api/leaderboard?limit=10                │ │  │
│              │  │  POST /api/score                               │ │  │
│              │  │  GET  /api/player/:id                          │ │  │
│              │  └────────────────────────────────────────────────┘ │  │
│              │                                                      │  │
│              │  ┌────────────────────────────────────────────────┐ │  │
│              │  │      Socket.IO (WebSocket)                     │ │  │
│              │  │                                                 │ │  │
│              │  │  - connection                                  │ │  │
│              │  │  - leaderboard-update (broadcast)              │ │  │
│              │  │  - request-leaderboard                         │ │  │
│              │  │  - disconnect                                  │ │  │
│              │  └────────────────────────────────────────────────┘ │  │
│              │                                                      │  │
│              │  ┌────────────────────────────────────────────────┐ │  │
│              │  │        Persistance (scores.json)               │ │  │
│              │  │                                                 │ │  │
│              │  │  {                                              │ │  │
│              │  │    "scores": [                                 │ │  │
│              │  │      {                                          │ │  │
│              │  │        "playerId": "player_123",                │ │  │
│              │  │        "playerName": "Héros",                   │ │  │
│              │  │        "level": 15,                             │ │  │
│              │  │        "kills": 75,                             │ │  │
│              │  │        "gold": 2500,                            │ │  │
│              │  │        ...                                      │ │  │
│              │  │      }                                          │ │  │
│              │  │    ]                                            │ │  │
│              │  │  }                                              │ │  │
│              │  └────────────────────────────────────────────────┘ │  │
│              └──────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Flux de Données

### 1. Soumission de Score

```
Joueur combat → Victoire
    ↓
combat.js → submitScoreIfEnabled()
    ↓
network.js → submitScore()
    ↓
HTTP POST → /api/score
    ↓
server.js → Validation + Sauvegarde
    ↓
scores.json (mise à jour)
    ↓
WebSocket broadcast → leaderboard-update
    ↓
Tous les clients connectés → updateLeaderboardDisplay()
    ↓
UI mise à jour en temps réel
```

### 2. Consultation du Classement

```
Joueur clique "Classement"
    ↓
game-logic.js → showLeaderboard()
    ↓
network.js → fetchLeaderboard()
    ↓
HTTP GET → /api/leaderboard
    ↓
server.js → Lecture et tri des scores
    ↓
scores.json
    ↓
Réponse JSON → Client
    ↓
displayNetworkLeaderboard()
    ↓
UI affiche le classement
```

### 3. Mises à Jour en Temps Réel

```
Nouveau score soumis par Joueur 2
    ↓
server.js → Score sauvegardé
    ↓
io.emit('leaderboard-update', scores)
    ↓
┌─────────────────────────────────────┐
│ Broadcast à tous les clients        │
│                                     │
│  Joueur 1 ──► updateLeaderboard()  │
│  Joueur 2 ──► updateLeaderboard()  │
│  Joueur 3 ──► updateLeaderboard()  │
└─────────────────────────────────────┘
    ↓
UI mise à jour automatiquement
```

## Technologies Utilisées

### Côté Serveur
- **Node.js** (v16+): Runtime JavaScript
- **Express.js** (v4.18): Framework web pour API REST
- **Socket.IO** (v4.6): Bibliothèque WebSocket
- **CORS**: Gestion des requêtes cross-origin
- **File System (fs)**: Persistance JSON

### Côté Client
- **JavaScript ES6 Modules**: Architecture modulaire
- **Fetch API**: Requêtes HTTP
- **Socket.IO Client**: WebSocket temps réel
- **LocalStorage**: Stockage de l'ID joueur
- **DOM API**: Manipulation de l'interface

## Déploiement

### Sur Réseau Local
```
PC Hôte (192.168.1.100)
    ↓
Démarrer serveur: npm start (port 3000)
    ↓
Autres appareils se connectent: http://192.168.1.100:3000
```

### Évolutivité Future

Pour supporter plus de joueurs ou fonctionnalités avancées:

```
┌────────────────┐
│   Load         │
│   Balancer     │
│   (Nginx)      │
└───────┬────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
Server 1  Server 2
   │         │
   └────┬────┘
        ▼
   Redis Cache
        ▼
  PostgreSQL DB
```

## Sécurité

### Niveau Actuel (LAN)
- ✓ Validation basique des entrées
- ✓ Sanitisation des données
- ✓ Pas d'exécution de code arbitraire
- ✓ CORS configuré

### Pour Production (Internet)
- ☐ Authentification JWT
- ☐ HTTPS/SSL
- ☐ Rate limiting
- ☐ Validation stricte
- ☐ Protection CSRF
- ☐ Base de données sécurisée
