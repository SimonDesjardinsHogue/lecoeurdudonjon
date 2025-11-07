// Game Logic Module
import { gameState, shopItems } from './game-state.js';
import { updateUI, addCombatLog, showScreen } from './ui.js';
import { saveGame, loadGame } from './save-load.js';

// Set up shop item effects
export function initializeShopItems() {
    shopItems[0].effect = () => healPlayer(50);  // Potion de Soin
    shopItems[1].effect = () => { gameState.player.strength += 5; };  // Épée en Acier
    shopItems[2].effect = () => { gameState.player.defense += 3; };  // Armure de Cuir
    shopItems[3].effect = () => healPlayer(100);  // Grande Potion
    shopItems[4].effect = () => { gameState.player.strength += 10; };  // Épée Enchantée
    shopItems[5].effect = () => { gameState.player.defense += 5; };  // Bouclier de Fer
}

// Check energy regeneration (6:00 AM Toronto time)
export function checkEnergyRegeneration() {
    const p = gameState.player;
    
    // If player hasn't slept yet, return
    if (!p.lastSleepTime) {
        return;
    }
    
    // Get current time in Toronto timezone (EST/EDT - UTC-5 or UTC-4)
    const now = new Date();
    const torontoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    const lastSleep = new Date(p.lastSleepTime);
    
    // Calculate the next 6 AM after last sleep
    const nextRegeneration = new Date(lastSleep);
    nextRegeneration.setHours(6, 0, 0, 0);
    
    // If last sleep was after 6 AM, add one day
    if (lastSleep.getHours() >= 6) {
        nextRegeneration.setDate(nextRegeneration.getDate() + 1);
    }
    
    // Check if current time is past the regeneration time
    if (torontoTime >= nextRegeneration) {
        // Regenerate energy to full
        p.energy = p.maxEnergy;
        p.lastSleepTime = torontoTime.toISOString();
        saveGame();
        updateUI();
    }
}

// Initialize game
export function init() {
    loadGame();
    initializeShopItems();
    checkEnergyRegeneration();
    updateUI();
}

// Start new game
export function startGame() {
    const name = document.getElementById('nameInput').value.trim();
    if (!name) {
        alert('Veuillez entrer un nom pour votre héros !');
        return;
    }
    
    gameState.player.name = name;
    gameState.player.gamesPlayed++;
    saveGame();
    showScreen('mainScreen');
    updateUI();
}

// Heal player
export function healPlayer(amount) {
    const p = gameState.player;
    p.health = Math.min(p.maxHealth, p.health + amount);
    saveGame();
    updateUI();
}

// Rest at the inn
export function rest() {
    const p = gameState.player;
    const cost = 20;
    
    if (p.gold >= cost) {
        p.gold -= cost;
        p.health = p.maxHealth;
        p.energy = p.maxEnergy;
        
        // Set last sleep time to current Toronto time
        const now = new Date();
        const torontoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }));
        p.lastSleepTime = torontoTime.toISOString();
        
        saveGame();
        updateUI();
        alert('Vous dormez à l\'auberge jusqu\'au lendemain à 6h00 du matin. Votre santé et votre énergie sont complètement restaurées ! (-20 or)');
    } else {
        alert('Vous n\'avez pas assez d\'or pour dormir à l\'auberge ! (Coût: 20 or)');
    }
}

// Check level up
export function checkLevelUp() {
    const p = gameState.player;
    if (p.xp >= p.xpToLevel) {
        p.level++;
        p.xp -= p.xpToLevel;
        p.xpToLevel = Math.floor(p.xpToLevel * 1.5);
        
        // Stat increases
        p.maxHealth += 20;
        p.health = p.maxHealth;
        p.strength += 5;
        p.defense += 3;
        
        addCombatLog(`🎉 Niveau supérieur ! Vous êtes maintenant niveau ${p.level} !`, 'victory');
        saveGame();
        updateUI();
    }
}

// Show shop
export function showShop() {
    showScreen('shopScreen');
    const shopDiv = document.getElementById('shopItems');
    shopDiv.innerHTML = '';
    
    shopItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        itemDiv.innerHTML = `
            <div class="shop-item-info">
                <strong>${item.name}</strong><br>
                <small>${item.description}</small>
            </div>
            <div class="shop-item-price">${item.cost} 💰</div>
            <button onclick="window.buyItem(${index})">Acheter</button>
        `;
        shopDiv.appendChild(itemDiv);
    });
}

// Buy item
export function buyItem(index) {
    const item = shopItems[index];
    const p = gameState.player;
    
    if (p.gold >= item.cost) {
        p.gold -= item.cost;
        item.effect();
        saveGame();
        updateUI();
        alert(`Vous avez acheté ${item.name} !`);
        showShop(); // Refresh shop
    } else {
        alert(`Vous n'avez pas assez d'or ! (Coût: ${item.cost} or)`);
    }
}

// Show stats
export function showStats() {
    showScreen('statsScreen');
    const p = gameState.player;
    const statsDiv = document.getElementById('detailedStats');
    
    // Create elements safely to avoid XSS
    const container = document.createElement('div');
    container.className = 'shop-item';
    container.style.display = 'block';
    
    // Helper function to create a stat paragraph
    const createStatParagraph = (label, value) => {
        const para = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = label + ':';
        para.appendChild(strong);
        para.appendChild(document.createTextNode(' ' + value));
        return para;
    };
    
    container.appendChild(createStatParagraph('Nom', p.name));
    container.appendChild(createStatParagraph('Niveau', p.level));
    container.appendChild(createStatParagraph('Santé', `${p.health}/${p.maxHealth}`));
    container.appendChild(createStatParagraph('Énergie', `${p.energy}/${p.maxEnergy}`));
    container.appendChild(createStatParagraph('Force', p.strength));
    container.appendChild(createStatParagraph('Défense', p.defense));
    container.appendChild(createStatParagraph('Or', p.gold));
    container.appendChild(createStatParagraph('Expérience', `${p.xp}/${p.xpToLevel}`));
    container.appendChild(createStatParagraph('Ennemis vaincus', p.kills));
    container.appendChild(createStatParagraph('Parties jouées', p.gamesPlayed));
    
    statsDiv.innerHTML = '';
    statsDiv.appendChild(container);
}

// Show save options
export function showSaveOptions() {
    showScreen('saveOptionsScreen');
    document.getElementById('exportResult').innerHTML = '';
    document.getElementById('importResult').innerHTML = '';
    document.getElementById('importCode').value = '';
}

// Show main screen
export function showMain() {
    showScreen('mainScreen');
}

// Reset game
export function resetGame() {
    if (confirm('Êtes-vous sûr de vouloir recommencer une nouvelle partie ?')) {
        const gamesPlayed = gameState.player.gamesPlayed;
        
        // Reset player
        gameState.player.name = '';
        gameState.player.level = 1;
        gameState.player.health = 100;
        gameState.player.maxHealth = 100;
        gameState.player.strength = 10;
        gameState.player.defense = 5;
        gameState.player.gold = 50;
        gameState.player.xp = 0;
        gameState.player.xpToLevel = 100;
        gameState.player.kills = 0;
        gameState.player.gamesPlayed = gamesPlayed;
        gameState.player.energy = 100;
        gameState.player.maxEnergy = 100;
        gameState.player.lastSleepTime = null;
        
        // Reset combat state
        gameState.currentEnemy = null;
        gameState.inCombat = false;
        gameState.defending = false;
        
        saveGame();
        document.getElementById('nameInput').value = '';
        showScreen('startScreen');
        updateUI();
    }
}
