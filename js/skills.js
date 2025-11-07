// Special Skills/Abilities System Module
import { gameState } from './game-state.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';
import { addCombatLog } from './ui.js';
import { saveGame } from './save-load.js';
import { trackAchievementProgress } from './achievements.js';

// Skill cooldown tracker
const skillCooldowns = {};

// Skill definitions by class
export const skills = {
    guerrier: [
        {
            id: 'charge',
            name: 'Charge Puissante',
            icon: '💥',
            description: 'Inflige 2x les dégâts normaux',
            energyCost: 25,
            cooldown: 3,
            effect: (player, enemy) => {
                const damage = Math.max(1, (player.strength * 2) - enemy.defense + Math.floor(Math.random() * 10));
                enemy.health -= damage;
                addCombatLog(`💥 Charge Puissante ! Vous infligez ${damage} dégâts massifs !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'damage' };
            }
        },
        {
            id: 'shield_bash',
            name: 'Coup de Bouclier',
            icon: '🛡️',
            description: 'Inflige des dégâts et augmente la défense pour 2 tours',
            energyCost: 20,
            cooldown: 4,
            effect: (player, enemy) => {
                const damage = Math.max(1, player.strength - enemy.defense + Math.floor(Math.random() * 5));
                enemy.health -= damage;
                player.defense += 5;
                gameState.skillBuffs = gameState.skillBuffs || {};
                gameState.skillBuffs.shieldBash = 2;
                addCombatLog(`🛡️ Coup de Bouclier ! ${damage} dégâts et +5 défense pour 2 tours !`, 'special');
                audioManager.playSound('defend');
                return { damage, type: 'damage_buff' };
            }
        }
    ],
    magicien: [
        {
            id: 'fireball',
            name: 'Boule de Feu',
            icon: '🔥',
            description: 'Lance une boule de feu qui ignore la défense',
            energyCost: 30,
            cooldown: 3,
            effect: (player, enemy) => {
                const damage = Math.floor(player.intelligence * 1.5) + Math.floor(Math.random() * 15);
                enemy.health -= damage;
                addCombatLog(`🔥 Boule de Feu ! Dégâts magiques de ${damage} !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'magic' };
            }
        },
        {
            id: 'mana_shield',
            name: 'Bouclier de Mana',
            icon: '✨',
            description: 'Crée un bouclier qui absorbe les dégâts pendant 3 tours',
            energyCost: 25,
            cooldown: 5,
            effect: (player, enemy) => {
                gameState.skillBuffs = gameState.skillBuffs || {};
                gameState.skillBuffs.manaShield = 3;
                gameState.skillBuffs.manaShieldAmount = Math.floor(player.intelligence * 2);
                addCombatLog(`✨ Bouclier de Mana activé ! Absorbe jusqu'à ${gameState.skillBuffs.manaShieldAmount} dégâts.`, 'special');
                audioManager.playSound('defend');
                return { type: 'shield' };
            }
        }
    ],
    archer: [
        {
            id: 'multi_shot',
            name: 'Tir Multiple',
            icon: '🏹',
            description: 'Tire 3 flèches rapides',
            energyCost: 25,
            cooldown: 3,
            effect: (player, enemy) => {
                let totalDamage = 0;
                for (let i = 0; i < 3; i++) {
                    const damage = Math.max(1, Math.floor(player.strength * 0.6) - Math.floor(enemy.defense * 0.5) + Math.floor(Math.random() * 5));
                    totalDamage += damage;
                }
                enemy.health -= totalDamage;
                addCombatLog(`🏹 Tir Multiple ! 3 flèches pour ${totalDamage} dégâts totaux !`, 'special');
                audioManager.playSound('attack');
                return { damage: totalDamage, type: 'damage' };
            }
        },
        {
            id: 'aimed_shot',
            name: 'Tir Visé',
            icon: '🎯',
            description: 'Tir critique garanti avec bonus de dextérité',
            energyCost: 30,
            cooldown: 4,
            effect: (player, enemy) => {
                const damage = Math.max(1, (player.strength + player.dexterity) - enemy.defense + Math.floor(Math.random() * 15));
                enemy.health -= damage;
                addCombatLog(`🎯 Tir Visé critique ! ${damage} dégâts précis !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'critical' };
            }
        }
    ],
    rogue: [
        {
            id: 'backstab',
            name: 'Coup dans le Dos',
            icon: '🗡️',
            description: 'Attaque sournoise qui inflige 2.5x les dégâts',
            energyCost: 30,
            cooldown: 3,
            effect: (player, enemy) => {
                const damage = Math.max(1, Math.floor(player.strength * 2.5) - enemy.defense + Math.floor(Math.random() * 12));
                enemy.health -= damage;
                addCombatLog(`🗡️ Coup dans le Dos ! Attaque sournoise de ${damage} dégâts !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'critical' };
            }
        },
        {
            id: 'smoke_bomb',
            name: 'Bombe Fumigène',
            icon: '💨',
            description: 'Augmente l\'esquive pour 3 tours',
            energyCost: 20,
            cooldown: 5,
            effect: (player, enemy) => {
                gameState.skillBuffs = gameState.skillBuffs || {};
                gameState.skillBuffs.smokeBomb = 3;
                gameState.skillBuffs.dodgeChance = 0.4; // 40% esquive
                addCombatLog(`💨 Bombe Fumigène ! +40% esquive pour 3 tours !`, 'special');
                audioManager.playSound('defend');
                return { type: 'dodge_buff' };
            }
        }
    ]
};

// Get available skills for current player class
export function getPlayerSkills() {
    return skills[gameState.player.class] || [];
}

// Check if skill is on cooldown
export function isSkillOnCooldown(skillId) {
    const currentTurn = gameState.combatTurn || 0;
    const cooldownEnd = skillCooldowns[skillId] || 0;
    return currentTurn < cooldownEnd;
}

// Get remaining cooldown for a skill
export function getSkillCooldown(skillId) {
    const currentTurn = gameState.combatTurn || 0;
    const cooldownEnd = skillCooldowns[skillId] || 0;
    return Math.max(0, cooldownEnd - currentTurn);
}

// Use a skill
export function useSkill(skillId) {
    if (!gameState.inCombat) return false;
    
    const skill = getPlayerSkills().find(s => s.id === skillId);
    if (!skill) return false;
    
    const player = gameState.player;
    const enemy = gameState.currentEnemy;
    
    // Check energy cost
    if (player.energy < skill.energyCost) {
        addCombatLog(`❌ Pas assez d'énergie ! (${skill.energyCost} requis)`, 'error');
        return false;
    }
    
    // Check cooldown
    if (isSkillOnCooldown(skillId)) {
        const remaining = getSkillCooldown(skillId);
        addCombatLog(`❌ Compétence en recharge (${remaining} tours)`, 'error');
        return false;
    }
    
    // Consume energy
    player.energy -= skill.energyCost;
    
    // Use skill
    const result = skill.effect(player, enemy);
    
    // Set cooldown
    const currentTurn = gameState.combatTurn || 0;
    skillCooldowns[skillId] = currentTurn + skill.cooldown;
    
    // Show particle effects
    const enemyInfoElement = document.getElementById('enemyInfo');
    if (enemyInfoElement && result.type !== 'shield' && result.type !== 'dodge_buff') {
        particleSystem.createAttackEffect(enemyInfoElement);
    }
    
    // Increment combat turn
    gameState.combatTurn = (gameState.combatTurn || 0) + 1;
    
    // Track skill usage for achievements
    trackAchievementProgress('skill_used', 1);
    
    saveGame();
    return true;
}

// Update skill buffs (call at start of each enemy turn)
export function updateSkillBuffs() {
    if (!gameState.skillBuffs) return;
    
    const buffs = gameState.skillBuffs;
    
    // Decrement buff durations
    if (buffs.shieldBash !== undefined) {
        buffs.shieldBash--;
        if (buffs.shieldBash <= 0) {
            gameState.player.defense -= 5;
            addCombatLog('🛡️ Effet de Coup de Bouclier terminé.', 'info');
            delete buffs.shieldBash;
        }
    }
    
    if (buffs.manaShield !== undefined) {
        buffs.manaShield--;
        if (buffs.manaShield <= 0) {
            addCombatLog('✨ Bouclier de Mana dissipé.', 'info');
            delete buffs.manaShield;
            delete buffs.manaShieldAmount;
        }
    }
    
    if (buffs.smokeBomb !== undefined) {
        buffs.smokeBomb--;
        if (buffs.smokeBomb <= 0) {
            addCombatLog('💨 Effet de Bombe Fumigène terminé.', 'info');
            delete buffs.smokeBomb;
            delete buffs.dodgeChance;
        }
    }
}

// Apply shield buff to incoming damage
export function applyShieldBuff(damage) {
    if (!gameState.skillBuffs || !gameState.skillBuffs.manaShield) {
        return damage;
    }
    
    const shieldAmount = gameState.skillBuffs.manaShieldAmount || 0;
    const blocked = Math.min(damage, shieldAmount);
    gameState.skillBuffs.manaShieldAmount -= blocked;
    
    if (blocked > 0) {
        addCombatLog(`✨ Bouclier de Mana absorbe ${blocked} dégâts !`, 'special');
    }
    
    if (gameState.skillBuffs.manaShieldAmount <= 0) {
        addCombatLog('✨ Bouclier de Mana brisé !', 'info');
        delete gameState.skillBuffs.manaShield;
        delete gameState.skillBuffs.manaShieldAmount;
    }
    
    return Math.max(0, damage - blocked);
}

// Check dodge buff
export function checkDodge() {
    if (!gameState.skillBuffs || !gameState.skillBuffs.smokeBomb) {
        return false;
    }
    
    const dodgeChance = gameState.skillBuffs.dodgeChance || 0;
    return Math.random() < dodgeChance;
}

// Reset cooldowns when combat ends
export function resetCombatState() {
    gameState.combatTurn = 0;
    // Keep cooldowns between fights to add strategy
}

// Clear all buffs (when combat ends)
export function clearSkillBuffs() {
    if (!gameState.skillBuffs) return;
    
    // Remove stat bonuses from buffs
    if (gameState.skillBuffs.shieldBash) {
        gameState.player.defense -= 5;
    }
    
    gameState.skillBuffs = {};
}
