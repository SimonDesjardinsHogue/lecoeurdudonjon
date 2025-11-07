// Daily Quests Module
import { gameState } from './game-state.js';
import { saveGame } from './save-load.js';
import { updateUI } from './ui.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';

// Quest templates
const questTemplates = [
    {
        id: 'kill_enemies',
        name: 'Chasseur de Monstres',
        icon: '⚔️',
        description: 'Vaincre {target} ennemis',
        type: 'kill',
        targetRange: [3, 8],
        rewards: { gold: 50, xp: 75, bonus: 'Vous recevez une bénédiction divine !' }
    },
    {
        id: 'collect_gold',
        name: 'Collectionneur de Richesses',
        icon: '💰',
        description: 'Collecter {target} pièces d\'or',
        type: 'collect_gold',
        targetRange: [100, 250],
        rewards: { gold: 100, xp: 50, bonus: 'Un marchand vous offre un cadeau !' }
    },
    {
        id: 'explore',
        name: 'Explorateur Intrépide',
        icon: '🗺️',
        description: 'Explorer le donjon {target} fois',
        type: 'explore',
        targetRange: [5, 10],
        rewards: { gold: 75, xp: 100, bonus: 'Vous découvrez un passage secret !' }
    },
    {
        id: 'visit_shop',
        name: 'Client Fidèle',
        icon: '🏪',
        description: 'Acheter {target} objets au marchand',
        type: 'shop',
        targetRange: [2, 5],
        rewards: { gold: 60, xp: 60, bonus: 'Le marchand vous offre un rabais permanent !' }
    },
    {
        id: 'survive_combat',
        name: 'Survivant',
        icon: '🛡️',
        description: 'Gagner {target} combats sans mourir',
        type: 'survive',
        targetRange: [3, 6],
        rewards: { gold: 80, xp: 90, bonus: 'Votre armure est renforcée par magie !' }
    }
];

// Initialize daily quests in game state
export function initializeDailyQuests() {
    if (!gameState.dailyQuests) {
        gameState.dailyQuests = {
            lastReset: null,
            active: [],
            completed: [],
            completedToday: 0,
            stats: {
                totalCompleted: 0,
                totalRewards: { gold: 0, xp: 0 }
            }
        };
    }
    
    // Check if we need to reset daily quests
    checkDailyReset();
}

// Check if daily reset is needed (at midnight local time)
export function checkDailyReset() {
    const quests = gameState.dailyQuests;
    const now = new Date();
    
    // Get today's date at midnight
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // If no last reset or last reset was before today, generate new quests
    if (!quests.lastReset || new Date(quests.lastReset) < today) {
        generateDailyQuests();
        quests.lastReset = today.toISOString();
        quests.completedToday = 0;
        saveGame();
    }
}

// Generate 3 random daily quests
export function generateDailyQuests() {
    const quests = gameState.dailyQuests;
    
    // Shuffle quest templates
    const shuffled = [...questTemplates].sort(() => Math.random() - 0.5);
    
    // Pick 3 quests
    quests.active = shuffled.slice(0, 3).map(template => {
        const target = Math.floor(
            Math.random() * (template.targetRange[1] - template.targetRange[0] + 1) + template.targetRange[0]
        );
        
        return {
            id: template.id,
            name: template.name,
            icon: template.icon,
            description: template.description.replace('{target}', target),
            type: template.type,
            target: target,
            progress: 0,
            completed: false,
            rewards: { ...template.rewards }
        };
    });
    
    quests.completed = [];
}

// Update quest progress
export function updateQuestProgress(type, amount = 1) {
    const quests = gameState.dailyQuests;
    if (!quests || !quests.active) return;
    
    let anyCompleted = false;
    
    quests.active.forEach(quest => {
        if (!quest.completed && quest.type === type) {
            quest.progress += amount;
            
            // Check if quest is completed
            if (quest.progress >= quest.target) {
                quest.progress = quest.target;
                quest.completed = true;
                completeQuest(quest);
                anyCompleted = true;
            }
        }
    });
    
    if (anyCompleted) {
        saveGame();
    }
}

// Complete a quest and give rewards
function completeQuest(quest) {
    const p = gameState.player;
    const quests = gameState.dailyQuests;
    
    // Add to completed list
    quests.completed.push(quest.id);
    quests.completedToday++;
    quests.stats.totalCompleted++;
    
    // Give rewards
    p.gold += quest.rewards.gold;
    p.xp += quest.rewards.xp;
    
    // Track total rewards
    quests.stats.totalRewards.gold += quest.rewards.gold;
    quests.stats.totalRewards.xp += quest.rewards.xp;
    
    // Play completion sound
    audioManager.playSound('levelup');
    
    // Show completion notification
    showQuestCompletionNotification(quest);
    
    // Check if all quests completed today
    if (quests.completedToday >= 3) {
        giveAllQuestsCompletionBonus();
    }
    
    saveGame();
    updateUI();
}

// Give bonus for completing all daily quests
function giveAllQuestsCompletionBonus() {
    const p = gameState.player;
    const bonusGold = 150;
    const bonusXP = 200;
    
    p.gold += bonusGold;
    p.xp += bonusXP;
    
    // Play special sound
    audioManager.playSound('victory');
    
    // Show special notification
    alert(`🎉 TOUTES LES QUÊTES COMPLÉTÉES ! 🎉\n\nBONUS SPÉCIAL :\n+${bonusGold} Or 💰\n+${bonusXP} XP ✨\n\nRevenez demain pour de nouvelles quêtes !`);
    
    saveGame();
    updateUI();
}

// Show quest completion notification
function showQuestCompletionNotification(quest) {
    const message = `
✅ QUÊTE COMPLÉTÉE ! ✅

${quest.icon} ${quest.name}

Récompenses reçues :
💰 +${quest.rewards.gold} Or
✨ +${quest.rewards.xp} XP

${quest.rewards.bonus}
    `.trim();
    
    alert(message);
}

// Show daily quests screen
export function showDailyQuestsScreen() {
    const quests = gameState.dailyQuests;
    if (!quests) return;
    
    // Create quest screen HTML
    let html = `
        <div class="story-text">
            <h3>📜 Défis Quotidiens</h3>
            <p>Complétez ces défis pour gagner des récompenses bonus !</p>
            <p style="color: #DAA520; font-weight: bold;">Complétez les 3 quêtes pour un bonus spécial !</p>
        </div>
    `;
    
    // Show active quests
    if (quests.active && quests.active.length > 0) {
        quests.active.forEach(quest => {
            const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
            const statusIcon = quest.completed ? '✅' : '📋';
            const statusClass = quest.completed ? 'quest-completed' : 'quest-active';
            
            html += `
                <div class="shop-item ${statusClass}" style="display: block; margin-bottom: 15px;">
                    <h4 style="color: #DAA520; margin-bottom: 5px;">
                        ${statusIcon} ${quest.icon} ${quest.name}
                    </h4>
                    <p style="margin: 5px 0; font-style: italic;">${quest.description}</p>
                    <div style="margin: 10px 0;">
                        <div class="xp-bar" style="height: 15px;">
                            <div class="xp-fill" style="width: ${progressPercent}%; height: 100%; background: ${quest.completed ? '#51cf66' : 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)'}; display: flex; align-items: center; justify-content: center; font-size: 0.8em; color: #000; font-weight: bold;">
                                ${quest.progress}/${quest.target}
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                        <span style="color: #51cf66;">💰 +${quest.rewards.gold} Or</span>
                        <span style="color: #51cf66;">✨ +${quest.rewards.xp} XP</span>
                    </div>
                    ${quest.completed ? '<p style="color: #51cf66; margin-top: 5px; font-weight: bold;">✓ COMPLÉTÉ</p>' : ''}
                </div>
            `;
        });
    } else {
        html += '<p style="text-align: center; color: #999; font-style: italic;">Aucune quête disponible pour le moment.</p>';
    }
    
    // Show statistics
    html += `
        <div class="shop-item" style="display: block; margin-top: 20px;">
            <h4 style="color: #DAA520;">📊 Statistiques</h4>
            <p><strong>Complétées aujourd'hui :</strong> ${quests.completedToday}/3</p>
            <p><strong>Total complétées :</strong> ${quests.stats.totalCompleted}</p>
            <p><strong>Récompenses totales :</strong></p>
            <p style="margin-left: 20px;">💰 ${quests.stats.totalRewards.gold} Or</p>
            <p style="margin-left: 20px;">✨ ${quests.stats.totalRewards.xp} XP</p>
        </div>
    `;
    
    // Create or update quest screen
    let questScreen = document.getElementById('dailyQuestsScreen');
    if (!questScreen) {
        // Create new screen if it doesn't exist
        questScreen = document.createElement('div');
        questScreen.id = 'dailyQuestsScreen';
        questScreen.className = 'game-screen';
        document.querySelector('.game-content').appendChild(questScreen);
    }
    
    questScreen.innerHTML = html + `
        <div class="game-actions">
            <button onclick="window.showMain()">🚪 Retour (ESC)</button>
        </div>
    `;
    
    // Show the screen
    import('./ui.js').then(module => {
        module.showScreen('dailyQuestsScreen');
    });
}

// Get quest summary for display in main menu
export function getQuestSummary() {
    const quests = gameState.dailyQuests;
    if (!quests || !quests.active) return null;
    
    const completed = quests.active.filter(q => q.completed).length;
    const total = quests.active.length;
    
    return {
        completed,
        total,
        hasIncomplete: completed < total
    };
}
