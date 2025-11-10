// Game Logic Module
import { gameState, shopItems, rareItems, npcs, rarities, generateRandomStats, statNames, hasRandomStats, metals, getStatModifier } from './game-state.js';
import { MAX_LEVEL } from './data/game-constants.js';
import { updateUI, addCombatLog, showScreen } from './ui.js';
import { saveGame, loadGame } from './save-load.js';
import { characterClasses, applyCharacterClass } from './character-classes.js';
import { characterRaces, applyRaceModifiers } from './character-races.js';
import { characterSexes, applySexBaseStats } from './character-sexes.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';
import { initializeDailyQuests, checkDailyReset, updateQuestProgress, showDailyQuestsScreen } from './daily-quests.js';
import { initAchievements, trackAchievementProgress, checkAchievements } from './achievements.js';
import { runBalanceTests, runBalanceTestsAsync, formatReportAsHTML } from './balance-tester.js';
import { submitScore, fetchLeaderboard, getNetworkState } from './network.js';
import { hasEventEffect, getEventMultiplier } from './scheduled-events.js';
import { initializeShopItems, initializeShopAvailability, getRestockTimeRemaining, isItemUnavailable, showShop, buyItem, meetWanderingMerchant, buyRareItem } from './systems/shop.js';

// Helper function to get class display name
function getClassDisplayName(classKey) {
    return characterClasses[classKey]?.name || classKey;
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
        // Regenerate energy and mana to full
        p.energy = p.maxEnergy;
        p.mana = p.maxMana;
        p.lastSleepTime = torontoTime.toISOString();
        saveGame();
        updateUI();
    }
}

// Initialize game
export function init() {
    loadGame();
    initializeShopItems();
    initializeShopAvailability();
    initializeDailyQuests();
    initAchievements();
    checkEnergyRegeneration();
    checkDailyReset();
    checkAchievements();
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
    
    // Get selected character gender
    const selectedGender = document.querySelector('input[name="characterGender"]:checked');
    if (!selectedGender) {
        alert('Veuillez choisir un genre pour votre personnage !');
        return;
    }
    
    // Get selected character race
    const selectedRace = document.querySelector('input[name="characterRace"]:checked');
    if (!selectedRace) {
        alert('Veuillez choisir une race pour votre personnage !');
        return;
    }
    
    // Get selected character class
    const selectedClass = document.querySelector('input[name="characterClass"]:checked');
    if (!selectedClass) {
        alert('Veuillez choisir une classe de personnage !');
        return;
    }
    
    gameState.player.name = name;
    gameState.player.gender = selectedGender.value;
    gameState.player.gamesPlayed++;
    
    // Apply sex-based base stats first
    applySexBaseStats(gameState.player, selectedGender.value);
    
    // Apply character class (overrides base stats)
    applyCharacterClass(gameState.player, selectedClass.value);
    
    // Then apply race modifiers on top
    applyRaceModifiers(gameState.player, selectedRace.value);
    
    saveGame();
    showScreen('mainScreen');
    updateUI();
}

// Heal player
export function healPlayer(amount) {
    const p = gameState.player;
    const oldHealth = p.health;
    
    // Wisdom increases healing effectiveness: +5% per wisdom modifier point
    const wisdomMod = getStatModifier(p.wisdom);
    const healingBonus = 1 + (wisdomMod * 0.05);
    const finalAmount = Math.floor(amount * healingBonus);
    
    p.health = Math.min(p.maxHealth, p.health + finalAmount);
    
    // Only play sound and particles if actually healed
    if (p.health > oldHealth) {
        audioManager.playSound('heal');
        const healthElement = document.getElementById('playerHealth');
        if (healthElement) {
            particleSystem.createHealEffect(healthElement.parentElement);
        }
    }
    
    saveGame();
    updateUI();
}

// Restore energy
export function restoreEnergy(amount) {
    const p = gameState.player;
    
    // Wisdom increases energy restoration: +5% per wisdom modifier point
    const wisdomMod = getStatModifier(p.wisdom);
    const energyBonus = 1 + (wisdomMod * 0.05);
    const finalAmount = Math.floor(amount * energyBonus);
    
    p.energy = Math.min(p.maxEnergy, p.energy + finalAmount);
    saveGame();
    updateUI();
}

// Restore mana
export function restoreMana(amount) {
    const p = gameState.player;
    
    // Intelligence increases mana restoration: +5% per intelligence modifier point
    const intelligenceMod = getStatModifier(p.intelligence);
    const manaBonus = 1 + (intelligenceMod * 0.05);
    const finalAmount = Math.floor(amount * manaBonus);
    
    p.mana = Math.min(p.maxMana, p.mana + finalAmount);
    saveGame();
    updateUI();
}

// Add experience
export function addExperience(amount) {
    const p = gameState.player;
    p.xp += amount;
    checkLevelUp();
    saveGame();
    updateUI();
}

// Rest at the inn
export function rest() {
    const p = gameState.player;
    
    // Check if there's a free rest event active
    const hasFreeRest = hasEventEffect('freeRest');
    const cost = hasFreeRest ? 0 : 20;
    
    if (!hasFreeRest && p.gold < cost) {
        alert('Vous n\'avez pas assez d\'or pour dormir à l\'auberge ! (Coût: 20 or)');
        return;
    }
    
    // Build confirmation message
    let confirmMessage = hasFreeRest 
        ? 'Le Sanctuaire de Guérison vous offre un repos gratuit !\n\n'
        : 'Voulez-vous dormir à l\'auberge pour 20 or ?\n\n';
    confirmMessage += 'Vos points de vie seront restaurés.\n';
    
    // Add warning if player still has energy
    if (p.energy > 0) {
        confirmMessage += `\n⚠️ Attention : Vous avez encore ${p.energy} points d'énergie. Ils seront perdus si vous dormez maintenant.`;
    }
    
    // Ask for confirmation
    if (!confirm(confirmMessage)) {
        return;  // User cancelled
    }
    
    // Proceed with sleep
    if (!hasFreeRest) {
        p.gold -= cost;
    }
    
    // Apply healing bonus from event if active
    const healingBonus = getEventMultiplier('healingBonus', 1);
    p.health = Math.min(p.maxHealth, Math.floor(p.maxHealth * healingBonus));
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
    
    const costMessage = hasFreeRest ? '' : ' (-20 or)';
    const bonusMessage = healingBonus > 1 ? ' 🎉 (Bonus de guérison événement)' : '';
    alert(`Vous dormez à l'auberge jusqu'à demain 6h00 du matin (heure de Toronto). Vos points de vie sont restaurés !${bonusMessage} Vous pourrez reprendre l'aventure à ${next6AMString}.${costMessage}`);
}

// Check level up
export function checkLevelUp() {
    const p = gameState.player;
    
    // Check if player has reached max level
    if (p.level >= MAX_LEVEL) {
        // Player is at max level, convert excess XP to gold
        if (p.xp >= p.xpToLevel) {
            const excessXP = p.xp;
            const goldBonus = Math.floor(excessXP / 10); // 10 XP = 1 gold
            p.gold += goldBonus;
            p.xp = 0; // Reset XP
            
            addCombatLog(`⭐ Niveau maximum atteint ! +${goldBonus} or pour l'XP excédentaire.`, 'victory');
            
            saveGame();
            updateUI();
        }
        return;
    }
    
    if (p.xp >= p.xpToLevel) {
        p.level++;
        p.xp -= p.xpToLevel;
        p.xpToLevel = Math.floor(p.xpToLevel * 1.5);
        
        // Class-based HP increase
        let hpIncrease = 10; // Default for Guerrier
        if (p.class === 'archer') {
            hpIncrease = 6;
        } else if (p.class === 'magicien') {
            hpIncrease = 4;
        }
        
        // Stat increases
        p.maxHealth += hpIncrease;
        p.health = p.maxHealth;
        p.strength += 5;
        p.defense += 3;
        
        // Grant 1 stat point per level
        p.statPoints = (p.statPoints || 0) + 1;
        
        addCombatLog(`🎉 Niveau supérieur ! Vous êtes maintenant niveau ${p.level}/20 ! (+${hpIncrease} PV, +1 point de stats)`, 'victory');
        
        // Play level up sound and show particles
        audioManager.playSound('levelup');
        particleSystem.createLevelUpEffect();
        
        // Check achievements after level up
        checkAchievements();
        
        saveGame();
        updateUI();
    }
}

// Spend stat point on a specific stat
export function spendStatPoint(statName) {
    const p = gameState.player;
    
    if (!p.statPoints || p.statPoints <= 0) {
        alert('Vous n\'avez pas de points de stats disponibles !');
        return;
    }
    
    // Valid stat names
    const validStats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    if (!validStats.includes(statName)) {
        console.error(`Invalid stat name: ${statName}`);
        return;
    }
    
    // Confirm spending the point
    const statDisplayNames = {
        'strength': 'Force',
        'dexterity': 'Dextérité',
        'constitution': 'Constitution',
        'intelligence': 'Intelligence',
        'wisdom': 'Sagesse',
        'charisma': 'Charisme'
    };
    
    if (!confirm(`Voulez-vous ajouter 1 point à ${statDisplayNames[statName]} ?`)) {
        return;
    }
    
    // Spend the point
    p[statName]++;
    p.statPoints--;
    
    // If constitution increases, also increase max health by 2
    if (statName === 'constitution') {
        p.maxHealth += 2;
        p.health += 2; // Also heal by 2
        addCombatLog(`✨ +1 ${statDisplayNames[statName]} ! (+2 PV max)`, 'info');
    } else {
        addCombatLog(`✨ +1 ${statDisplayNames[statName]} !`, 'info');
    }
    
    saveGame();
    updateUI();
}

// Show shop
// Show stats
export function showStats() {
    showScreen('statsScreen');
    const p = gameState.player;
    const statsDiv = document.getElementById('detailedStats');
    
    // Helper function to create a stat paragraph
    const createStatParagraph = (label, value) => {
        const para = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = label + ':';
        para.appendChild(strong);
        para.appendChild(document.createTextNode(' ' + value));
        return para;
    };
    
    // Create two-column container
    const twoColumnContainer = document.createElement('div');
    twoColumnContainer.className = 'stats-two-column';
    
    // Left column: Character info and stats
    const leftColumn = document.createElement('div');
    leftColumn.className = 'stats-column';
    const leftTitle = document.createElement('h4');
    leftTitle.textContent = '👤 Informations du Personnage';
    leftColumn.appendChild(leftTitle);
    
    leftColumn.appendChild(createStatParagraph('Nom', p.name));
    leftColumn.appendChild(createStatParagraph('Genre', p.gender === 'male' ? '♂️ Masculin' : '♀️ Féminin'));
    leftColumn.appendChild(createStatParagraph('Race', `${p.raceIcon || '👤'} ${p.raceName || 'Humain'}`));
    leftColumn.appendChild(createStatParagraph('Classe', `${p.classIcon} ${p.className}`));
    leftColumn.appendChild(createStatParagraph('Points de vie', `${p.health}/${p.maxHealth}`));
    leftColumn.appendChild(createStatParagraph('Énergie', `${p.energy}/${p.maxEnergy}`));
    leftColumn.appendChild(createStatParagraph('Classe d\'armure', p.defense));
    leftColumn.appendChild(createStatParagraph('Force', p.strength));
    leftColumn.appendChild(createStatParagraph('Dextérité', p.dexterity));
    leftColumn.appendChild(createStatParagraph('Constitution', p.constitution));
    leftColumn.appendChild(createStatParagraph('Intelligence', p.intelligence));
    leftColumn.appendChild(createStatParagraph('Sagesse', p.wisdom));
    leftColumn.appendChild(createStatParagraph('Charisme', p.charisma));
    
    // Right column: Gameplay progression info
    const rightColumn = document.createElement('div');
    rightColumn.className = 'stats-column';
    const rightTitle = document.createElement('h4');
    rightTitle.textContent = '📊 Progression et Statistiques';
    rightColumn.appendChild(rightTitle);
    
    rightColumn.appendChild(createStatParagraph('Niveau', p.level));
    rightColumn.appendChild(createStatParagraph('Expérience', `${p.xp}/${p.xpToLevel}`));
    rightColumn.appendChild(createStatParagraph('Or', p.gold));
    rightColumn.appendChild(createStatParagraph('Ennemis vaincus', p.kills));
    rightColumn.appendChild(createStatParagraph('Parties jouées', p.gamesPlayed));
    
    // Add columns to container
    twoColumnContainer.appendChild(leftColumn);
    twoColumnContainer.appendChild(rightColumn);
    
    // Update the stats div
    statsDiv.innerHTML = '';
    statsDiv.appendChild(twoColumnContainer);
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
    // Restore default music when returning to main screen
    audioManager.startMusic('default');
    showScreen('mainScreen');
}

// Reset game
export function resetGame() {
    if (confirm('Êtes-vous sûr de vouloir recommencer une nouvelle partie ?')) {
        const gamesPlayed = gameState.player.gamesPlayed;
        
        // Reset player
        gameState.player.name = '';
        gameState.player.gender = 'male';
        gameState.player.race = 'humain';
        gameState.player.raceName = undefined;
        gameState.player.raceIcon = undefined;
        gameState.player.class = 'guerrier';
        gameState.player.className = 'Guerrier';
        gameState.player.classIcon = '⚔️';
        gameState.player.level = 1;
        gameState.player.health = 100;
        gameState.player.maxHealth = 100;
        gameState.player.strength = 10;
        gameState.player.defense = 5;
        gameState.player.dexterity = 10;
        gameState.player.constitution = 10;
        gameState.player.intelligence = 10;
        gameState.player.wisdom = 10;
        gameState.player.charisma = 10;
        gameState.player.statPoints = 0;
        gameState.player.gold = 75;
        gameState.player.xp = 0;
        gameState.player.xpToLevel = 100;
        gameState.player.kills = 0;
        gameState.player.gamesPlayed = gamesPlayed;
        gameState.player.energy = 100;
        gameState.player.maxEnergy = 100;
        gameState.player.lastSleepTime = null;
        gameState.player.bossesDefeated = 0;
        gameState.player.metals = {
            or: 0,
            platine: 0,
            argent: 0,
            cuivre: 0
        };
        gameState.player.inventory = [];
        gameState.player.merchantPurchasedItems = [];
        
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
    // Check if player has enough energy to meet an NPC
    if (gameState.player.energy < 2) {
        alert('Vous êtes trop fatigué pour rencontrer un PNJ ! Allez dormir à l\'auberge pour récupérer votre énergie.');
        return;
    }
    
    // Consume energy for meeting an NPC
    gameState.player.energy = Math.max(0, gameState.player.energy - 2);
    
    // Update UI immediately to show energy consumption
    updateUI();
    
    const npc = npcs[Math.floor(Math.random() * npcs.length)];
    
    // Check if it's the wandering merchant
    if (npc.special === 'wandering_merchant') {
        meetWanderingMerchant();
        return;
    }
    
    // Check if it's the jeweler
    if (npc.special === 'jeweler') {
        meetJeweler();
        return;
    }
    
    // Switch to mystery music for NPC encounter
    audioManager.startMusic('mystery');
    
    showScreen('npcScreen');
    
    // Show event info container and hide regular NPC content
    const eventInfo = document.getElementById('eventInfo');
    const npcContent = document.getElementById('npcContent');
    eventInfo.style.display = 'flex';
    npcContent.style.display = 'none';
    
    // Set the event icon
    const eventIcon = document.getElementById('eventIcon');
    eventIcon.textContent = npc.icon;
    
    // Set the event name
    const eventName = document.getElementById('eventName');
    eventName.textContent = npc.name;
    
    // Set the event description
    const eventDescription = document.getElementById('eventDescription');
    eventDescription.innerHTML = '';
    
    const dialogue = document.createElement('p');
    dialogue.textContent = `"${npc.dialogue}"`;
    dialogue.style.fontStyle = 'italic';
    dialogue.style.marginBottom = '15px';
    eventDescription.appendChild(dialogue);
    
    // Apply reward if any
    if (npc.reward) {
        const p = gameState.player;
        let rewardText = '';
        
        // Charisma increases NPC rewards: +10% per charisma modifier point
        const charismaMod = getStatModifier(p.charisma);
        const rewardBonus = 1 + (charismaMod * 0.10);
        
        if (npc.reward.type === 'heal') {
            const baseHealAmount = npc.reward.amount;
            const bonusHealAmount = Math.floor(baseHealAmount * rewardBonus);
            const healAmount = Math.min(bonusHealAmount, p.maxHealth - p.health);
            p.health = Math.min(p.maxHealth, p.health + bonusHealAmount);
            rewardText = `Vous avez été soigné de ${healAmount} HP !`;
            if (charismaMod > 0) {
                rewardText += ` (+${Math.floor((rewardBonus - 1) * 100)}% grâce à votre charisme)`;
            }
        } else if (npc.reward.type === 'gold') {
            const bonusGoldAmount = Math.floor(npc.reward.amount * rewardBonus);
            p.gold += bonusGoldAmount;
            rewardText = `Vous avez reçu ${bonusGoldAmount} pièces d'or !`;
            if (charismaMod > 0) {
                rewardText += ` (+${Math.floor((rewardBonus - 1) * 100)}% grâce à votre charisme)`;
            }
        }
        
        const rewardPara = document.createElement('p');
        rewardPara.textContent = `✨ ${rewardText}`;
        rewardPara.style.color = '#51cf66';
        rewardPara.style.fontWeight = 'bold';
        eventDescription.appendChild(rewardPara);
        
        saveGame();
        updateUI();
    }
    
    // Save and update UI to reflect energy consumption
    saveGame();
    updateUI();
}

// Show leaderboard
export function showLeaderboard() {
    showScreen('leaderboardScreen');
    
    // Check if multiplayer is enabled
    const networkState = getNetworkState();
    
    if (networkState.enabled) {
        // Display network leaderboard
        displayNetworkLeaderboard();
    } else {
        // Display local leaderboard
        displayLocalLeaderboard();
    }
}

// Display local (single device) leaderboard
async function displayLocalLeaderboard() {
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
    leaderboardList.innerHTML = '<h4 style="color: #DAA520;">🏠 Classement Local (cet appareil uniquement)</h4>';
    
    if (players.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun héros n\'a encore été enregistré dans les annales du royaume de Valéria.';
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
    
    // Add note about multiplayer
    const note = document.createElement('div');
    note.style.cssText = 'margin-top: 20px; padding: 15px; background: rgba(139, 69, 19, 0.3); border-radius: 5px; border: 1px solid #8B4513;';
    note.innerHTML = `
        <p style="margin: 0; color: #DAA520;">💡 <strong>Astuce:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 0.9em;">
            Activez le mode multijoueur LAN dans les paramètres pour partager le classement avec votre famille sur le réseau local !
        </p>
    `;
    leaderboardList.appendChild(note);
}

// Display network (LAN multiplayer) leaderboard
async function displayNetworkLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = `
        <h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>
        <div id="multiplayerStatus" style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;">
            ⏳ Chargement du classement...
        </div>
    `;
    
    // Fetch leaderboard from server
    const result = await fetchLeaderboard(10);
    
    if (!result.success) {
        leaderboardList.innerHTML = `
            <h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>
            <div style="color: #ff6b6b; padding: 15px; background: rgba(255, 0, 0, 0.1); border-radius: 5px;">
                ❌ Impossible de se connecter au serveur multijoueur.<br>
                <small>${result.error || 'Vérifiez que le serveur est démarré.'}</small>
            </div>
        `;
        return;
    }
    
    leaderboardList.innerHTML = '<h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>';
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'multiplayerStatus';
    statusDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(81, 207, 102, 0.2); border-radius: 5px; color: #51cf66;';
    statusDiv.textContent = '🟢 Connecté au serveur multijoueur';
    leaderboardList.appendChild(statusDiv);
    
    // Make function available globally for WebSocket updates
    window.updateNetworkLeaderboard = function(scores) {
        updateLeaderboardDisplay(scores);
    };
    
    updateLeaderboardDisplay(result.scores);
}

// Update leaderboard display with scores
function updateLeaderboardDisplay(scores) {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Remove old scores if any
    const existingScores = leaderboardList.querySelector('.network-scores');
    if (existingScores) {
        existingScores.remove();
    }
    
    const scoresContainer = document.createElement('div');
    scoresContainer.className = 'network-scores';
    
    if (scores.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun score n\'a encore été enregistré sur le serveur.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        scoresContainer.appendChild(emptyMsg);
    } else {
        scores.forEach((score, index) => {
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
            
            // Format class icon
            const classIcon = getClassIcon(score.className);
            const raceIcon = getRaceIcon(score.race);
            const genderIcon = score.gender === 'female' ? '♀️' : '♂️';
            
            const nameSection = document.createElement('div');
            nameSection.innerHTML = `
                <strong>${medal}${score.playerName}</strong> ${genderIcon}<br>
                <small>${classIcon} ${score.className} ${raceIcon} | Niveau ${score.level} | ${score.kills} victoires</small>
            `;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${score.gold} 💰</div>
                <small style="color: #999;">${new Date(score.timestamp).toLocaleDateString('fr-FR')}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            scoresContainer.appendChild(playerDiv);
        });
    }
    
    leaderboardList.appendChild(scoresContainer);
}

// Helper function to get class icon
function getClassIcon(className) {
    const icons = {
        'Guerrier': '⚔️',
        'Magicien': '🧙',
        'Archer': '🏹'
    };
    return icons[className] || '⚔️';
}

// Helper function to get race icon
function getRaceIcon(race) {
    const icons = {
        'humain': '👤',
        'elfe': '🧝',
        'nain': '🧔'
    };
    return icons[race] || '👤';
}

// Calculate player score for leaderboard
function calculatePlayerScore(player) {
    return (player.level * 100) + (player.kills * 50) + (player.strength * 10) + (player.defense * 5);
}

// Meet wandering merchant with rare items
// Calculate jeweler's daily profit margin (30-50%)
function getJewelerProfitMargin() {
    // Use current date to determine daily profit
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Use day of year as seed for consistent daily rate
    const seed = dayOfYear % 21; // 21 possible values for 30-50%
    return 0.30 + (seed * 0.01); // 30% to 50%
}

// Meet the Jeweler NPC
export function meetJeweler() {
    // Switch to merchant music for jeweler
    audioManager.startMusic('merchant');
    
    showScreen('shopScreen');
    const shopDiv = document.getElementById('shopItems');
    shopDiv.innerHTML = '';
    
    const profitMargin = getJewelerProfitMargin();
    const profitPercent = Math.round(profitMargin * 100);
    
    // Add jeweler description
    const jewelerDesc = document.createElement('div');
    jewelerDesc.className = 'story-text';
    jewelerDesc.innerHTML = `
        <p>💎 <strong>Bijoutier</strong></p>
        <p>"Bienvenue dans ma bijouterie ! J'achète et vends des métaux précieux. Aujourd'hui, ma marge est de ${profitPercent}% sur toutes les transactions."</p>
        <p style="font-size: 0.9em; color: #999;">Vous pouvez échanger vos pièces d'or contre des métaux précieux, ou vendre vos métaux pour de l'or.</p>
    `;
    shopDiv.appendChild(jewelerDesc);
    
    // Show player's current metals
    const inventoryDiv = document.createElement('div');
    inventoryDiv.className = 'shop-item';
    inventoryDiv.style.display = 'block';
    inventoryDiv.style.marginBottom = '20px';
    inventoryDiv.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💰 Votre Inventaire</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div>Or: ${gameState.player.gold} 💰</div>
            <div>${metals.or.icon} Or: ${gameState.player.metals.or.toFixed(2)} oz</div>
            <div>${metals.platine.icon} Platine: ${gameState.player.metals.platine.toFixed(2)} oz</div>
            <div>${metals.argent.icon} Argent: ${gameState.player.metals.argent.toFixed(2)} oz</div>
            <div>${metals.cuivre.icon} Cuivre: ${gameState.player.metals.cuivre.toFixed(2)} oz</div>
        </div>
    `;
    shopDiv.appendChild(inventoryDiv);
    
    // Metal prices table
    const pricesDiv = document.createElement('div');
    pricesDiv.className = 'shop-item';
    pricesDiv.style.display = 'block';
    pricesDiv.style.marginBottom = '20px';
    pricesDiv.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">📊 Prix des Métaux (CAD/oz)</h4>
        <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #8B4513;">
                <th style="padding: 8px;">Métal</th>
                <th style="padding: 8px;">Valeur Relative</th>
                <th style="padding: 8px;">Prix d'Achat</th>
                <th style="padding: 8px;">Prix de Vente</th>
            </tr>
            ${Object.entries(metals).map(([key, metal]) => {
                const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
                const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
                return `
                    <tr>
                        <td style="padding: 8px;">${metal.icon} ${metal.name}</td>
                        <td style="padding: 8px;">${metal.relativeValue}</td>
                        <td style="padding: 8px; color: #ff6b6b;">${buyPrice} 💰</td>
                        <td style="padding: 8px; color: #51cf66;">${sellPrice} 💰</td>
                    </tr>
                `;
            }).join('')}
        </table>
    `;
    shopDiv.appendChild(pricesDiv);
    
    // Buy metals section
    const buySection = document.createElement('div');
    buySection.className = 'shop-item';
    buySection.style.display = 'block';
    buySection.style.marginBottom = '20px';
    buySection.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💰 Acheter des Métaux (avec vos pièces d'or)</h4>
    `;
    
    Object.entries(metals).forEach(([key, metal]) => {
        const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
        const buyDiv = document.createElement('div');
        buyDiv.style.display = 'flex';
        buyDiv.style.justifyContent = 'space-between';
        buyDiv.style.alignItems = 'center';
        buyDiv.style.marginBottom = '10px';
        buyDiv.style.padding = '10px';
        buyDiv.style.background = 'rgba(0, 0, 0, 0.3)';
        buyDiv.style.borderRadius = '5px';
        
        buyDiv.innerHTML = `
            <div>
                <strong>${metal.icon} ${metal.name}</strong><br>
                <small>${metal.description}</small>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="buy_${key}" min="0.01" step="0.01" value="1" 
                       style="width: 80px; padding: 5px; background: rgba(0,0,0,0.5); color: #f0f0f0; border: 1px solid #8B4513; border-radius: 3px;">
                <span>oz</span>
                <button onclick="window.buyMetal('${key}', document.getElementById('buy_${key}').value)">
                    Acheter (${buyPrice} 💰/oz)
                </button>
            </div>
        `;
        buySection.appendChild(buyDiv);
    });
    shopDiv.appendChild(buySection);
    
    // Sell metals section
    const sellSection = document.createElement('div');
    sellSection.className = 'shop-item';
    sellSection.style.display = 'block';
    sellSection.style.marginBottom = '20px';
    sellSection.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💎 Vendre des Métaux (pour des pièces d'or)</h4>
    `;
    
    Object.entries(metals).forEach(([key, metal]) => {
        const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
        const sellDiv = document.createElement('div');
        sellDiv.style.display = 'flex';
        sellDiv.style.justifyContent = 'space-between';
        sellDiv.style.alignItems = 'center';
        sellDiv.style.marginBottom = '10px';
        sellDiv.style.padding = '10px';
        sellDiv.style.background = 'rgba(0, 0, 0, 0.3)';
        sellDiv.style.borderRadius = '5px';
        
        sellDiv.innerHTML = `
            <div>
                <strong>${metal.icon} ${metal.name}</strong><br>
                <small>Vous avez: ${gameState.player.metals[key].toFixed(2)} oz</small>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="sell_${key}" min="0.01" step="0.01" value="1" max="${gameState.player.metals[key]}"
                       style="width: 80px; padding: 5px; background: rgba(0,0,0,0.5); color: #f0f0f0; border: 1px solid #8B4513; border-radius: 3px;">
                <span>oz</span>
                <button onclick="window.sellMetal('${key}', document.getElementById('sell_${key}').value)" 
                        ${gameState.player.metals[key] <= 0 ? 'disabled' : ''}>
                    Vendre (${sellPrice} 💰/oz)
                </button>
            </div>
        `;
        sellSection.appendChild(sellDiv);
    });
    shopDiv.appendChild(sellSection);
}

// Buy metal from jeweler
export function buyMetal(metalType, amount) {
    const metal = metals[metalType];
    const profitMargin = getJewelerProfitMargin();
    const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
    const ozAmount = parseFloat(amount);
    
    if (isNaN(ozAmount) || ozAmount <= 0) {
        alert('Quantité invalide !');
        return;
    }
    
    const totalCost = Math.round(buyPrice * ozAmount);
    const p = gameState.player;
    
    if (p.gold >= totalCost) {
        p.gold -= totalCost;
        p.metals[metalType] += ozAmount;
        
        audioManager.playSound('purchase');
        saveGame();
        updateUI();
        
        alert(`Vous avez acheté ${ozAmount.toFixed(2)} oz de ${metal.name} pour ${totalCost} pièces d'or !`);
        meetJeweler(); // Refresh jeweler shop
    } else {
        alert(`Vous n'avez pas assez d'or ! (Coût: ${totalCost} or, Vous avez: ${p.gold} or)`);
    }
}

// Sell metal to jeweler
export function sellMetal(metalType, amount) {
    const metal = metals[metalType];
    const profitMargin = getJewelerProfitMargin();
    const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
    const ozAmount = parseFloat(amount);
    
    if (isNaN(ozAmount) || ozAmount <= 0) {
        alert('Quantité invalide !');
        return;
    }
    
    const p = gameState.player;
    
    if (p.metals[metalType] >= ozAmount) {
        p.metals[metalType] -= ozAmount;
        const goldEarned = Math.round(sellPrice * ozAmount);
        p.gold += goldEarned;
        
        audioManager.playSound('purchase');
        saveGame();
        updateUI();
        
        alert(`Vous avez vendu ${ozAmount.toFixed(2)} oz de ${metal.name} pour ${goldEarned} pièces d'or !`);
        meetJeweler(); // Refresh jeweler shop
    } else {
        alert(`Vous n'avez pas assez de ${metal.name} ! (Requis: ${ozAmount.toFixed(2)} oz, Vous avez: ${p.metals[metalType].toFixed(2)} oz)`);
    }
}

// Show achievements screen
export function showAchievements() {
    showScreen('achievementsScreen');
    
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Import achievements functions
    import('./achievements.js').then(module => {
        const { achievements: achievementsList, getAchievementsByCategory, isAchievementUnlocked, getAchievementProgress } = module;
        
        const categories = getAchievementsByCategory();
        const categoryNames = {
            combat: '⚔️ Combat',
            wealth: '💰 Richesse',
            progression: '⭐ Progression',
            challenge: '🏆 Défis',
            skills: '⚡ Compétences',
            commerce: '🛒 Commerce',
            quests: '📜 Quêtes',
            exploration: '🗺️ Exploration'
        };
        
        let unlockedCount = 0;
        let totalCount = achievementsList.length;
        
        for (const [category, items] of Object.entries(categories)) {
            if (items.length === 0) continue;
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'achievement-category';
            categoryHeader.textContent = categoryNames[category] || category;
            container.appendChild(categoryHeader);
            
            items.forEach(achievement => {
                const isUnlocked = isAchievementUnlocked(achievement.id);
                if (isUnlocked) unlockedCount++;
                
                const progress = getAchievementProgress(achievement);
                
                const item = document.createElement('div');
                item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
                
                const icon = document.createElement('div');
                icon.className = 'achievement-icon';
                icon.textContent = achievement.icon;
                if (!isUnlocked) icon.style.filter = 'grayscale(100%)';
                item.appendChild(icon);
                
                const details = document.createElement('div');
                details.className = 'achievement-details';
                
                const name = document.createElement('div');
                name.className = 'achievement-name';
                name.textContent = isUnlocked ? `✓ ${achievement.name}` : `🔒 ${achievement.name}`;
                details.appendChild(name);
                
                const description = document.createElement('div');
                description.className = 'achievement-description';
                description.textContent = achievement.description;
                details.appendChild(description);
                
                if (isUnlocked) {
                    const reward = document.createElement('div');
                    reward.className = 'achievement-reward';
                    const rewardParts = [];
                    if (achievement.reward.gold) rewardParts.push(`+${achievement.reward.gold} or`);
                    if (achievement.reward.xp) rewardParts.push(`+${achievement.reward.xp} XP`);
                    if (achievement.reward.strength) rewardParts.push(`+${achievement.reward.strength} Force`);
                    if (achievement.reward.defense) rewardParts.push(`+${achievement.reward.defense} Défense`);
                    if (achievement.reward.dexterity) rewardParts.push(`+${achievement.reward.dexterity} Dextérité`);
                    if (achievement.reward.maxHealth) rewardParts.push(`+${achievement.reward.maxHealth} HP max`);
                    if (achievement.reward.maxEnergy) rewardParts.push(`+${achievement.reward.maxEnergy} Énergie max`);
                    reward.textContent = `Récompense: ${rewardParts.join(', ')}`;
                    details.appendChild(reward);
                } else {
                    const progressBar = document.createElement('div');
                    progressBar.className = 'achievement-progress';
                    const progressFill = document.createElement('div');
                    progressFill.className = 'achievement-progress-fill';
                    progressFill.style.width = `${progress.percentage}%`;
                    progressBar.appendChild(progressFill);
                    details.appendChild(progressBar);
                    
                    const progressText = document.createElement('div');
                    progressText.style.fontSize = '0.85em';
                    progressText.style.color = '#999';
                    progressText.style.marginTop = '5px';
                    progressText.textContent = `Progression: ${progress.current}/${progress.required}`;
                    details.appendChild(progressText);
                }
                
                item.appendChild(details);
                container.appendChild(item);
            });
        }
        
        // Add summary header
        const summary = document.createElement('div');
        summary.style.cssText = 'text-align: center; padding: 20px; background: rgba(218, 165, 32, 0.1); border-radius: 5px; margin-bottom: 20px; border: 2px solid #DAA520;';
        summary.innerHTML = `
            <div style="font-size: 1.5em; font-weight: bold; color: #FFD700; margin-bottom: 10px;">
                🏆 ${unlockedCount} / ${totalCount} Succès Débloqués
            </div>
            <div style="font-size: 0.9em; color: #ccc;">
                ${Math.floor((unlockedCount / totalCount) * 100)}% de complétion
            </div>
        `;
        container.insertBefore(summary, container.firstChild);
    });
}

// Show balance test screen
export function showBalanceTest() {
    showScreen('balanceTestScreen');
    
    // Reset test results
    document.getElementById('balanceTestResults').innerHTML = '';
    document.getElementById('balanceTestProgress').style.display = 'none';
    document.getElementById('startBalanceTestBtn').disabled = false;
}

// Run balance test
export async function runBalanceTest() {
    const startBtn = document.getElementById('startBalanceTestBtn');
    const progressDiv = document.getElementById('balanceTestProgress');
    const statusText = document.getElementById('balanceTestStatus');
    const progressBar = document.getElementById('balanceTestProgressBar');
    const resultsDiv = document.getElementById('balanceTestResults');
    
    // Disable button and show progress
    startBtn.disabled = true;
    progressDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
    
    try {
        statusText.textContent = 'Démarrage des tests...';
        progressBar.style.width = '0%';
        
        // Use setTimeout to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Run tests with progress updates (100 games per combination instead of 2500)
        statusText.textContent = 'Simulation en cours...';
        
        const report = await runBalanceTestsAsync(100, (progress) => {
            // Update progress bar
            progressBar.style.width = `${progress.progress}%`;
            statusText.textContent = `Simulation en cours... ${progress.currentGames}/${progress.totalGames} (${progress.progress.toFixed(1)}%)`;
        });
        
        progressBar.style.width = '95%';
        statusText.textContent = 'Génération du rapport...';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Format and display results
        const htmlReport = formatReportAsHTML(report);
        resultsDiv.innerHTML = htmlReport;
        
        progressBar.style.width = '100%';
        statusText.textContent = '✓ Test terminé avec succès !';
        
        // Hide progress after a delay
        setTimeout(() => {
            progressDiv.style.display = 'none';
            startBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error running balance tests:', error);
        statusText.textContent = '✗ Erreur lors du test: ' + error.message;
        statusText.style.color = '#ff6b6b';
        startBtn.disabled = false;
    }
}

// Use item from inventory
export function useInventoryItem(inventoryIndex) {
    const p = gameState.player;
    if (!p.inventory || inventoryIndex < 0 || inventoryIndex >= p.inventory.length) {
        return;
    }
    
    const inventoryItem = p.inventory[inventoryIndex];
    const shopItem = shopItems[inventoryItem.shopIndex];
    
    if (shopItem && shopItem.effect) {
        // Use the item
        shopItem.effect();
        
        // Remove from inventory
        p.inventory.splice(inventoryIndex, 1);
        
        saveGame();
        updateUI();
    }
}

// Sell item from inventory to merchant
export function sellInventoryItem(inventoryIndex) {
    const p = gameState.player;
    if (!p.inventory || inventoryIndex < 0 || inventoryIndex >= p.inventory.length) {
        return;
    }
    
    const inventoryItem = p.inventory[inventoryIndex];
    // Merchant buys at 50% of original value
    const sellPrice = Math.floor(inventoryItem.cost * 0.5);
    
    p.gold += sellPrice;
    p.inventory.splice(inventoryIndex, 1);
    
    alert(`Vous avez vendu ${inventoryItem.name} pour ${sellPrice} or !`);
    
    saveGame();
    updateUI();
}

// Show daily quests (export for main.js)
export { showDailyQuestsScreen };

// Admin Panel Functions
const ADMIN_PASSWORD = 'Simon';

// Show admin login prompt
export function showAdminLogin() {
    const password = prompt('🔐 Entrez le mot de passe administrateur:');
    
    if (password === null) {
        // User cancelled
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        showAdminPanel();
    } else {
        alert('❌ Mot de passe incorrect!');
    }
}

// Show admin panel
export function showAdminPanel() {
    showScreen('adminPanelScreen');
}

// Show server hosting screen
export function showServerHosting() {
    showScreen('serverHostingScreen');
}

// Delete all saved games from localStorage and network
export function deleteAllSaves() {
    if (confirm('⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir supprimer TOUTES les sauvegardes ?\n\nCela supprimera :\n- Toutes les parties sauvegardées localement\n- Les données du classement local\n- La configuration du serveur multijoueur\n- Les paramètres audio\n\nCette action est IRRÉVERSIBLE !')) {
        
        // Second confirmation to prevent accidental deletion
        if (confirm('Dernière confirmation : Voulez-vous vraiment supprimer toutes les données ?')) {
            try {
                // List of all localStorage keys used by the game
                const keysToDelete = [
                    'lecoeurdudonjon_save',           // Main game save
                    'lecoeurdudragon_playerId',       // Multiplayer player ID
                    'lecoeurdudragon_serverUrl',      // Server configuration
                    'lecoeurdudonjon_leaderboard',    // Local leaderboard
                    'lecoeurdudonjon_audio'           // Audio settings
                ];
                
                // Delete each key
                let deletedCount = 0;
                keysToDelete.forEach(key => {
                    if (localStorage.getItem(key) !== null) {
                        localStorage.removeItem(key);
                        deletedCount++;
                    }
                });
                
                // Show success message
                alert(`✅ Sauvegardes supprimées avec succès !\n\n${deletedCount} élément(s) supprimé(s) du stockage local.`);
                
                // Reset the game state to default
                resetGame();
                
            } catch (e) {
                alert(`❌ Erreur lors de la suppression des sauvegardes :\n${e.message}`);
            }
        }
    }
}
