// UI Management Module
import { gameState, getStatModifier } from './game-state.js';
import { getPlayerSkills, isSkillOnCooldown, getSkillCooldown } from './skills.js';

// Update event banner UI
export function updateEventBanner() {
    // This will be implemented when scheduled-events module is imported
    if (!window.scheduledEventsModule) return;
    
    const { getNextEvent, getTimeUntilNextEvent, formatTimeRemaining, checkActiveEvent } = window.scheduledEventsModule;
    
    const banner = document.getElementById('eventBanner');
    if (!banner) return;
    
    const activeEvent = checkActiveEvent();
    const nextEvent = getNextEvent();
    
    if (activeEvent) {
        // Event is currently active
        banner.style.display = 'block';
        banner.classList.add('active-event');
        banner.classList.remove('upcoming-event');
        
        const timeRemaining = getTimeUntilNextEvent();
        const timeStr = formatTimeRemaining(timeRemaining);
        
        document.getElementById('eventBannerIcon').textContent = activeEvent.icon;
        document.getElementById('eventBannerText').textContent = `🎉 ÉVÉNEMENT ACTIF ! ${timeStr} restant`;
        document.getElementById('eventBannerDetails').textContent = `${activeEvent.name} - ${activeEvent.benefit}`;
    } else if (nextEvent) {
        // Show next upcoming event
        banner.style.display = 'block';
        banner.classList.remove('active-event');
        banner.classList.add('upcoming-event');
        
        const timeUntil = getTimeUntilNextEvent();
        const timeStr = formatTimeRemaining(timeUntil);
        
        const startTime = new Date(nextEvent.startTime);
        const hours = startTime.getHours().toString().padStart(2, '0');
        const minutes = startTime.getMinutes().toString().padStart(2, '0');
        
        document.getElementById('eventBannerIcon').textContent = nextEvent.icon;
        document.getElementById('eventBannerText').textContent = `Prochain événement dans ${timeStr}`;
        document.getElementById('eventBannerDetails').textContent = `${nextEvent.name} à ${hours}:${minutes}`;
    } else {
        // No events remaining today
        banner.style.display = 'none';
    }
}

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
    
    // Reset NPC screen layout when showing it
    if (screenId === 'npcScreen') {
        const eventInfo = document.getElementById('eventInfo');
        const npcContent = document.getElementById('npcContent');
        // Default to showing npcContent, individual functions will override if needed
        if (eventInfo) eventInfo.style.display = 'none';
        if (npcContent) npcContent.style.display = 'block';
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
    document.getElementById('playerLevel').textContent = `${p.level}/20`;
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
    
    // Update weapon damage display and icon
    const weaponDamage = p.weaponDamage || 0;
    const totalDamage = weaponDamage + strengthMod;
    document.getElementById('playerWeaponDamage').textContent = `${weaponDamage} (+${strengthMod >= 0 ? strengthMod : 0})`;
    
    // Update weapon icon based on class or equipped weapon
    const weaponIconEl = document.getElementById('weaponIcon');
    if (weaponIconEl) {
        let weaponIcon = '⚔️'; // default
        if (p.currentWeapon && p.currentWeapon.icon) {
            weaponIcon = p.currentWeapon.icon;
        } else {
            // Use class-specific weapon icon
            switch(p.class) {
                case 'guerrier': weaponIcon = '⚔️'; break;
                case 'archer': weaponIcon = '🏹'; break;
                case 'magicien': weaponIcon = '🔮'; break;
            }
        }
        weaponIconEl.textContent = weaponIcon;
    }
    
    // Show/hide mana bar for mages
    const manaRow = document.getElementById('manaRow');
    if (manaRow) {
        if (p.class === 'magicien') {
            manaRow.style.display = 'flex';
            document.getElementById('playerMana').textContent = `${p.mana}/${p.maxMana}`;
            const manaPercent = (p.mana / p.maxMana) * 100;
            document.getElementById('manaFill').style.width = manaPercent + '%';
        } else {
            manaRow.style.display = 'none';
        }
    }
    
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
    
    // Update stat points display
    const statPointsAvailable = document.getElementById('statPointsAvailable');
    const statPointsCount = document.getElementById('statPointsCount');
    if (statPointsAvailable && statPointsCount) {
        const points = p.statPoints || 0;
        if (points > 0) {
            statPointsAvailable.style.display = 'block';
            statPointsCount.textContent = points;
        } else {
            statPointsAvailable.style.display = 'none';
        }
    }
    
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

// Calculate difficulty indicator based on player vs enemy stats
function getDifficultyIndicator(enemy) {
    const p = gameState.player;
    
    // Calculate enemy power score
    const enemyPower = (enemy.health || 0) + (enemy.strength || 0) * 5 + (enemy.defense || 0) * 3;
    
    // Calculate player power score
    const playerPower = p.health + p.strength * 5 + p.defense * 3;
    
    // Calculate power ratio (enemy power relative to player power)
    const powerRatio = enemyPower / playerPower;
    
    // Determine difficulty level and assign indicator
    let indicator = '';
    let color = '';
    let title = '';
    
    if (powerRatio < 0.5) {
        // Very easy - light green
        indicator = '●';
        color = '#8ce99a';
        title = 'Très Facile';
    } else if (powerRatio < 0.8) {
        // Easy - green
        indicator = '●';
        color = '#51cf66';
        title = 'Facile';
    } else if (powerRatio < 1.2) {
        // Normal - yellow
        indicator = '●';
        color = '#ffd43b';
        title = 'Normal';
    } else if (powerRatio < 1.5) {
        // Hard - orange
        indicator = '●';
        color = '#ff922b';
        title = 'Difficile';
    } else if (powerRatio < 2.0) {
        // Very hard - red
        indicator = '●';
        color = '#ff6b6b';
        title = 'Très Difficile';
    } else {
        // Deadly - dark red
        indicator = '●';
        color = '#c92a2a';
        title = 'Mortel';
    }
    
    return { indicator, color, title };
}

// Update enemy UI
export function updateEnemyUI() {
    const e = gameState.currentEnemy;
    const icon = e.icon || '👹';
    
    // Check if this is dual combat
    const isDual = gameState.isDualCombat && gameState.currentEnemies && gameState.currentEnemies.length > 1;
    
    // Update first enemy (primary target)
    const enemyIconElement = document.getElementById('enemyIcon');
    if (enemyIconElement) {
        enemyIconElement.textContent = icon;
    }
    
    // Get difficulty indicator
    const difficulty = getDifficultyIndicator(e);
    
    // Build enemy name with difficulty indicator (no icon in name anymore)
    const enemyNameElement = document.getElementById('enemyName');
    let distanceIndicator = '';
    if (e.distance > 0) {
        distanceIndicator = ` <span style="color: #ff9800; font-size: 0.9em;">📍 À distance</span>`;
    }
    enemyNameElement.innerHTML = `${e.name} <span style="color: ${difficulty.color}; font-size: 1.2em; margin-left: 5px;" title="${difficulty.title}">${difficulty.indicator}</span>${distanceIndicator}`;
    
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
    
    // Handle second enemy display
    const enemyInfo2Element = document.getElementById('enemyInfo2');
    if (isDual) {
        // Show second enemy
        const e2 = gameState.currentEnemies[1];
        const icon2 = e2.icon || '👹';
        
        if (enemyInfo2Element) {
            enemyInfo2Element.style.display = 'block';
        }
        
        const enemyIcon2Element = document.getElementById('enemyIcon2');
        if (enemyIcon2Element) {
            enemyIcon2Element.textContent = icon2;
        }
        
        const difficulty2 = getDifficultyIndicator(e2);
        const enemyName2Element = document.getElementById('enemyName2');
        if (enemyName2Element) {
            let distanceIndicator2 = '';
            if (e2.distance > 0) {
                distanceIndicator2 = ` <span style="color: #ff9800; font-size: 0.9em;">📍 À distance</span>`;
            }
            enemyName2Element.innerHTML = `${e2.name} <span style="color: ${difficulty2.color}; font-size: 1.2em; margin-left: 5px;" title="${difficulty2.title}">${difficulty2.indicator}</span>${distanceIndicator2}`;
        }
        
        const enemyHealth2Element = document.getElementById('enemyHealth2');
        if (enemyHealth2Element) {
            enemyHealth2Element.textContent = `HP: ${e2.health}/${e2.maxHealth}`;
        }
        
        const enemyArmor2Element = document.getElementById('enemyArmor2');
        if (enemyArmor2Element) {
            const defenseMod2 = getStatModifier(e2.defense);
            enemyArmor2Element.textContent = `CA: ${e2.defense} (${defenseMod2 >= 0 ? '+' : ''}${defenseMod2})`;
        }
        
        const healthFill2Element = document.getElementById('enemyHealthFill2');
        if (healthFill2Element && e2.maxHealth > 0) {
            const healthPercent2 = Math.max(0, Math.min(100, (e2.health / e2.maxHealth) * 100));
            healthFill2Element.style.width = healthPercent2 + '%';
        }
    } else {
        // Hide second enemy
        if (enemyInfo2Element) {
            enemyInfo2Element.style.display = 'none';
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
    
    // Only show skills when defending (similar to inventory/potions)
    if (!gameState.defending) {
        skillsContainer.innerHTML = '<div style="margin-bottom: 5px; color: #DAA520; font-weight: bold;">⚡ Compétences Spéciales:</div><div style="color: #888; font-style: italic; font-size: 0.9em;">🛡️ Défendez-vous pour accéder à vos compétences</div>';
        return;
    }
    
    // When defending, show skills
    skillsContainer.innerHTML = '<div style="margin-bottom: 5px; color: #51cf66; font-weight: bold;">✅ ⚡ Compétences Spéciales - Accessibles:</div>';
    
    skills.forEach(skill => {
        const cooldown = getSkillCooldown(skill.id);
        const isOnCooldown = isSkillOnCooldown(skill.id);
        
        // Check if player has enough energy or mana
        let hasResource = false;
        let costText = '';
        if (skill.energyCost) {
            hasResource = player.energy >= skill.energyCost;
            costText = `${skill.energyCost} ⚡`;
        } else if (skill.manaCost) {
            hasResource = player.mana >= skill.manaCost;
            costText = `${skill.manaCost} 🔮`;
        }
        
        const canUse = !isOnCooldown && hasResource;
        
        const button = document.createElement('button');
        button.style.cssText = 'margin: 5px; padding: 8px 12px; font-size: 0.9em;';
        button.disabled = !canUse;
        
        let buttonText = `${skill.icon} ${skill.name}`;
        if (isOnCooldown) {
            buttonText += ` (${cooldown} tours)`;
            button.style.opacity = '0.5';
        } else {
            buttonText += ` (${costText})`;
        }
        
        if (!hasResource) {
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
    
    // Only show inventory contents when defending
    if (!gameState.defending) {
        if (currentSlots === 0) {
            container.innerHTML = `<div style="margin-bottom: 10px; color: #DAA520; font-weight: bold;">🎒 Sac (0/4):</div><div style="color: #888; font-style: italic; font-size: 0.9em;">Défendez-vous pour accéder à vos potions</div>`;
        } else {
            container.innerHTML = `<div style="margin-bottom: 10px; color: #DAA520; font-weight: bold;">🎒 Sac (${currentSlots}/4):</div><div style="color: #888; font-style: italic; font-size: 0.9em;">🛡️ Défendez-vous pour accéder à vos potions</div>`;
        }
        return;
    }
    
    // When defending, show inventory
    if (currentSlots === 0) {
        container.innerHTML = `<div style="margin-bottom: 10px; color: #DAA520; font-weight: bold;">🎒 Sac (0/4):</div><div style="color: #888; font-style: italic; font-size: 0.9em;">Aucun objet</div>`;
        
        // Add skip button when no items
        const skipButton = document.createElement('button');
        skipButton.textContent = '⏭️ Passer le tour';
        skipButton.style.cssText = 'margin-top: 10px;';
        skipButton.onclick = () => {
            if (window.skipDefendTurn) {
                window.skipDefendTurn();
            }
        };
        container.appendChild(skipButton);
        return;
    }
    
    container.innerHTML = `<div style="margin-bottom: 10px; color: #51cf66; font-weight: bold;">✅ 🎒 Sac (${currentSlots}/4) - Accessible:</div>`;
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
    
    // Add skip button option
    const skipButton = document.createElement('button');
    skipButton.textContent = '⏭️ Passer le tour';
    skipButton.style.cssText = 'margin-top: 10px;';
    skipButton.onclick = () => {
        if (window.skipDefendTurn) {
            window.skipDefendTurn();
        }
    };
    container.appendChild(skipButton);
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
            <button onclick="window.useInventoryItemFromPanel(${index})" style="padding: 4px 8px; font-size: 0.75em;">Utiliser</button>
        `;
        
        container.appendChild(itemDiv);
    });
}

// Toggle equipment modal
export function toggleEquipmentModal() {
    const modal = document.getElementById('equipmentModal');
    if (!modal) return;
    
    if (modal.style.display === 'none' || !modal.style.display) {
        modal.style.display = 'block';
        updateEquipmentModal();
    } else {
        modal.style.display = 'none';
    }
}

// Update equipment modal content
export function updateEquipmentModal() {
    const p = gameState.player;
    
    // Update character avatar based on gender and class
    const avatarEl = document.getElementById('characterAvatar');
    if (avatarEl) {
        let avatar = '🧙'; // default
        const isFemale = p.gender === 'female';
        
        switch(p.class) {
            case 'guerrier':
                avatar = isFemale ? '👸' : '🤴';
                break;
            case 'magicien':
                avatar = isFemale ? '🧙‍♀️' : '🧙‍♂️';
                break;
            case 'archer':
                avatar = isFemale ? '🏹👩' : '🏹👨';
                break;
        }
        avatarEl.textContent = avatar;
    }
    
    // Update weapon info
    const weaponIconEl = document.getElementById('equippedWeaponIcon');
    const weaponNameEl = document.getElementById('equippedWeaponName');
    const weaponDescEl = document.getElementById('equippedWeaponDesc');
    
    if (p.currentWeapon) {
        if (weaponIconEl) weaponIconEl.textContent = p.currentWeapon.icon;
        if (weaponNameEl) weaponNameEl.textContent = p.currentWeapon.name;
        if (weaponDescEl) weaponDescEl.textContent = p.currentWeapon.description;
    } else {
        if (weaponIconEl) weaponIconEl.textContent = '⚔️';
        if (weaponNameEl) weaponNameEl.textContent = 'Aucune arme';
        if (weaponDescEl) weaponDescEl.textContent = 'Visitez le marchand pour acheter une arme';
    }
    
    // Update armor info
    const armorNameEl = document.getElementById('equippedArmorName');
    const armorDescEl = document.getElementById('equippedArmorDesc');
    
    if (p.currentArmor) {
        if (armorNameEl) armorNameEl.textContent = p.currentArmor.name;
        if (armorDescEl) armorDescEl.textContent = p.currentArmor.description;
    } else {
        if (armorNameEl) armorNameEl.textContent = 'Aucune armure';
        if (armorDescEl) armorDescEl.textContent = 'Visitez le marchand pour acheter une armure';
    }
}
