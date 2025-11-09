// Game Logic Module
import { gameState, shopItems, rareItems, npcs, rarities, generateRandomStats, statNames, hasRandomStats, metals, getStatModifier } from './game-state.js';
import { updateUI, addCombatLog, showScreen } from './ui.js';
import { saveGame, loadGame } from './save-load.js';
import { characterClasses, applyCharacterClass } from './character-classes.js';
import { characterRaces, applyRaceModifiers } from './character-races.js';
import { characterSexes, applySexBaseStats } from './character-sexes.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';
import { initializeDailyQuests, checkDailyReset, updateQuestProgress, showDailyQuestsScreen } from './daily-quests.js';
import { initAchievements, trackAchievementProgress, checkAchievements } from './achievements.js';
import { runBalanceTests, formatReportAsHTML } from './balance-tester.js';
import { submitScore, fetchLeaderboard, getNetworkState } from './network.js';

// Helper function to get class display name
function getClassDisplayName(classKey) {
    return characterClasses[classKey]?.name || classKey;
}

// Set up shop item effects
export function initializeShopItems() {
    // Healing potions (8 tiers)
    shopItems[0].effect = () => healPlayer(20);   // Potion de Soin Minuscule
    shopItems[1].effect = () => healPlayer(40);   // Petite Potion de Soin
    shopItems[2].effect = () => healPlayer(60);   // Potion de Soin
    shopItems[3].effect = () => healPlayer(90);   // Grande Potion de Soin
    shopItems[4].effect = () => healPlayer(120);  // Potion de Soin Majeure
    shopItems[5].effect = () => healPlayer(160);  // Potion de Soin Suprême
    shopItems[6].effect = () => healPlayer(220);  // Potion de Soin Ultime
    shopItems[7].effect = () => healPlayer(300);  // Élixir de Soin Divin
    
    // Damage potions (8 tiers)
    shopItems[8].effect = () => { gameState.player.strength += 1; };   // Potion de Force Minuscule
    shopItems[9].effect = () => { gameState.player.strength += 3; };   // Potion de Force Mineure
    shopItems[10].effect = () => { gameState.player.strength += 5; };  // Potion de Force
    shopItems[11].effect = () => { gameState.player.strength += 7; };  // Potion de Force Supérieure
    shopItems[12].effect = () => { gameState.player.strength += 9; };  // Potion de Force Majeure
    shopItems[13].effect = () => { gameState.player.strength += 10; }; // Potion de Force Extrême
    shopItems[14].effect = () => { gameState.player.strength += 12; }; // Potion de Force Titanesque
    shopItems[15].effect = () => { gameState.player.strength += 15; }; // Potion de Force Divine
    
    // Energy potions (3 tiers)
    shopItems[16].effect = () => restoreEnergy(30);  // Potion d'Énergie Mineure
    shopItems[17].effect = () => restoreEnergy(50);  // Potion d'Énergie
    shopItems[18].effect = () => restoreEnergy(100); // Potion d'Énergie Majeure
    
    // Experience potions (3 tiers)
    shopItems[19].effect = () => addExperience(30);  // Potion d'Expérience Mineure
    shopItems[20].effect = () => addExperience(60);  // Potion d'Expérience
    shopItems[21].effect = () => addExperience(120); // Potion d'Expérience Majeure
    
    // Weapons for Guerrier (8 tiers)
    shopItems[22].effect = () => { gameState.player.strength += 1; };  // Épée Rouillée
    shopItems[23].effect = () => { gameState.player.strength += 3; };  // Épée en Fer
    shopItems[24].effect = () => { gameState.player.strength += 5; };  // Épée en Acier
    shopItems[25].effect = () => { gameState.player.strength += 7; };  // Épée Enchantée
    shopItems[26].effect = () => { gameState.player.strength += 9; };  // Épée Flamboyante
    shopItems[27].effect = () => { gameState.player.strength += 10; }; // Épée Runique
    shopItems[28].effect = () => { gameState.player.strength += 12; }; // Épée Légendaire
    shopItems[29].effect = () => { gameState.player.strength += 15; }; // Épée Divine
    
    // Weapons for Archer (8 tiers)
    shopItems[30].effect = () => { gameState.player.strength += 1; };  // Arc Basique
    shopItems[31].effect = () => { gameState.player.strength += 3; };  // Arc Court
    shopItems[32].effect = () => { gameState.player.strength += 5; };  // Arc Long
    shopItems[33].effect = () => { gameState.player.strength += 7; };  // Arc Composite
    shopItems[34].effect = () => { gameState.player.strength += 9; };  // Arc Elfique
    shopItems[35].effect = () => { gameState.player.strength += 10; }; // Arc Runique
    shopItems[36].effect = () => { gameState.player.strength += 12; }; // Arc Légendaire
    shopItems[37].effect = () => { gameState.player.strength += 15; }; // Arc du Chasseur Divin
    
    // Weapons for Magicien (8 tiers)
    shopItems[38].effect = () => { gameState.player.strength += 1; };  // Bâton de Bois
    shopItems[39].effect = () => { gameState.player.strength += 3; };  // Bâton d'Apprenti
    shopItems[40].effect = () => { gameState.player.strength += 5; };  // Bâton Mystique
    shopItems[41].effect = () => { gameState.player.strength += 7; };  // Bâton Enchanté
    shopItems[42].effect = () => { gameState.player.strength += 9; };  // Bâton de Pouvoir
    shopItems[43].effect = () => { gameState.player.strength += 10; }; // Bâton Runique
    shopItems[44].effect = () => { gameState.player.strength += 12; }; // Bâton Légendaire
    shopItems[45].effect = () => { gameState.player.strength += 15; }; // Bâton de l'Archimage
    
    // Weapons for Rogue (8 tiers)
    shopItems[46].effect = () => { gameState.player.strength += 1; };  // Dague Émoussée
    shopItems[47].effect = () => { gameState.player.strength += 3; };  // Dague Affûtée
    shopItems[48].effect = () => { gameState.player.strength += 5; };  // Dague en Acier
    shopItems[49].effect = () => { gameState.player.strength += 7; };  // Dague Empoisonnée
    shopItems[50].effect = () => { gameState.player.strength += 9; };  // Dague de l'Ombre
    shopItems[51].effect = () => { gameState.player.strength += 10; }; // Dague Runique
    shopItems[52].effect = () => { gameState.player.strength += 12; }; // Dague Légendaire
    shopItems[53].effect = () => { gameState.player.strength += 15; }; // Dague de l'Assassin Suprême
    
    // Armors (8 tiers)
    shopItems[54].effect = () => { gameState.player.defense += 1; };  // Armure en Tissu
    shopItems[55].effect = () => { gameState.player.defense += 3; };  // Armure de Cuir
    shopItems[56].effect = () => { gameState.player.defense += 5; };  // Armure Clouée
    shopItems[57].effect = () => { gameState.player.defense += 7; };  // Cotte de Mailles
    shopItems[58].effect = () => { gameState.player.defense += 9; };  // Armure d'Acier
    shopItems[59].effect = () => { gameState.player.defense += 10; }; // Armure Enchantée
    shopItems[60].effect = () => { gameState.player.defense += 12; }; // Armure Runique
    shopItems[61].effect = () => { gameState.player.defense += 15; }; // Armure Divine
    
    // Rare items
    rareItems[0].effect = () => { // Élixir de Résurrection
        gameState.player.health = gameState.player.maxHealth;
        gameState.player.energy = gameState.player.maxEnergy;
    };
    rareItems[1].effect = () => { gameState.player.strength += 12; }; // Potion de Géant
    rareItems[2].effect = () => { // Armure Runique
        const p = gameState.player;
        p.defense += 8;
        p.strength += 2;
        p.dexterity += 2;
        p.constitution += 2;
        p.intelligence += 2;
        p.wisdom += 2;
        p.charisma += 2;
    };
    rareItems[3].effect = () => { // Amulette de Fortune
        gameState.player.gold += 100;
        gameState.player.charisma += 5;
    };
    rareItems[4].effect = () => { // Grimoire Ancien
        gameState.player.intelligence += 10;
        addExperience(200);
    };
}

// Check energy regeneration (6:00 AM Toronto time)
export function checkEnergyRegeneration() {
    const p = gameState.player;
    
    // If player hasn't slept yet, return
    if (!p.lastSleepTime) {
        return;
    }
    
    // Get current time in Toronto timezone (EST/EDT - UTC-5 or UTC-4)
    const now = new Date();
    const torontoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    const lastSleep = new Date(p.lastSleepTime);
    
    // Calculate the next 6 AM after last sleep
    const nextRegeneration = new Date(lastSleep);
    nextRegeneration.setHours(6, 0, 0, 0);
    
    // If last sleep was after 6 AM, add one day
    if (lastSleep.getHours() >= 6) {
        nextRegeneration.setDate(nextRegeneration.getDate() + 1);
    }
    
    // Check if current time is past the regeneration time
    if (torontoTime >= nextRegeneration) {
        // Regenerate energy to full
        p.energy = p.maxEnergy;
        p.lastSleepTime = torontoTime.toISOString();
        saveGame();
        updateUI();
    }
}

// Initialize game
export function init() {
    loadGame();
    initializeShopItems();
    initializeDailyQuests();
    initAchievements();
    checkEnergyRegeneration();
    checkDailyReset();
    checkAchievements();
    updateUI();
    
    // Show restore button if save exists
    const hasSave = localStorage.getItem('lecoeurdudonjon_save');
    const restoreBtn = document.getElementById('restoreSaveBtn');
    if (hasSave && restoreBtn) {
        restoreBtn.style.display = 'inline-block';
    }
}

// Start new game
export function startGame() {
    const name = document.getElementById('nameInput').value.trim();
    if (!name) {
        alert('Veuillez entrer un nom pour votre héros !');
        return;
    }
    
    // Get selected character gender
    const selectedGender = document.querySelector('input[name="characterGender"]:checked');
    if (!selectedGender) {
        alert('Veuillez choisir un genre pour votre personnage !');
        return;
    }
    
    // Get selected character race
    const selectedRace = document.querySelector('input[name="characterRace"]:checked');
    if (!selectedRace) {
        alert('Veuillez choisir une race pour votre personnage !');
        return;
    }
    
    // Get selected character class
    const selectedClass = document.querySelector('input[name="characterClass"]:checked');
    if (!selectedClass) {
        alert('Veuillez choisir une classe de personnage !');
        return;
    }
    
    gameState.player.name = name;
    gameState.player.gender = selectedGender.value;
    gameState.player.gamesPlayed++;
    
    // Apply sex-based base stats first
    applySexBaseStats(gameState.player, selectedGender.value);
    
    // Apply character class (overrides base stats)
    applyCharacterClass(gameState.player, selectedClass.value);
    
    // Then apply race modifiers on top
    applyRaceModifiers(gameState.player, selectedRace.value);
    
    saveGame();
    showScreen('mainScreen');
    updateUI();
}

// Heal player
export function healPlayer(amount) {
    const p = gameState.player;
    const oldHealth = p.health;
    
    // Wisdom increases healing effectiveness: +5% per wisdom modifier point
    const wisdomMod = getStatModifier(p.wisdom);
    const healingBonus = 1 + (wisdomMod * 0.05);
    const finalAmount = Math.floor(amount * healingBonus);
    
    p.health = Math.min(p.maxHealth, p.health + finalAmount);
    
    // Only play sound and particles if actually healed
    if (p.health > oldHealth) {
        audioManager.playSound('heal');
        const healthElement = document.getElementById('playerHealth');
        if (healthElement) {
            particleSystem.createHealEffect(healthElement.parentElement);
        }
    }
    
    saveGame();
    updateUI();
}

// Restore energy
export function restoreEnergy(amount) {
    const p = gameState.player;
    
    // Wisdom increases energy restoration: +5% per wisdom modifier point
    const wisdomMod = getStatModifier(p.wisdom);
    const energyBonus = 1 + (wisdomMod * 0.05);
    const finalAmount = Math.floor(amount * energyBonus);
    
    p.energy = Math.min(p.maxEnergy, p.energy + finalAmount);
    saveGame();
    updateUI();
}

// Add experience
export function addExperience(amount) {
    const p = gameState.player;
    p.xp += amount;
    checkLevelUp();
    saveGame();
    updateUI();
}

// Rest at the inn
export function rest() {
    const p = gameState.player;
    const cost = 20;
    
    if (p.gold < cost) {
        alert('Vous n\'avez pas assez d\'or pour dormir à l\'auberge ! (Coût: 20 or)');
        return;
    }
    
    // Build confirmation message
    let confirmMessage = 'Voulez-vous dormir à l\'auberge pour 20 or ?\n\n';
    confirmMessage += 'Vos points de vie seront restaurés.\n';
    
    // Add warning if player still has energy
    if (p.energy > 0) {
        confirmMessage += `\n⚠️ Attention : Vous avez encore ${p.energy} points d'énergie. Ils seront perdus si vous dormez maintenant.`;
    }
    
    // Ask for confirmation
    if (!confirm(confirmMessage)) {
        return;  // User cancelled
    }
    
    // Proceed with sleep
    p.gold -= cost;
    p.health = p.maxHealth;
    p.energy = 0;  // Set energy to 0 - player must wait until 6 AM Toronto time
    
    // Set last sleep time to current Toronto time
    const now = new Date();
    const torontoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    p.lastSleepTime = torontoTime.toISOString();
    
    saveGame();
    updateUI();
    
    // Calculate next 6 AM
    const next6AM = new Date(torontoTime);
    next6AM.setHours(6, 0, 0, 0);
    if (torontoTime.getHours() >= 6) {
        next6AM.setDate(next6AM.getDate() + 1);
    }
    
    const options = { 
        timeZone: 'America/Toronto',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const next6AMString = next6AM.toLocaleString('fr-FR', options);
    
    alert(`Vous dormez à l'auberge jusqu'à demain 6h00 du matin (heure de Toronto). Vos points de vie sont restaurés ! Vous pourrez reprendre l'aventure à ${next6AMString}. (-20 or)`);
}

// Check level up
export function checkLevelUp() {
    const p = gameState.player;
    if (p.xp >= p.xpToLevel) {
        p.level++;
        p.xp -= p.xpToLevel;
        p.xpToLevel = Math.floor(p.xpToLevel * 1.5);
        
        // Stat increases
        p.maxHealth += 20;
        p.health = p.maxHealth;
        p.strength += 5;
        p.defense += 3;
        
        addCombatLog(`🎉 Niveau supérieur ! Vous êtes maintenant niveau ${p.level} !`, 'victory');
        
        // Play level up sound and show particles
        audioManager.playSound('levelup');
        particleSystem.createLevelUpEffect();
        
        // Check achievements after level up
        checkAchievements();
        
        saveGame();
        updateUI();
    }
}

// Show shop
export function showShop(filterCategory = 'all', filterByClass = true) {
    showScreen('shopScreen');
    const shopDiv = document.getElementById('shopItems');
    shopDiv.innerHTML = '';
    
    // Add filter dropdown and checkbox
    const filterContainer = document.createElement('div');
    filterContainer.style.marginBottom = '20px';
    filterContainer.style.display = 'flex';
    filterContainer.style.flexWrap = 'wrap';
    filterContainer.style.gap = '15px';
    filterContainer.style.alignItems = 'center';
    filterContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <label for="categoryFilter" style="color: #DAA520;">Type de produit :</label>
            <select id="categoryFilter" onchange="window.showShop(this.value, document.getElementById('classFilter').checked)" style="padding: 8px; background: rgba(0, 0, 0, 0.7); color: #f0f0f0; border: 2px solid #8B4513; border-radius: 5px; font-family: 'Courier New', monospace; cursor: pointer;">
                <option value="all" ${filterCategory === 'all' ? 'selected' : ''}>🏪 Tous les produits</option>
                <option value="heal" ${filterCategory === 'heal' ? 'selected' : ''}>❤️ Soin</option>
                <option value="damage" ${filterCategory === 'damage' ? 'selected' : ''}>⚔️ Force</option>
                <option value="energy" ${filterCategory === 'energy' ? 'selected' : ''}>⚡ Énergie</option>
                <option value="exp" ${filterCategory === 'exp' ? 'selected' : ''}>✨ Expérience</option>
                <option value="shield" ${filterCategory === 'shield' ? 'selected' : ''}>🛡️ Boucliers</option>
                <option value="weapon" ${filterCategory === 'weapon' ? 'selected' : ''}>⚔️ Armes</option>
                <option value="armor" ${filterCategory === 'armor' ? 'selected' : ''}>🛡️ Armures</option>
            </select>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="classFilter" ${filterByClass ? 'checked' : ''} onchange="window.showShop(document.getElementById('categoryFilter').value, this.checked)" style="cursor: pointer; width: 18px; height: 18px;">
            <label for="classFilter" style="color: #DAA520; cursor: pointer;">Objets pour ma classe uniquement</label>
        </div>
    `;
    shopDiv.appendChild(filterContainer);
    
    // Filter items based on category or type
    let filteredItems = filterCategory === 'all' 
        ? shopItems 
        : shopItems.filter(item => {
            // For equipment types (shield, weapon, armor), check the type field
            if (filterCategory === 'shield' || filterCategory === 'weapon' || filterCategory === 'armor') {
                return item.type === filterCategory;
            }
            // For other categories (heal, damage, energy, exp), check the category field
            return item.category === filterCategory;
        });
    
    // Additional filter by class compatibility if checkbox is checked
    if (filterByClass) {
        filteredItems = filteredItems.filter(item => {
            // Show item if it has no class restriction (usable by all)
            // OR if the class restriction matches the player's class
            return !item.classRestriction || item.classRestriction === gameState.player.class;
        });
    }
    
    if (filteredItems.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun produit dans cette catégorie.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '20px';
        shopDiv.appendChild(emptyMsg);
    } else {
        filteredItems.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            const icon = item.icon || '📦';
            
            // Find the original index in shopItems array
            const originalIndex = shopItems.indexOf(item);
            
            // Generate random stats for preview (not applied until purchase)
            const previewStats = hasRandomStats(item) ? generateRandomStats(item.rarity) : null;
            
            // Check if item has rarity and apply styling
            let rarityInfo = '';
            let rarityColor = '#f0f0f0';
            if (item.rarity && rarities[item.rarity]) {
                const rarityData = rarities[item.rarity];
                rarityColor = rarityData.color;
                rarityInfo = `<span style="color: ${rarityColor}; font-weight: bold;">[${rarityData.name}]</span><br>`;
                itemDiv.style.borderColor = rarityColor;
                itemDiv.style.borderWidth = '2px';
                // Add CSS class for rarity-based styling
                itemDiv.classList.add(`rarity-${item.rarity}`);
            }
            
            // Build random stats description
            let randomStatsInfo = '';
            if (previewStats && Object.keys(previewStats).length > 0) {
                const statsText = Object.entries(previewStats)
                    .map(([stat, value]) => `+${value} ${statNames[stat]}`)
                    .join(', ');
                randomStatsInfo = `<br><small style="color: ${rarityColor};">✨ ${statsText}</small>`;
            }
            
            // Check if item has class restriction
            let classInfo = '';
            let isDisabled = false;
            if (item.classRestriction) {
                const className = getClassDisplayName(item.classRestriction);
                classInfo = `<br><small style="color: #DAA520;">Pour: ${className}</small>`;
                
                // Disable if player is not this class
                if (item.classRestriction !== gameState.player.class) {
                    isDisabled = true;
                    itemDiv.classList.add('shop-item-disabled');
                }
            }
            
            // Calculate discounted price based on charisma
            const charismaMod = getStatModifier(gameState.player.charisma);
            const discount = Math.min(0.20, Math.max(0, charismaMod * 0.02));
            const finalCost = Math.floor(item.cost * (1 - discount));
            
            // Build price display with discount info
            let priceDisplay = `${finalCost} 💰`;
            if (discount > 0) {
                priceDisplay = `<span style="text-decoration: line-through; color: #888;">${item.cost}</span> ${finalCost} 💰<br><small style="color: #51cf66;">-${Math.floor(discount * 100)}% (Charisme)</small>`;
            }
            
            itemDiv.innerHTML = `
                <div class="shop-item-info">
                    <strong style="color: ${rarityColor};">${icon} ${item.name}</strong><br>
                    ${rarityInfo}
                    <small>${item.description}</small>${randomStatsInfo}${classInfo}
                </div>
                <div class="shop-item-price">${priceDisplay}</div>
                <button onclick="window.buyItem(${originalIndex})" ${isDisabled ? 'disabled' : ''}>Acheter</button>
            `;
            shopDiv.appendChild(itemDiv);
        });
    }
}

// Buy item
export function buyItem(index) {
    const item = shopItems[index];
    const p = gameState.player;
    
    // Check class restriction for weapons
    if (item.classRestriction && item.classRestriction !== p.class) {
        const className = getClassDisplayName(item.classRestriction);
        alert(`Cet objet est réservé à la classe ${className} !`);
        return;
    }
    
    // Charisma reduces shop prices: -2% per charisma modifier point (max 20% discount)
    const charismaMod = getStatModifier(p.charisma);
    const discount = Math.min(0.20, Math.max(0, charismaMod * 0.02));
    const finalCost = Math.floor(item.cost * (1 - discount));
    
    if (p.gold >= finalCost) {
        p.gold -= finalCost;
        
        // Check if item is a potion that should go to inventory
        const isPotionForInventory = item.type === 'potion' && (item.category === 'heal' || item.category === 'energy');
        
        if (isPotionForInventory) {
            // Add to inventory if there's space
            if (!p.inventory) {
                p.inventory = [];
            }
            if (p.inventory.length < 4) {
                // Store item with its shop index for later use
                p.inventory.push({
                    shopIndex: index,
                    name: item.name,
                    icon: item.icon,
                    description: item.description,
                    cost: item.cost,
                    category: item.category,
                    type: item.type
                });
            } else {
                alert('Votre sac est plein ! (maximum 4 objets)');
                p.gold += finalCost; // Refund
                return;
            }
        } else {
            // Use item immediately (equipment, damage potions, exp potions, etc.)
            item.effect();
            
            // Track weapon damage for display in UI
            if (item.type === 'weapon' && item.bonus) {
                p.weaponDamage = item.bonus;
            }
            
            // Generate and apply random stats for rare+ items at purchase time
            const randomStats = hasRandomStats(item) ? generateRandomStats(item.rarity) : null;
            if (randomStats && Object.keys(randomStats).length > 0) {
                Object.entries(randomStats).forEach(([stat, value]) => {
                    if (p[stat] !== undefined) {
                        p[stat] += value;
                    }
                });
            }
        }
        
        // Play purchase sound
        audioManager.playSound('purchase');
        
        // Update quest progress for shop purchases
        updateQuestProgress('shop', 1);
        
        // Track item purchase for achievements
        trackAchievementProgress('item_bought', 1);
        checkAchievements();
        
        saveGame();
        updateUI();
        
        // Build confirmation message
        let message = isPotionForInventory ? 
            `${item.name} ajouté à votre sac !` :
            `Vous avez acheté ${item.name} !`;
        if (discount > 0) {
            const savedGold = item.cost - finalCost;
            message += ` (Réduction de ${Math.floor(discount * 100)}% grâce à votre charisme: -${savedGold} or)`;
        }
        if (!isPotionForInventory) {
            const randomStats = hasRandomStats(item) ? generateRandomStats(item.rarity) : null;
            if (randomStats && Object.keys(randomStats).length > 0) {
                const statsText = Object.entries(randomStats)
                    .map(([stat, value]) => `+${value} ${statNames[stat]}`)
                    .join(', ');
                message += `\n✨ Bonus: ${statsText}`;
            }
        }
        alert(message);
        
        // Refresh shop with current filter state
        // Null checks are needed because this function may be called when shop screen is not active
        const categoryFilter = document.getElementById('categoryFilter');
        const classFilter = document.getElementById('classFilter');
        const currentCategory = categoryFilter ? categoryFilter.value : 'all';
        const currentClassFilter = classFilter ? classFilter.checked : false;
        showShop(currentCategory, currentClassFilter);
    } else {
        alert(`Vous n'avez pas assez d'or ! (Coût: ${finalCost} or)`);
    }
}

// Show stats
export function showStats() {
    showScreen('statsScreen');
    const p = gameState.player;
    const statsDiv = document.getElementById('detailedStats');
    
    // Create elements safely to avoid XSS
    const container = document.createElement('div');
    container.className = 'shop-item';
    container.style.display = 'block';
    
    // Helper function to create a stat paragraph
    const createStatParagraph = (label, value) => {
        const para = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = label + ':';
        para.appendChild(strong);
        para.appendChild(document.createTextNode(' ' + value));
        return para;
    };
    
    container.appendChild(createStatParagraph('Nom', p.name));
    container.appendChild(createStatParagraph('Genre', p.gender === 'male' ? '♂️ Masculin' : '♀️ Féminin'));
    container.appendChild(createStatParagraph('Race', `${p.raceIcon || '👤'} ${p.raceName || 'Humain'}`));
    container.appendChild(createStatParagraph('Classe', `${p.classIcon} ${p.className}`));
    container.appendChild(createStatParagraph('Niveau', p.level));
    container.appendChild(createStatParagraph('Points de vie', `${p.health}/${p.maxHealth}`));
    container.appendChild(createStatParagraph('Énergie', `${p.energy}/${p.maxEnergy}`));
    container.appendChild(createStatParagraph('Force', p.strength));
    container.appendChild(createStatParagraph('Dextérité', p.dexterity));
    container.appendChild(createStatParagraph('Constitution', p.constitution));
    container.appendChild(createStatParagraph('Intelligence', p.intelligence));
    container.appendChild(createStatParagraph('Sagesse', p.wisdom));
    container.appendChild(createStatParagraph('Charisme', p.charisma));
    container.appendChild(createStatParagraph('Classe d\'armure', p.defense));
    container.appendChild(createStatParagraph('Or', p.gold));
    container.appendChild(createStatParagraph('Expérience', `${p.xp}/${p.xpToLevel}`));
    container.appendChild(createStatParagraph('Ennemis vaincus', p.kills));
    container.appendChild(createStatParagraph('Parties jouées', p.gamesPlayed));
    
    statsDiv.innerHTML = '';
    statsDiv.appendChild(container);
}

// Show save options
export function showSaveOptions() {
    showScreen('saveOptionsScreen');
    document.getElementById('exportResult').innerHTML = '';
    document.getElementById('importResult').innerHTML = '';
    document.getElementById('importCode').value = '';
}

// Show main screen
export function showMain() {
    showScreen('mainScreen');
}

// Reset game
export function resetGame() {
    if (confirm('Êtes-vous sûr de vouloir recommencer une nouvelle partie ?')) {
        const gamesPlayed = gameState.player.gamesPlayed;
        
        // Reset player
        gameState.player.name = '';
        gameState.player.gender = 'male';
        gameState.player.race = 'humain';
        gameState.player.raceName = undefined;
        gameState.player.raceIcon = undefined;
        gameState.player.class = 'guerrier';
        gameState.player.className = 'Guerrier';
        gameState.player.classIcon = '⚔️';
        gameState.player.level = 1;
        gameState.player.health = 100;
        gameState.player.maxHealth = 100;
        gameState.player.strength = 10;
        gameState.player.defense = 5;
        gameState.player.dexterity = 10;
        gameState.player.constitution = 10;
        gameState.player.intelligence = 10;
        gameState.player.wisdom = 10;
        gameState.player.charisma = 10;
        gameState.player.gold = 75;
        gameState.player.xp = 0;
        gameState.player.xpToLevel = 100;
        gameState.player.kills = 0;
        gameState.player.gamesPlayed = gamesPlayed;
        gameState.player.energy = 100;
        gameState.player.maxEnergy = 100;
        gameState.player.lastSleepTime = null;
        gameState.player.bossesDefeated = 0;
        gameState.player.metals = {
            or: 0,
            platine: 0,
            argent: 0,
            cuivre: 0
        };
        gameState.player.inventory = [];
        gameState.player.merchantPurchasedItems = [];
        
        // Reset combat state
        gameState.currentEnemy = null;
        gameState.inCombat = false;
        gameState.defending = false;
        
        saveGame();
        document.getElementById('nameInput').value = '';
        showScreen('startScreen');
        updateUI();
        
        // Show restore button if save exists
        const restoreBtn = document.getElementById('restoreSaveBtn');
        if (restoreBtn) {
            restoreBtn.style.display = 'inline-block';
        }
    }
}

// Restore save from start screen
export function restoreSaveFromStart() {
    const saved = localStorage.getItem('lecoeurdudonjon_save');
    if (saved && gameState.player.name) {
        showScreen('mainScreen');
        updateUI();
    } else {
        alert('Aucune partie sauvegardée trouvée !');
    }
}

// Meet a random NPC
export function meetNPC() {
    // Check if player has enough energy to meet an NPC
    if (gameState.player.energy < 2) {
        alert('Vous êtes trop fatigué pour rencontrer un PNJ ! Allez dormir à l\'auberge pour récupérer votre énergie.');
        return;
    }
    
    // Consume energy for meeting an NPC
    gameState.player.energy = Math.max(0, gameState.player.energy - 2);
    
    // Update UI immediately to show energy consumption
    updateUI();
    
    const npc = npcs[Math.floor(Math.random() * npcs.length)];
    
    // Check if it's the wandering merchant
    if (npc.special === 'wandering_merchant') {
        meetWanderingMerchant();
        return;
    }
    
    // Check if it's the jeweler
    if (npc.special === 'jeweler') {
        meetJeweler();
        return;
    }
    
    showScreen('npcScreen');
    
    const npcNameEl = document.getElementById('npcName');
    const npcDialogueEl = document.getElementById('npcDialogue');
    
    npcNameEl.textContent = `${npc.icon} ${npc.name}`;
    
    const dialogueContainer = document.createElement('div');
    dialogueContainer.className = 'shop-item';
    dialogueContainer.style.display = 'block';
    
    const dialogue = document.createElement('p');
    dialogue.textContent = `"${npc.dialogue}"`;
    dialogue.style.fontStyle = 'italic';
    dialogue.style.marginBottom = '15px';
    dialogueContainer.appendChild(dialogue);
    
    // Apply reward if any
    if (npc.reward) {
        const p = gameState.player;
        let rewardText = '';
        
        // Charisma increases NPC rewards: +10% per charisma modifier point
        const charismaMod = getStatModifier(p.charisma);
        const rewardBonus = 1 + (charismaMod * 0.10);
        
        if (npc.reward.type === 'heal') {
            const baseHealAmount = npc.reward.amount;
            const bonusHealAmount = Math.floor(baseHealAmount * rewardBonus);
            const healAmount = Math.min(bonusHealAmount, p.maxHealth - p.health);
            p.health = Math.min(p.maxHealth, p.health + bonusHealAmount);
            rewardText = `Vous avez été soigné de ${healAmount} HP !`;
            if (charismaMod > 0) {
                rewardText += ` (+${Math.floor((rewardBonus - 1) * 100)}% grâce à votre charisme)`;
            }
        } else if (npc.reward.type === 'gold') {
            const bonusGoldAmount = Math.floor(npc.reward.amount * rewardBonus);
            p.gold += bonusGoldAmount;
            rewardText = `Vous avez reçu ${bonusGoldAmount} pièces d'or !`;
            if (charismaMod > 0) {
                rewardText += ` (+${Math.floor((rewardBonus - 1) * 100)}% grâce à votre charisme)`;
            }
        }
        
        const rewardPara = document.createElement('p');
        rewardPara.textContent = `✨ ${rewardText}`;
        rewardPara.style.color = '#51cf66';
        rewardPara.style.fontWeight = 'bold';
        dialogueContainer.appendChild(rewardPara);
        
        saveGame();
        updateUI();
    }
    
    npcDialogueEl.innerHTML = '';
    npcDialogueEl.appendChild(dialogueContainer);
    
    // Save and update UI to reflect energy consumption
    saveGame();
    updateUI();
}

// Show leaderboard
export function showLeaderboard() {
    showScreen('leaderboardScreen');
    
    // Check if multiplayer is enabled
    const networkState = getNetworkState();
    
    if (networkState.enabled) {
        // Display network leaderboard
        displayNetworkLeaderboard();
    } else {
        // Display local leaderboard
        displayLocalLeaderboard();
    }
}

// Display local (single device) leaderboard
async function displayLocalLeaderboard() {
    // Get all saved players from leaderboard storage
    const leaderboardData = localStorage.getItem('lecoeurdudonjon_leaderboard');
    let players = [];
    
    if (leaderboardData) {
        try {
            players = JSON.parse(leaderboardData);
        } catch (e) {
            console.error('Error loading leaderboard:', e);
        }
    }
    
    // Add current player to leaderboard if they have a name
    if (gameState.player.name) {
        const currentPlayer = {
            name: gameState.player.name,
            level: gameState.player.level,
            kills: gameState.player.kills,
            strength: gameState.player.strength,
            defense: gameState.player.defense,
            score: calculatePlayerScore(gameState.player)
        };
        
        // Check if player already exists in leaderboard
        const existingIndex = players.findIndex(p => p.name === currentPlayer.name);
        if (existingIndex >= 0) {
            // Update if current score is higher
            if (currentPlayer.score > players[existingIndex].score) {
                players[existingIndex] = currentPlayer;
            }
        } else {
            players.push(currentPlayer);
        }
        
        // Save updated leaderboard
        localStorage.setItem('lecoeurdudonjon_leaderboard', JSON.stringify(players));
    }
    
    // Sort players by score (highest first)
    players.sort((a, b) => b.score - a.score);
    
    // Display leaderboard
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<h4 style="color: #DAA520;">🏠 Classement Local (cet appareil uniquement)</h4>';
    
    if (players.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun héros n\'a encore été enregistré dans les annales du royaume.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        leaderboardList.appendChild(emptyMsg);
    } else {
        players.slice(0, 10).forEach((player, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'shop-item';
            playerDiv.style.display = 'flex';
            playerDiv.style.justifyContent = 'space-between';
            playerDiv.style.alignItems = 'center';
            playerDiv.style.marginBottom = '10px';
            
            // Add medal for top 3
            let medal = '';
            if (index === 0) medal = '🥇 ';
            else if (index === 1) medal = '🥈 ';
            else if (index === 2) medal = '🥉 ';
            else medal = `${index + 1}. `;
            
            const nameSection = document.createElement('div');
            nameSection.innerHTML = `
                <strong>${medal}${player.name}</strong><br>
                <small>Niveau ${player.level} | ${player.kills} victoires</small>
            `;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${player.score} pts</div>
                <small>⚔️ ${player.strength} | 🛡️ ${player.defense}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            leaderboardList.appendChild(playerDiv);
        });
    }
    
    // Add note about multiplayer
    const note = document.createElement('div');
    note.style.cssText = 'margin-top: 20px; padding: 15px; background: rgba(139, 69, 19, 0.3); border-radius: 5px; border: 1px solid #8B4513;';
    note.innerHTML = `
        <p style="margin: 0; color: #DAA520;">💡 <strong>Astuce:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 0.9em;">
            Activez le mode multijoueur LAN dans les paramètres pour partager le classement avec votre famille sur le réseau local !
        </p>
    `;
    leaderboardList.appendChild(note);
}

// Display network (LAN multiplayer) leaderboard
async function displayNetworkLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = `
        <h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>
        <div id="multiplayerStatus" style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;">
            ⏳ Chargement du classement...
        </div>
    `;
    
    // Fetch leaderboard from server
    const result = await fetchLeaderboard(10);
    
    if (!result.success) {
        leaderboardList.innerHTML = `
            <h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>
            <div style="color: #ff6b6b; padding: 15px; background: rgba(255, 0, 0, 0.1); border-radius: 5px;">
                ❌ Impossible de se connecter au serveur multijoueur.<br>
                <small>${result.error || 'Vérifiez que le serveur est démarré.'}</small>
            </div>
        `;
        return;
    }
    
    leaderboardList.innerHTML = '<h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>';
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'multiplayerStatus';
    statusDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(81, 207, 102, 0.2); border-radius: 5px; color: #51cf66;';
    statusDiv.textContent = '🟢 Connecté au serveur multijoueur';
    leaderboardList.appendChild(statusDiv);
    
    // Make function available globally for WebSocket updates
    window.updateNetworkLeaderboard = function(scores) {
        updateLeaderboardDisplay(scores);
    };
    
    updateLeaderboardDisplay(result.scores);
}

// Update leaderboard display with scores
function updateLeaderboardDisplay(scores) {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Remove old scores if any
    const existingScores = leaderboardList.querySelector('.network-scores');
    if (existingScores) {
        existingScores.remove();
    }
    
    const scoresContainer = document.createElement('div');
    scoresContainer.className = 'network-scores';
    
    if (scores.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun score n\'a encore été enregistré sur le serveur.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        scoresContainer.appendChild(emptyMsg);
    } else {
        scores.forEach((score, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'shop-item';
            playerDiv.style.display = 'flex';
            playerDiv.style.justifyContent = 'space-between';
            playerDiv.style.alignItems = 'center';
            playerDiv.style.marginBottom = '10px';
            
            // Add medal for top 3
            let medal = '';
            if (index === 0) medal = '🥇 ';
            else if (index === 1) medal = '🥈 ';
            else if (index === 2) medal = '🥉 ';
            else medal = `${index + 1}. `;
            
            // Format class icon
            const classIcon = getClassIcon(score.className);
            const raceIcon = getRaceIcon(score.race);
            const genderIcon = score.gender === 'female' ? '♀️' : '♂️';
            
            const nameSection = document.createElement('div');
            nameSection.innerHTML = `
                <strong>${medal}${score.playerName}</strong> ${genderIcon}<br>
                <small>${classIcon} ${score.className} ${raceIcon} | Niveau ${score.level} | ${score.kills} victoires</small>
            `;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${score.gold} 💰</div>
                <small style="color: #999;">${new Date(score.timestamp).toLocaleDateString('fr-FR')}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            scoresContainer.appendChild(playerDiv);
        });
    }
    
    leaderboardList.appendChild(scoresContainer);
}

// Helper function to get class icon
function getClassIcon(className) {
    const icons = {
        'Guerrier': '⚔️',
        'Magicien': '🧙',
        'Archer': '🏹',
        'Rogue': '🗡️'
    };
    return icons[className] || '⚔️';
}

// Helper function to get race icon
function getRaceIcon(race) {
    const icons = {
        'humain': '👤',
        'elfe': '🧝',
        'nain': '🧔'
    };
    return icons[race] || '👤';
}

// Calculate player score for leaderboard
function calculatePlayerScore(player) {
    return (player.level * 100) + (player.kills * 50) + (player.strength * 10) + (player.defense * 5);
}

// Meet wandering merchant with rare items
export function meetWanderingMerchant() {
    showScreen('shopScreen');
    const shopDiv = document.getElementById('shopItems');
    shopDiv.innerHTML = '';
    
    // Reset purchased items on new encounter
    gameState.player.merchantPurchasedItems = [];
    
    // Add merchant description
    const merchantDesc = document.createElement('div');
    merchantDesc.className = 'story-text';
    merchantDesc.innerHTML = `
        <p>🧙‍♂️ <strong>Marchand Itinérant</strong></p>
        <p>Un mystérieux marchand ambulant apparaît devant vous. "J'ai des objets rares et puissants... à des prix élevés bien sûr !"</p>
    `;
    shopDiv.appendChild(merchantDesc);
    
    // Display rare items (only show items that haven't been purchased this encounter)
    rareItems.forEach((item, index) => {
        // Skip items that have been purchased in this encounter
        if (gameState.player.merchantPurchasedItems.includes(index)) {
            return;
        }
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        const icon = item.icon || '📦';
        
        itemDiv.innerHTML = `
            <div class="shop-item-info">
                <strong style="color: #FFD700;">${icon} ${item.name} (RARE)</strong><br>
                <small>${item.description}</small>
            </div>
            <div class="shop-item-price">${item.cost} 💰</div>
            <button onclick="window.buyRareItem(${index})">Acheter</button>
        `;
        shopDiv.appendChild(itemDiv);
    });
}

// Buy rare item
export function buyRareItem(index) {
    const item = rareItems[index];
    const p = gameState.player;
    
    if (p.gold >= item.cost) {
        p.gold -= item.cost;
        item.effect();
        
        // Mark item as purchased for this encounter
        if (!p.merchantPurchasedItems) {
            p.merchantPurchasedItems = [];
        }
        p.merchantPurchasedItems.push(index);
        
        // Play purchase sound
        audioManager.playSound('purchase');
        
        // Update quest progress for shop purchases
        updateQuestProgress('shop', 1);
        
        checkLevelUp();
        saveGame();
        updateUI();
        alert(`Vous avez acheté ${item.name} !`);
        meetWanderingMerchant(); // Refresh merchant shop
    } else {
        alert(`Vous n'avez pas assez d'or ! (Coût: ${item.cost} or)`);
    }
}

// Calculate jeweler's daily profit margin (30-50%)
function getJewelerProfitMargin() {
    // Use current date to determine daily profit
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Use day of year as seed for consistent daily rate
    const seed = dayOfYear % 21; // 21 possible values for 30-50%
    return 0.30 + (seed * 0.01); // 30% to 50%
}

// Meet the Jeweler NPC
export function meetJeweler() {
    showScreen('shopScreen');
    const shopDiv = document.getElementById('shopItems');
    shopDiv.innerHTML = '';
    
    const profitMargin = getJewelerProfitMargin();
    const profitPercent = Math.round(profitMargin * 100);
    
    // Add jeweler description
    const jewelerDesc = document.createElement('div');
    jewelerDesc.className = 'story-text';
    jewelerDesc.innerHTML = `
        <p>💎 <strong>Bijoutier</strong></p>
        <p>"Bienvenue dans ma bijouterie ! J'achète et vends des métaux précieux. Aujourd'hui, ma marge est de ${profitPercent}% sur toutes les transactions."</p>
        <p style="font-size: 0.9em; color: #999;">Vous pouvez échanger vos pièces d'or contre des métaux précieux, ou vendre vos métaux pour de l'or.</p>
    `;
    shopDiv.appendChild(jewelerDesc);
    
    // Show player's current metals
    const inventoryDiv = document.createElement('div');
    inventoryDiv.className = 'shop-item';
    inventoryDiv.style.display = 'block';
    inventoryDiv.style.marginBottom = '20px';
    inventoryDiv.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💰 Votre Inventaire</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div>Or: ${gameState.player.gold} 💰</div>
            <div>${metals.or.icon} Or: ${gameState.player.metals.or.toFixed(2)} oz</div>
            <div>${metals.platine.icon} Platine: ${gameState.player.metals.platine.toFixed(2)} oz</div>
            <div>${metals.argent.icon} Argent: ${gameState.player.metals.argent.toFixed(2)} oz</div>
            <div>${metals.cuivre.icon} Cuivre: ${gameState.player.metals.cuivre.toFixed(2)} oz</div>
        </div>
    `;
    shopDiv.appendChild(inventoryDiv);
    
    // Metal prices table
    const pricesDiv = document.createElement('div');
    pricesDiv.className = 'shop-item';
    pricesDiv.style.display = 'block';
    pricesDiv.style.marginBottom = '20px';
    pricesDiv.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">📊 Prix des Métaux (CAD/oz)</h4>
        <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #8B4513;">
                <th style="padding: 8px;">Métal</th>
                <th style="padding: 8px;">Valeur Relative</th>
                <th style="padding: 8px;">Prix d'Achat</th>
                <th style="padding: 8px;">Prix de Vente</th>
            </tr>
            ${Object.entries(metals).map(([key, metal]) => {
                const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
                const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
                return `
                    <tr>
                        <td style="padding: 8px;">${metal.icon} ${metal.name}</td>
                        <td style="padding: 8px;">${metal.relativeValue}</td>
                        <td style="padding: 8px; color: #ff6b6b;">${buyPrice} 💰</td>
                        <td style="padding: 8px; color: #51cf66;">${sellPrice} 💰</td>
                    </tr>
                `;
            }).join('')}
        </table>
    `;
    shopDiv.appendChild(pricesDiv);
    
    // Buy metals section
    const buySection = document.createElement('div');
    buySection.className = 'shop-item';
    buySection.style.display = 'block';
    buySection.style.marginBottom = '20px';
    buySection.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💰 Acheter des Métaux (avec vos pièces d'or)</h4>
    `;
    
    Object.entries(metals).forEach(([key, metal]) => {
        const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
        const buyDiv = document.createElement('div');
        buyDiv.style.display = 'flex';
        buyDiv.style.justifyContent = 'space-between';
        buyDiv.style.alignItems = 'center';
        buyDiv.style.marginBottom = '10px';
        buyDiv.style.padding = '10px';
        buyDiv.style.background = 'rgba(0, 0, 0, 0.3)';
        buyDiv.style.borderRadius = '5px';
        
        buyDiv.innerHTML = `
            <div>
                <strong>${metal.icon} ${metal.name}</strong><br>
                <small>${metal.description}</small>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="buy_${key}" min="0.01" step="0.01" value="1" 
                       style="width: 80px; padding: 5px; background: rgba(0,0,0,0.5); color: #f0f0f0; border: 1px solid #8B4513; border-radius: 3px;">
                <span>oz</span>
                <button onclick="window.buyMetal('${key}', document.getElementById('buy_${key}').value)">
                    Acheter (${buyPrice} 💰/oz)
                </button>
            </div>
        `;
        buySection.appendChild(buyDiv);
    });
    shopDiv.appendChild(buySection);
    
    // Sell metals section
    const sellSection = document.createElement('div');
    sellSection.className = 'shop-item';
    sellSection.style.display = 'block';
    sellSection.style.marginBottom = '20px';
    sellSection.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💎 Vendre des Métaux (pour des pièces d'or)</h4>
    `;
    
    Object.entries(metals).forEach(([key, metal]) => {
        const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
        const sellDiv = document.createElement('div');
        sellDiv.style.display = 'flex';
        sellDiv.style.justifyContent = 'space-between';
        sellDiv.style.alignItems = 'center';
        sellDiv.style.marginBottom = '10px';
        sellDiv.style.padding = '10px';
        sellDiv.style.background = 'rgba(0, 0, 0, 0.3)';
        sellDiv.style.borderRadius = '5px';
        
        sellDiv.innerHTML = `
            <div>
                <strong>${metal.icon} ${metal.name}</strong><br>
                <small>Vous avez: ${gameState.player.metals[key].toFixed(2)} oz</small>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="sell_${key}" min="0.01" step="0.01" value="1" max="${gameState.player.metals[key]}"
                       style="width: 80px; padding: 5px; background: rgba(0,0,0,0.5); color: #f0f0f0; border: 1px solid #8B4513; border-radius: 3px;">
                <span>oz</span>
                <button onclick="window.sellMetal('${key}', document.getElementById('sell_${key}').value)" 
                        ${gameState.player.metals[key] <= 0 ? 'disabled' : ''}>
                    Vendre (${sellPrice} 💰/oz)
                </button>
            </div>
        `;
        sellSection.appendChild(sellDiv);
    });
    shopDiv.appendChild(sellSection);
}

// Buy metal from jeweler
export function buyMetal(metalType, amount) {
    const metal = metals[metalType];
    const profitMargin = getJewelerProfitMargin();
    const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
    const ozAmount = parseFloat(amount);
    
    if (isNaN(ozAmount) || ozAmount <= 0) {
        alert('Quantité invalide !');
        return;
    }
    
    const totalCost = Math.round(buyPrice * ozAmount);
    const p = gameState.player;
    
    if (p.gold >= totalCost) {
        p.gold -= totalCost;
        p.metals[metalType] += ozAmount;
        
        audioManager.playSound('purchase');
        saveGame();
        updateUI();
        
        alert(`Vous avez acheté ${ozAmount.toFixed(2)} oz de ${metal.name} pour ${totalCost} pièces d'or !`);
        meetJeweler(); // Refresh jeweler shop
    } else {
        alert(`Vous n'avez pas assez d'or ! (Coût: ${totalCost} or, Vous avez: ${p.gold} or)`);
    }
}

// Sell metal to jeweler
export function sellMetal(metalType, amount) {
    const metal = metals[metalType];
    const profitMargin = getJewelerProfitMargin();
    const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
    const ozAmount = parseFloat(amount);
    
    if (isNaN(ozAmount) || ozAmount <= 0) {
        alert('Quantité invalide !');
        return;
    }
    
    const p = gameState.player;
    
    if (p.metals[metalType] >= ozAmount) {
        p.metals[metalType] -= ozAmount;
        const goldEarned = Math.round(sellPrice * ozAmount);
        p.gold += goldEarned;
        
        audioManager.playSound('purchase');
        saveGame();
        updateUI();
        
        alert(`Vous avez vendu ${ozAmount.toFixed(2)} oz de ${metal.name} pour ${goldEarned} pièces d'or !`);
        meetJeweler(); // Refresh jeweler shop
    } else {
        alert(`Vous n'avez pas assez de ${metal.name} ! (Requis: ${ozAmount.toFixed(2)} oz, Vous avez: ${p.metals[metalType].toFixed(2)} oz)`);
    }
}

// Show achievements screen
export function showAchievements() {
    showScreen('achievementsScreen');
    
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Import achievements functions
    import('./achievements.js').then(module => {
        const { achievements: achievementsList, getAchievementsByCategory, isAchievementUnlocked, getAchievementProgress } = module;
        
        const categories = getAchievementsByCategory();
        const categoryNames = {
            combat: '⚔️ Combat',
            wealth: '💰 Richesse',
            progression: '⭐ Progression',
            challenge: '🏆 Défis',
            skills: '⚡ Compétences',
            commerce: '🛒 Commerce',
            quests: '📜 Quêtes',
            exploration: '🗺️ Exploration'
        };
        
        let unlockedCount = 0;
        let totalCount = achievementsList.length;
        
        for (const [category, items] of Object.entries(categories)) {
            if (items.length === 0) continue;
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'achievement-category';
            categoryHeader.textContent = categoryNames[category] || category;
            container.appendChild(categoryHeader);
            
            items.forEach(achievement => {
                const isUnlocked = isAchievementUnlocked(achievement.id);
                if (isUnlocked) unlockedCount++;
                
                const progress = getAchievementProgress(achievement);
                
                const item = document.createElement('div');
                item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
                
                const icon = document.createElement('div');
                icon.className = 'achievement-icon';
                icon.textContent = achievement.icon;
                if (!isUnlocked) icon.style.filter = 'grayscale(100%)';
                item.appendChild(icon);
                
                const details = document.createElement('div');
                details.className = 'achievement-details';
                
                const name = document.createElement('div');
                name.className = 'achievement-name';
                name.textContent = isUnlocked ? `✓ ${achievement.name}` : `🔒 ${achievement.name}`;
                details.appendChild(name);
                
                const description = document.createElement('div');
                description.className = 'achievement-description';
                description.textContent = achievement.description;
                details.appendChild(description);
                
                if (isUnlocked) {
                    const reward = document.createElement('div');
                    reward.className = 'achievement-reward';
                    const rewardParts = [];
                    if (achievement.reward.gold) rewardParts.push(`+${achievement.reward.gold} or`);
                    if (achievement.reward.xp) rewardParts.push(`+${achievement.reward.xp} XP`);
                    if (achievement.reward.strength) rewardParts.push(`+${achievement.reward.strength} Force`);
                    if (achievement.reward.defense) rewardParts.push(`+${achievement.reward.defense} Défense`);
                    if (achievement.reward.dexterity) rewardParts.push(`+${achievement.reward.dexterity} Dextérité`);
                    if (achievement.reward.maxHealth) rewardParts.push(`+${achievement.reward.maxHealth} HP max`);
                    if (achievement.reward.maxEnergy) rewardParts.push(`+${achievement.reward.maxEnergy} Énergie max`);
                    reward.textContent = `Récompense: ${rewardParts.join(', ')}`;
                    details.appendChild(reward);
                } else {
                    const progressBar = document.createElement('div');
                    progressBar.className = 'achievement-progress';
                    const progressFill = document.createElement('div');
                    progressFill.className = 'achievement-progress-fill';
                    progressFill.style.width = `${progress.percentage}%`;
                    progressBar.appendChild(progressFill);
                    details.appendChild(progressBar);
                    
                    const progressText = document.createElement('div');
                    progressText.style.fontSize = '0.85em';
                    progressText.style.color = '#999';
                    progressText.style.marginTop = '5px';
                    progressText.textContent = `Progression: ${progress.current}/${progress.required}`;
                    details.appendChild(progressText);
                }
                
                item.appendChild(details);
                container.appendChild(item);
            });
        }
        
        // Add summary header
        const summary = document.createElement('div');
        summary.style.cssText = 'text-align: center; padding: 20px; background: rgba(218, 165, 32, 0.1); border-radius: 5px; margin-bottom: 20px; border: 2px solid #DAA520;';
        summary.innerHTML = `
            <div style="font-size: 1.5em; font-weight: bold; color: #FFD700; margin-bottom: 10px;">
                🏆 ${unlockedCount} / ${totalCount} Succès Débloqués
            </div>
            <div style="font-size: 0.9em; color: #ccc;">
                ${Math.floor((unlockedCount / totalCount) * 100)}% de complétion
            </div>
        `;
        container.insertBefore(summary, container.firstChild);
    });
}

// Show balance test screen
export function showBalanceTest() {
    showScreen('balanceTestScreen');
    
    // Reset test results
    document.getElementById('balanceTestResults').innerHTML = '';
    document.getElementById('balanceTestProgress').style.display = 'none';
    document.getElementById('startBalanceTestBtn').disabled = false;
}

// Run balance test
export async function runBalanceTest() {
    const startBtn = document.getElementById('startBalanceTestBtn');
    const progressDiv = document.getElementById('balanceTestProgress');
    const statusText = document.getElementById('balanceTestStatus');
    const progressBar = document.getElementById('balanceTestProgressBar');
    const resultsDiv = document.getElementById('balanceTestResults');
    
    // Disable button and show progress
    startBtn.disabled = true;
    progressDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
    
    try {
        statusText.textContent = 'Démarrage des tests...';
        progressBar.style.width = '0%';
        
        // Use setTimeout to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Run tests with progress updates
        statusText.textContent = 'Simulation en cours... (Cela peut prendre 10-30 secondes)';
        progressBar.style.width = '25%';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const report = runBalanceTests(2500);
        
        progressBar.style.width = '75%';
        statusText.textContent = 'Génération du rapport...';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Format and display results
        const htmlReport = formatReportAsHTML(report);
        resultsDiv.innerHTML = htmlReport;
        
        progressBar.style.width = '100%';
        statusText.textContent = '✓ Test terminé avec succès !';
        
        // Hide progress after a delay
        setTimeout(() => {
            progressDiv.style.display = 'none';
            startBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error running balance tests:', error);
        statusText.textContent = '✗ Erreur lors du test: ' + error.message;
        statusText.style.color = '#ff6b6b';
        startBtn.disabled = false;
    }
}

// Use item from inventory
export function useInventoryItem(inventoryIndex) {
    const p = gameState.player;
    if (!p.inventory || inventoryIndex < 0 || inventoryIndex >= p.inventory.length) {
        return;
    }
    
    const inventoryItem = p.inventory[inventoryIndex];
    const shopItem = shopItems[inventoryItem.shopIndex];
    
    if (shopItem && shopItem.effect) {
        // Use the item
        shopItem.effect();
        
        // Remove from inventory
        p.inventory.splice(inventoryIndex, 1);
        
        saveGame();
        updateUI();
    }
}

// Sell item from inventory to merchant
export function sellInventoryItem(inventoryIndex) {
    const p = gameState.player;
    if (!p.inventory || inventoryIndex < 0 || inventoryIndex >= p.inventory.length) {
        return;
    }
    
    const inventoryItem = p.inventory[inventoryIndex];
    // Merchant buys at 50% of original value
    const sellPrice = Math.floor(inventoryItem.cost * 0.5);
    
    p.gold += sellPrice;
    p.inventory.splice(inventoryIndex, 1);
    
    alert(`Vous avez vendu ${inventoryItem.name} pour ${sellPrice} or !`);
    
    saveGame();
    updateUI();
}

// Show daily quests (export for main.js)
export { showDailyQuestsScreen };
