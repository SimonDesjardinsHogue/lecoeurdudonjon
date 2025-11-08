# Structure du Code JavaScript

Ce document explique l'organisation modulaire du code du jeu pour faciliter la maintenance et réduire les erreurs.

## 📁 Organisation des Dossiers

```
js/
├── data/               # Données du jeu (enemies, items, NPCs, etc.)
│   ├── enemies.js      # Ennemis et boss
│   ├── npcs.js         # Personnages non-joueurs
│   ├── shop-items.js   # Items de la boutique
│   ├── metals.js       # Métaux précieux
│   ├── events.js       # Événements aléatoires, énigmes, choix moraux
│   └── game-constants.js # Constantes (rarités, noms de stats, etc.)
│
├── core/               # Modules centraux du jeu
│   └── game-state.js   # État central du jeu (importe depuis data/)
│
├── systems/            # Systèmes de jeu (à venir)
│   └── (futures extractions de game-logic.js)
│
├── game-state.js       # Wrapper de compatibilité (re-exporte core/game-state.js)
├── game-logic.js       # Logique principale du jeu
├── combat.js           # Système de combat
├── ui.js               # Gestion de l'interface
├── save-load.js        # Sauvegarde/Chargement
├── achievements.js     # Système de succès
├── daily-quests.js     # Quêtes quotidiennes
├── skills.js           # Compétences
├── character-classes.js # Classes de personnages
├── character-races.js  # Races de personnages
├── character-sexes.js  # Genres de personnages
├── audio.js            # Gestion audio
├── particles.js        # Effets visuels
├── keyboard-handler.js # Raccourcis clavier
└── main.js             # Point d'entrée principal

```

## 🎯 Principes de l'Architecture

### Séparation des Préoccupations

1. **Données (data/)** : Définitions pures sans logique
   - Ennemis, items, NPCs, événements
   - Facile à modifier sans risque de casser la logique
   - Peut être généré ou édité par des outils externes

2. **État Central (core/)** : Gestion de l'état du jeu
   - Import et re-export des données
   - État mutable du joueur et du jeu
   - Source unique de vérité

3. **Logique (game-logic.js)** : Opérations sur l'état
   - Manipulation de l'état du jeu
   - Orchestration des différents systèmes
   - Règles métier

4. **Systèmes (systems/)** : Systèmes indépendants
   - Futurs modules pour boutique, PNJ, classement, etc.
   - Chaque système gère une fonctionnalité spécifique

## 📝 Guide de Modification

### Ajouter un Nouvel Ennemi

Éditez `js/data/enemies.js` :

```javascript
export const enemies = [
    // ... ennemis existants
    { 
        name: 'Nouveau Monstre', 
        icon: '🦖', 
        health: 100, 
        strength: 20, 
        defense: 10, 
        gold: 60, 
        xp: 80 
    }
];
```

### Ajouter un Nouvel Item de Boutique

Éditez `js/data/shop-items.js` :

```javascript
export const shopItems = [
    // ... items existants
    { 
        name: 'Nouvel Item', 
        icon: '✨', 
        description: 'Description', 
        cost: 100, 
        category: 'heal', 
        type: 'potion', 
        effect: null  // Sera défini dans game-logic.js
    }
];
```

Puis dans `js/game-logic.js`, fonction `initializeShopItems()` :

```javascript
shopItems[XX].effect = () => healPlayer(50);
```

### Ajouter un Nouveau PNJ

Éditez `js/data/npcs.js` :

```javascript
export const npcs = [
    // ... NPCs existants
    { 
        name: 'Nouveau PNJ',
        icon: '🧙',
        dialogue: 'Texte du dialogue...',
        reward: { type: 'gold', amount: 50 }  // ou null
    }
];
```

### Modifier les Constantes du Jeu

Éditez `js/data/game-constants.js` pour les rarités, noms de stats, modificateurs, etc.

## 🔄 Compatibilité Rétroactive

L'ancien fichier `js/game-state.js` est maintenant un wrapper qui re-exporte tout depuis `js/core/game-state.js`. Cela assure que le code existant continue de fonctionner sans modification.

```javascript
// js/game-state.js
export * from './core/game-state.js';
```

## 🚀 Prochaines Améliorations

Pour réduire davantage la taille de `game-logic.js` (actuellement 1197 lignes), les systèmes suivants peuvent être extraits :

1. **Shop System** → `js/systems/shop.js`
   - `showShop()`, `buyItem()`, `buyRareItem()`
   
2. **NPC System** → `js/systems/npc.js`
   - `meetNPC()`, `meetWanderingMerchant()`, `meetJeweler()`
   - `buyMetal()`, `sellMetal()`
   
3. **Leaderboard System** → `js/systems/leaderboard.js`
   - `showLeaderboard()`

## 💡 Bonnes Pratiques

1. **Un fichier = Une responsabilité** : Chaque fichier devrait avoir un rôle clairement défini
2. **Petits fichiers** : Viser < 300 lignes par fichier pour faciliter la lecture
3. **Imports explicites** : Toujours nommer ce qui est importé
4. **Documentation** : Commenter le rôle de chaque module en haut du fichier
5. **Tests** : Après chaque modification, tester le jeu dans le navigateur

## 🔍 Débogage

Si vous rencontrez des erreurs après une modification :

1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs d'import/export
3. S'assurer que tous les fichiers sont bien enregistrés
4. Rafraîchir la page (Ctrl+F5)
5. Vérifier que le serveur HTTP est actif

## 📚 Ressources

- [MDN: JavaScript Modules](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules)
- [Guide de contribution](../CONTRIBUTING.md)
- [Liste d'optimisations](../OPTIMISATIONS.md)
