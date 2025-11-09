// UI Management Module
import { gameState, getStatModifier } from './game-state.js';
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
        updateCombatInventoryUI();
    }
    
    // Update inventory UI when showing shop screen
    if (screenId === 'shopScreen') {
        updateShopInventoryUI();
    }
}

// Update UI with current game state
export function updateUI() {
    const p = gameState.player;
    document.getElementById('playerName').textContent = p.name || '---';
    document.getElementById('playerLevel').textContent = p.level;
    document.getElementById('playerGold').textContent = p.gold + ' 💰';
    document.getElementById('playerHealth').textContent = `${p.health}/${p.maxHealth}`;
    
    // Display stats with modifiers
    const strengthMod = getStatModifier(p.strength);
    const defenseMod = getStatModifier(p.defense);
    const dexterityMod = getStatModifier(p.dexterity);
    const constitutionMod = getStatModifier(p.constitution);
    const intelligenceMod = getStatModifier(p.intelligence);
    const wisdomMod = getStatModifier(p.wisdom);
    const charismaMod = getStatModifier(p.charisma);
    
    document.getElementById('playerStrength').textContent = `${p.strength} (${strengthMod >= 0 ? '+' : ''}${strengthMod})`;
    document.getElementById('playerDefense').textContent = `${p.defense} (${defenseMod >= 0 ? '+' : ''}${defenseMod})`;
    document.getElementById('playerDexterity').textContent = `${p.dexterity} (${dexterityMod >= 0 ? '+' : ''}${dexterityMod})`;
    document.getElementById('playerConstitution').textContent = `${p.constitution} (${constitutionMod >= 0 ? '+' : ''}${constitutionMod})`;
    document.getElementById('playerIntelligence').textContent = `${p.intelligence} (${intelligenceMod >= 0 ? '+' : ''}${intelligenceMod})`;
    document.getElementById('playerWisdom').textContent = `${p.wisdom} (${wisdomMod >= 0 ? '+' : ''}${wisdomMod})`;
    document.getElementById('playerCharisma').textContent = `${p.charisma} (${charismaMod >= 0 ? '+' : ''}${charismaMod})`;
    
    document.getElementById('playerXP').textContent = `${p.xp}/${p.xpToLevel}`;
    document.getElementById('playerEnergy').textContent = `${p.energy}/${p.maxEnergy}`;
    
    // Update character info
    const classDisplay = p.classIcon ? `${p.classIcon} ${p.className || p.class}` : (p.className || p.class);
    document.getElementById('playerClass').textContent = classDisplay;
    
    const raceDisplay = p.raceIcon ? `${p.raceIcon} ${p.raceName || p.race}` : (p.raceName || p.race);
    document.getElementById('playerRace').textContent = raceDisplay;
    
    const genderDisplay = p.gender === 'female' ? '♀️ Féminin' : '♂️ Masculin';
    document.getElementById('playerGender').textContent = genderDisplay;
    
    // Update health bar
    const healthPercent = (p.health / p.maxHealth) * 100;
    document.getElementById('healthFill').style.width = healthPercent + '%';
    
    // Update XP bar
    const xpPercent = (p.xp / p.xpToLevel) * 100;
    document.getElementById('xpFill').style.width = xpPercent + '%';
    
    // Update energy bar
    const energyPercent = (p.energy / p.maxEnergy) * 100;
    document.getElementById('energyFill').style.width = energyPercent + '%';
    
    // Update inventory count in characteristics section
    const inventoryCountEl = document.getElementById('inventoryCount');
    if (inventoryCountEl) {
        const currentSlots = p.inventory ? p.inventory.length : 0;
        inventoryCountEl.textContent = `${currentSlots}/4`;
    }
    
    // Update inventory panel if it's visible
    const inventoryPanel = document.getElementById('inventoryPanel');
    if (inventoryPanel && inventoryPanel.style.display !== 'none') {
        updateInventoryPanel();
    }
}

// Update enemy UI
export function updateEnemyUI() {
    const e = gameState.currentEnemy;
    const icon = e.icon || '👹';
    document.getElementById('enemyName').textContent = `${icon} ${e.name}`;
    document.getElementById('enemyHealth').textContent = `HP: ${e.health}/${e.maxHealth}`;
    
    // Add armor class display
    const enemyArmorElement = document.getElementById('enemyArmor');
    if (enemyArmorElement) {
        const defenseMod = getStatModifier(e.defense);
        enemyArmorElement.textContent = `CA: ${e.defense} (${defenseMod >= 0 ? '+' : ''}${defenseMod})`;
    }
    
    // Remove fade-out class from previous combat to ensure health bar is visible
    const enemyInfoElement = document.getElementById('enemyInfo');
    if (enemyInfoElement) {
        enemyInfoElement.classList.remove('fade-out');
    }
    
    // Ensure health bar is always visible by checking element exists and health values are valid
    const healthFillElement = document.getElementById('enemyHealthFill');
    if (healthFillElement && e.maxHealth > 0) {
        const healthPercent = Math.max(0, Math.min(100, (e.health / e.maxHealth) * 100));
        healthFillElement.style.width = healthPercent + '%';
        // Ensure the health bar container is visible
        const healthBarElement = healthFillElement.parentElement;
        if (healthBarElement) {
            healthBarElement.style.display = 'block';
        }
    }
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

// Update inventory UI in combat screen
export function updateCombatInventoryUI() {
    const container = document.getElementById('combatInventoryContainer');
    if (!container) return;
    
    const p = gameState.player;
    const currentSlots = p.inventory ? p.inventory.length : 0;
    const maxSlots = 4;
    
    if (currentSlots === 0) {
        container.innerHTML = `<div style="margin-bottom: 10px; color: #DAA520; font-weight: bold;">🎒 Sac (0/4):</div><div style="color: #888; font-style: italic; font-size: 0.9em;">Aucun objet</div>`;
        return;
    }
    
    container.innerHTML = `<div style="margin-bottom: 10px; color: #DAA520; font-weight: bold;">🎒 Sac (${currentSlots}/4):</div>`;
    const inventoryDiv = document.createElement('div');
    inventoryDiv.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';
    
    p.inventory.forEach((item, index) => {
        const button = document.createElement('button');
        button.style.cssText = 'padding: 8px 12px; font-size: 0.9em;';
        button.textContent = `${item.icon} ${item.name}`;
        button.title = item.description;
        button.onclick = () => {
            if (window.useCombatPotion) {
                window.useCombatPotion(index);
            }
        };
        inventoryDiv.appendChild(button);
    });
    
    container.appendChild(inventoryDiv);
}

// Update inventory UI in shop screen (for selling)
export function updateShopInventoryUI() {
    const container = document.getElementById('shopInventoryContainer');
    if (!container) return;
    
    const p = gameState.player;
    if (!p.inventory || p.inventory.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = '<div class="story-text"><h3>🎒 Votre Sac</h3><p style="font-style: italic; color: #888;">Le marchand achète vos objets à 50% de leur valeur.</p></div>';
    
    p.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        const sellPrice = Math.floor(item.cost * 0.5);
        
        itemDiv.innerHTML = `
            <div class="shop-item-info">
                <strong>${item.icon} ${item.name}</strong><br>
                <small>${item.description}</small>
            </div>
            <div class="shop-item-price">${sellPrice} 💰 (50%)</div>
            <button onclick="window.sellInventoryItem(${index})">Vendre</button>
        `;
        
        container.appendChild(itemDiv);
    });
}

// Toggle inventory panel in characteristics section
export function toggleInventoryPanel() {
    const panel = document.getElementById('inventoryPanel');
    if (!panel) return;
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        updateInventoryPanel();
    } else {
        panel.style.display = 'none';
    }
}

// Update inventory panel content
export function updateInventoryPanel() {
    const container = document.getElementById('inventoryPanelContent');
    if (!container) return;
    
    const p = gameState.player;
    if (!p.inventory || p.inventory.length === 0) {
        container.innerHTML = '<div style="color: #888; font-style: italic; font-size: 0.9em; text-align: center;">Aucun objet</div>';
        return;
    }
    
    container.innerHTML = '';
    
    p.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 3px; margin-bottom: 5px;';
        
        itemDiv.innerHTML = `
            <div style="flex: 1;">
                <strong>${item.icon} ${item.name}</strong><br>
                <small style="color: #999;">${item.description}</small>
            </div>
            <button onclick="window.useInventoryItemFromPanel(${index})" style="padding: 6px 12px; font-size: 0.85em;">Utiliser</button>
        `;
        
        container.appendChild(itemDiv);
    });
}
