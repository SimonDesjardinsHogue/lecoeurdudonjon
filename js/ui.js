// UI Management Module
import { gameState } from './game-state.js';
import { getPlayerSkills, isSkillOnCooldown, getSkillCooldown } from './skills.js';

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
    
    // Update skills UI when showing combat screen
    if (screenId === 'combatScreen') {
        updateSkillsUI();
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
    document.getElementById('playerDexterity').textContent = p.dexterity;
    document.getElementById('playerConstitution').textContent = p.constitution;
    document.getElementById('playerIntelligence').textContent = p.intelligence;
    document.getElementById('playerWisdom').textContent = p.wisdom;
    document.getElementById('playerCharisma').textContent = p.charisma;
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

// Update skills UI in combat
export function updateSkillsUI() {
    const skillsContainer = document.getElementById('skillsContainer');
    if (!skillsContainer) return;
    
    const skills = getPlayerSkills();
    if (!skills || skills.length === 0) {
        skillsContainer.innerHTML = '';
        return;
    }
    
    const player = gameState.player;
    
    skillsContainer.innerHTML = '<div style="margin-bottom: 5px; color: #DAA520; font-weight: bold;">⚡ Compétences Spéciales:</div>';
    
    skills.forEach(skill => {
        const cooldown = getSkillCooldown(skill.id);
        const isOnCooldown = isSkillOnCooldown(skill.id);
        const hasEnergy = player.energy >= skill.energyCost;
        const canUse = !isOnCooldown && hasEnergy;
        
        const button = document.createElement('button');
        button.style.cssText = 'margin: 5px; padding: 8px 12px; font-size: 0.9em;';
        button.disabled = !canUse;
        
        let buttonText = `${skill.icon} ${skill.name}`;
        if (isOnCooldown) {
            buttonText += ` (${cooldown} tours)`;
            button.style.opacity = '0.5';
        } else {
            buttonText += ` (${skill.energyCost} ⚡)`;
        }
        
        if (!hasEnergy) {
            button.style.opacity = '0.5';
        }
        
        button.textContent = buttonText;
        button.title = skill.description;
        button.onclick = () => {
            if (window.useSkill) {
                window.useSkill(skill.id);
            }
        };
        
        skillsContainer.appendChild(button);
    });
}
