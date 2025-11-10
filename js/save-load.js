// Save and Load Module
import { gameState } from './game-state.js';
import { updateUI, showSaveIndicator } from './ui.js';

// Save game to localStorage
export function saveGame() {
    localStorage.setItem('lecoeurdudonjon_save', JSON.stringify(gameState));
    showSaveIndicator();
}

// Load game from localStorage
export function loadGame() {
    const saved = localStorage.getItem('lecoeurdudonjon_save');
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            
            // Copy properties to gameState, ensuring we maintain the object reference
            // Copy player properties individually
            if (loadedState.player) {
                Object.assign(gameState.player, loadedState.player);
            }
            // Copy other state properties
            gameState.currentEnemy = loadedState.currentEnemy;
            gameState.inCombat = loadedState.inCombat;
            gameState.defending = loadedState.defending;
            
            // Add energy properties if they don't exist (for backwards compatibility)
            if (!gameState.player.hasOwnProperty('energy')) {
                gameState.player.energy = 100;
            }
            if (!gameState.player.hasOwnProperty('maxEnergy')) {
                gameState.player.maxEnergy = 100;
            }
            if (!gameState.player.hasOwnProperty('lastSleepTime')) {
                gameState.player.lastSleepTime = null;
            }
            // Add character class properties if they don't exist (for backwards compatibility)
            if (!gameState.player.hasOwnProperty('class')) {
                gameState.player.class = 'guerrier';
            }
            if (!gameState.player.hasOwnProperty('className')) {
                gameState.player.className = 'Guerrier';
            }
            if (!gameState.player.hasOwnProperty('classIcon')) {
                gameState.player.classIcon = '⚔️';
            }
            // Add weapon damage property if it doesn't exist (for backwards compatibility)
            if (!gameState.player.hasOwnProperty('weaponDamage')) {
                gameState.player.weaponDamage = 0;
            }
            // Add equipment tracking properties if they don't exist (for backwards compatibility)
            if (!gameState.player.hasOwnProperty('currentWeapon')) {
                gameState.player.currentWeapon = null;
            }
            if (!gameState.player.hasOwnProperty('currentArmor')) {
                gameState.player.currentArmor = null;
            }
            // Add mana properties if they don't exist (for backwards compatibility)
            if (!gameState.player.hasOwnProperty('mana')) {
                gameState.player.mana = 100;
            }
            if (!gameState.player.hasOwnProperty('maxMana')) {
                gameState.player.maxMana = 100;
            }
            
            // Add shop state if it doesn't exist (for backwards compatibility)
            if (loadedState.shop) {
                gameState.shop = loadedState.shop;
            }
            if (!gameState.shop) {
                gameState.shop = {
                    unavailableItemIndices: [],
                    nextRestockTime: null
                };
            }
        } catch (e) {
            console.error('Error loading save:', e);
        }
    }
}

// Export save to code
export function exportSave() {
    // Prevent save export during boss combat to avoid save-scumming
    if (gameState.inBossCombat) {
        const resultDiv = document.getElementById('exportResult');
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#ff6b6b';
        errorMsg.textContent = '⚠️ Impossible de sauvegarder pendant un combat de boss!';
        resultDiv.innerHTML = '';
        resultDiv.appendChild(errorMsg);
        return;
    }
    
    try {
        const saveData = JSON.stringify(gameState);
        const encoded = btoa(encodeURIComponent(saveData));
        
        const resultDiv = document.getElementById('exportResult');
        
        // Create elements safely to avoid XSS
        const container = document.createElement('div');
        container.style.cssText = 'background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; margin-top: 10px;';
        
        const successMsg = document.createElement('p');
        successMsg.style.cssText = 'color: #51cf66; margin-bottom: 10px;';
        successMsg.textContent = '✓ Code généré avec succès !';
        
        const textarea = document.createElement('textarea');
        textarea.readOnly = true;
        textarea.style.cssText = 'width: 100%; max-width: 100%; height: 100px; background: rgba(0, 0, 0, 0.7); color: #f0f0f0; border: 1px solid #8B4513; padding: 10px; font-family: "Courier New", monospace; font-size: 0.8em; border-radius: 5px;';
        textarea.value = encoded;
        
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Copier le Code';
        copyBtn.style.cssText = 'margin-top: 10px;';
        copyBtn.addEventListener('click', () => copySaveCode(encoded));
        
        container.appendChild(successMsg);
        container.appendChild(textarea);
        container.appendChild(copyBtn);
        
        resultDiv.innerHTML = '';
        resultDiv.appendChild(container);
    } catch (e) {
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#ff6b6b';
        errorMsg.textContent = '❌ Erreur lors de l\'export: ' + e.message;
        document.getElementById('exportResult').innerHTML = '';
        document.getElementById('exportResult').appendChild(errorMsg);
    }
}

// Copy save code to clipboard
function copySaveCode(code) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            alert('Code copié dans le presse-papiers !');
        }).catch(() => {
            fallbackCopy(code);
        });
    } else {
        fallbackCopy(code);
    }
}

// Fallback copy method for browsers without Clipboard API
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        const success = document.execCommand('copy');
        if (success) {
            alert('Code copié dans le presse-papiers !');
        } else {
            alert('Impossible de copier automatiquement. Veuillez copier le code manuellement.');
        }
    } catch (e) {
        alert('Impossible de copier automatiquement. Veuillez copier le code manuellement.');
    }
    document.body.removeChild(textarea);
}

// Validation ranges for player properties (anti-cheat)
const VALIDATION_RANGES = {
    level: { min: 1, max: 20 },
    health: { min: 1, max: 2000 },
    maxHealth: { min: 1, max: 2000 },
    strength: { min: 1, max: 100 },
    defense: { min: 1, max: 100 },
    dexterity: { min: 1, max: 100 },
    constitution: { min: 1, max: 100 },
    intelligence: { min: 1, max: 100 },
    wisdom: { min: 1, max: 100 },
    charisma: { min: 1, max: 100 },
    gold: { min: 0, max: 999999 },
    xp: { min: 0, max: 999999 },
    statPoints: { min: 0, max: 40 },
    kills: { min: 0, max: 99999 },
    deaths: { min: 0, max: 99999 },
    bossesDefeated: { min: 0, max: 5 },
    energy: { min: 0, max: 200 },
    maxEnergy: { min: 0, max: 200 },
    mana: { min: 0, max: 200 },
    maxMana: { min: 0, max: 200 }
};

// Validate player data against acceptable ranges
function validatePlayerData(player) {
    for (const [prop, range] of Object.entries(VALIDATION_RANGES)) {
        if (player[prop] !== undefined) {
            const value = player[prop];
            if (typeof value !== 'number' || value < range.min || value > range.max) {
                throw new Error(`Invalid ${prop}: ${value} (must be ${range.min}-${range.max})`);
            }
        }
    }
    
    // Logical validations
    if (player.health > player.maxHealth) {
        throw new Error('Health cannot exceed maxHealth');
    }
    
    if (player.energy > player.maxEnergy) {
        throw new Error('Energy cannot exceed maxEnergy');
    }
    
    if (player.mana > player.maxMana) {
        throw new Error('Mana cannot exceed maxMana');
    }
    
    // Level should roughly correlate with stats
    const totalStats = (player.strength || 10) + (player.defense || 10) + 
                       (player.dexterity || 10) + (player.constitution || 10) +
                       (player.intelligence || 10) + (player.wisdom || 10) + 
                       (player.charisma || 10);
    const minExpectedStats = 70 + (player.level - 1) * 1; // Base 70 + 1 per level minimum
    const maxExpectedStats = 70 + (player.level - 1) * 7 + 50; // Allow for items and bonuses
    
    if (totalStats < minExpectedStats || totalStats > maxExpectedStats) {
        console.warn(`Suspicious stats total: ${totalStats} for level ${player.level}`);
        // Don't throw, just warn - player might have special items
    }
    
    return true;
}

// Import save from code
export function importSave() {
    const code = document.getElementById('importCode').value.trim();
    const resultDiv = document.getElementById('importResult');
    
    if (!code) {
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#ff6b6b';
        errorMsg.textContent = '❌ Veuillez entrer un code de sauvegarde.';
        resultDiv.innerHTML = '';
        resultDiv.appendChild(errorMsg);
        return;
    }
    
    try {
        const decoded = decodeURIComponent(atob(code));
        const loadedState = JSON.parse(decoded);
        
        // Comprehensive validation of the loaded state
        if (!loadedState || typeof loadedState !== 'object') {
            throw new Error('Invalid state structure');
        }
        
        // Validate player object and required properties
        const requiredPlayerProps = ['name', 'level', 'health', 'maxHealth', 'strength', 'defense', 'gold', 'xp', 'xpToLevel', 'kills', 'gamesPlayed'];
        if (!loadedState.player || typeof loadedState.player !== 'object') {
            throw new Error('Missing player data');
        }
        
        for (const prop of requiredPlayerProps) {
            if (!(prop in loadedState.player)) {
                throw new Error(`Missing player property: ${prop}`);
            }
        }
        
        // Validate player data ranges (anti-cheat)
        validatePlayerData(loadedState.player);
        
        // Add energy properties if they don't exist (for backwards compatibility)
        if (!('energy' in loadedState.player)) {
            loadedState.player.energy = 100;
        }
        if (!('maxEnergy' in loadedState.player)) {
            loadedState.player.maxEnergy = 100;
        }
        if (!('lastSleepTime' in loadedState.player)) {
            loadedState.player.lastSleepTime = null;
        }
        // Add character class properties if they don't exist (for backwards compatibility)
        if (!('class' in loadedState.player)) {
            loadedState.player.class = 'guerrier';
        }
        if (!('className' in loadedState.player)) {
            loadedState.player.className = 'Guerrier';
        }
        if (!('classIcon' in loadedState.player)) {
            loadedState.player.classIcon = '⚔️';
        }
        
        // Validate property types for all player properties
        if (typeof loadedState.player.name !== 'string' || 
            typeof loadedState.player.level !== 'number' ||
            typeof loadedState.player.health !== 'number' ||
            typeof loadedState.player.maxHealth !== 'number' ||
            typeof loadedState.player.strength !== 'number' ||
            typeof loadedState.player.defense !== 'number' ||
            typeof loadedState.player.gold !== 'number' ||
            typeof loadedState.player.xp !== 'number' ||
            typeof loadedState.player.xpToLevel !== 'number' ||
            typeof loadedState.player.kills !== 'number' ||
            typeof loadedState.player.gamesPlayed !== 'number' ||
            typeof loadedState.player.energy !== 'number' ||
            typeof loadedState.player.maxEnergy !== 'number') {
            throw new Error('Invalid player data types');
        }
        
        // Validate required state properties and their types
        if (typeof loadedState.inCombat !== 'boolean' || 
            typeof loadedState.defending !== 'boolean') {
            throw new Error('Invalid state property types');
        }
        
        // Validate currentEnemy if present
        if (loadedState.currentEnemy !== null) {
            if (typeof loadedState.currentEnemy !== 'object' ||
                typeof loadedState.currentEnemy.name !== 'string' ||
                typeof loadedState.currentEnemy.health !== 'number' ||
                typeof loadedState.currentEnemy.strength !== 'number' ||
                typeof loadedState.currentEnemy.defense !== 'number' ||
                typeof loadedState.currentEnemy.gold !== 'number' ||
                typeof loadedState.currentEnemy.xp !== 'number') {
                // If enemy data is invalid, clear it
                loadedState.currentEnemy = null;
                loadedState.inCombat = false;
            }
        }
        
        // Restore the game state, maintaining object references
        // Copy player properties individually
        if (loadedState.player) {
            Object.assign(gameState.player, loadedState.player);
        }
        // Copy other state properties
        gameState.currentEnemy = loadedState.currentEnemy;
        gameState.inCombat = loadedState.inCombat;
        gameState.defending = loadedState.defending;
        
        saveGame();
        updateUI();
        
        const successMsg = document.createElement('p');
        successMsg.style.color = '#51cf66';
        successMsg.textContent = `✓ Sauvegarde restaurée avec succès ! Bienvenue, ${gameState.player.name} !`;
        resultDiv.innerHTML = '';
        resultDiv.appendChild(successMsg);
    } catch (e) {
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#ff6b6b';
        errorMsg.textContent = '❌ Code invalide ou corrompu. Veuillez vérifier et réessayer.';
        resultDiv.innerHTML = '';
        resultDiv.appendChild(errorMsg);
    }
}
