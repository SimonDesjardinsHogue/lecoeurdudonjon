// Special Skills/Abilities System Module
import { gameState, getStatModifier } from './game-state.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';
import { addCombatLog } from './ui.js';
import { saveGame } from './save-load.js';
import { trackAchievementProgress } from './achievements.js';
import { rollDamage, formatDiceRoll, rollChance } from './dice.js';

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
                const puissanceMod = getStatModifier(player.puissance);
                const enemyDefenseMod = getStatModifier(enemy.defense);
                // Charge uses 3d6 with double strength modifier
                const damageRoll = rollDamage(3, puissanceMod * 2);
                const damage = Math.max(1, damageRoll.total - (enemy.defense + enemyDefenseMod));
                enemy.health -= damage;
                addCombatLog(`💥 Charge Puissante !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(damageRoll)} - ${enemy.defense + enemyDefenseMod} défense = ${damage} dégâts massifs !`, 'special');
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
                const puissanceMod = getStatModifier(player.puissance);
                const enemyDefenseMod = getStatModifier(enemy.defense);
                // Shield bash uses 2d6 with strength modifier
                const damageRoll = rollDamage(2, puissanceMod);
                const damage = Math.max(1, damageRoll.total - (enemy.defense + enemyDefenseMod));
                enemy.health -= damage;
                player.defense += 5;
                gameState.skillBuffs = gameState.skillBuffs || {};
                gameState.skillBuffs.shieldBash = 2;
                addCombatLog(`🛡️ Coup de Bouclier !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(damageRoll)} - ${enemy.defense + enemyDefenseMod} défense = ${damage} dégâts et +5 défense pour 2 tours !`, 'special');
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
                const espritMod = getStatModifier(player.esprit);
                // Fireball uses 4d6 with spirit modifier (ignores defense)
                const damageRoll = rollDamage(4, Math.floor(espritMod * 1.5));
                const damage = damageRoll.total; // Ignores defense
                enemy.health -= damage;
                addCombatLog(`🔥 Boule de Feu !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(damageRoll)} (ignore la défense) = ${damage} dégâts magiques !`, 'special');
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
                const espritMod = getStatModifier(player.esprit);
                gameState.skillBuffs = gameState.skillBuffs || {};
                gameState.skillBuffs.manaShield = 3;
                // Shield absorbs 3d6 + spirit modifier
                const shieldRoll = rollDamage(3, espritMod * 2);
                gameState.skillBuffs.manaShieldAmount = shieldRoll.total;
                addCombatLog(`✨ Bouclier de Mana activé !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(shieldRoll)} = absorbe jusqu'à ${gameState.skillBuffs.manaShieldAmount} dégâts.`, 'special');
                audioManager.playSound('defend');
                return { type: 'shield' };
            }
        },
        {
            id: 'lightning_bolt',
            name: 'Éclair Foudroyant',
            icon: '⚡',
            description: 'Frappe l\'ennemi avec un éclair destructeur (utilise du mana)',
            manaCost: 20,
            cooldown: 2,
            effect: (player, enemy) => {
                const espritMod = getStatModifier(player.esprit);
                // Lightning bolt uses 5d6 with double spirit modifier (ignores defense)
                const damageRoll = rollDamage(5, espritMod * 2);
                const damage = damageRoll.total; // Ignores defense
                enemy.health -= damage;
                addCombatLog(`⚡ Éclair Foudroyant !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(damageRoll)} (ignore la défense) = ${damage} dégâts électriques !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'magic' };
            }
        },
        {
            id: 'ice_lance',
            name: 'Lance de Glace',
            icon: '❄️',
            description: 'Projette une lance de glace perçante (utilise du mana)',
            manaCost: 25,
            cooldown: 3,
            effect: (player, enemy) => {
                const espritMod = getStatModifier(player.esprit);
                // Ice lance uses 4d6 with spirit modifier (ignores defense)
                const damageRoll = rollDamage(4, Math.floor(espritMod * 1.5));
                const damage = damageRoll.total; // Ignores defense
                enemy.health -= damage;
                addCombatLog(`❄️ Lance de Glace !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(damageRoll)} (ignore la défense) = ${damage} dégâts glacials !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'magic' };
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
                const adresseMod = getStatModifier(player.adresse);
                const enemyDefenseMod = getStatModifier(enemy.defense);
                let totalDamage = 0;
                const rolls = [];
                // Each arrow is 1d6 + dexterity modifier
                for (let i = 0; i < 3; i++) {
                    const arrowRoll = rollDamage(1, Math.floor(adresseMod * 0.5));
                    const damage = Math.max(1, arrowRoll.total - Math.floor((enemy.defense + enemyDefenseMod) * 0.5));
                    totalDamage += damage;
                    rolls.push(`Flèche ${i + 1}: ${formatDiceRoll(arrowRoll)} - ${Math.floor((enemy.defense + enemyDefenseMod) * 0.5)} = ${damage}`);
                }
                enemy.health -= totalDamage;
                addCombatLog(`🏹 Tir Multiple ! 3 flèches tirées !`, 'special');
                rolls.forEach(roll => addCombatLog(`🎲 ${roll}`, 'special'));
                addCombatLog(`Total: ${totalDamage} dégâts`, 'special');
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
                const adresseMod = getStatModifier(player.adresse);
                const enemyDefenseMod = getStatModifier(enemy.defense);
                // Aimed shot uses 4d6 with double dexterity modifier (critical hit)
                const damageRoll = rollDamage(4, adresseMod * 2);
                const damage = Math.max(1, damageRoll.total - (enemy.defense + enemyDefenseMod));
                enemy.health -= damage;
                addCombatLog(`🎯 Tir Visé critique !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(damageRoll)} - ${enemy.defense + enemyDefenseMod} défense = ${damage} dégâts précis !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'critical' };
            }
        }
    ],
    enchanteur: [
        {
            id: 'illusion_persuasive',
            name: 'Illusion Persuasive',
            icon: '🌀',
            description: 'Altère la réalité pour l\'adversaire, causant des dégâts psychiques (utilise du mana)',
            manaCost: 22,
            cooldown: 3,
            effect: (player, enemy) => {
                const espritMod = getStatModifier(player.esprit);
                const presenceMod = getStatModifier(player.presence);
                // Illusion uses 4d6 with spirit and presence modifiers (ignores defense)
                const damageRoll = rollDamage(4, Math.floor(espritMod * 1.3) + Math.floor(presenceMod * 1.2));
                const damage = damageRoll.total; // Psychic damage ignores defense
                enemy.health -= damage;
                addCombatLog(`🌀 Illusion Persuasive !`, 'special');
                addCombatLog(`🎲 ${formatDiceRoll(damageRoll)} (ignore la défense) = ${damage} dégâts psychiques !`, 'special');
                audioManager.playSound('attack');
                return { damage, type: 'magic' };
            }
        },
        {
            id: 'suggestion_mentale',
            name: 'Suggestion Mentale',
            icon: '🧠',
            description: 'Influence l\'esprit de l\'adversaire pour réduire son attaque pendant 3 tours (utilise du mana)',
            manaCost: 20,
            cooldown: 4,
            effect: (player, enemy) => {
                const presenceMod = getStatModifier(player.presence);
                const reduction = Math.floor(player.presence * 0.3) + Math.floor(presenceMod * 0.3) + 2;
                gameState.skillBuffs = gameState.skillBuffs || {};
                gameState.skillBuffs.suggestionMentale = 3;
                gameState.skillBuffs.enemyAttackReduction = reduction;
                // Apply the debuff to the enemy
                enemy.puissance = Math.max(1, enemy.puissance - reduction);
                addCombatLog(`🧠 Suggestion Mentale ! L'attaque de l'ennemi est réduite de ${reduction} pour 3 tours !`, 'special');
                audioManager.playSound('defend');
                return { type: 'debuff' };
            }
        },
        {
            id: 'presence_obsedante',
            name: 'Présence Obsédante',
            icon: '👁️',
            description: 'Inspire la fascination ou la peur, augmentant la défense et la présence pendant 3 tours (utilise du mana)',
            manaCost: 25,
            cooldown: 5,
            effect: (player, enemy) => {
                const presenceMod = getStatModifier(player.presence);
                const defenseBonus = Math.floor(player.presence * 0.4) + Math.floor(presenceMod * 0.4) + 3;
                const presenceBonus = Math.floor(player.presence * 0.3) + 2;
                gameState.skillBuffs = gameState.skillBuffs || {};
                gameState.skillBuffs.presenceObsedante = 3;
                gameState.skillBuffs.presenceDefenseBonus = defenseBonus;
                gameState.skillBuffs.presencePresenceBonus = presenceBonus;
                player.defense += defenseBonus;
                player.presence += presenceBonus;
                addCombatLog(`👁️ Présence Obsédante activée ! +${defenseBonus} Défense et +${presenceBonus} Présence pour 3 tours !`, 'special');
                audioManager.playSound('defend');
                return { type: 'buff' };
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
    
    // Can only use skills while defending
    if (!gameState.defending) {
        addCombatLog('Vous devez vous défendre pour accéder à vos compétences !', 'damage');
        return false;
    }
    
    const skill = getPlayerSkills().find(s => s.id === skillId);
    if (!skill) return false;
    
    const player = gameState.player;
    const enemy = gameState.currentEnemy;
    
    // Check distance for melee skills (warrior skills)
    if (enemy.distance > 0 && player.class === 'guerrier') {
        addCombatLog(`⚔️ Vous ne pouvez pas utiliser cette compétence de mêlée à distance !`, 'damage');
        return false;
    }
    
    // Check energy or mana cost
    if (skill.energyCost) {
        if (player.energy < skill.energyCost) {
            addCombatLog(`❌ Pas assez d'énergie ! (${skill.energyCost} requis)`, 'error');
            return false;
        }
    } else if (skill.manaCost) {
        if (player.mana < skill.manaCost) {
            addCombatLog(`❌ Pas assez de mana ! (${skill.manaCost} requis)`, 'error');
            return false;
        }
    }
    
    // Check cooldown
    if (isSkillOnCooldown(skillId)) {
        const remaining = getSkillCooldown(skillId);
        addCombatLog(`❌ Compétence en recharge (${remaining} tours)`, 'error');
        return false;
    }
    
    // Consume energy or mana
    if (skill.energyCost) {
        player.energy -= skill.energyCost;
    } else if (skill.manaCost) {
        player.mana -= skill.manaCost;
    }
    
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
    
    if (buffs.suggestionMentale !== undefined) {
        buffs.suggestionMentale--;
        if (buffs.suggestionMentale <= 0) {
            const enemy = gameState.currentEnemy;
            if (enemy && buffs.enemyAttackReduction) {
                enemy.puissance += buffs.enemyAttackReduction;
            }
            addCombatLog('🧠 Effet de Suggestion Mentale terminé.', 'info');
            delete buffs.suggestionMentale;
            delete buffs.enemyAttackReduction;
        }
    }
    
    if (buffs.presenceObsedante !== undefined) {
        buffs.presenceObsedante--;
        if (buffs.presenceObsedante <= 0) {
            if (buffs.presenceDefenseBonus) {
                gameState.player.defense -= buffs.presenceDefenseBonus;
            }
            if (buffs.presencePresenceBonus) {
                gameState.player.presence -= buffs.presencePresenceBonus;
            }
            addCombatLog('👁️ Effet de Présence Obsédante terminé.', 'info');
            delete buffs.presenceObsedante;
            delete buffs.presenceDefenseBonus;
            delete buffs.presencePresenceBonus;
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
    
    const dodgeChance = (gameState.skillBuffs.dodgeChance || 0) * 100; // Convert to percentage
    return rollChance(dodgeChance);
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
    
    if (gameState.skillBuffs.presenceDefenseBonus) {
        gameState.player.defense -= gameState.skillBuffs.presenceDefenseBonus;
    }
    
    if (gameState.skillBuffs.presencePresenceBonus) {
        gameState.player.presence -= gameState.skillBuffs.presencePresenceBonus;
    }
    
    gameState.skillBuffs = {};
}
