// Shop System Module
// Handles all shop-related functionality: regular shop, rare items, and shop item management

import { gameState, shopItems, rareItems, rarities, generateRandomStats, statNames, hasRandomStats, getStatModifier } from '../game-state.js';
import { updateUI, showScreen } from '../ui.js';
import { saveGame } from '../save-load.js';
import { characterClasses } from '../character-classes.js';
import { audioManager } from '../audio.js';
import { updateQuestProgress } from '../daily-quests.js';
import { trackAchievementProgress, checkAchievements } from '../achievements.js';
import { getEventMultiplier } from '../scheduled-events.js';
import { healPlayer, restoreEnergy, addExperience, checkLevelUp } from '../game-logic.js';

// Helper function to get class display name
function getClassDisplayName(classKey) {
    return characterClasses[classKey]?.name || classKey;
}

// Set up shop item effects
export function initializeShopItems() {
    // Healing potions (10 tiers)
    shopItems[0].effect = () => healPlayer(20);   // Potion de Soin Minuscule
    shopItems[1].effect = () => healPlayer(40);   // Petite Potion de Soin
    shopItems[2].effect = () => healPlayer(60);   // Potion de Soin
    shopItems[3].effect = () => healPlayer(90);   // Grande Potion de Soin
    shopItems[4].effect = () => healPlayer(120);  // Potion de Soin Majeure
    shopItems[5].effect = () => healPlayer(160);  // Potion de Soin Suprême
    shopItems[6].effect = () => healPlayer(220);  // Potion de Soin Ultime
    shopItems[7].effect = () => healPlayer(300);  // Élixir de Soin Divin
    shopItems[8].effect = () => healPlayer(400);  // Élixir de Soin Céleste
    shopItems[9].effect = () => healPlayer(550);  // Élixir de Soin Immortel
    
    // Damage potions (10 tiers)
    shopItems[10].effect = () => { gameState.player.strength += 1; };   // Potion de Force Minuscule
    shopItems[11].effect = () => { gameState.player.strength += 3; };   // Potion de Force Mineure
    shopItems[12].effect = () => { gameState.player.strength += 5; };   // Potion de Force
    shopItems[13].effect = () => { gameState.player.strength += 7; };   // Potion de Force Supérieure
    shopItems[14].effect = () => { gameState.player.strength += 9; };   // Potion de Force Majeure
    shopItems[15].effect = () => { gameState.player.strength += 10; };  // Potion de Force Extrême
    shopItems[16].effect = () => { gameState.player.strength += 12; };  // Potion de Force Titanesque
    shopItems[17].effect = () => { gameState.player.strength += 15; };  // Potion de Force Divine
    shopItems[18].effect = () => { gameState.player.strength += 18; };  // Potion de Force Céleste
    shopItems[19].effect = () => { gameState.player.strength += 22; };  // Potion de Force Immortelle
    
    // Energy potions (3 tiers)
    shopItems[20].effect = () => restoreEnergy(30);  // Potion d'Énergie Mineure
    shopItems[21].effect = () => restoreEnergy(50);  // Potion d'Énergie
    shopItems[22].effect = () => restoreEnergy(100); // Potion d'Énergie Majeure
    
    // Experience potions (3 tiers)
    shopItems[23].effect = () => addExperience(30);  // Potion d'Expérience Mineure
    shopItems[24].effect = () => addExperience(60);  // Potion d'Expérience
    shopItems[25].effect = () => addExperience(120); // Potion d'Expérience Majeure
    
    // Weapons for Guerrier (10 tiers)
    shopItems[26].effect = () => { gameState.player.strength += 1; };  // Épée Rouillée
    shopItems[27].effect = () => { gameState.player.strength += 3; };  // Épée en Fer
    shopItems[28].effect = () => { gameState.player.strength += 5; };  // Épée en Acier
    shopItems[29].effect = () => { gameState.player.strength += 7; };  // Épée Enchantée
    shopItems[30].effect = () => { gameState.player.strength += 9; };  // Épée Flamboyante
    shopItems[31].effect = () => { gameState.player.strength += 10; }; // Épée Runique
    shopItems[32].effect = () => { gameState.player.strength += 12; }; // Épée Légendaire
    shopItems[33].effect = () => { gameState.player.strength += 15; }; // Épée Divine
    shopItems[34].effect = () => { gameState.player.strength += 18; }; // Épée Céleste
    shopItems[35].effect = () => { gameState.player.strength += 22; }; // Épée du Conquérant Suprême
    
    // Weapons for Archer (10 tiers)
    shopItems[36].effect = () => { gameState.player.strength += 1; };  // Arc Basique
    shopItems[37].effect = () => { gameState.player.strength += 3; };  // Arc Court
    shopItems[38].effect = () => { gameState.player.strength += 5; };  // Arc Long
    shopItems[39].effect = () => { gameState.player.strength += 7; };  // Arc Composite
    shopItems[40].effect = () => { gameState.player.strength += 9; };  // Arc Elfique
    shopItems[41].effect = () => { gameState.player.strength += 10; }; // Arc Runique
    shopItems[42].effect = () => { gameState.player.strength += 12; }; // Arc Légendaire
    shopItems[43].effect = () => { gameState.player.strength += 15; }; // Arc du Chasseur Divin
    shopItems[44].effect = () => { gameState.player.strength += 18; }; // Arc Céleste
    shopItems[45].effect = () => { gameState.player.strength += 22; }; // Arc de l'Étoile Filante
    
    // Weapons for Magicien (10 tiers)
    shopItems[46].effect = () => { gameState.player.strength += 1; };  // Bâton de Bois
    shopItems[47].effect = () => { gameState.player.strength += 3; };  // Bâton d'Apprenti
    shopItems[48].effect = () => { gameState.player.strength += 5; };  // Bâton Mystique
    shopItems[49].effect = () => { gameState.player.strength += 7; };  // Bâton Enchanté
    shopItems[50].effect = () => { gameState.player.strength += 9; };  // Bâton de Pouvoir
    shopItems[51].effect = () => { gameState.player.strength += 10; }; // Bâton Runique
    shopItems[52].effect = () => { gameState.player.strength += 12; }; // Bâton Légendaire
    shopItems[53].effect = () => { gameState.player.strength += 15; }; // Bâton de l'Archimage
    shopItems[54].effect = () => { gameState.player.strength += 18; }; // Bâton Céleste
    shopItems[55].effect = () => { gameState.player.strength += 22; }; // Bâton de l'Univers
    
    // Shields for Guerrier (10 tiers)
    shopItems[56].effect = () => { gameState.player.defense += 1; };  // Bouclier en Bois
    shopItems[57].effect = () => { gameState.player.defense += 3; };  // Bouclier en Fer
    shopItems[58].effect = () => { gameState.player.defense += 5; };  // Bouclier Renforcé
    shopItems[59].effect = () => { gameState.player.defense += 7; };  // Bouclier d'Acier
    shopItems[60].effect = () => { gameState.player.defense += 9; };  // Bouclier de Chevalier
    shopItems[61].effect = () => { gameState.player.defense += 10; }; // Bouclier Enchanté
    shopItems[62].effect = () => { gameState.player.defense += 12; }; // Bouclier Runique
    shopItems[63].effect = () => { gameState.player.defense += 15; }; // Bouclier Divin
    shopItems[64].effect = () => { gameState.player.defense += 18; }; // Bouclier Céleste
    shopItems[65].effect = () => { gameState.player.defense += 22; }; // Bouclier du Protecteur Immortel
    
    // Armors (10 tiers)
    shopItems[66].effect = () => { gameState.player.defense += 1; };  // Armure en Tissu
    shopItems[67].effect = () => { gameState.player.defense += 3; };  // Armure de Cuir
    shopItems[68].effect = () => { gameState.player.defense += 5; };  // Armure Clouée
    shopItems[69].effect = () => { gameState.player.defense += 7; };  // Cotte de Mailles
    shopItems[70].effect = () => { gameState.player.defense += 9; };  // Armure d'Acier
    shopItems[71].effect = () => { gameState.player.defense += 10; }; // Armure Enchantée
    shopItems[72].effect = () => { gameState.player.defense += 12; }; // Armure Runique
    shopItems[73].effect = () => { gameState.player.defense += 15; }; // Armure Divine
    shopItems[74].effect = () => { gameState.player.defense += 18; }; // Armure Céleste
    shopItems[75].effect = () => { gameState.player.defense += 22; }; // Armure Immortelle
    
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

// Initialize or rotate unavailable shop items (approximately 20% of items)
export function initializeShopAvailability() {
    const now = Date.now();
    
    // Check if we need to restock (first time or after 2 hours)
    if (!gameState.shop.nextRestockTime || now >= gameState.shop.nextRestockTime) {
        // Calculate how many items to make unavailable (~20%)
        const unavailableCount = Math.floor(shopItems.length * 0.2);
        
        // Randomly select items to make unavailable
        const unavailableIndices = new Set();
        while (unavailableIndices.size < unavailableCount) {
            const randomIndex = Math.floor(Math.random() * shopItems.length);
            unavailableIndices.add(randomIndex);
        }
        
        // Update shop state
        gameState.shop.unavailableItemIndices = Array.from(unavailableIndices);
        gameState.shop.nextRestockTime = now + (2 * 60 * 60 * 1000); // 2 hours in milliseconds
        
        saveGame();
    }
}

// Get time remaining until next restock in a human-readable format
export function getRestockTimeRemaining() {
    if (!gameState.shop.nextRestockTime) {
        return null;
    }
    
    const now = Date.now();
    const timeRemaining = gameState.shop.nextRestockTime - now;
    
    if (timeRemaining <= 0) {
        return null;
    }
    
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    } else {
        return `${minutes}min`;
    }
}

// Check if an item is currently unavailable
export function isItemUnavailable(itemIndex) {
    return gameState.shop.unavailableItemIndices.includes(itemIndex);
}

// Show regular shop with filters
export function showShop(filterCategory = 'all', filterByClass = true) {
    // Check and update shop availability
    initializeShopAvailability();
    
    // Switch to merchant music when opening regular shop
    audioManager.startMusic('merchant');
    
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
            <label for="classFilter" style="color: #DAA520; cursor: pointer;">Ma classe, disponibles et prérequis atteints</label>
        </div>
    `;
    shopDiv.appendChild(filterContainer);
    
    // Add restock timer message if there are unavailable items
    const restockTime = getRestockTimeRemaining();
    if (restockTime && gameState.shop.unavailableItemIndices.length > 0) {
        const restockMsg = document.createElement('div');
        restockMsg.style.cssText = 'background: rgba(139, 69, 19, 0.3); border: 2px solid #8B4513; border-radius: 8px; padding: 12px; margin-bottom: 15px; text-align: center;';
        restockMsg.innerHTML = `
            <p style="margin: 0; color: #DAA520; font-weight: bold;">
                🕐 Le marchand attend de nouveaux articles dans ${restockTime}
            </p>
            <p style="margin: 5px 0 0 0; color: #AAA; font-size: 0.9em; font-style: italic;">
                Certains articles sont temporairement indisponibles
            </p>
        `;
        shopDiv.appendChild(restockMsg);
    }
    
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
    
    // Additional filter by class compatibility, availability, and prerequisites if checkbox is checked
    if (filterByClass) {
        filteredItems = filteredItems.filter(item => {
            // Find the original index in shopItems array
            const originalIndex = shopItems.indexOf(item);
            
            // Check class compatibility
            const isClassCompatible = !item.classRestriction || item.classRestriction === gameState.player.class;
            
            // Check availability
            const isAvailable = !isItemUnavailable(originalIndex);
            
            // Check level requirement
            const meetsLevelRequirement = !item.levelRequirement || gameState.player.level >= item.levelRequirement;
            
            // Show item only if it passes all checks
            return isClassCompatible && isAvailable && meetsLevelRequirement;
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
            let disabledReason = '';
            
            if (item.classRestriction) {
                const className = getClassDisplayName(item.classRestriction);
                classInfo = `<br><small style="color: #DAA520;">Pour: ${className}</small>`;
                
                // Disable if player is not this class
                if (item.classRestriction !== gameState.player.class) {
                    isDisabled = true;
                    disabledReason = 'class';
                    itemDiv.classList.add('shop-item-disabled');
                }
            }
            
            // Check if item has level requirement
            let levelInfo = '';
            if (item.levelRequirement) {
                const meetsRequirement = gameState.player.level >= item.levelRequirement;
                const levelColor = meetsRequirement ? '#51cf66' : '#ff6b6b';
                levelInfo = `<br><small style="color: ${levelColor};">Niveau requis: ${item.levelRequirement}</small>`;
                
                // Disable if player level is too low
                if (!meetsRequirement) {
                    isDisabled = true;
                    disabledReason = 'level';
                    itemDiv.classList.add('shop-item-disabled');
                }
            }
            
            // Check if item is currently unavailable
            if (isItemUnavailable(originalIndex)) {
                isDisabled = true;
                disabledReason = 'unavailable';
                itemDiv.classList.add('shop-item-disabled');
                itemDiv.style.opacity = '0.6';
            }
            
            // Calculate discounted price based on charisma
            const charismaMod = getStatModifier(gameState.player.charisma);
            const charismaDiscount = Math.min(0.20, Math.max(0, charismaMod * 0.02));
            
            // Apply event shop discount
            const eventDiscount = getEventMultiplier('shopDiscount', 0);
            const totalDiscount = Math.min(0.50, charismaDiscount + eventDiscount); // Max 50% discount
            
            const finalCost = Math.floor(item.cost * (1 - totalDiscount));
            
            // Build price display with discount info
            let priceDisplay = `${finalCost} 💰`;
            if (disabledReason === 'unavailable') {
                priceDisplay = `<span style="color: #888;">Indisponible</span>`;
            } else if (totalDiscount > 0) {
                let discountText = '';
                if (charismaDiscount > 0 && eventDiscount > 0) {
                    discountText = `-${Math.floor(totalDiscount * 100)}% (Charisme + Événement 🎉)`;
                } else if (charismaDiscount > 0) {
                    discountText = `-${Math.floor(charismaDiscount * 100)}% (Charisme)`;
                } else if (eventDiscount > 0) {
                    discountText = `-${Math.floor(eventDiscount * 100)}% (Événement 🎉)`;
                }
                priceDisplay = `<span style="text-decoration: line-through; color: #888;">${item.cost}</span> ${finalCost} 💰<br><small style="color: #51cf66;">${discountText}</small>`;
            }
            
            // Build button text based on disabled reason
            let buttonText = 'Acheter';
            if (disabledReason === 'unavailable') {
                buttonText = 'Indisponible';
            }
            
            itemDiv.innerHTML = `
                <div class="shop-item-info">
                    <strong style="color: ${rarityColor};">${icon} ${item.name}</strong><br>
                    ${rarityInfo}
                    <small>${item.description}</small>${randomStatsInfo}${classInfo}${levelInfo}
                </div>
                <div class="shop-item-price">${priceDisplay}</div>
                <button onclick="window.buyItem(${originalIndex})" ${isDisabled ? 'disabled' : ''}>${buttonText}</button>
            `;
            shopDiv.appendChild(itemDiv);
        });
    }
}

// Buy item
export function buyItem(index) {
    const item = shopItems[index];
    const p = gameState.player;
    
    // Check if item is currently unavailable
    if (isItemUnavailable(index)) {
        const restockTime = getRestockTimeRemaining();
        alert(`Cet article est temporairement indisponible. Le marchand attend de nouveaux articles dans ${restockTime}.`);
        return;
    }
    
    // Check class restriction for weapons
    if (item.classRestriction && item.classRestriction !== p.class) {
        const className = getClassDisplayName(item.classRestriction);
        alert(`Cet objet est réservé à la classe ${className} !`);
        return;
    }
    
    // Check level requirement
    if (item.levelRequirement && p.level < item.levelRequirement) {
        alert(`Vous n'avez pas le niveau requis pour acheter cet objet !\n\nNiveau requis : ${item.levelRequirement}\nVotre niveau : ${p.level}\n\nRevenez quand vous serez plus fort !`);
        return;
    }
    
    // Charisma reduces shop prices: -2% per charisma modifier point (max 20% discount)
    const charismaMod = getStatModifier(p.charisma);
    const charismaDiscount = Math.min(0.20, Math.max(0, charismaMod * 0.02));
    
    // Apply event shop discount
    const eventDiscount = getEventMultiplier('shopDiscount', 0);
    const totalDiscount = Math.min(0.50, charismaDiscount + eventDiscount); // Max 50% discount
    
    const finalCost = Math.floor(item.cost * (1 - totalDiscount));
    
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
            
            // Track weapon damage and equipment for display in UI
            if (item.type === 'weapon' && item.bonus) {
                p.weaponDamage = item.bonus;
                p.currentWeapon = {
                    name: item.name,
                    icon: item.icon,
                    bonus: item.bonus,
                    description: item.description
                };
            }
            if (item.type === 'armor' && item.bonus) {
                p.currentArmor = {
                    name: item.name,
                    icon: item.icon,
                    bonus: item.bonus,
                    description: item.description
                };
            }
            if (item.type === 'shield' && item.bonus) {
                p.currentShield = {
                    name: item.name,
                    icon: item.icon,
                    bonus: item.bonus,
                    description: item.description
                };
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
        if (totalDiscount > 0) {
            const savedGold = item.cost - finalCost;
            message += ` (Réduction de ${Math.floor(totalDiscount * 100)}% grâce à votre charisme: -${savedGold} or)`;
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

// Show wandering merchant with rare items
export function meetWanderingMerchant() {
    // Switch to merchant music
    audioManager.startMusic('merchant');
    
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

// Buy rare item from wandering merchant
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
