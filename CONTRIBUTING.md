# Guide de Contribution - Le Coeur du Dragon

## 📁 Structure du Projet

Le jeu est organisé de manière **modulaire** pour faciliter la maintenance et l'ajout de nouvelles fonctionnalités.

### Architecture des Modules

```
lecoeurdudragon/
├── index.html              # Point d'entrée HTML
├── style.css               # Styles CSS
└── js/                     # Modules JavaScript
    ├── main.js             # Point d'entrée, configuration globale
    ├── game-state.js       # État du jeu (données)
    ├── game-logic.js       # Logique métier principale
    ├── character-classes.js # Système de classes de personnages
    ├── combat.js           # Système de combat
    ├── ui.js               # Gestion de l'interface utilisateur
    ├── save-load.js        # Sauvegarde et chargement
    ├── audio.js            # Gestion audio
    ├── particles.js        # Effets visuels
    └── keyboard-handler.js # Gestion des raccourcis clavier
```

### Description des Modules

#### 1. **game-state.js** - État du Jeu
- Contient toutes les données du jeu (joueur, ennemis, objets, PNJ)
- Structure centralisée pour éviter les conflits
- Exports: `gameState`, `enemies`, `shopItems`, `npcs`

#### 2. **character-classes.js** - Classes de Personnages
- Définitions des classes (Guerrier, Magicien, Archer, Rogue)
- Fonction d'application des stats de classe
- Exports: `characterClasses`, `applyCharacterClass()`

#### 3. **game-logic.js** - Logique Principale
- Initialisation du jeu
- Gestion des actions (repos, boutique, etc.)
- Progression (montée de niveau, expérience)
- Exports: `init()`, `startGame()`, `rest()`, `showShop()`, etc.

#### 4. **combat.js** - Système de Combat
- Logique de combat (attaque, défense, fuite)
- Génération d'ennemis
- Gestion des victoires/défaites
- Exports: `explore()`, `attack()`, `defend()`, `flee()`

#### 5. **ui.js** - Interface Utilisateur
- Mise à jour de l'affichage
- Gestion des écrans
- Affichage des logs de combat
- Exports: `showScreen()`, `updateUI()`, `updateEnemyUI()`, `addCombatLog()`

#### 6. **save-load.js** - Sauvegarde
- Sauvegarde automatique (localStorage)
- Export/import de parties
- Exports: `saveGame()`, `loadGame()`, `exportSave()`, `importSave()`

#### 7. **audio.js** - Audio
- Gestion des sons et de la musique
- Système de mute/unmute
- Exports: `audioManager`

#### 8. **particles.js** - Effets Visuels
- Animations (niveau supérieur, soins, etc.)
- Exports: `particleSystem`

#### 9. **keyboard-handler.js** - Raccourcis Clavier
- Gestion des touches de raccourci
- Exports: Configuration automatique

#### 10. **main.js** - Point d'Entrée
- Import de tous les modules
- Exposition des fonctions au scope global (pour onclick)
- Initialisation au chargement de la page

## 🔧 Ajouter une Nouvelle Fonctionnalité

### Exemple: Ajouter un Nouvel Ennemi

1. **Modifier `game-state.js`** - Ajouter l'ennemi à la liste:
```javascript
export const enemies = [
    // ... ennemis existants
    { name: 'Nouveau Monstre', icon: '👾', health: 75, strength: 16, defense: 7, gold: 40, xp: 60 }
];
```

2. **Aucune modification nécessaire ailleurs** - Le système de combat utilise automatiquement la liste.

### Exemple: Ajouter un Nouvel Objet dans la Boutique

1. **Modifier `game-state.js`** - Ajouter l'objet:
```javascript
export const shopItems = [
    // ... objets existants
    { name: 'Nouvel Objet', icon: '🎁', description: 'Description', cost: 100, category: 'heal', type: 'potion', strength: 'normal', effect: null }
];
```

2. **Modifier `game-logic.js`** - Ajouter l'effet dans `initializeShopItems()`:
```javascript
export function initializeShopItems() {
    // ... effets existants
    shopItems[17].effect = () => { /* effet de l'objet */ };
}
```

### Exemple: Ajouter un Nouvel Écran

1. **Modifier `index.html`** - Ajouter la section:
```html
<div id="newScreen" class="game-screen">
    <div class="story-text">
        <p>Contenu du nouvel écran</p>
    </div>
    <div class="game-actions">
        <button onclick="showMain()">🚪 Retour</button>
    </div>
</div>
```

2. **Créer une fonction dans `game-logic.js`**:
```javascript
export function showNewScreen() {
    showScreen('newScreen');
    // ... logique spécifique
}
```

3. **Exporter dans `main.js`**:
```javascript
import { /* ... autres imports */, showNewScreen } from './game-logic.js';
// ...
window.showNewScreen = showNewScreen;
```

## ✅ Bonnes Pratiques

### 1. **Séparation des Responsabilités**
- **Données** → `game-state.js`
- **Logique** → `game-logic.js` ou modules spécifiques
- **Affichage** → `ui.js`
- **Persistance** → `save-load.js`

### 2. **Nommage Cohérent**
- Fonctions: camelCase (`startGame`, `showShop`)
- Constantes: UPPER_SNAKE_CASE (rare, utilisé pour valeurs immuables)
- Modules: kebab-case (`game-state.js`)

### 3. **Éviter les Dépendances Circulaires**
```
✅ BON:  main.js → game-logic.js → game-state.js
❌ MAUVAIS: game-logic.js ↔ combat.js (import mutuel)
```

### 4. **Toujours Sauvegarder Après Modification**
```javascript
GameState.player.gold += 10;
saveGame();  // ✅ Important!
updateUI();  // ✅ Met à jour l'affichage
```

### 5. **Gestion d'Erreurs**
```javascript
export function buyItem(index) {
    const item = shopItems[index];
    if (!item) {
        console.error(`Item not found: ${index}`);
        return;
    }
    // ... suite de la logique
}
```

## 🧪 Tester Vos Modifications

### Serveur Local
```bash
# Python 3
python3 -m http.server 8000

# Node.js (avec npx)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Puis visitez: `http://localhost:8000/`

### Points de Test Importants
1. ✅ Le jeu se charge sans erreur
2. ✅ Le bouton "Commencer l'Aventure" fonctionne
3. ✅ La sauvegarde persiste après rechargement
4. ✅ Les combats fonctionnent correctement
5. ✅ La boutique affiche tous les objets
6. ✅ Les sons ne causent pas d'erreurs (même si mutés)

## 🐛 Déboguer

### Console du Navigateur
Ouvrez la console (F12) pour voir:
- Erreurs de chargement de modules
- Messages de débogage
- État du jeu: `console.log(GameState.player)`

### Vérifier l'État
```javascript
// Dans la console du navigateur
console.log(GameState.player);
console.log(GameState.enemies);
```

### Forcer une Sauvegarde
```javascript
saveGame();
```

### Réinitialiser
```javascript
localStorage.clear();
location.reload();
```

## 📚 Ressources

- [MDN Web Docs - ES6 Modules](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules)
- [JavaScript Best Practices](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide)
- [localStorage API](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)

## ❓ Questions Fréquentes

**Q: Pourquoi utiliser des modules ES6?**  
R: Meilleure organisation, évite les conflits de noms, facilite la maintenance.

**Q: Le jeu ne se charge pas en local?**  
R: Les modules ES6 nécessitent un serveur HTTP. Utilisez `python3 -m http.server 8000`.

**Q: Comment ajouter un son?**  
R: Consultez `audio.js` et ajoutez votre son dans la structure `sounds`.

**Q: Puis-je utiliser jQuery ou d'autres librairies?**  
R: Le jeu utilise du JavaScript vanilla pour rester léger. Préférez cette approche.

---

**Contribution bienvenue!** N'hésitez pas à proposer des améliorations via Pull Requests. 🎮
