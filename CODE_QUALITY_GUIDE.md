# Guide des Bonnes Pratiques - Le Coeur du Dragon

Ce document décrit les bonnes pratiques de développement pour le projet "Le Coeur du Dragon".

## 1. Gestion des Erreurs

### Utilisation de try-catch
Toutes les fonctions qui interagissent avec des APIs externes, le DOM, ou effectuent des opérations critiques doivent être protégées par try-catch :

```javascript
export function criticalFunction() {
    try {
        // Opération critique
        performAction();
        saveGame();
        updateUI();
    } catch (error) {
        console.error('Error in criticalFunction:', error);
        // Restaurer l'état si nécessaire
        // Informer l'utilisateur
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
}
```

### Validation des entrées
Toujours valider et nettoyer les entrées utilisateur :

```javascript
import { sanitizePlayerName } from './security.js';

const name = sanitizePlayerName(userInput, PLAYER_NAME_MAX_LENGTH);
```

### Vérification des éléments DOM
Toujours vérifier l'existence des éléments avant manipulation :

```javascript
const element = document.getElementById('myElement');
if (element) {
    element.textContent = 'value';
}
```

## 2. Constantes et Configuration

### Extraction des nombres magiques
Utiliser des constantes nommées au lieu de nombres magiques :

```javascript
// ❌ Mauvais
if (player.energy < 10) {
    // ...
}

// ✅ Bon
import { ENERGY_COSTS } from './data/game-constants.js';

if (player.energy < ENERGY_COSTS.EXPLORE) {
    // ...
}
```

### Centralisation des constantes
Placer toutes les constantes dans `js/data/game-constants.js` :

```javascript
export const ENERGY_COSTS = {
    EXPLORE: 10,
    VISIT_VILLAGE: 5
};

export const REST_COST = 20;
```

## 3. Documentation et Commentaires

### Commentaires JSDoc
Utiliser JSDoc pour toutes les fonctions publiques :

```javascript
/**
 * Démarre une nouvelle partie avec les options sélectionnées
 * Valide les entrées et initialise l'état du joueur
 * 
 * @throws {Error} Si les sélections de personnage sont invalides
 */
export function startGame() {
    // ...
}
```

### Commentaires inline
Ajouter des commentaires pour la logique complexe :

```javascript
// Anti-cheat: Vérifier que le temps n'a pas reculé (manipulation d'horloge)
// Tolérance de 60 secondes pour les petits ajustements d'horloge
if (p.lastGameTime && currentTime < p.lastGameTime - 60000) {
    console.warn('⚠️ Anomalie temporelle détectée - manipulation d'horloge possible');
    return;
}
```

## 4. Organisation du Code

### Séparation des responsabilités
Diviser les fonctions longues en sous-fonctions :

```javascript
// ❌ Mauvais - Une fonction fait tout
export function explore() {
    // 200 lignes de code...
}

// ✅ Bon - Fonctions séparées par responsabilité
export function explore() {
    if (shouldFaceBoss()) {
        initiateBossFight();
        return;
    }
    
    if (dualMonsterChance) {
        initiateDualCombat();
    } else {
        initiateSingleCombat();
    }
}

function initiateBossFight() {
    // Logique spécifique aux boss
}

function initiateDualCombat() {
    // Logique spécifique aux combats doubles
}
```

### Structure modulaire
Respecter l'architecture ES6 modules :

```javascript
// Imports organisés par type
import { gameState } from './game-state.js';
import { ENERGY_COSTS } from './data/game-constants.js';
import { updateUI, showScreen } from './ui.js';
import { saveGame } from './save-load.js';

// Exports nommés (pas de default export)
export function myFunction() { }
export { otherFunction };
```

## 5. Performance et Optimisation

### Cache DOM
Utiliser le cache DOM pour les éléments fréquemment accédés :

```javascript
import { domCache } from './utils/dom-cache.js';

// Au lieu de :
const element = document.getElementById('myElement');

// Utiliser :
const element = domCache.get('myElement');
```

### Minimiser les manipulations DOM
Regrouper les mises à jour du DOM :

```javascript
// ❌ Mauvais - Multiples reflows
element1.textContent = 'value1';
element2.textContent = 'value2';
element3.textContent = 'value3';

// ✅ Bon - DocumentFragment ou mise à jour groupée
const updates = [
    { element: element1, value: 'value1' },
    { element: element2, value: 'value2' },
    { element: element3, value: 'value3' }
];
updates.forEach(({ element, value }) => {
    element.textContent = value;
});
```

## 6. Sécurité

### Prévention XSS
Toujours nettoyer les entrées utilisateur :

```javascript
import { sanitizePlayerName, escapeHtml } from './security.js';

// Pour les noms
const safeName = sanitizePlayerName(userInput, maxLength);

// Pour le contenu HTML
const safeHtml = escapeHtml(userContent);
```

### Validation localStorage
Valider les données avant de les charger :

```javascript
try {
    const saved = localStorage.getItem('key');
    if (saved) {
        const data = JSON.parse(saved);
        
        // Valider la structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data structure');
        }
        
        // Valider les propriétés requises
        validateSaveData(data);
        
        // Utiliser les données
        loadData(data);
    }
} catch (error) {
    console.error('Error loading data:', error);
    // Utiliser les valeurs par défaut
}
```

## 7. Tests et Validation

### Tests manuels
Après chaque modification :
1. Lancer le jeu et vérifier qu'il démarre
2. Créer un nouveau personnage
3. Tester les fonctionnalités modifiées
4. Vérifier qu'aucune erreur n'apparaît dans la console

### Tests de compatibilité
Tester sur :
- Chrome/Edge (Chromium)
- Firefox
- Safari (si possible)
- Mobile (Chrome mobile, Safari mobile)

## 8. Conventions de Nommage

### Variables et fonctions
```javascript
// camelCase pour variables et fonctions
let playerHealth = 100;
function calculateDamage() { }
```

### Constantes
```javascript
// camelCase pour objets/tableaux
export const ENERGY_COSTS = { EXPLORE: 10 };

// UPPER_SNAKE_CASE pour primitives
export const MAX_LEVEL = 24;
export const REST_COST = 20;
```

### Fichiers
```javascript
// kebab-case pour noms de fichiers
game-logic.js
character-classes.js
dom-cache.js
```

### Contenu français
```javascript
// Toutes les chaînes UI en français
alert('Veuillez entrer un nom pour votre héros !');
addCombatLog('Vous rencontrez un gobelin !', 'info');
```

## 9. Git et Commits

### Messages de commit
Format : Action + Description courte

```
Fix duplicate stats display in stats screen
Add error handling to combat functions
Extract constants to game-constants.js
Improve code organization in combat.js
```

### Commits atomiques
Un commit = une modification logique cohérente

## 10. Points de Vérification

Avant chaque commit :
- [ ] Code lint et formaté
- [ ] Pas d'erreurs console
- [ ] Fonctionnalités testées manuellement
- [ ] Documentation JSDoc ajoutée
- [ ] Constantes extraites si nécessaire
- [ ] Gestion d'erreurs appropriée
- [ ] Pas de console.log inutiles (utiliser console.error/warn)

## 11. Anti-patterns à Éviter

### ❌ Ne pas faire
```javascript
// Modification de state sans sauvegarde
gameState.player.gold += 100;

// Accès DOM répété
for (let i = 0; i < 100; i++) {
    document.getElementById('element').textContent = i;
}

// Nombres magiques
if (energy < 10) { }

// Pas de gestion d'erreur
function critical() {
    riskyOperation();
}
```

### ✅ Faire
```javascript
// Modification avec sauvegarde
gameState.player.gold += 100;
saveGame();
updateUI();

// Cache DOM
const element = domCache.get('element');
for (let i = 0; i < 100; i++) {
    element.textContent = i;
}

// Constantes nommées
import { ENERGY_COSTS } from './data/game-constants.js';
if (energy < ENERGY_COSTS.EXPLORE) { }

// Gestion d'erreur
function critical() {
    try {
        riskyOperation();
    } catch (error) {
        console.error('Error:', error);
        handleError();
    }
}
```

## 12. Ressources

- [Architecture du projet](ARCHITECTURE.md)
- [Guide de contribution](CONTRIBUTING.md)
- [Documentation des modules](docs/)
- [MDN JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
- [ES6 Modules](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules)
