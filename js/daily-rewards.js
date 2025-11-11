// Daily Rewards Module
// Manages daily login rewards, first victory bonus, and time-based chests
import { gameState } from './game-state.js';
import { saveGame } from './save-load.js';
import { updateUI } from './ui.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';
import { trackAchievementProgress, checkAchievements } from './achievements.js';
import { popupQueue } from './popup-queue.js';

// Daily login reward tiers (progressive rewards)
const dailyLoginRewards = [
    { day: 1, gold: 50, xp: 0, item: null, message: '🎁 Jour 1 : +50 Or' },
    { day: 2, gold: 100, xp: 50, item: null, message: '🎁 Jour 2 : +100 Or, +50 XP' },
    { day: 3, gold: 150, xp: 75, item: null, message: '🎁 Jour 3 : +150 Or, +75 XP' },
    { day: 4, gold: 200, xp: 100, item: null, message: '🎁 Jour 4 : +200 Or, +100 XP' },
    { day: 5, gold: 300, xp: 150, item: null, message: '🎁 Jour 5 : +300 Or, +150 XP' },
    { day: 6, gold: 400, xp: 200, item: null, message: '🎁 Jour 6 : +400 Or, +200 XP' },
    { day: 7, gold: 500, xp: 300, item: 'legendary', message: '🎁 Jour 7 : +500 Or, +300 XP, Objet Légendaire !' }
];

// Time-based chest types
const chestTypes = [
    { id: 'chest_4h', name: 'Coffre Rapide', icon: '📦', duration: 4 * 60 * 60 * 1000, rewards: { gold: 100, xp: 50 } },
    { id: 'chest_8h', name: 'Coffre Standard', icon: '🎁', duration: 8 * 60 * 60 * 1000, rewards: { gold: 250, xp: 100 } },
    { id: 'chest_24h', name: 'Coffre Épique', icon: '💎', duration: 24 * 60 * 60 * 1000, rewards: { gold: 750, xp: 300, item: 'rare' } }
];

// Initialize daily rewards in game state
export function initializeDailyRewards() {
    if (!gameState.dailyRewards) {
        gameState.dailyRewards = {
            lastLoginDate: null,
            loginStreak: 0,
            totalLogins: 0,
            lastRewardClaimed: null,
            firstVictoryToday: false,
            lastFirstVictoryDate: null,
            chests: [],
            stats: {
                totalGoldFromRewards: 0,
                totalXPFromRewards: 0,
                totalChestsOpened: 0,
                longestStreak: 0
            }
        };
    }
    
    // Don't automatically check for daily reset on initialization
    // This will be called explicitly after character is loaded/created
}

// Get today's date string (YYYY-MM-DD)
function getTodayDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Check if daily rewards need to be reset
export function checkDailyRewardReset() {
    const rewards = gameState.dailyRewards;
    if (!rewards) return;
    
    const today = getTodayDateString();
    
    // Check if it's a new day
    if (rewards.lastLoginDate !== today) {
        const yesterday = getYesterdayDateString();
        
        // Check if login streak should continue or reset
        if (rewards.lastLoginDate === yesterday) {
            // Consecutive day - increment streak
            rewards.loginStreak++;
            if (rewards.loginStreak > rewards.stats.longestStreak) {
                rewards.stats.longestStreak = rewards.loginStreak;
            }
        } else if (rewards.lastLoginDate !== null) {
            // Missed a day - reset streak
            rewards.loginStreak = 1;
        } else {
            // First login ever
            rewards.loginStreak = 1;
        }
        
        rewards.lastLoginDate = today;
        rewards.totalLogins++;
        rewards.lastRewardClaimed = null;
        rewards.firstVictoryToday = false;
        
        saveGame();
        
        // Show daily login reward
        showDailyLoginReward();
    }
    
    // Update chest timers
    updateChestTimers();
}

// Get yesterday's date string
function getYesterdayDateString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
}

// Show daily login reward popup
function showDailyLoginReward() {
    const rewards = gameState.dailyRewards;
    const today = getTodayDateString();
    
    // Don't show if already claimed today
    if (rewards.lastRewardClaimed === today) return;
    
    // Calculate which reward to give (cycle through 7 days)
    const rewardDay = ((rewards.loginStreak - 1) % 7) + 1;
    const reward = dailyLoginRewards[rewardDay - 1];
    
    // Give rewards
    gameState.player.gold += reward.gold;
    gameState.player.xp += reward.xp;
    
    rewards.stats.totalGoldFromRewards += reward.gold;
    rewards.stats.totalXPFromRewards += reward.xp;
    
    // Give legendary item on day 7
    if (reward.item === 'legendary') {
        giveLegendaryReward();
    }
    
    rewards.lastRewardClaimed = today;
    
    // Play sound
    audioManager.playSound('levelup');
    
    // Show popup using the queue to avoid blocking other popups
    const message = `
🎉 CONNEXION QUOTIDIENNE ! 🎉

Série actuelle : ${rewards.loginStreak} jour${rewards.loginStreak > 1 ? 's' : ''} 🔥

${reward.message}

${reward.item === 'legendary' ? '\n🌟 BONUS SPÉCIAL : Vous recevez un objet légendaire ! 🌟' : ''}

Revenez demain pour continuer votre série !
    `.trim();
    
    popupQueue.enqueue(message);
    
    saveGame();
    updateUI();
}

// Give a random legendary item
function giveLegendaryReward() {
    // Import legendary items
    import('./data/shop-items.js').then(module => {
        const legendaryItems = module.legendaryItems;
        if (legendaryItems && legendaryItems.length > 0) {
            // Get a random legendary item
            const randomItem = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
            
            // Add to inventory if there's space
            if (gameState.player.inventory.length < 4) {
                gameState.player.inventory.push({
                    ...randomItem,
                    id: `legendary_${Date.now()}_${Math.random()}`
                });
                console.log('Legendary item added to inventory:', randomItem.name);
            } else {
                // Inventory full - give gold equivalent instead
                gameState.player.gold += 1000;
                popupQueue.enqueue('⚠️ Inventaire plein ! Vous recevez 1000 Or à la place de l\'objet légendaire.');
            }
            
            saveGame();
            updateUI();
        }
    });
}

// Check and apply first victory bonus
export function applyFirstVictoryBonus() {
    const rewards = gameState.dailyRewards;
    if (!rewards) return { applied: false };
    
    const today = getTodayDateString();
    
    // Check if first victory already claimed today
    if (rewards.firstVictoryToday || rewards.lastFirstVictoryDate === today) {
        return { applied: false };
    }
    
    // Mark as claimed
    rewards.firstVictoryToday = true;
    rewards.lastFirstVictoryDate = today;
    
    saveGame();
    
    return { applied: true, goldMultiplier: 2, xpMultiplier: 2 };
}

// Show first victory notification
export function showFirstVictoryNotification(goldEarned, xpEarned) {
    const message = `
🏆 PREMIÈRE VICTOIRE DU JOUR ! 🏆

Double récompense activée !

💰 +${goldEarned} Or (x2)
✨ +${xpEarned} XP (x2)

Votre première victoire de chaque jour donne des récompenses doublées !
    `.trim();
    
    // Play special sound
    audioManager.playSound('victory');
    
    // Show notification using popup queue
    popupQueue.enqueue(message);
}

// Start a time-based chest
export function startChest(chestTypeId) {
    const rewards = gameState.dailyRewards;
    if (!rewards) return false;
    
    const chestType = chestTypes.find(c => c.id === chestTypeId);
    if (!chestType) return false;
    
    // Check if player already has 3 chests (max)
    if (rewards.chests.length >= 3) {
        popupQueue.enqueue('⚠️ Vous avez déjà 3 coffres en cours ! Ouvrez-en un avant d\'en commencer un nouveau.');
        return false;
    }
    
    // Create new chest
    const chest = {
        id: `chest_${Date.now()}_${Math.random()}`,
        type: chestTypeId,
        name: chestType.name,
        icon: chestType.icon,
        startTime: Date.now(),
        endTime: Date.now() + chestType.duration,
        duration: chestType.duration,
        rewards: { ...chestType.rewards },
        opened: false
    };
    
    rewards.chests.push(chest);
    saveGame();
    
    popupQueue.enqueue(`📦 ${chestType.name} commencé !\n\nIl s'ouvrira dans ${formatDuration(chestType.duration)}.`);
    
    return true;
}

// Update chest timers and check for ready chests
export function updateChestTimers() {
    const rewards = gameState.dailyRewards;
    if (!rewards || !rewards.chests) return;
    
    const now = Date.now();
    
    rewards.chests.forEach(chest => {
        if (!chest.opened && now >= chest.endTime) {
            // Chest is ready to open
            chest.ready = true;
        }
    });
}

// Open a ready chest
export function openChest(chestId) {
    const rewards = gameState.dailyRewards;
    if (!rewards) return false;
    
    const chestIndex = rewards.chests.findIndex(c => c.id === chestId);
    if (chestIndex === -1) return false;
    
    const chest = rewards.chests[chestIndex];
    
    // Check if chest is ready
    if (!chest.ready && Date.now() < chest.endTime) {
        const timeLeft = chest.endTime - Date.now();
        popupQueue.enqueue(`⏰ Ce coffre n'est pas encore prêt !\n\nTemps restant : ${formatDuration(timeLeft)}`);
        return false;
    }
    
    // Give rewards
    gameState.player.gold += chest.rewards.gold;
    gameState.player.xp += chest.rewards.xp;
    
    rewards.stats.totalGoldFromRewards += chest.rewards.gold;
    rewards.stats.totalXPFromRewards += chest.rewards.xp;
    rewards.stats.totalChestsOpened++;
    
    // Give rare item if applicable
    if (chest.rewards.item === 'rare') {
        giveRareReward();
    }
    
    // Play sound
    audioManager.playSound('victory');
    
    // Show notification using popup queue
    let message = `
🎁 COFFRE OUVERT ! 🎁

${chest.icon} ${chest.name}

Récompenses :
💰 +${chest.rewards.gold} Or
✨ +${chest.rewards.xp} XP
    `.trim();
    
    if (chest.rewards.item === 'rare') {
        message += '\n\n🌟 + Objet Rare !';
    }
    
    popupQueue.enqueue(message);
    
    // Remove chest from list
    rewards.chests.splice(chestIndex, 1);
    
    saveGame();
    updateUI();
    
    return true;
}

// Give a random rare item
function giveRareReward() {
    import('./data/shop-items.js').then(module => {
        const rareItems = module.rareItems;
        if (rareItems && rareItems.length > 0) {
            const randomItem = rareItems[Math.floor(Math.random() * rareItems.length)];
            
            if (gameState.player.inventory.length < 4) {
                gameState.player.inventory.push({
                    ...randomItem,
                    id: `rare_${Date.now()}_${Math.random()}`
                });
                console.log('Rare item added to inventory:', randomItem.name);
            } else {
                gameState.player.gold += 500;
                popupQueue.enqueue('⚠️ Inventaire plein ! Vous recevez 500 Or à la place de l\'objet rare.');
            }
            
            saveGame();
            updateUI();
        }
    });
}

// Format duration in human-readable format
function formatDuration(milliseconds) {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Get time remaining for a chest
export function getChestTimeRemaining(chestId) {
    const rewards = gameState.dailyRewards;
    if (!rewards) return null;
    
    const chest = rewards.chests.find(c => c.id === chestId);
    if (!chest) return null;
    
    const now = Date.now();
    const remaining = chest.endTime - now;
    
    if (remaining <= 0) return { ready: true, remaining: 0 };
    
    return { ready: false, remaining, formatted: formatDuration(remaining) };
}

// Show daily rewards screen
export function showDailyRewardsScreen() {
    const rewards = gameState.dailyRewards;
    if (!rewards) return;
    
    // Update timers first
    updateChestTimers();
    
    let html = `
        <div class="story-text">
            <h3>🎁 Récompenses Quotidiennes</h3>
            <p>Connectez-vous chaque jour pour recevoir des récompenses progressives !</p>
        </div>
    `;
    
    // Login streak section
    html += `
        <div class="shop-item" style="display: block; margin-bottom: 20px; background: linear-gradient(135deg, #2d5016 0%, #1a3009 100%); border: 2px solid #4a7c1b;">
            <h4 style="color: #90EE90;">🔥 Série de Connexion</h4>
            <p style="font-size: 1.2em; margin: 10px 0;"><strong>Jour actuel : ${rewards.loginStreak}</strong></p>
            <p>Plus longue série : ${rewards.stats.longestStreak} jour${rewards.stats.longestStreak > 1 ? 's' : ''}</p>
            <p style="font-size: 0.9em; color: #ddd; margin-top: 10px;">
                Connectez-vous tous les jours pour maintenir votre série et obtenir de meilleures récompenses !
            </p>
        </div>
    `;
    
    // Show 7-day reward calendar
    html += `
        <div class="shop-item" style="display: block; margin-bottom: 20px;">
            <h4 style="color: #DAA520;">📅 Calendrier de Récompenses (7 jours)</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 10px;">
    `;
    
    const currentRewardDay = ((rewards.loginStreak - 1) % 7) + 1;
    dailyLoginRewards.forEach((reward, index) => {
        const isCurrentDay = reward.day === currentRewardDay;
        const isPastDay = reward.day < currentRewardDay || (currentRewardDay === 7 && reward.day < 7);
        
        html += `
            <div style="padding: 10px; background: ${isCurrentDay ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0,0,0,0.3)'}; border: 2px solid ${isCurrentDay ? '#DAA520' : '#555'}; border-radius: 5px; text-align: center;">
                <div style="font-weight: bold; color: ${isCurrentDay ? '#DAA520' : '#999'};">Jour ${reward.day}</div>
                <div style="margin: 5px 0; font-size: 0.9em;">
                    ${reward.gold > 0 ? `💰 ${reward.gold}` : ''}<br>
                    ${reward.xp > 0 ? `✨ ${reward.xp}` : ''}<br>
                    ${reward.item === 'legendary' ? '🌟 Légendaire' : ''}
                </div>
                ${isCurrentDay ? '<div style="color: #90EE90; font-weight: bold;">← Aujourd\'hui</div>' : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // First victory bonus
    const firstVictoryStatus = rewards.firstVictoryToday ? '✅ Obtenu' : '📋 Disponible';
    html += `
        <div class="shop-item" style="display: block; margin-bottom: 20px;">
            <h4 style="color: #DAA520;">🏆 Première Victoire du Jour</h4>
            <p>Statut : <strong style="color: ${rewards.firstVictoryToday ? '#51cf66' : '#FFD700'};">${firstVictoryStatus}</strong></p>
            <p style="font-size: 0.9em; color: #ddd;">
                Gagnez votre premier combat de la journée pour recevoir <strong>double Or et XP</strong> !
            </p>
        </div>
    `;
    
    // Time-based chests
    html += `
        <div class="shop-item" style="display: block; margin-bottom: 20px;">
            <h4 style="color: #DAA520;">⏰ Coffres Temporels</h4>
            <p style="font-size: 0.9em; color: #ddd; margin-bottom: 10px;">
                Démarrez un coffre et revenez plus tard pour l'ouvrir ! (Maximum 3 coffres actifs)
            </p>
    `;
    
    // Show active chests
    if (rewards.chests && rewards.chests.length > 0) {
        html += '<div style="margin-top: 15px;"><strong>Coffres en cours :</strong></div>';
        rewards.chests.forEach(chest => {
            const timeInfo = getChestTimeRemaining(chest.id);
            const isReady = timeInfo && timeInfo.ready;
            
            html += `
                <div style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px; margin-top: 10px; border: 2px solid ${isReady ? '#51cf66' : '#555'};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${chest.icon} ${chest.name}</strong><br>
                            <span style="font-size: 0.85em; color: ${isReady ? '#51cf66' : '#999'};">
                                ${isReady ? '✅ Prêt à ouvrir !' : `⏰ ${timeInfo.formatted} restant`}
                            </span>
                        </div>
                        <button onclick="window.openChest('${chest.id}')" ${!isReady ? 'disabled style="opacity: 0.5;"' : ''}>
                            ${isReady ? '🎁 Ouvrir' : '🔒 Verrouillé'}
                        </button>
                    </div>
                </div>
            `;
        });
    } else {
        html += '<p style="font-style: italic; color: #999; margin-top: 10px;">Aucun coffre actif</p>';
    }
    
    // Buttons to start new chests
    if (rewards.chests.length < 3) {
        html += '<div style="margin-top: 15px;"><strong>Démarrer un nouveau coffre :</strong></div>';
        html += '<div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">';
        
        chestTypes.forEach(chestType => {
            html += `
                <button onclick="window.startChest('${chestType.id}')" style="flex: 1; min-width: 150px;">
                    ${chestType.icon} ${chestType.name}<br>
                    <small>(${formatDuration(chestType.duration)})</small>
                </button>
            `;
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    
    // Statistics
    html += `
        <div class="shop-item" style="display: block;">
            <h4 style="color: #DAA520;">📊 Statistiques</h4>
            <p><strong>Total connexions :</strong> ${rewards.totalLogins}</p>
            <p><strong>Coffres ouverts :</strong> ${rewards.stats.totalChestsOpened}</p>
            <p><strong>Or total des récompenses :</strong> 💰 ${rewards.stats.totalGoldFromRewards}</p>
            <p><strong>XP total des récompenses :</strong> ✨ ${rewards.stats.totalXPFromRewards}</p>
        </div>
    `;
    
    // Create or update screen
    let rewardsScreen = document.getElementById('dailyRewardsScreen');
    if (!rewardsScreen) {
        rewardsScreen = document.createElement('div');
        rewardsScreen.id = 'dailyRewardsScreen';
        rewardsScreen.className = 'game-screen';
        document.querySelector('.game-content').appendChild(rewardsScreen);
    }
    
    rewardsScreen.innerHTML = html + `
        <div class="game-actions">
            <button onclick="window.showMain()">🚪 Retour (ESC)</button>
        </div>
    `;
    
    // Show the screen
    import('./ui.js').then(module => {
        module.showScreen('dailyRewardsScreen');
    });
}

// Get summary for notifications
export function getDailyRewardsSummary() {
    const rewards = gameState.dailyRewards;
    if (!rewards) return null;
    
    const readyChests = rewards.chests ? rewards.chests.filter(c => c.ready || Date.now() >= c.endTime).length : 0;
    
    return {
        loginStreak: rewards.loginStreak,
        firstVictoryAvailable: !rewards.firstVictoryToday,
        readyChests
    };
}
