// Game Logic Module
import { gameState, shopItems, npcs } from './game-state.js';
import { updateUI, addCombatLog, showScreen } from './ui.js';
import { saveGame, loadGame } from './save-load.js';
import { characterClasses, applyCharacterClass } from './character-classes.js';

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
    
    // Show restore button if save exists
    const hasSave = localStorage.getItem('lecoeurdudonjon_save');
    const restoreBtn = document.getElementById('restoreSaveBtn');
    if (hasSave && restoreBtn) {
        restoreBtn.style.display = 'inline-block';
    }
}

// Start new game
export function startGame() {
    const name = document.getElementById('nameInput').value.trim();
    if (!name) {
        alert('Veuillez entrer un nom pour votre héros !');
        return;
    }
    
    // Get selected character class
    const selectedClass = document.querySelector('input[name="characterClass"]:checked');
    if (!selectedClass) {
        alert('Veuillez choisir une classe de personnage !');
        return;
    }
    
    gameState.player.name = name;
    gameState.player.gamesPlayed++;
    
    // Apply character class
    applyCharacterClass(gameState.player, selectedClass.value);
    
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
        p.energy = 0;  // Set energy to 0 - player must wait until 6 AM Toronto time
        
        // Set last sleep time to current Toronto time
        const now = new Date();
        const torontoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }));
        p.lastSleepTime = torontoTime.toISOString();
        
        saveGame();
        updateUI();
        
        // Calculate next 6 AM
        const next6AM = new Date(torontoTime);
        next6AM.setHours(6, 0, 0, 0);
        if (torontoTime.getHours() >= 6) {
            next6AM.setDate(next6AM.getDate() + 1);
        }
        
        const options = { 
            timeZone: 'America/Toronto',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const next6AMString = next6AM.toLocaleString('fr-FR', options);
        
        alert(`Vous dormez à l'auberge jusqu'à demain 6h00 du matin (heure de Toronto). Votre santé est restaurée ! Vous pourrez reprendre l'aventure à ${next6AMString}. (-20 or)`);
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
        const icon = item.icon || '📦';
        itemDiv.innerHTML = `
            <div class="shop-item-info">
                <strong>${icon} ${item.name}</strong><br>
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
    container.appendChild(createStatParagraph('Classe', `${p.classIcon} ${p.className}`));
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
        gameState.player.class = 'guerrier';
        gameState.player.className = 'Guerrier';
        gameState.player.classIcon = '⚔️';
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
        
        // Show restore button if save exists
        const restoreBtn = document.getElementById('restoreSaveBtn');
        if (restoreBtn) {
            restoreBtn.style.display = 'inline-block';
        }
    }
}

// Restore save from start screen
export function restoreSaveFromStart() {
    const saved = localStorage.getItem('lecoeurdudonjon_save');
    if (saved && gameState.player.name) {
        showScreen('mainScreen');
        updateUI();
    } else {
        alert('Aucune partie sauvegardée trouvée !');
    }
}

// Meet a random NPC
export function meetNPC() {
    const npc = npcs[Math.floor(Math.random() * npcs.length)];
    showScreen('npcScreen');
    
    const npcNameEl = document.getElementById('npcName');
    const npcDialogueEl = document.getElementById('npcDialogue');
    
    npcNameEl.textContent = `${npc.icon} ${npc.name}`;
    
    const dialogueContainer = document.createElement('div');
    dialogueContainer.className = 'shop-item';
    dialogueContainer.style.display = 'block';
    
    const dialogue = document.createElement('p');
    dialogue.textContent = `"${npc.dialogue}"`;
    dialogue.style.fontStyle = 'italic';
    dialogue.style.marginBottom = '15px';
    dialogueContainer.appendChild(dialogue);
    
    // Apply reward if any
    if (npc.reward) {
        const p = gameState.player;
        let rewardText = '';
        
        if (npc.reward.type === 'heal') {
            const healAmount = Math.min(npc.reward.amount, p.maxHealth - p.health);
            p.health = Math.min(p.maxHealth, p.health + npc.reward.amount);
            rewardText = `Vous avez été soigné de ${healAmount} HP !`;
        } else if (npc.reward.type === 'gold') {
            p.gold += npc.reward.amount;
            rewardText = `Vous avez reçu ${npc.reward.amount} pièces d'or !`;
        }
        
        const rewardPara = document.createElement('p');
        rewardPara.textContent = `✨ ${rewardText}`;
        rewardPara.style.color = '#51cf66';
        rewardPara.style.fontWeight = 'bold';
        dialogueContainer.appendChild(rewardPara);
        
        saveGame();
        updateUI();
    }
    
    npcDialogueEl.innerHTML = '';
    npcDialogueEl.appendChild(dialogueContainer);
}

// Show leaderboard
export function showLeaderboard() {
    showScreen('leaderboardScreen');
    
    // Get all saved players from leaderboard storage
    const leaderboardData = localStorage.getItem('lecoeurdudonjon_leaderboard');
    let players = [];
    
    if (leaderboardData) {
        try {
            players = JSON.parse(leaderboardData);
        } catch (e) {
            console.error('Error loading leaderboard:', e);
        }
    }
    
    // Add current player to leaderboard if they have a name
    if (gameState.player.name) {
        const currentPlayer = {
            name: gameState.player.name,
            level: gameState.player.level,
            kills: gameState.player.kills,
            strength: gameState.player.strength,
            defense: gameState.player.defense,
            score: calculatePlayerScore(gameState.player)
        };
        
        // Check if player already exists in leaderboard
        const existingIndex = players.findIndex(p => p.name === currentPlayer.name);
        if (existingIndex >= 0) {
            // Update if current score is higher
            if (currentPlayer.score > players[existingIndex].score) {
                players[existingIndex] = currentPlayer;
            }
        } else {
            players.push(currentPlayer);
        }
        
        // Save updated leaderboard
        localStorage.setItem('lecoeurdudonjon_leaderboard', JSON.stringify(players));
    }
    
    // Sort players by score (highest first)
    players.sort((a, b) => b.score - a.score);
    
    // Display leaderboard
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    
    if (players.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun héros n\'a encore été enregistré dans les annales du royaume.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        leaderboardList.appendChild(emptyMsg);
    } else {
        players.slice(0, 10).forEach((player, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'shop-item';
            playerDiv.style.display = 'flex';
            playerDiv.style.justifyContent = 'space-between';
            playerDiv.style.alignItems = 'center';
            playerDiv.style.marginBottom = '10px';
            
            // Add medal for top 3
            let medal = '';
            if (index === 0) medal = '🥇 ';
            else if (index === 1) medal = '🥈 ';
            else if (index === 2) medal = '🥉 ';
            else medal = `${index + 1}. `;
            
            const nameSection = document.createElement('div');
            nameSection.innerHTML = `
                <strong>${medal}${player.name}</strong><br>
                <small>Niveau ${player.level} | ${player.kills} victoires</small>
            `;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${player.score} pts</div>
                <small>⚔️ ${player.strength} | 🛡️ ${player.defense}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            leaderboardList.appendChild(playerDiv);
        });
    }
}

// Calculate player score for leaderboard
function calculatePlayerScore(player) {
    return (player.level * 100) + (player.kills * 50) + (player.strength * 10) + (player.defense * 5);
}
