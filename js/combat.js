// Combat System Module
import { gameState, enemies, bosses, legendaryItems, randomEvents, riddles, moralChoices, getStatModifier, shopItems } from './game-state.js';
import { updateUI, updateEnemyUI, addCombatLog, showScreen, updateCombatInventoryUI } from './ui.js';
import { saveGame } from './save-load.js';
import { checkLevelUp, meetNPC } from './game-logic.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';
import { updateQuestProgress } from './daily-quests.js';
import { updateSkillBuffs, applyShieldBuff, checkDodge, clearSkillBuffs, resetCombatState } from './skills.js';
import { trackAchievementProgress, checkAchievements } from './achievements.js';
import { submitScore, getNetworkState } from './network.js';
import { getEventMultiplier } from './scheduled-events.js';

// Check if player should face a boss (every 5 levels with probability)
function shouldFaceBoss() {
    const p = gameState.player;
    // Boss possible at levels 5, 10, 15, 20, etc.
    // 17.5% chance to encounter boss when at a boss level and haven't defeated this boss yet
    const isAtBossLevel = p.level % 5 === 0 && p.kills > 0 && (p.level / 5) > p.bossesDefeated;
    const bossSpawnChance = 0.175; // 17.5% chance (reduced from 35%)
    return isAtBossLevel && Math.random() < bossSpawnChance;
}

// Create boss enemy
function createBossEnemy() {
    const p = gameState.player;
    const bossIndex = Math.min(p.bossesDefeated, bosses.length - 1);
    const bossTemplate = bosses[bossIndex];
    
    // Scale boss stats based on player level
    const levelMultiplier = 1 + (p.level - (p.bossesDefeated * 5)) * 0.1;
    
    return {
        ...bossTemplate,
        maxHealth: Math.floor(bossTemplate.health * levelMultiplier),
        health: Math.floor(bossTemplate.health * levelMultiplier),
        strength: Math.floor(bossTemplate.strength * levelMultiplier),
        defense: Math.floor(bossTemplate.defense * levelMultiplier),
        gold: Math.floor(bossTemplate.gold * levelMultiplier),
        xp: Math.floor(bossTemplate.xp * levelMultiplier),
        isBoss: true
    };
}

// Trigger random event
export function triggerRandomEvent() {
    const eventType = Math.random();
    
    // 15% riddle, 15% moral choice, 70% random event
    if (eventType < 0.15) {
        triggerRiddle();
    } else if (eventType < 0.30) {
        triggerMoralChoice();
    } else {
        const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        const result = event.effect(gameState.player);
        
        showScreen('npcScreen');
        
        // Show event info container and hide regular NPC content
        const eventInfo = document.getElementById('eventInfo');
        const npcContent = document.getElementById('npcContent');
        eventInfo.style.display = 'flex';
        npcContent.style.display = 'none';
        
        // Set the event icon
        const eventIcon = document.getElementById('eventIcon');
        eventIcon.textContent = event.icon;
        
        // Set the event name
        const eventName = document.getElementById('eventName');
        eventName.textContent = event.name;
        
        // Set the event description
        const eventDescription = document.getElementById('eventDescription');
        eventDescription.innerHTML = '';
        
        const desc = document.createElement('p');
        desc.textContent = event.description;
        desc.style.fontStyle = 'italic';
        desc.style.marginBottom = '15px';
        eventDescription.appendChild(desc);
        
        const resultPara = document.createElement('p');
        resultPara.textContent = `✨ ${result}`;
        resultPara.style.color = event.type === 'trap' ? '#ff6b6b' : '#51cf66';
        resultPara.style.fontWeight = 'bold';
        eventDescription.appendChild(resultPara);
        
        saveGame();
        updateUI();
    }
}

// Trigger riddle
function triggerRiddle() {
    const riddle = riddles[Math.floor(Math.random() * riddles.length)];
    
    showScreen('npcScreen');
    
    // Show event info container and hide regular NPC content
    const eventInfo = document.getElementById('eventInfo');
    const npcContent = document.getElementById('npcContent');
    eventInfo.style.display = 'flex';
    npcContent.style.display = 'none';
    
    // Set the event icon
    const eventIcon = document.getElementById('eventIcon');
    eventIcon.textContent = '🧙‍♂️';
    
    // Set the event name
    const eventName = document.getElementById('eventName');
    eventName.textContent = 'Sphinx Énigmatique';
    
    // Set the event description
    const eventDescription = document.getElementById('eventDescription');
    eventDescription.innerHTML = '';
    
    const question = document.createElement('p');
    question.textContent = riddle.question;
    question.style.fontStyle = 'italic';
    question.style.marginBottom = '15px';
    eventDescription.appendChild(question);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'riddleAnswer';
    input.placeholder = 'Votre réponse...';
    input.style.width = '100%';
    input.style.marginBottom = '10px';
    eventDescription.appendChild(input);
    
    const submitBtn = document.createElement('button');
    submitBtn.textContent = '✓ Répondre';
    submitBtn.onclick = () => checkRiddleAnswer(riddle);
    eventDescription.appendChild(submitBtn);
    
    const resultDiv = document.createElement('div');
    resultDiv.id = 'riddleResult';
    resultDiv.style.marginTop = '15px';
    eventDescription.appendChild(resultDiv);
}

// Check riddle answer
function checkRiddleAnswer(riddle) {
    const answer = document.getElementById('riddleAnswer').value.toLowerCase().trim();
    const resultDiv = document.getElementById('riddleResult');
    const inputEl = document.getElementById('riddleAnswer');
    const submitBtn = inputEl.nextElementSibling; // Get the submit button
    const p = gameState.player;
    
    if (riddle.answers.includes(answer)) {
        const reward = riddle.getReward();
        p.gold += reward.gold;
        p.xp += reward.xp;
        resultDiv.innerHTML = `<p style="color: #51cf66; font-weight: bold;">✓ Correct ! Vous gagnez ${reward.gold} or et ${reward.xp} XP !</p>`;
        checkLevelUp();
    } else {
        resultDiv.innerHTML = `<p style="color: #ff6b6b; font-weight: bold;">✗ Incorrect... La bonne réponse était : ${riddle.answers[0]}</p>`;
    }
    
    // Disable input and button to prevent re-submission
    inputEl.disabled = true;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    
    saveGame();
    updateUI();
}

// Trigger moral choice
function triggerMoralChoice() {
    const choice = moralChoices[Math.floor(Math.random() * moralChoices.length)];
    
    showScreen('npcScreen');
    
    // Show event info container and hide regular NPC content
    const eventInfo = document.getElementById('eventInfo');
    const npcContent = document.getElementById('npcContent');
    eventInfo.style.display = 'flex';
    npcContent.style.display = 'none';
    
    // Set the event icon
    const eventIcon = document.getElementById('eventIcon');
    eventIcon.textContent = '⚖️';
    
    // Set the event name
    const eventName = document.getElementById('eventName');
    eventName.textContent = 'Dilemme Moral';
    
    // Set the event description
    const eventDescription = document.getElementById('eventDescription');
    eventDescription.innerHTML = '';
    
    const situation = document.createElement('p');
    situation.textContent = choice.situation;
    situation.style.fontStyle = 'italic';
    situation.style.marginBottom = '15px';
    eventDescription.appendChild(situation);
    
    choice.choices.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.style.display = 'block';
        btn.style.marginBottom = '10px';
        btn.style.width = '100%';
        btn.onclick = () => makeMoralChoice(option, eventDescription);
        eventDescription.appendChild(btn);
    });
}

// Make moral choice
function makeMoralChoice(option, container) {
    const result = option.effect(gameState.player);
    
    const resultDiv = document.createElement('div');
    resultDiv.style.marginTop = '15px';
    resultDiv.innerHTML = `<p style="color: #DAA520; font-weight: bold;">${result}</p>`;
    
    // Remove buttons
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());
    
    container.appendChild(resultDiv);
    
    checkLevelUp();
    saveGame();
    updateUI();
}

// Start exploring the dungeon
export function explore() {
    // Check if player has enough energy to explore
    if (gameState.player.energy < 10) {
        alert('Vous êtes trop fatigué pour explorer le donjon ! Allez dormir à l\'auberge pour récupérer votre énergie.');
        return;
    }
    
    // Consume energy for exploring
    gameState.player.energy = Math.max(0, gameState.player.energy - 10);
    
    // Update quest progress for exploring
    updateQuestProgress('explore', 1);
    
    // Track exploration for achievements
    trackAchievementProgress('exploration', 1);
    
    // Check for boss encounter first
    if (shouldFaceBoss()) {
        gameState.currentEnemy = createBossEnemy();
        gameState.currentEnemies = null;
        gameState.isDualCombat = false;
        gameState.inCombat = true;
        gameState.defending = false;
        
        // Switch to combat music for boss encounter
        audioManager.startMusic('combat');
        
        showScreen('combatScreen');
        document.getElementById('combatLog').innerHTML = '';
        addCombatLog(`🔥 COMBAT DE BOSS ! 🔥`, 'victory');
        addCombatLog(`${gameState.currentEnemy.name} apparaît devant vous !`, 'info');
        addCombatLog(`${gameState.currentEnemy.description}`, 'info');
        addCombatLog(`Capacité spéciale : ${gameState.currentEnemy.abilityDescription}`, 'info');
        updateEnemyUI();
        saveGame();
        updateUI();
        return;
    }
    
    // Random encounter - 20% random event, 20% NPC, 60% monster
    const encounterRoll = Math.random();
    
    if (encounterRoll < 0.2) {
        // Random event
        triggerRandomEvent();
    } else if (encounterRoll < 0.4) {
        // NPC encounter
        meetNPC();
    } else {
        // Monster encounter - 7% chance for dual monsters
        const dualMonsterChance = Math.random() < 0.07;
        
        if (dualMonsterChance) {
            // Dual monster encounter - select two different enemies
            const maxEnemyIndex = Math.min(enemies.length - 1, gameState.player.level);
            
            // Get two different random indices
            const index1 = Math.floor(Math.random() * (maxEnemyIndex + 1));
            let index2 = Math.floor(Math.random() * (maxEnemyIndex + 1));
            while (index2 === index1 && maxEnemyIndex > 0) {
                index2 = Math.floor(Math.random() * (maxEnemyIndex + 1));
            }
            
            const enemy1Template = enemies[index1];
            const enemy2Template = enemies[index2];
            
            // Create enemy objects
            const enemy1 = {
                ...enemy1Template,
                maxHealth: enemy1Template.health,
                isBoss: false
            };
            const enemy2 = {
                ...enemy2Template,
                maxHealth: enemy2Template.health,
                isBoss: false
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
            document.getElementById('combatLog').innerHTML = '';
            addCombatLog(`Vous rencontrez ${sortedEnemies[0].name} et ${sortedEnemies[1].name} !`, 'info');
            updateEnemyUI();
        } else {
            // Single monster encounter - select enemy based on player level but ensure we don't exceed array bounds
            const maxEnemyIndex = Math.min(enemies.length - 1, gameState.player.level);
            const enemyTemplate = enemies[Math.floor(Math.random() * (maxEnemyIndex + 1))];
            
            gameState.currentEnemy = {
                ...enemyTemplate,
                maxHealth: enemyTemplate.health,
                isBoss: false
            };
            gameState.currentEnemies = null;
            gameState.isDualCombat = false;
            
            gameState.inCombat = true;
            gameState.defending = false;
            
            // Switch to combat music for monster encounter
            audioManager.startMusic('combat');
            
            showScreen('combatScreen');
            document.getElementById('combatLog').innerHTML = '';
            addCombatLog(`Vous rencontrez un ${gameState.currentEnemy.name} !`, 'info');
            updateEnemyUI();
        }
    }
    
    saveGame();
    updateUI();
}

// Player attacks enemy
export function attack() {
    if (!gameState.inCombat) return;
    
    const p = gameState.player;
    const e = gameState.currentEnemy;
    
    // Play attack sound and show particles
    audioManager.playSound('attack');
    const enemyInfoElement = document.getElementById('enemyInfo');
    if (enemyInfoElement) {
        particleSystem.createAttackEffect(enemyInfoElement);
        // Add shake animation
        enemyInfoElement.classList.add('shake');
        setTimeout(() => enemyInfoElement.classList.remove('shake'), 500);
    }
    
    // Player attacks
    const strengthMod = getStatModifier(p.strength);
    const enemyDefenseMod = getStatModifier(e.defense);
    
    // Apply event strength multiplier
    const eventStrengthMultiplier = getEventMultiplier('strengthMultiplier', 1);
    
    // Calculate base damage with increased randomness: -3 to +10
    const damageVariance = Math.floor(Math.random() * 14) - 3;
    let playerDamage = Math.max(1, Math.floor((p.strength + strengthMod) * eventStrengthMultiplier) - (e.defense + enemyDefenseMod) + damageVariance);
    
    // Critical hit chance (10% base + event bonus)
    const baseCriticalChance = 0.10;
    const eventCriticalMultiplier = getEventMultiplier('criticalChance', 1);
    const criticalChance = Math.random();
    let isCritical = false;
    if (criticalChance < (baseCriticalChance * eventCriticalMultiplier)) {
        playerDamage = Math.floor(playerDamage * 1.5);
        isCritical = true;
    }
    
    e.health -= playerDamage;
    
    if (isCritical) {
        addCombatLog(`💥 COUP CRITIQUE ! Vous infligez ${playerDamage} dégâts au ${e.name} !`, 'victory');
    } else {
        addCombatLog(`Vous infligez ${playerDamage} dégâts au ${e.name} !`, 'player-damage');
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
        
        // Victory - Add randomness to rewards (80% to 120% of base values)
        const goldMultiplier = 0.80 + Math.random() * 0.40;
        const xpMultiplier = 0.80 + Math.random() * 0.40;
        
        // Apply event multipliers
        const eventGoldMultiplier = getEventMultiplier('goldMultiplier', 1) * getEventMultiplier('combatRewardMultiplier', 1);
        const eventXpMultiplier = getEventMultiplier('xpMultiplier', 1) * getEventMultiplier('combatRewardMultiplier', 1);
        
        const goldEarned = Math.round(e.gold * goldMultiplier * eventGoldMultiplier);
        const xpEarned = Math.round(e.xp * xpMultiplier * eventXpMultiplier);
        
        p.gold += goldEarned;
        p.xp += xpEarned;
        p.kills++;
        
        let victoryMessage = `Victoire ! Vous gagnez ${goldEarned} or et ${xpEarned} XP !`;
        if (eventGoldMultiplier > 1 || eventXpMultiplier > 1) {
            victoryMessage += ' 🎉 (Bonus événement)';
        }
        addCombatLog(victoryMessage, 'victory');
        
        // Update quest progress
        updateQuestProgress('kill', 1);
        updateQuestProgress('collect_gold', goldEarned);
        updateQuestProgress('survive', 1);
        
        // Track combat win for achievements
        trackAchievementProgress('combat_win', 1);
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
            
            // Award legendary item
            const legendaryItem = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
            addCombatLog(`Vous obtenez un objet légendaire : ${legendaryItem.icon} ${legendaryItem.name} !`, 'victory');
            addCombatLog(`${legendaryItem.description}`, 'info');
            legendaryItem.effect(p);
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
    
    // Enemy attacks
    setTimeout(() => {
        enemyAttack();
    }, 1000);
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
    const dexterityMod = getStatModifier(p.dexterity);
    // Base dodge chance: 5% + (dexterity modifier * 2%)
    const baseDodgeChance = 0.05 + (dexterityMod * 0.02);
    if (Math.random() < baseDodgeChance) {
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
                // Troll regenerates 4-7 HP each turn (reduced from 8-15)
                const regenAmount = 4 + Math.floor(Math.random() * 4);
                e.health = Math.min(e.maxHealth, e.health + regenAmount);
                addCombatLog(`${e.name} se régénère de ${regenAmount} HP !`, 'info');
                updateEnemyUI();
                break;
            
            case 'life_drain':
                // Liche drains life (12-20 HP)
                const drainAmount = 12 + Math.floor(Math.random() * 9);
                p.health -= drainAmount;
                e.health = Math.min(e.maxHealth, e.health + drainAmount);
                addCombatLog(`${e.name} vous draine de ${drainAmount} HP et se soigne !`, 'damage');
                updateEnemyUI();
                updateUI();
                
                if (p.health <= 0) {
                    handleDefeat();
                    return;
                }
                break;
            
            case 'triple_attack':
                // Hydra attacks three times
                addCombatLog(`${e.name} attaque avec ses trois têtes !`, 'info');
                const enemyStrengthMod = getStatModifier(e.strength);
                for (let i = 0; i < 3; i++) {
                    const damageVariance = Math.floor(Math.random() * 10) - 2;
                    const damage = Math.max(1, Math.floor(e.strength / 2) + Math.floor(enemyStrengthMod / 2) - (defense + playerDefenseMod) + damageVariance);
                    p.health -= damage;
                    addCombatLog(`Tête ${i + 1} inflige ${damage} dégâts !`, 'damage');
                    
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
                // Demon ignores 50% of defense
                const reducedDefense = Math.floor(defense * 0.5);
                const reducedDefenseMod = Math.floor(playerDefenseMod * 0.5);
                const enemyStrengthModFire = getStatModifier(e.strength);
                const fireDamageVariance = Math.floor(Math.random() * 16) - 3;
                const fireDamage = Math.max(1, e.strength + enemyStrengthModFire - (reducedDefense + reducedDefenseMod) + fireDamageVariance);
                p.health -= fireDamage;
                addCombatLog(`${e.name} lance une explosion de flammes ! ${fireDamage} dégâts !`, 'damage');
                
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
                // Dragon breath massive damage
                const enemyStrengthModBreath = getStatModifier(e.strength);
                const breathDamageVariance = Math.floor(Math.random() * 20) - 5;
                const breathDamage = Math.max(1, Math.floor(e.strength * 1.5) + Math.floor(enemyStrengthModBreath * 1.5) - (defense + playerDefenseMod) + breathDamageVariance);
                p.health -= breathDamage;
                addCombatLog(`${e.name} crache son souffle destructeur ! ${breathDamage} dégâts !`, 'damage');
                
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
    
    // Normal attack
    const enemyStrengthMod = getStatModifier(e.strength);
    
    // Calculate base damage with increased randomness: -3 to +10
    const damageVariance = Math.floor(Math.random() * 14) - 3;
    let enemyDamage = Math.max(1, e.strength + enemyStrengthMod - (defense + playerDefenseMod) + damageVariance);
    
    // Apply mana shield buff if active
    enemyDamage = applyShieldBuff(enemyDamage);
    
    p.health -= enemyDamage;
    addCombatLog(`Le ${e.name} vous inflige ${enemyDamage} dégâts !`, 'damage');
    
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
    updateCombatInventoryUI();
}

// Handle player defeat
function handleDefeat() {
    const p = gameState.player;
    p.health = 0;
    addCombatLog('Vous avez été vaincu...', 'damage');
    
    // Track combat loss for achievements (resets consecutive wins)
    trackAchievementProgress('combat_loss');
    
    // Clear skill buffs when combat ends
    clearSkillBuffs();
    resetCombatState();
    
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
    
    // Don't automatically trigger enemy attack - let player choose to use potion or skip
    // Enemy will attack after potion use or when defending state is cleared
}

// Try to flee from combat
export function flee() {
    if (!gameState.inCombat) return;
    
    const p = gameState.player;
    
    // Charisma improves flee chance: base 50% + (charisma modifier * 5%)
    const charismaMod = getStatModifier(p.charisma);
    const baseFleeChance = 0.5 + (charismaMod * 0.05);
    const fleeChance = Math.min(0.9, Math.max(0.1, baseFleeChance)); // Cap between 10% and 90%
    
    if (Math.random() < fleeChance) {
        addCombatLog('Vous fuyez le combat !', 'info');
        
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
