// UI Management Module
import { gameState } from './game-state.js';

// Show specific screen
export function showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    if (screenId !== 'startScreen') {
        document.getElementById('gameStats').style.display = 'grid';
    } else {
        document.getElementById('gameStats').style.display = 'none';
    }
}

// Update UI with current game state
export function updateUI() {
    const p = gameState.player;
    document.getElementById('playerName').textContent = p.name || '---';
    document.getElementById('playerLevel').textContent = p.level;
    document.getElementById('playerGold').textContent = p.gold + ' 💰';
    document.getElementById('playerHealth').textContent = `${p.health}/${p.maxHealth}`;
    document.getElementById('playerStrength').textContent = p.strength;
    document.getElementById('playerDefense').textContent = p.defense;
    document.getElementById('playerXP').textContent = `${p.xp}/${p.xpToLevel}`;
    document.getElementById('playerEnergy').textContent = `${p.energy}/${p.maxEnergy}`;
    
    // Update health bar
    const healthPercent = (p.health / p.maxHealth) * 100;
    document.getElementById('healthFill').style.width = healthPercent + '%';
    
    // Update XP bar
    const xpPercent = (p.xp / p.xpToLevel) * 100;
    document.getElementById('xpFill').style.width = xpPercent + '%';
    
    // Update energy bar
    const energyPercent = (p.energy / p.maxEnergy) * 100;
    document.getElementById('energyFill').style.width = energyPercent + '%';
}

// Update enemy UI
export function updateEnemyUI() {
    const e = gameState.currentEnemy;
    const icon = e.icon || '👹';
    document.getElementById('enemyName').textContent = `${icon} ${e.name}`;
    document.getElementById('enemyHealth').textContent = `HP: ${e.health}/${e.maxHealth}`;
    
    const healthPercent = (e.health / e.maxHealth) * 100;
    document.getElementById('enemyHealthFill').style.width = healthPercent + '%';
}

// Add combat log message
export function addCombatLog(message, type = '') {
    const log = document.getElementById('combatLog');
    const p = document.createElement('p');
    p.textContent = message;
    if (type) p.classList.add(type);
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

// Show save indicator
export function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    if (indicator) {
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
}
