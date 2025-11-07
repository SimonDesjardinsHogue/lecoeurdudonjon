// Combat System Module
import { gameState, enemies } from './game-state.js';
import { updateUI, updateEnemyUI, addCombatLog, showScreen } from './ui.js';
import { saveGame } from './save-load.js';
import { checkLevelUp, meetNPC } from './game-logic.js';

// Start exploring the dungeon
export function explore() {
    // Check if player has enough energy to explore
    if (gameState.player.energy < 10) {
        alert('Vous êtes trop fatigué pour explorer le donjon ! Allez dormir à l\'auberge pour récupérer votre énergie.');
        return;
    }
    
    // Consume energy for exploring
    gameState.player.energy = Math.max(0, gameState.player.energy - 10);
    
    // Random encounter - 30% chance to meet an NPC, 70% chance to meet a monster
    const encounterRoll = Math.random();
    
    if (encounterRoll < 0.3) {
        // NPC encounter
        meetNPC();
    } else {
        // Monster encounter - select enemy based on player level but ensure we don't exceed array bounds
        const maxEnemyIndex = Math.min(enemies.length - 1, gameState.player.level);
        const enemyTemplate = enemies[Math.floor(Math.random() * (maxEnemyIndex + 1))];
        
        gameState.currentEnemy = {
            ...enemyTemplate,
            maxHealth: enemyTemplate.health
        };
        
        gameState.inCombat = true;
        gameState.defending = false;
        
        showScreen('combatScreen');
        document.getElementById('combatLog').innerHTML = '';
        addCombatLog(`Vous rencontrez un ${gameState.currentEnemy.name} !`, 'info');
        updateEnemyUI();
    }
    
    saveGame();
    updateUI();
}

// Player attacks enemy
export function attack() {
    if (!gameState.inCombat) return;
    
    const p = gameState.player;
    const e = gameState.currentEnemy;
    
    // Player attacks
    const playerDamage = Math.max(1, p.strength - e.defense + Math.floor(Math.random() * 5));
    e.health -= playerDamage;
    addCombatLog(`Vous infligez ${playerDamage} dégâts au ${e.name} !`, 'damage');
    
    if (e.health <= 0) {
        // Victory
        p.gold += e.gold;
        p.xp += e.xp;
        p.kills++;
        addCombatLog(`Victoire ! Vous gagnez ${e.gold} or et ${e.xp} XP !`, 'victory');
        
        checkLevelUp();
        
        // Check for victory condition (10 kills)
        if (p.kills >= 10) {
            setTimeout(() => showScreen('victoryScreen'), 2000);
        } else {
            setTimeout(() => {
                gameState.inCombat = false;
                showScreen('mainScreen');
            }, 2000);
        }
        
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
    
    let defense = p.defense;
    if (gameState.defending) {
        defense *= 2;
        gameState.defending = false;
    }
    
    const enemyDamage = Math.max(1, e.strength - defense + Math.floor(Math.random() * 5));
    p.health -= enemyDamage;
    addCombatLog(`Le ${e.name} vous inflige ${enemyDamage} dégâts !`, 'damage');
    
    if (p.health <= 0) {
        // Defeat
        p.health = 0;
        addCombatLog('Vous avez été vaincu...', 'damage');
        setTimeout(() => {
            p.health = Math.floor(p.maxHealth * 0.5);
            p.gold = Math.floor(p.gold * 0.5);
            gameState.inCombat = false;
            saveGame();
            updateUI();
            alert('Vous avez été vaincu ! Vous perdez la moitié de votre or et vous réveillez à l\'entrée du donjon.');
            showScreen('mainScreen');
        }, 1500);
    }
    
    updateUI();
}

// Player defends
export function defend() {
    if (!gameState.inCombat) return;
    
    gameState.defending = true;
    addCombatLog('Vous prenez une position défensive !', 'info');
    
    setTimeout(() => {
        enemyAttack();
    }, 1000);
}

// Try to flee from combat
export function flee() {
    if (!gameState.inCombat) return;
    
    const fleeChance = Math.random();
    if (fleeChance > 0.5) {
        addCombatLog('Vous fuyez le combat !', 'info');
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
