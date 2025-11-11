// Achievements System Module
import { gameState } from './game-state.js';
import { saveGame } from './save-load.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';

// Achievement definitions
export const achievements = [
    {
        id: 'first_kill',
        name: 'Premier Sang',
        icon: '⚔️',
        description: 'Vaincre votre premier ennemi',
        category: 'combat',
        requirement: { type: 'kills', value: 1 },
        reward: { gold: 50 }
    },
    {
        id: 'monster_slayer',
        name: 'Tueur de Monstres',
        icon: '💀',
        description: 'Vaincre 10 ennemis',
        category: 'combat',
        requirement: { type: 'kills', value: 10 },
        reward: { gold: 100, xp: 50 }
    },
    {
        id: 'veteran_warrior',
        name: 'Guerrier Vétéran',
        icon: '🏆',
        description: 'Vaincre 50 ennemis',
        category: 'combat',
        requirement: { type: 'kills', value: 50 },
        reward: { gold: 250, puissance: 2 }
    },
    {
        id: 'legendary_hero',
        name: 'Héros Légendaire',
        icon: '👑',
        description: 'Vaincre 100 ennemis',
        category: 'combat',
        requirement: { type: 'kills', value: 100 },
        reward: { gold: 500, puissance: 3, defense: 2 }
    },
    {
        id: 'first_boss',
        name: 'Tueur de Boss',
        icon: '🐉',
        description: 'Vaincre votre premier boss',
        category: 'combat',
        requirement: { type: 'bosses', value: 1 },
        reward: { gold: 200, xp: 100 }
    },
    {
        id: 'boss_master',
        name: 'Maître des Boss',
        icon: '🔥',
        description: 'Vaincre 5 boss',
        category: 'combat',
        requirement: { type: 'bosses', value: 5 },
        reward: { gold: 500, maxHealth: 50 }
    },
    {
        id: 'wealthy',
        name: 'Riche Aventurier',
        icon: '💰',
        description: 'Accumuler 1000 pièces d\'or',
        category: 'wealth',
        requirement: { type: 'gold', value: 1000 },
        reward: { xp: 150 }
    },
    {
        id: 'tycoon',
        name: 'Magnat',
        icon: '💎',
        description: 'Accumuler 5000 pièces d\'or',
        category: 'wealth',
        requirement: { type: 'gold', value: 5000 },
        reward: { xp: 300, defense: 3 }
    },
    {
        id: 'level_5',
        name: 'Apprenti Aventurier',
        icon: '⭐',
        description: 'Atteindre le niveau 5',
        category: 'progression',
        requirement: { type: 'level', value: 5 },
        reward: { gold: 100 }
    },
    {
        id: 'level_10',
        name: 'Aventurier Expérimenté',
        icon: '🌟',
        description: 'Atteindre le niveau 10',
        category: 'progression',
        requirement: { type: 'level', value: 10 },
        reward: { gold: 250, maxHealth: 25 }
    },
    {
        id: 'level_20',
        name: 'Héros Reconnu',
        icon: '✨',
        description: 'Atteindre le niveau 20',
        category: 'progression',
        requirement: { type: 'level', value: 20 },
        reward: { gold: 500, maxHealth: 50, puissance: 5 }
    },
    {
        id: 'survivor',
        name: 'Survivant',
        icon: '🛡️',
        description: 'Gagner 20 combats consécutifs sans mourir',
        category: 'challenge',
        requirement: { type: 'consecutive_wins', value: 20 },
        reward: { defense: 5, maxHealth: 30 }
    },
    {
        id: 'energy_master',
        name: 'Maître de l\'Énergie',
        icon: '⚡',
        description: 'Utiliser 50 compétences spéciales',
        category: 'skills',
        requirement: { type: 'skills_used', value: 50 },
        reward: { maxEnergy: 25 }
    },
    {
        id: 'shopaholic',
        name: 'Accro du Shopping',
        icon: '🛒',
        description: 'Acheter 30 objets au marchand',
        category: 'commerce',
        requirement: { type: 'items_bought', value: 30 },
        reward: { gold: 200 }
    },
    {
        id: 'quest_master',
        name: 'Maître des Quêtes',
        icon: '📜',
        description: 'Compléter 10 quêtes quotidiennes',
        category: 'quests',
        requirement: { type: 'quests_completed', value: 10 },
        reward: { xp: 200, gold: 300 }
    },
    {
        id: 'explorer',
        name: 'Explorateur Infatigable',
        icon: '🗺️',
        description: 'Explorer le donjon 100 fois',
        category: 'exploration',
        requirement: { type: 'explorations', value: 100 },
        reward: { adresse: 5 }
    },
    {
        id: 'lucky_charm',
        name: 'Porte-Bonheur',
        icon: '🍀',
        description: 'Fuir avec succès 10 combats',
        category: 'challenge',
        requirement: { type: 'successful_escapes', value: 10 },
        reward: { adresse: 3 }
    }
];

// Initialize achievement tracking in game state
export function initAchievements() {
    if (!gameState.achievements) {
        gameState.achievements = {
            unlocked: [],
            progress: {},
            stats: {
                consecutive_wins: 0,
                skills_used: 0,
                items_bought: 0,
                quests_completed: 0,
                explorations: 0,
                successful_escapes: 0
            }
        };
    }
}

// Check if achievement is unlocked
export function isAchievementUnlocked(achievementId) {
    initAchievements();
    return gameState.achievements.unlocked.includes(achievementId);
}

// Check and unlock achievements based on current game state
export function checkAchievements() {
    initAchievements();
    
    const player = gameState.player;
    const stats = gameState.achievements.stats;
    
    achievements.forEach(achievement => {
        if (isAchievementUnlocked(achievement.id)) return;
        
        let isUnlocked = false;
        const req = achievement.requirement;
        
        switch (req.type) {
            case 'kills':
                isUnlocked = player.kills >= req.value;
                break;
            case 'bosses':
                isUnlocked = player.bossesDefeated >= req.value;
                break;
            case 'gold':
                isUnlocked = player.gold >= req.value;
                break;
            case 'level':
                isUnlocked = player.level >= req.value;
                break;
            case 'consecutive_wins':
                isUnlocked = stats.consecutive_wins >= req.value;
                break;
            case 'skills_used':
                isUnlocked = stats.skills_used >= req.value;
                break;
            case 'items_bought':
                isUnlocked = stats.items_bought >= req.value;
                break;
            case 'quests_completed':
                isUnlocked = stats.quests_completed >= req.value;
                break;
            case 'explorations':
                isUnlocked = stats.explorations >= req.value;
                break;
            case 'successful_escapes':
                isUnlocked = stats.successful_escapes >= req.value;
                break;
        }
        
        if (isUnlocked) {
            unlockAchievement(achievement);
        }
    });
}

// Unlock an achievement and grant rewards
function unlockAchievement(achievement) {
    if (isAchievementUnlocked(achievement.id)) return;
    
    gameState.achievements.unlocked.push(achievement.id);
    
    // Grant rewards
    const player = gameState.player;
    const reward = achievement.reward;
    
    let rewardText = [];
    
    if (reward.gold) {
        player.gold += reward.gold;
        rewardText.push(`+${reward.gold} or`);
    }
    if (reward.xp) {
        player.xp += reward.xp;
        rewardText.push(`+${reward.xp} XP`);
    }
    if (reward.puissance) {
        player.puissance += reward.puissance;
        rewardText.push(`+${reward.puissance} Puissance`);
    }
    if (reward.defense) {
        player.defense += reward.defense;
        rewardText.push(`+${reward.defense} Défense`);
    }
    if (reward.adresse) {
        player.adresse += reward.adresse;
        rewardText.push(`+${reward.adresse} Adresse`);
    }
    if (reward.esprit) {
        player.esprit += reward.esprit;
        rewardText.push(`+${reward.esprit} Esprit`);
    }
    if (reward.presence) {
        player.presence += reward.presence;
        rewardText.push(`+${reward.presence} Présence`);
    }
    if (reward.maxHealth) {
        player.maxHealth += reward.maxHealth;
        player.health += reward.maxHealth;
        rewardText.push(`+${reward.maxHealth} HP max`);
    }
    if (reward.maxEnergy) {
        player.maxEnergy += reward.maxEnergy;
        player.energy += reward.maxEnergy;
        rewardText.push(`+${reward.maxEnergy} Énergie max`);
    }
    
    // Show achievement notification
    showAchievementNotification(achievement, rewardText.join(', '));
    
    // Play sound
    audioManager.playSound('victory');
    
    saveGame();
}

// Show achievement notification
function showAchievementNotification(achievement, rewardText) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 5px;">${achievement.icon}</div>
        <div style="font-weight: bold; color: #FFD700; margin-bottom: 5px;">
            Succès Débloqué !
        </div>
        <div style="font-weight: bold; margin-bottom: 5px;">
            ${achievement.name}
        </div>
        <div style="font-size: 0.9em; margin-bottom: 5px; opacity: 0.9;">
            ${achievement.description}
        </div>
        <div style="color: #51cf66; font-size: 0.9em;">
            Récompense: ${rewardText}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Track achievement progress
export function trackAchievementProgress(type, value = 1) {
    initAchievements();
    
    const stats = gameState.achievements.stats;
    
    switch (type) {
        case 'skill_used':
            stats.skills_used = (stats.skills_used || 0) + value;
            break;
        case 'item_bought':
            stats.items_bought = (stats.items_bought || 0) + value;
            break;
        case 'quest_completed':
            stats.quests_completed = (stats.quests_completed || 0) + value;
            break;
        case 'exploration':
            stats.explorations = (stats.explorations || 0) + value;
            break;
        case 'successful_escape':
            stats.successful_escapes = (stats.successful_escapes || 0) + value;
            break;
        case 'combat_win':
            stats.consecutive_wins = (stats.consecutive_wins || 0) + value;
            break;
        case 'combat_loss':
            stats.consecutive_wins = 0;
            break;
    }
    
    checkAchievements();
}

// Get achievement progress percentage
export function getAchievementProgress(achievement) {
    initAchievements();
    
    const player = gameState.player;
    const stats = gameState.achievements.stats;
    const req = achievement.requirement;
    
    let current = 0;
    
    switch (req.type) {
        case 'kills':
            current = player.kills;
            break;
        case 'bosses':
            current = player.bossesDefeated;
            break;
        case 'gold':
            current = player.gold;
            break;
        case 'level':
            current = player.level;
            break;
        case 'consecutive_wins':
            current = stats.consecutive_wins;
            break;
        case 'skills_used':
            current = stats.skills_used;
            break;
        case 'items_bought':
            current = stats.items_bought;
            break;
        case 'quests_completed':
            current = stats.quests_completed;
            break;
        case 'explorations':
            current = stats.explorations;
            break;
        case 'successful_escapes':
            current = stats.successful_escapes;
            break;
    }
    
    return {
        current: Math.min(current, req.value),
        required: req.value,
        percentage: Math.min(100, Math.floor((current / req.value) * 100))
    };
}

// Get all achievements by category
export function getAchievementsByCategory() {
    const categories = {
        combat: [],
        wealth: [],
        progression: [],
        challenge: [],
        skills: [],
        commerce: [],
        quests: [],
        exploration: []
    };
    
    achievements.forEach(achievement => {
        if (categories[achievement.category]) {
            categories[achievement.category].push(achievement);
        }
    });
    
    return categories;
}
