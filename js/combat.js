// Combat System Module - Core combat actions
// Responsibility: Handle main combat actions (attack, defend, flee)

import { gameState, enemies, eliteEnemies, legendaryItems, getStatModifier, shopItems } from './game-state.js';
import { ENERGY_COSTS, ENCOUNTER_CHANCES } from './data/game-constants.js';
import { updateUI, updateEnemyUI, addCombatLog, showScreen, updateCombatInventoryUI, updateSkillsUI } from './ui.js';
import { saveGame } from './save-load.js';
import { checkLevelUp, meetNPC } from './game-logic.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';
import { updateQuestProgress } from './daily-quests.js';
import { updateSkillBuffs, applyShieldBuff, checkDodge, clearSkillBuffs, resetCombatState } from './skills.js';
import { trackAchievementProgress, checkAchievements } from './achievements.js';
import { submitScore, getNetworkState } from './network.js';
import { getEventMultiplier } from './scheduled-events.js';
import { applyFirstVictoryBonus, showFirstVictoryNotification } from './daily-rewards.js';
import { determineInitiative } from './combat/initiative.js';
import { shouldFaceBoss, createBossEnemy } from './combat/boss.js';
import { triggerRandomEvent } from './combat/events.js';
import { showTouchHint } from './touch-gestures.js';
import { rollDamage, getDamageDiceForLevel, getDamageDiceForEnemy, formatDiceRoll, rollChance, rollSelect, rollRange } from './dice.js';
export { triggerRandomEvent };

/**
 * Starts exploring the dungeon, consuming energy and triggering encounters
 * May result in boss fights, random events, NPC encounters, or monster battles
 */
export function explore() {
    const p = gameState.player;
    
    // Check if player has enough energy to explore
    if (p.energy < ENERGY_COSTS.EXPLORE) {
        alert('Vous êtes trop fatigué pour explorer la forêt ! Allez dormir à l\'auberge pour récupérer votre énergie.');
        return;
    }
    
    try {
        // Consume energy for exploring
        p.energy = Math.max(0, p.energy - ENERGY_COSTS.EXPLORE);
        
        // Update quest progress for exploring
        updateQuestProgress('explore', 1);
        // Track exploration for achievements
        trackAchievementProgress('exploration', 1);
        
        // Check for boss encounter first
        if (shouldFaceBoss()) {
            initiateBossFight();
            return;
        }
        
        // Random encounter - 20% random event, 20% NPC, 60% monster
        const encounterRoll = rollChance(ENCOUNTER_CHANCES.FOREST_EVENT) ? 0.1 : 
                             (rollChance(ENCOUNTER_CHANCES.FOREST_NPC) ? 0.3 : 0.5);
        
        if (encounterRoll < 0.2) {
            // Random event (forest-specific)
            triggerRandomEvent('forest');
        } else if (encounterRoll < 0.4) {
            // NPC encounter (forest-specific)
            meetNPC('forest');
        } else {
            // Monster encounter - 7% chance for dual monsters
            const dualMonsterChance = rollChance(ENCOUNTER_CHANCES.DUAL_MONSTER);
            
            if (dualMonsterChance) {
                initiateDualCombat();
            } else {
                initiateSingleCombat();
            }
        }
    } catch (error) {
        console.error('Error in explore:', error);
        // Restore energy on error to prevent unfair consumption
        p.energy = Math.min(p.maxEnergy, p.energy + ENERGY_COSTS.EXPLORE);
        alert('Une erreur est survenue pendant l\'exploration. Veuillez réessayer.');
    }
}

/**
 * Initiates a boss fight encounter
 * Sets up boss-specific game state and UI
 */
function initiateBossFight() {
    try {
        gameState.currentEnemy = createBossEnemy();
        gameState.currentEnemies = null;
        gameState.isDualCombat = false;
        gameState.inCombat = true;
        gameState.defending = false;
        
        // Mark that we're in a boss fight to prevent save export during combat
        gameState.inBossCombat = true;
        
        // Create a checkpoint before boss fight
        gameState.bossCheckpoint = {
            playerHealth: gameState.player.health,
            playerEnergy: gameState.player.energy,
            playerMana: gameState.player.mana,
            timestamp: Date.now()
        };
        
        // Switch to combat music for boss encounter
        audioManager.startMusic('combat');
        
        showScreen('combatScreen');
        const combatLog = document.getElementById('combatLog');
        if (combatLog) {
            combatLog.innerHTML = '';
        }
        addCombatLog(`🔥 COMBAT DE BOSS ! 🔥`, 'victory');
        addCombatLog(`${gameState.currentEnemy.name} apparaît devant vous !`, 'info');
        addCombatLog(`${gameState.currentEnemy.description}`, 'info');
        addCombatLog(`Capacité spéciale : ${gameState.currentEnemy.abilityDescription}`, 'info');
        
        // Roll initiative
        const playerGoesFirst = determineInitiative();
        
        updateEnemyUI();
        saveGame();
        updateUI();
        
        // Show touch hint for mobile users
        showTouchHint('💡 Balayez ← pour défendre, → pour fuir');
        
        // If enemy won initiative, they attack first
        if (!playerGoesFirst) {
            setTimeout(() => {
                enemyAttack();
            }, 2000);
        }
    } catch (error) {
        console.error('Error initiating boss fight:', error);
        gameState.inCombat = false;
        gameState.inBossCombat = false;
        alert('Une erreur est survenue lors de l\'initialisation du combat de boss.');
    }
}

/**
 * Initiates a dual monster combat encounter
 * Sets up state for fighting two enemies simultaneously
 */
function initiateDualCombat() {
    try {
        // Dual monster encounter - select two different enemies
        const maxEnemyIndex = Math.min(enemies.length - 1, gameState.player.level);
        
        // Get two different random indices using dice
        const availableEnemies = enemies.slice(0, maxEnemyIndex + 1);
        const enemy1Template = rollSelect(availableEnemies);
        let enemy2Template = rollSelect(availableEnemies);
        
        // Ensure we get different enemies if possible
        let attempts = 0;
        while (enemy2Template === enemy1Template && availableEnemies.length > 1 && attempts < 5) {
            enemy2Template = rollSelect(availableEnemies);
            attempts++;
        }
        
        // Create enemy objects
        const enemy1 = {
            ...enemy1Template,
            maxHealth: enemy1Template.health,
            isBoss: false,
            distance: enemy1Template.isRanged ? 1 : 0 // Ranged enemies start at distance 1
        };
        const enemy2 = {
            ...enemy2Template,
            maxHealth: enemy2Template.health,
            isBoss: false,
            distance: enemy2Template.isRanged ? 1 : 0 // Ranged enemies start at distance 1
        };
        
        // Sort by strength - stronger on left (index 0)
        const sortedEnemies = [enemy1, enemy2].sort((a, b) => b.strength - a.strength);
        
        // Store both enemies
        gameState.currentEnemies = sortedEnemies;
        gameState.currentEnemy = sortedEnemies[0]; // Primary target
        gameState.isDualCombat = true;
        
        gameState.inCombat = true;
        gameState.defending = false;
        
        // Switch to combat music for monster encounter
        audioManager.startMusic('combat');
        
        showScreen('combatScreen');
        const combatLog = document.getElementById('combatLog');
        if (combatLog) {
            combatLog.innerHTML = '';
        }
        addCombatLog(`Vous rencontrez ${sortedEnemies[0].name} et ${sortedEnemies[1].name} !`, 'info');
        
        // Show distance info for ranged enemies
        if (sortedEnemies[0].isRanged || sortedEnemies[1].isRanged) {
            addCombatLog(`⚠️ Certains ennemis sont à distance et doivent s'approcher pour attaquer au corps à corps !`, 'info');
        }
        
        // Roll initiative
        const playerGoesFirst = determineInitiative();
        
        updateEnemyUI();
        saveGame();
        updateUI();
        
        // Show touch hint for mobile users
        showTouchHint('💡 Balayez ← pour défendre, → pour fuir');
        
        // If enemy won initiative, they attack first
        if (!playerGoesFirst) {
            setTimeout(() => {
                enemyApproachOrAttack();
            }, 2000);
        }
    } catch (error) {
        console.error('Error initiating dual combat:', error);
        gameState.inCombat = false;
        alert('Une erreur est survenue lors de l\'initialisation du combat double.');
    }
}

/**
 * Initiates a single monster combat encounter
 * Sets up state for fighting one enemy
 */
function initiateSingleCombat() {
    try {
        // 15% chance for elite enemy encounter (better loot)
        const isEliteEncounter = rollChance(0.15);
        let enemyTemplate;
        
        if (isEliteEncounter) {
            // Elite enemy - filter by player level
            const maxEnemyIndex = Math.min(eliteEnemies.length - 1, Math.floor(gameState.player.level / 3));
            const availableElites = eliteEnemies.slice(0, maxEnemyIndex + 1);
            enemyTemplate = rollSelect(availableElites);
        } else {
            // Normal enemy
            const maxEnemyIndex = Math.min(enemies.length - 1, gameState.player.level);
            const availableEnemies = enemies.slice(0, maxEnemyIndex + 1);
            enemyTemplate = rollSelect(availableEnemies);
        }
        
        gameState.currentEnemy = {
            ...enemyTemplate,
            maxHealth: enemyTemplate.health,
            isBoss: false,
            distance: enemyTemplate.isRanged ? 1 : 0 // Ranged enemies start at distance 1
        };
        gameState.currentEnemies = null;
        gameState.isDualCombat = false;
        
        gameState.inCombat = true;
        gameState.defending = false;
        
        // Switch to combat music for monster encounter
        audioManager.startMusic('combat');
        
        showScreen('combatScreen');
        const combatLog = document.getElementById('combatLog');
        if (combatLog) {
            combatLog.innerHTML = '';
        }
        
        // Special message for elite enemies
        if (enemyTemplate.isElite) {
            addCombatLog(`⭐ ENNEMI ÉLITE ! ⭐`, 'victory');
            addCombatLog(`Vous rencontrez un ${gameState.currentEnemy.name} !`, 'special');
            addCombatLog(`💎 Cet ennemi puissant offre de meilleures récompenses !`, 'special');
        } else {
            addCombatLog(`Vous rencontrez un ${gameState.currentEnemy.name} !`, 'info');
        }
        
        // Show distance info for ranged enemies
        if (gameState.currentEnemy.isRanged) {
            addCombatLog(`⚠️ L'ennemi est à distance et doit s'approcher pour attaquer au corps à corps !`, 'info');
            if (gameState.player.class === 'guerrier') {
                addCombatLog(`⚔️ En tant que Guerrier, vous ne pouvez pas attaquer pendant son approche.`, 'info');
            } else if (gameState.player.class === 'magicien') {
                addCombatLog(`🧙 En tant que Magicien, vous pouvez lancer des sorts pendant son approche !`, 'special');
            } else if (gameState.player.class === 'archer') {
                addCombatLog(`🏹 En tant qu'Archer, vous pouvez tirer pendant son approche !`, 'special');
            }
        }
        
        // Roll initiative
        const playerGoesFirst = determineInitiative();
        
        updateEnemyUI();
        saveGame();
        updateUI();
        
        // Show touch hint for mobile users
        showTouchHint('💡 Balayez ← pour défendre, → pour fuir');
        
        // If enemy won initiative, they attack first
        if (!playerGoesFirst) {
            setTimeout(() => {
                enemyApproachOrAttack();
            }, 2000);
        }
    } catch (error) {
        console.error('Error initiating single combat:', error);
        gameState.inCombat = false;
        alert('Une erreur est survenue lors de l\'initialisation du combat.');
    }
}

/**
 * Player attacks the current enemy
 * Handles attack validation, damage calculation, and combat flow
 */
export function attack() {
    if (!gameState.inCombat) return;
    
    const p = gameState.player;
    const e = gameState.currentEnemy;
    
    // Check if enemy is at distance and if warrior cannot attack
    if (e.distance > 0) {
        if (p.class === 'guerrier') {
            addCombatLog(`⚔️ Vous ne pouvez pas attaquer l'ennemi à distance en tant que Guerrier !`, 'damage');
            addCombatLog(`L'ennemi s'approche...`, 'info');
            audioManager.playSound('error');
            
            // Enemy approaches and may attack
            setTimeout(() => {
                enemyApproachOrAttack();
            }, 1000);
            return;
        }
        // Mages and archers can attack at range
        if (p.class === 'magicien') {
            addCombatLog(`🧙 Vous lancez un sort à distance !`, 'special');
        } else if (p.class === 'archer') {
            addCombatLog(`🏹 Vous tirez une flèche !`, 'special');
        }
    }
    
    // Play attack sound and show particles
    audioManager.playSound('attack');
    const enemyInfoElement = document.getElementById('enemyInfo');
    if (enemyInfoElement) {
        particleSystem.createAttackEffect(enemyInfoElement);
        // Add shake animation
        enemyInfoElement.classList.add('shake');
        setTimeout(() => enemyInfoElement.classList.remove('shake'), 500);
    }
    
    // Player attacks with dice-based damage
    const puissanceMod = getStatModifier(p.puissance);
    const enemyDefenseMod = getStatModifier(e.defense);
    
    // Apply event strength multiplier
    const eventStrengthMultiplier = getEventMultiplier('strengthMultiplier', 1);
    
    // Calculate damage using dice system
    // Number of damage dice based on player level
    const numDamageDice = getDamageDiceForLevel(p.level);
    
    // Roll damage dice with strength modifier as bonus
    const damageRoll = rollDamage(numDamageDice, Math.floor(puissanceMod * eventStrengthMultiplier));
    
    // Subtract enemy defense
    let playerDamage = Math.max(1, damageRoll.total - (e.defense + enemyDefenseMod));
    
    // Critical hit chance (10% base + event bonus)
    const baseCriticalChance = 0.10;
    const eventCriticalMultiplier = getEventMultiplier('criticalChance', 1);
    const effectiveCritChance = baseCriticalChance * eventCriticalMultiplier * 100;
    let isCritical = rollChance(effectiveCritChance);
    
    e.health -= playerDamage;
    
    // Display damage with dice roll details
    if (isCritical) {
        playerDamage = Math.floor(playerDamage * 1.5);
        addCombatLog(`💥 COUP CRITIQUE !`, 'victory');
        addCombatLog(`🎲 Dégâts: ${formatDiceRoll(damageRoll)} - ${e.defense + enemyDefenseMod} défense × 1.5 = ${playerDamage}`, 'player-damage');
    } else {
        addCombatLog(`🎲 ${formatDiceRoll(damageRoll, 'Attaque')} - ${e.defense + enemyDefenseMod} défense = ${playerDamage} dégâts`, 'player-damage');
    }
    
    if (e.health <= 0) {
        // Check if this is dual combat and there's a second enemy
        if (gameState.isDualCombat && gameState.currentEnemies && gameState.currentEnemies.length > 1) {
            // Find the index of the defeated enemy
            const defeatedIndex = gameState.currentEnemies.findIndex(enemy => enemy === e);
            
            // Remove defeated enemy
            gameState.currentEnemies.splice(defeatedIndex, 1);
            
            // Switch to remaining enemy
            gameState.currentEnemy = gameState.currentEnemies[0];
            
            addCombatLog(`${e.name} est vaincu !`, 'victory');
            addCombatLog(`${gameState.currentEnemy.name} continue le combat !`, 'info');
            
            // Update UI to show remaining enemy
            updateEnemyUI();
            
            // Continue combat with remaining enemy
            setTimeout(() => {
                enemyAttack();
            }, 1000);
            
            return;
        }
        
        // Victory - Add randomness to rewards using dice (80% to 120% of base values)
        const goldMultiplier = rollRange(80, 120) / 100; // ~2d6 scaled to 0.80-1.20
        const xpMultiplier = rollRange(80, 120) / 100;   // ~2d6 scaled to 0.80-1.20
        
        // Increment victory combo
        p.victoryCombo = (p.victoryCombo || 0) + 1;
        if (p.victoryCombo > (p.maxVictoryCombo || 0)) {
            p.maxVictoryCombo = p.victoryCombo;
        }
        
        // Combo bonus: +5% per consecutive victory (max +50% at 10 combo)
        const comboMultiplier = 1 + Math.min(p.victoryCombo * 0.05, 0.5);
        
        // Apply event multipliers
        const eventGoldMultiplier = getEventMultiplier('goldMultiplier', 1) * getEventMultiplier('combatRewardMultiplier', 1);
        const eventXpMultiplier = getEventMultiplier('xpMultiplier', 1) * getEventMultiplier('combatRewardMultiplier', 1);
        
        // Check for first victory bonus
        const firstVictory = applyFirstVictoryBonus();
        const firstVictoryMultiplier = firstVictory.applied ? 2 : 1;
        
        let goldEarned = Math.round(e.gold * goldMultiplier * eventGoldMultiplier * firstVictoryMultiplier * comboMultiplier);
        let xpEarned = Math.round(e.xp * xpMultiplier * eventXpMultiplier * firstVictoryMultiplier * comboMultiplier);
        
        p.gold += goldEarned;
        p.xp += xpEarned;
        p.kills++;
        
        let victoryMessage = `Victoire ! Vous gagnez ${goldEarned} or et ${xpEarned} XP !`;
        if (eventGoldMultiplier > 1 || eventXpMultiplier > 1) {
            victoryMessage += ' 🎉 (Bonus événement)';
        }
        if (p.victoryCombo > 1) {
            victoryMessage += ` 🔥 COMBO x${p.victoryCombo} ! (+${Math.round((comboMultiplier - 1) * 100)}% bonus)`;
        }
        addCombatLog(victoryMessage, 'victory');
        
        // Show first victory notification if applicable
        if (firstVictory.applied) {
            showFirstVictoryNotification(goldEarned, xpEarned);
        }
        
        // Update quest progress
        updateQuestProgress('kill', 1);
        updateQuestProgress('collect_gold', goldEarned);
        updateQuestProgress('survive', 1);
        
        // Track combat win for achievements
        trackAchievementProgress('combat_win', 1);
        
        // Track elite kills
        if (e.isElite) {
            trackAchievementProgress('elite_kills', 1);
        }
        
        // Track max combo
        if (p.victoryCombo > (gameState.achievements?.stats?.max_combo || 0)) {
            trackAchievementProgress('max_combo', p.victoryCombo);
        }
        
        checkAchievements();
        
        // Play victory sound and show particles
        audioManager.playSound('victory');
        if (enemyInfoElement) {
            particleSystem.createVictoryEffect(enemyInfoElement);
            // Add fade-out animation
            enemyInfoElement.classList.add('fade-out');
        }
        
        // Check if boss was defeated
        if (e.isBoss) {
            p.bossesDefeated++;
            addCombatLog(`🏆 BOSS VAINCU ! 🏆`, 'victory');
            
            // Award legendary item using dice-based selection
            const legendaryItem = rollSelect(legendaryItems);
            addCombatLog(`Vous obtenez un objet légendaire : ${legendaryItem.icon} ${legendaryItem.name} !`, 'victory');
            addCombatLog(`${legendaryItem.description}`, 'info');
            legendaryItem.effect(p);
            
            // Clear boss combat flag
            gameState.inBossCombat = false;
            delete gameState.bossCheckpoint;
        }
        
        checkLevelUp();
        
        // Clear skill buffs when combat ends
        clearSkillBuffs();
        resetCombatState();
        
        // Submit score to multiplayer server if enabled
        submitScoreIfEnabled();
        
        // Immediately end combat to prevent double rewards
        gameState.inCombat = false;
        gameState.isDualCombat = false;
        gameState.currentEnemies = null;
        
        // Restore default music after combat
        audioManager.startMusic('default');
        
        // Return to main screen after victory
        setTimeout(() => {
            showScreen('mainScreen');
        }, 2000);
        
        saveGame();
        updateUI();
        return;
    }
    
    updateEnemyUI();
    
    // Enemy attacks or approaches
    setTimeout(() => {
        enemyApproachOrAttack();
    }, 1000);
}

// Enemy approaches or attacks based on distance
export function enemyApproachOrAttack() {
    const e = gameState.currentEnemy;
    
    // Check if enemy needs to approach (is at distance)
    if (e.distance > 0) {
        e.distance = 0; // Enemy moves to melee range
        addCombatLog(`${e.name} s'approche au corps à corps !`, 'info');
        
        // If enemy is ranged, they can still attack from range before closing
        if (e.isRanged) {
            addCombatLog(`${e.name} tire à distance avant de s'approcher !`, 'damage');
            const p = gameState.player;
            const enemyStrengthMod = getStatModifier(e.strength);
            const playerDefenseMod = getStatModifier(p.defense);
            
            let defense = p.defense;
            if (gameState.defending) {
                defense *= 2;
                gameState.defending = false;
            }
            
            // Ranged attack - uses dice but with reduced damage (80% of dice count, min 1)
            const numDamageDice = Math.max(1, Math.floor(getDamageDiceForEnemy(e.strength) * 0.8));
            const rangedRoll = rollDamage(numDamageDice, Math.floor(enemyStrengthMod * 0.8));
            let rangedDamage = Math.max(1, rangedRoll.total - (defense + playerDefenseMod));
            
            // Apply mana shield buff if active
            rangedDamage = applyShieldBuff(rangedDamage);
            
            // Class-specific defensive abilities still apply
            if (p.class === 'magicien' && rollChance(20)) {
                const reduction = Math.floor(rangedDamage * 0.30);
                rangedDamage = rangedDamage - reduction;
                addCombatLog(`✨ Bouclier arcanique ! Les dégâts sont réduits de ${reduction}.`, 'special');
            }
            
            if (p.class === 'archer') {
                const dexMod = getStatModifier(p.adresse);
                const dodgeChance = Math.min(18, dexMod * 1.8); // Convert to percentage
                if (rollChance(dodgeChance)) {
                    const reduction = Math.floor(rangedDamage * 0.35);
                    rangedDamage = rangedDamage - reduction;
                    addCombatLog(`💨 Esquive partielle ! Les dégâts sont réduits de ${reduction}.`, 'special');
                }
            }
            
            p.health -= rangedDamage;
            addCombatLog(`🎲 Tir à distance: ${formatDiceRoll(rangedRoll)} - ${defense + playerDefenseMod} défense = ${rangedDamage} dégâts`, 'damage');
            
            // Play hit sound and show particles
            audioManager.playSound('hit');
            const playerStatsElement = document.getElementById('gameStats');
            if (playerStatsElement) {
                particleSystem.createHitEffect(playerStatsElement);
            }
            
            if (p.health <= 0) {
                handleDefeat();
                return;
            }
        }
        
        updateUI();
        updateEnemyUI();
        return;
    }
    
    // Enemy is at melee range, proceed with normal attack
    enemyAttack();
}

// Enemy attacks player
export function enemyAttack() {
    const p = gameState.player;
    const e = gameState.currentEnemy;
    
    // Update skill buffs at start of enemy turn
    updateSkillBuffs();
    
    // Check for dodge from smoke bomb
    if (checkDodge()) {
        addCombatLog(`💨 Vous esquivez l'attaque grâce à la Bombe Fumigène !`, 'special');
        updateUI();
        return;
    }
    
    // Check for natural dodge based on dexterity
    const adresseMod = getStatModifier(p.adresse);
    // Base dodge chance: 5% + (dexterity modifier * 2%)
    const baseDodgeChance = 5 + (adresseMod * 2); // Convert to percentage
    if (rollChance(baseDodgeChance)) {
        addCombatLog(`⚡ Vous esquivez l'attaque avec agilité !`, 'special');
        updateUI();
        return;
    }
    
    let defense = p.defense;
    const playerDefenseMod = getStatModifier(p.defense);
    if (gameState.defending) {
        defense *= 2;
        gameState.defending = false;
    }
    
    // Handle boss special abilities
    if (e.isBoss && e.ability) {
        switch (e.ability) {
            case 'regeneration':
                // Troll regenerates using dice (1d6+1 HP each turn)
                const regenRoll = rollDamage(1, 1);
                const regenAmount = regenRoll.total;
                e.health = Math.min(e.maxHealth, e.health + regenAmount);
                addCombatLog(`🎲 ${e.name} se régénère: ${formatDiceRoll(regenRoll)} HP !`, 'info');
                updateEnemyUI();
                break;
            
            case 'life_drain':
                // Liche drains life using dice (2d6+3 HP)
                const drainRoll = rollDamage(2, 3);
                const drainAmount = drainRoll.total;
                p.health -= drainAmount;
                e.health = Math.min(e.maxHealth, e.health + drainAmount);
                addCombatLog(`🎲 ${e.name} draine: ${formatDiceRoll(drainRoll)} HP et se soigne !`, 'damage');
                updateEnemyUI();
                updateUI();
                
                if (p.health <= 0) {
                    handleDefeat();
                    return;
                }
                break;
            
            case 'triple_attack':
                // Hydra attacks three times with dice
                addCombatLog(`${e.name} attaque avec ses trois têtes !`, 'info');
                const enemyStrengthMod = getStatModifier(e.strength);
                for (let i = 0; i < 3; i++) {
                    // Each head does reduced damage: 1d6 + half strength mod
                    const headDamageRoll = rollDamage(1, Math.floor(enemyStrengthMod / 2));
                    const damage = Math.max(1, headDamageRoll.total - (defense + playerDefenseMod));
                    p.health -= damage;
                    addCombatLog(`🎲 Tête ${i + 1}: ${formatDiceRoll(headDamageRoll)} - ${defense + playerDefenseMod} défense = ${damage} dégâts`, 'damage');
                    
                    if (p.health <= 0) {
                        handleDefeat();
                        return;
                    }
                }
                
                audioManager.playSound('hit');
                const playerStatsElement1 = document.getElementById('gameStats');
                if (playerStatsElement1) {
                    particleSystem.createHitEffect(playerStatsElement1);
                }
                
                updateUI();
                return;
            
            case 'fire_burst':
                // Demon ignores 50% of defense with fire burst
                const reducedDefense = Math.floor(defense * 0.5);
                const reducedDefenseMod = Math.floor(playerDefenseMod * 0.5);
                const enemyStrengthModFire = getStatModifier(e.strength);
                // Fire burst uses 3d6 + strength mod
                const fireRoll = rollDamage(3, enemyStrengthModFire);
                const fireDamage = Math.max(1, fireRoll.total - (reducedDefense + reducedDefenseMod));
                p.health -= fireDamage;
                addCombatLog(`🔥 ${e.name} lance une explosion de flammes !`, 'damage');
                addCombatLog(`🎲 ${formatDiceRoll(fireRoll)} - ${reducedDefense + reducedDefenseMod} défense réduite = ${fireDamage} dégâts`, 'damage');
                
                audioManager.playSound('hit');
                const playerStatsElement2 = document.getElementById('gameStats');
                if (playerStatsElement2) {
                    particleSystem.createHitEffect(playerStatsElement2);
                }
                
                if (p.health <= 0) {
                    handleDefeat();
                    return;
                }
                
                updateUI();
                return;
            
            case 'breath_weapon':
                // Dragon breath massive damage using 4d6
                const enemyStrengthModBreath = getStatModifier(e.strength);
                const breathRoll = rollDamage(4, Math.floor(enemyStrengthModBreath * 1.5));
                const breathDamage = Math.max(1, breathRoll.total - (defense + playerDefenseMod));
                p.health -= breathDamage;
                addCombatLog(`🐉 ${e.name} crache son souffle destructeur !`, 'damage');
                addCombatLog(`🎲 ${formatDiceRoll(breathRoll)} - ${defense + playerDefenseMod} défense = ${breathDamage} dégâts`, 'damage');
                
                audioManager.playSound('hit');
                const playerStatsElement3 = document.getElementById('gameStats');
                if (playerStatsElement3) {
                    particleSystem.createHitEffect(playerStatsElement3);
                }
                
                if (p.health <= 0) {
                    handleDefeat();
                    return;
                }
                
                updateUI();
                return;
        }
    }
    
    // Normal attack with dice-based damage
    const enemyStrengthMod = getStatModifier(e.strength);
    
    // Calculate damage using dice system
    // Number of damage dice based on enemy strength
    const numDamageDice = getDamageDiceForEnemy(e.strength);
    
    // Roll damage dice with strength modifier as bonus
    const damageRoll = rollDamage(numDamageDice, enemyStrengthMod);
    
    // Subtract player defense
    let enemyDamage = Math.max(1, damageRoll.total - (defense + playerDefenseMod));
    
    // Apply mana shield buff if active
    enemyDamage = applyShieldBuff(enemyDamage);
    
    // Class-specific defensive abilities
    // Magicien: Arcane Shield - 20% chance to cast shield that reduces damage by 30%
    if (p.class === 'magicien' && rollChance(20)) {
        const reduction = Math.floor(enemyDamage * 0.30);
        enemyDamage = enemyDamage - reduction;
        addCombatLog(`✨ Bouclier arcanique ! Les dégâts sont réduits de ${reduction}.`, 'special');
    }
    
    // Archer: DEX-based dodge - chance to reduce damage based on dexterity
    if (p.class === 'archer') {
        const dexMod = getStatModifier(p.adresse);
        const dodgeChance = Math.min(18, dexMod * 1.8); // Up to 18% dodge chance
        if (rollChance(dodgeChance)) {
            const reduction = Math.floor(enemyDamage * 0.35);
            enemyDamage = enemyDamage - reduction;
            addCombatLog(`💨 Esquive partielle ! Les dégâts sont réduits de ${reduction}.`, 'special');
        }
    }
    
    p.health -= enemyDamage;
    addCombatLog(`🎲 ${e.name}: ${formatDiceRoll(damageRoll, 'Attaque')} - ${defense + playerDefenseMod} défense = ${enemyDamage} dégâts`, 'damage');
    
    // Play hit sound and show particles
    audioManager.playSound('hit');
    const playerStatsElement = document.getElementById('gameStats');
    if (playerStatsElement) {
        particleSystem.createHitEffect(playerStatsElement);
    }
    
    if (p.health <= 0) {
        handleDefeat();
        return;
    }
    
    updateUI();
    updateSkillsUI();
    updateCombatInventoryUI();
}

// Handle player defeat
function handleDefeat() {
    const p = gameState.player;
    p.health = 0;
    addCombatLog('Vous avez été vaincu...', 'damage');
    
    // Reset victory combo on defeat
    if (p.victoryCombo > 0) {
        addCombatLog(`💔 Combo de ${p.victoryCombo} victoires perdu !`, 'damage');
        p.victoryCombo = 0;
    }
    
    // Track combat loss for achievements (resets consecutive wins)
    trackAchievementProgress('combat_loss');
    
    // Clear skill buffs when combat ends
    clearSkillBuffs();
    resetCombatState();
    
    // Clear boss combat flag if player dies to a boss
    if (gameState.inBossCombat) {
        gameState.inBossCombat = false;
        delete gameState.bossCheckpoint;
    }
    
    // Reset survive quest progress since player died
    if (gameState.dailyQuests && gameState.dailyQuests.active) {
        gameState.dailyQuests.active.forEach(quest => {
            if (quest.type === 'survive') {
                quest.progress = 0;
            }
        });
    }
    
    setTimeout(() => {
        p.health = Math.floor(p.maxHealth * 0.5);
        p.gold = Math.floor(p.gold * 0.5);
        gameState.inCombat = false;
        
        // Restore default music after defeat
        audioManager.startMusic('default');
        
        saveGame();
        updateUI();
        alert('Vous avez été vaincu ! Vous perdez la moitié de votre or et vous réveillez à l\'entrée du donjon.');
        showScreen('mainScreen');
    }, 1500);
}

// Player defends
export function defend() {
    if (!gameState.inCombat) return;
    
    gameState.defending = true;
    addCombatLog('Vous prenez une position défensive !', 'info');
    addCombatLog('Vous pouvez maintenant utiliser vos potions !', 'special');
    
    // Play defend sound and show particles
    audioManager.playSound('defend');
    const playerStatsElement = document.getElementById('gameStats');
    if (playerStatsElement) {
        particleSystem.createDefenseEffect(playerStatsElement);
    }
    
    // Update UI to show combat inventory
    updateCombatInventoryUI();
    updateSkillsUI();
    
    // Don't automatically trigger enemy attack - let player choose to use potion or skip
    // Enemy will attack after potion use or when defending state is cleared
}

// Try to flee from combat
export function flee() {
    if (!gameState.inCombat) return;
    
    const p = gameState.player;
    const e = gameState.currentEnemy;
    
    // Cannot flee from bosses
    if (e && e.isBoss) {
        addCombatLog('❌ Impossible de fuir un boss! Vous devez combattre!', 'damage');
        audioManager.playSound('error');
        return;
    }
    
    // Initialize flee history if it doesn't exist
    if (!p.fleeHistory) {
        p.fleeHistory = [];
    }
    
    // Clean up old flee history (keep only last 5 minutes)
    const now = Date.now();
    p.fleeHistory = p.fleeHistory.filter(time => now - time < 300000);
    
    // Reduce flee chance with recent flees to prevent abuse
    const recentFleeCount = p.fleeHistory.length;
    const fleePenalty = recentFleeCount * 0.1; // -10% per recent flee
    
    // Charisma improves flee chance: base 50% + (charisma modifier * 5%) - penalties
    const presenceMod = getStatModifier(p.presence);
    const baseFleeChance = 50 + (presenceMod * 5) - (fleePenalty * 100); // Convert to percentage
    const fleeChance = Math.min(90, Math.max(10, baseFleeChance)); // Cap between 10% and 90%
    
    if (rollChance(fleeChance)) {
        // Calculate penalties for fleeing
        const goldLost = Math.floor(p.gold * 0.05); // Lose 5% of gold
        const xpLost = Math.floor(p.xp * 0.03); // Lose 3% of XP
        
        p.gold = Math.max(0, p.gold - goldLost);
        p.xp = Math.max(0, p.xp - xpLost);
        
        // Reset victory combo on flee
        if (p.victoryCombo > 0) {
            addCombatLog(`💔 Combo de ${p.victoryCombo} victoires perdu !`, 'damage');
            p.victoryCombo = 0;
        }
        
        // Record this flee
        p.fleeHistory.push(now);
        
        let fleeMessage = 'Vous fuyez le combat !';
        if (goldLost > 0 || xpLost > 0) {
            fleeMessage += ` Vous perdez ${goldLost} or et ${xpLost} XP dans votre fuite.`;
        }
        addCombatLog(fleeMessage, 'info');
        
        // Track successful escape for achievements
        trackAchievementProgress('successful_escape', 1);
        checkAchievements();
        
        // Play flee sound
        audioManager.playSound('flee');
        
        // Restore default music after fleeing
        audioManager.startMusic('default');
        
        setTimeout(() => {
            gameState.inCombat = false;
            showScreen('mainScreen');
            saveGame();
            updateUI();
        }, 1000);
    } else {
        addCombatLog('Vous ne parvenez pas à fuir !', 'damage');
        setTimeout(() => {
            enemyAttack();
        }, 1000);
    }
}

// Use potion from inventory during combat
export function useCombatPotion(inventoryIndex) {
    if (!gameState.inCombat) return;
    
    // Can only use potions while defending
    if (!gameState.defending) {
        addCombatLog('Vous devez vous défendre pour accéder à vos potions !', 'damage');
        return;
    }
    
    const p = gameState.player;
    if (!p.inventory || inventoryIndex < 0 || inventoryIndex >= p.inventory.length) {
        return;
    }
    
    const inventoryItem = p.inventory[inventoryIndex];
    const shopItem = shopItems[inventoryItem.shopIndex];
    
    if (shopItem && shopItem.effect) {
        // Use the potion
        shopItem.effect();
        
        // Remove from inventory
        p.inventory.splice(inventoryIndex, 1);
        
        // Log the action
        addCombatLog(`Vous utilisez ${inventoryItem.name} !`, 'special');
        
        saveGame();
        updateUI();
        updateCombatInventoryUI();
        
        // Enemy attacks after player uses potion
        setTimeout(() => {
            if (gameState.inCombat) {
                enemyAttack();
            }
        }, 1000);
    }
}

// Skip turn while defending (don't use potion)
export function skipDefendTurn() {
    if (!gameState.inCombat) return;
    
    if (!gameState.defending) {
        return;
    }
    
    addCombatLog('Vous maintenez votre position défensive sans utiliser de potion.', 'info');
    
    // Trigger enemy attack
    setTimeout(() => {
        enemyAttack();
    }, 1000);
}

// Submit score to multiplayer server if enabled
async function submitScoreIfEnabled() {
    const networkState = getNetworkState();
    
    if (!networkState.enabled) {
        return; // Multiplayer not enabled
    }
    
    try {
        const result = await submitScore();
        if (result.success) {
            console.log('✓ Score soumis au serveur multijoueur');
        } else if (!result.offline) {
            console.warn('⚠️ Échec de soumission du score:', result.error);
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du score:', error);
    }
}
