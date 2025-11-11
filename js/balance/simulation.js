// Simulation Module
// Responsibility: Simulate game sessions for balance testing

import { characterClasses, applyCharacterClass } from '../character-classes.js';
import { characterRaces, applyRaceModifiers } from '../character-races.js';
import { characterSexes, applySexModifiers } from '../character-sexes.js';
import { enemies, bosses, getStatModifier } from '../game-state.js';
import { shopItems } from '../data/shop-items.js';

// Create a simulated player
export function createSimulatedPlayer(classKey, raceKey = 'humain', sexKey = 'male') {
    const player = {
        name: `Test_${classKey}_${raceKey}_${sexKey}`,
        gender: sexKey,
        race: raceKey,
        class: classKey,
        level: 1,
        health: 100,
        maxHealth: 100,
        puissance: 10,
        defense: 5,
        adresse: 10,
        puissance: 10,
        esprit: 10,
        esprit: 10,
        presence: 10,
        gold: 75,
        xp: 0,
        xpToLevel: 100,
        kills: 0,
        energy: 100,
        maxEnergy: 100,
        bossesDefeated: 0,
        deaths: 0,
        totalGoldEarned: 0,
        totalGoldSpent: 0,
        itemsPurchased: 0,
        itemsPurchasedByCategory: { heal: 0, damage: 0, equipment: 0, energy: 0, exp: 0 },
        combatsWon: 0,
        combatsLost: 0,
        metals: { or: 0, platine: 0, argent: 0, cuivre: 0 }
    };
    
    // Apply character stats in correct order:
    // 1. Class sets base stats
    // 2. Sex modifies stats
    // 3. Race modifies stats
    applyCharacterClass(player, classKey);
    applySexModifiers(player, sexKey);
    applyRaceModifiers(player, raceKey);
    
    return player;
}

// Check if player should level up
export function checkLevelUp(player) {
    while (player.xp >= player.xpToLevel) {
        player.level++;
        player.xp -= player.xpToLevel;
        
        // Progressive XP scaling - much harder progression (level 20 max)
        if (player.level < 5) {
            player.xpToLevel = Math.floor(player.xpToLevel * 1.40);
        } else if (player.level < 10) {
            player.xpToLevel = Math.floor(player.xpToLevel * 1.50);
        } else if (player.level < 15) {
            player.xpToLevel = Math.floor(player.xpToLevel * 1.60);
        } else {
            // Very hard to reach level 20
            player.xpToLevel = Math.floor(player.xpToLevel * 1.70);
        }
        
        // Stat increases
        player.maxHealth += 20;
        player.health = player.maxHealth;
        player.maxEnergy += 10;
        player.energy = player.maxEnergy;
        
        // Intelligent stat point allocation based on class
        // Each level grants 3 stat points to distribute
        const statPointsPerLevel = 3;
        allocateStatPoints(player, statPointsPerLevel);
    }
}

// Intelligently allocate stat points based on class priorities
function allocateStatPoints(player, points) {
    // Define stat priorities for each class
    const classPriorities = {
        guerrier: [
            { stat: 'puissance', weight: 0.4 },
            { stat: 'puissance', weight: 0.3 },
            { stat: 'defense', weight: 0.2 },
            { stat: 'adresse', weight: 0.1 }
        ],
        magicien: [
            { stat: 'esprit', weight: 0.5 },
            { stat: 'esprit', weight: 0.2 },
            { stat: 'puissance', weight: 0.2 },
            { stat: 'adresse', weight: 0.1 }
        ],
        archer: [
            { stat: 'adresse', weight: 0.4 },
            { stat: 'puissance', weight: 0.3 },
            { stat: 'puissance', weight: 0.2 },
            { stat: 'esprit', weight: 0.1 }
        ]
    };
    
    const priorities = classPriorities[player.class] || classPriorities.guerrier;
    
    // Distribute points according to weights
    for (const { stat, weight } of priorities) {
        const pointsToAdd = Math.round(points * weight);
        if (pointsToAdd > 0) {
            player[stat] += pointsToAdd;
        }
    }
}

// Simulate intelligent item purchasing
export function simulatePurchasing(player) {
    // Track equipped items to avoid duplicate purchases
    if (!player.equippedItems) {
        player.equippedItems = {
            weapon: null,
            armor: null,
            classItem: null // shield/book/quiver
        };
    }
    
    // Priority: healing if low health, then equipment for permanent upgrades, then energy, then potions
    const purchasableItems = shopItems.filter(item => {
        // Can afford
        if (item.cost > player.gold) return false;
        
        // Check class restriction
        if (item.classRestriction && item.classRestriction !== player.class) return false;
        
        // Check level requirement
        if (item.levelRequirement && player.level < item.levelRequirement) return false;
        
        return true;
    });
    
    if (purchasableItems.length === 0) return;
    
    // Calculate urgency scores for different item types
    const healthPercent = player.health / player.maxHealth;
    const energyPercent = player.energy / player.maxEnergy;
    const needsHealing = healthPercent < 0.6;
    const needsEnergy = energyPercent < 0.3;
    
    // Sort by priority with improved logic
    const sortedItems = purchasableItems.sort((a, b) => {
        // CRITICAL: If health is very low (< 40%), prioritize healing above all
        if (healthPercent < 0.4) {
            if (a.category === 'heal' && b.category !== 'heal') return -1;
            if (a.category !== 'heal' && b.category === 'heal') return 1;
        }
        
        // HIGH PRIORITY: Equipment upgrades (weapons, armor, class items)
        // These provide permanent benefits
        const aIsEquipment = a.category === 'equipment' || a.category === 'classes';
        const bIsEquipment = b.category === 'equipment' || b.category === 'classes';
        
        // Check if we need to upgrade this equipment slot
        const aNeedsUpgrade = isEquipmentUpgrade(player, a);
        const bNeedsUpgrade = isEquipmentUpgrade(player, b);
        
        if (aNeedsUpgrade && !bNeedsUpgrade) return -1;
        if (!aNeedsUpgrade && bNeedsUpgrade) return 1;
        
        // MEDIUM PRIORITY: Health if needed
        if (needsHealing) {
            if (a.category === 'heal' && b.category !== 'heal') return -1;
            if (a.category !== 'heal' && b.category === 'heal') return 1;
        }
        
        // MEDIUM PRIORITY: Energy if needed
        if (needsEnergy) {
            if (a.category === 'energy' && b.category !== 'energy') return -1;
            if (a.category !== 'energy' && b.category === 'energy') return 1;
        }
        
        // Prioritize equipment over consumables in general
        if (aIsEquipment && !bIsEquipment) return -1;
        if (!aIsEquipment && bIsEquipment) return 1;
        
        // For equipment, prefer better value (higher bonus per cost)
        if (aIsEquipment && bIsEquipment) {
            const aValue = (a.bonus || 0) / a.cost;
            const bValue = (b.bonus || 0) / b.cost;
            if (Math.abs(aValue - bValue) > 0.001) {
                return bValue - aValue;
            }
        }
        
        // For consumables, prefer items that match current needs
        if (a.category === 'heal' && b.category === 'heal') {
            // Buy just enough healing, not the most expensive
            const aHealing = parseInt(a.description.match(/\d+/)?.[0] || 0);
            const bHealing = parseInt(b.description.match(/\d+/)?.[0] || 0);
            const healthNeeded = player.maxHealth - player.health;
            
            const aDiff = Math.abs(aHealing - healthNeeded);
            const bDiff = Math.abs(bHealing - healthNeeded);
            return aDiff - bDiff;
        }
        
        // For other consumables, prefer higher tier
        return b.cost - a.cost;
    });
    
    // Buy the best affordable item
    const itemToBuy = sortedItems[0];
    if (itemToBuy) {
        player.gold -= itemToBuy.cost;
        player.totalGoldSpent += itemToBuy.cost;
        player.itemsPurchased++;
        
        // Track items purchased by category
        const trackCategory = itemToBuy.category === 'classes' ? 'equipment' : itemToBuy.category;
        if (player.itemsPurchasedByCategory[trackCategory] !== undefined) {
            player.itemsPurchasedByCategory[trackCategory]++;
        }
        
        // Apply item effect based on category and type
        if (itemToBuy.category === 'heal') {
            const healAmount = parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
            player.health = Math.min(player.maxHealth, player.health + healAmount);
        } else if (itemToBuy.category === 'damage') {
            const strBonus = parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
            player.puissance += strBonus;
        } else if (itemToBuy.category === 'equipment') {
            if (itemToBuy.type === 'weapon') {
                const strBonus = itemToBuy.bonus || parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
                player.puissance += strBonus;
                player.equippedItems.weapon = itemToBuy;
            } else if (itemToBuy.type === 'armor') {
                const defBonus = itemToBuy.bonus || parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
                player.defense += defBonus;
                player.equippedItems.armor = itemToBuy;
            }
        } else if (itemToBuy.category === 'classes') {
            // Class-specific items: shields, books, quivers
            if (itemToBuy.type === 'shield') {
                const defBonus = itemToBuy.bonus || 0;
                player.defense += defBonus;
                player.equippedItems.classItem = itemToBuy;
            } else if (itemToBuy.type === 'book') {
                const intBonus = itemToBuy.bonus || 0;
                player.esprit += intBonus;
                player.equippedItems.classItem = itemToBuy;
            } else if (itemToBuy.type === 'quiver') {
                const dexBonus = itemToBuy.bonus || 0;
                player.adresse += dexBonus;
                player.equippedItems.classItem = itemToBuy;
            }
        } else if (itemToBuy.category === 'energy') {
            const energyAmount = parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
            player.energy = Math.min(player.maxEnergy, player.energy + energyAmount);
        } else if (itemToBuy.category === 'exp') {
            const xpAmount = parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
            player.xp += xpAmount;
            checkLevelUp(player);
        }
    }
}

// Check if an item would be an upgrade over currently equipped item
function isEquipmentUpgrade(player, item) {
    if (item.category === 'equipment') {
        if (item.type === 'weapon') {
            const currentWeapon = player.equippedItems.weapon;
            if (!currentWeapon) return true;
            return (item.bonus || 0) > (currentWeapon.bonus || 0);
        } else if (item.type === 'armor') {
            const currentArmor = player.equippedItems.armor;
            if (!currentArmor) return true;
            return (item.bonus || 0) > (currentArmor.bonus || 0);
        }
    } else if (item.category === 'classes') {
        const currentClassItem = player.equippedItems.classItem;
        if (!currentClassItem) return true;
        return (item.bonus || 0) > (currentClassItem.bonus || 0);
    }
    return false;
}

// Simulate combat
export function simulateCombat(player, enemy) {
    // Ensure enemy has puissance (convert from strength if needed)
    const enemyCopy = { 
        ...enemy, 
        puissance: enemy.puissance || enemy.strength,
        health: enemy.health, 
        maxHealth: enemy.health 
    };
    
    let turns = 0;
    const maxTurns = 100; // Prevent infinite loops
    
    while (player.health > 0 && enemyCopy.health > 0 && turns < maxTurns) {
        turns++;
        
        // Player attacks
        const strengthMod = getStatModifier(player.puissance);
        const enemyDefenseMod = getStatModifier(enemyCopy.defense);
        
        // Use same damage variance as combat.js: -3 to +10
        const damageVariance = Math.floor(Math.random() * 14) - 3;
        let playerDamage = Math.max(1, player.puissance + strengthMod - (enemyCopy.defense + enemyDefenseMod) + damageVariance);
        
        // Critical hit chance (10%)
        if (Math.random() < 0.10) {
            playerDamage = Math.floor(playerDamage * 1.5);
        }
        
        enemyCopy.health -= playerDamage;
        
        if (enemyCopy.health <= 0) {
            // Victory - Add randomness to rewards (80% to 120% of base values)
            const goldMultiplier = 0.80 + Math.random() * 0.40;
            const xpMultiplier = 0.80 + Math.random() * 0.40;
            const goldEarned = Math.round(enemy.gold * goldMultiplier);
            const xpEarned = Math.round(enemy.xp * xpMultiplier);
            
            player.gold += goldEarned;
            player.totalGoldEarned += goldEarned;
            player.xp += xpEarned;
            player.kills++;
            player.combatsWon++;
            checkLevelUp(player);
            return true;
        }
        
        // Enemy attacks
        const enemyStrengthMod = getStatModifier(enemyCopy.puissance);
        const playerDefenseMod = getStatModifier(player.defense);
        
        // Use same damage variance as combat.js: -3 to +10
        const enemyDamageVariance = Math.floor(Math.random() * 14) - 3;
        const enemyDamage = Math.max(1, enemyCopy.puissance + enemyStrengthMod - (player.defense + playerDefenseMod) + enemyDamageVariance);
        player.health -= enemyDamage;
        
        if (player.health <= 0) {
            // Defeat
            player.deaths++;
            player.combatsLost++;
            player.health = Math.floor(player.maxHealth * 0.5);
            player.gold = Math.floor(player.gold * 0.5);
            return false;
        }
    }
    
    return false; // Timeout or error
}

// Simulate a single game
export function simulateGame(classKey, raceKey = 'humain', sexKey = 'male', maxCombats = 5000) {
    const player = createSimulatedPlayer(classKey, raceKey, sexKey);
    
    // Track stats at milestone levels
    const milestones = [5, 10, 15, 20];
    const milestoneStats = {};
    
    for (let i = 0; i < maxCombats; i++) {
        // Check if we've reached a milestone and haven't recorded it yet
        for (const milestone of milestones) {
            if (player.level >= milestone && !milestoneStats[milestone]) {
                milestoneStats[milestone] = {
                    level: player.level,
                    kills: player.kills,
                    deaths: player.deaths,
                    combatsWon: player.combatsWon,
                    combatsLost: player.combatsLost,
                    gold: player.gold,
                    totalGoldEarned: player.totalGoldEarned,
                    puissance: player.puissance,
                    defense: player.defense,
                    health: player.maxHealth
                };
            }
        }
        
        // Stop if we reach level 20 (maximum level)
        if (player.level >= 20) {
            break;
        }
        
        // Try to purchase items if we have gold
        if (player.gold >= 15) {
            simulatePurchasing(player);
        }
        
        // Select enemy based on player level with better scaling
        // Use a narrower range of enemies to match player level better
        const enemyLevelRange = Math.max(1, Math.min(enemies.length, Math.floor(player.level / 2)));
        const minEnemyIndex = Math.max(0, enemyLevelRange - 2);
        const maxEnemyIndex = Math.min(enemies.length - 1, enemyLevelRange + 1);
        const enemyTemplate = enemies[minEnemyIndex + Math.floor(Math.random() * (maxEnemyIndex - minEnemyIndex + 1))];
        
        // Check if should face boss (every 5 levels)
        let enemy;
        if (player.level % 5 === 0 && player.kills > 0 && (player.level / 5) > player.bossesDefeated) {
            const bossIndex = Math.min(player.bossesDefeated, bosses.length - 1);
            const bossTemplate = bosses[bossIndex];
            // Harder boss multipliers for level 20 max
            const levelMultiplier = 1 + (player.level - (player.bossesDefeated * 5)) * 0.15;
            const xpMultiplier = player.level > 10 ? 1.8 : 1.5;
            
            enemy = {
                ...bossTemplate,
                health: Math.floor(bossTemplate.health * levelMultiplier * 1.5),
                puissance: Math.floor((bossTemplate.puissance || bossTemplate.strength) * levelMultiplier * 1.3),
                defense: Math.floor(bossTemplate.defense * levelMultiplier * 1.2),
                gold: Math.floor(bossTemplate.gold * levelMultiplier * 2.0),
                xp: Math.floor(bossTemplate.xp * levelMultiplier * xpMultiplier),
                isBoss: true
            };
        } else {
            // Scale regular enemies - harder difficulty for level 20 cap
            const scaleFactor = Math.max(1, player.level / 3);
            const xpBonus = player.level > 15 ? 1.2 : player.level > 10 ? 1.0 : player.level > 5 ? 0.8 : 0.6;
            
            enemy = {
                ...enemyTemplate,
                health: Math.floor(enemyTemplate.health * scaleFactor * 1.3), // Much more HP
                puissance: Math.floor((enemyTemplate.puissance || enemyTemplate.strength) * scaleFactor * 1.2), // Stronger
                defense: Math.floor(enemyTemplate.defense * scaleFactor * 1.1),
                gold: Math.floor(enemyTemplate.gold * scaleFactor * 1.5),
                xp: Math.floor(enemyTemplate.xp * scaleFactor * xpBonus) // Reduced XP gains
            };
        }
        
        const won = simulateCombat(player, enemy);
        
        if (won && enemy.isBoss) {
            player.bossesDefeated++;
        }
        
        // Better rest logic - rest if health is low and we have gold
        if (player.health < player.maxHealth * 0.5 && player.gold >= 20) {
            const restCost = Math.min(player.gold, 30);
            player.gold -= restCost;
            player.health = player.maxHealth;
        }
    }
    
    // Ensure we capture final state for levels reached
    for (const milestone of milestones) {
        if (player.level >= milestone && !milestoneStats[milestone]) {
            milestoneStats[milestone] = {
                level: player.level,
                kills: player.kills,
                deaths: player.deaths,
                combatsWon: player.combatsWon,
                combatsLost: player.combatsLost,
                gold: player.gold,
                totalGoldEarned: player.totalGoldEarned,
                puissance: player.puissance,
                defense: player.defense,
                health: player.maxHealth
            };
        }
    }
    
    return {
        class: classKey,
        race: raceKey,
        sex: sexKey,
        finalLevel: player.level,
        kills: player.kills,
        deaths: player.deaths,
        combatsWon: player.combatsWon,
        combatsLost: player.combatsLost,
        bossesDefeated: player.bossesDefeated,
        finalGold: player.gold,
        totalGoldEarned: player.totalGoldEarned,
        totalGoldSpent: player.totalGoldSpent,
        itemsPurchased: player.itemsPurchased,
        itemsPurchasedByCategory: player.itemsPurchasedByCategory,
        finalStrength: player.puissance,
        finalDefense: player.defense,
        finalHealth: player.maxHealth,
        finalDexterity: player.adresse,
        finalConstitution: player.puissance,
        winRate: player.combatsWon / (player.combatsWon + player.combatsLost),
        reachedLevel20: player.level >= 20,
        milestoneStats: milestoneStats // Add milestone tracking
    };
}
