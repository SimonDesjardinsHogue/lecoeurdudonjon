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
import { meetNPC, meetJeweler, buyMetal, sellMetal } from './systems/npc.js';
import { healPlayer, restoreEnergy, restoreMana, addExperience, checkLevelUp, spendStatPoint } from './systems/player.js';
import { useInventoryItem, sellInventoryItem } from './systems/inventory.js';
import { showLeaderboard } from './systems/leaderboard.js';

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

// Re-export system functions
export { healPlayer, restoreEnergy, restoreMana, addExperience, checkLevelUp, spendStatPoint };
export { meetNPC, meetJeweler, buyMetal, sellMetal };

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

// Re-export leaderboard system functions
export { showLeaderboard };

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
        
        // Run tests with progress updates (200 games per combination = 3600 total)
        statusText.textContent = 'Simulation en cours...';
        
        const report = await runBalanceTestsAsync(200, (progress) => {
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

// Re-export inventory system functions
export { useInventoryItem, sellInventoryItem };

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
