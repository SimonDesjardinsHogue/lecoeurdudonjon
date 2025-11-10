// Balance Testing Module
// Runs automated game simulations to test balance

import { characterClasses, applyCharacterClass } from './character-classes.js';
import { characterRaces, applyRaceModifiers } from './character-races.js';
import { characterSexes, applySexBaseStats } from './character-sexes.js';
import { enemies, bosses, getStatModifier } from './game-state.js';
import { shopItems } from './data/shop-items.js';

// Create a simulated player
function createSimulatedPlayer(classKey, raceKey = 'humain', sexKey = 'male') {
    const player = {
        name: `Test_${classKey}_${raceKey}_${sexKey}`,
        gender: sexKey,
        race: raceKey,
        class: classKey,
        level: 1,
        health: 100,
        maxHealth: 100,
        strength: 10,
        defense: 5,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
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
    
    // Apply character class and race
    applySexBaseStats(player, sexKey);
    applyCharacterClass(player, classKey);
    applyRaceModifiers(player, raceKey);
    
    return player;
}

// Check if player should level up
function checkLevelUp(player) {
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
            { stat: 'strength', weight: 0.4 },
            { stat: 'constitution', weight: 0.3 },
            { stat: 'defense', weight: 0.2 },
            { stat: 'dexterity', weight: 0.1 }
        ],
        magicien: [
            { stat: 'intelligence', weight: 0.5 },
            { stat: 'wisdom', weight: 0.2 },
            { stat: 'constitution', weight: 0.2 },
            { stat: 'dexterity', weight: 0.1 }
        ],
        archer: [
            { stat: 'dexterity', weight: 0.4 },
            { stat: 'strength', weight: 0.3 },
            { stat: 'constitution', weight: 0.2 },
            { stat: 'wisdom', weight: 0.1 }
        ]
    };
    
    const priorities = classPriorities[player.class] || classPriorities.guerrier;
    
    // Distribute points based on weighted priorities
    for (let i = 0; i < points; i++) {
        // Use weighted random selection for variety
        const rand = Math.random();
        let cumulative = 0;
        
        for (const priority of priorities) {
            cumulative += priority.weight;
            if (rand <= cumulative) {
                player[priority.stat]++;
                
                // Update derived stats
                if (priority.stat === 'constitution') {
                    player.maxHealth += 5;
                    player.health += 5;
                }
                break;
            }
        }
    }
}

// Simulate intelligent item purchasing
function simulatePurchasing(player) {
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
            player.strength += strBonus;
        } else if (itemToBuy.category === 'equipment') {
            if (itemToBuy.type === 'weapon') {
                const strBonus = itemToBuy.bonus || parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
                player.strength += strBonus;
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
                player.intelligence += intBonus;
                player.equippedItems.classItem = itemToBuy;
            } else if (itemToBuy.type === 'quiver') {
                const dexBonus = itemToBuy.bonus || 0;
                player.dexterity += dexBonus;
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
function simulateCombat(player, enemy) {
    const enemyCopy = { ...enemy, health: enemy.health, maxHealth: enemy.health };
    
    let turns = 0;
    const maxTurns = 100; // Prevent infinite loops
    
    while (player.health > 0 && enemyCopy.health > 0 && turns < maxTurns) {
        turns++;
        
        // Player attacks
        const strengthMod = getStatModifier(player.strength);
        const enemyDefenseMod = getStatModifier(enemyCopy.defense);
        
        // Use same damage variance as combat.js: -3 to +10
        const damageVariance = Math.floor(Math.random() * 14) - 3;
        let playerDamage = Math.max(1, player.strength + strengthMod - (enemyCopy.defense + enemyDefenseMod) + damageVariance);
        
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
        const enemyStrengthMod = getStatModifier(enemyCopy.strength);
        const playerDefenseMod = getStatModifier(player.defense);
        
        // Use same damage variance as combat.js: -3 to +10
        const enemyDamageVariance = Math.floor(Math.random() * 14) - 3;
        const enemyDamage = Math.max(1, enemyCopy.strength + enemyStrengthMod - (player.defense + playerDefenseMod) + enemyDamageVariance);
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
function simulateGame(classKey, raceKey = 'humain', sexKey = 'male', maxCombats = 5000) {
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
                    strength: player.strength,
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
                strength: Math.floor(bossTemplate.strength * levelMultiplier * 1.3),
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
                strength: Math.floor(enemyTemplate.strength * scaleFactor * 1.2), // Stronger
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
                strength: player.strength,
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
        finalStrength: player.strength,
        finalDefense: player.defense,
        finalHealth: player.maxHealth,
        finalDexterity: player.dexterity,
        finalConstitution: player.constitution,
        winRate: player.combatsWon / (player.combatsWon + player.combatsLost),
        reachedLevel20: player.level >= 20,
        milestoneStats: milestoneStats // Add milestone tracking
    };
}

// Run balance tests (synchronous version for CLI)
export function runBalanceTests(iterations = 2500) {
    const results = {
        byClass: {
            guerrier: [],
            magicien: [],
            archer: []
        },
        byRace: {
            humain: [],
            elfe: [],
            nain: []
        },
        bySex: {
            male: [],
            female: []
        },
        byCombination: {}
    };
    
    const classes = ['guerrier', 'magicien', 'archer'];
    const races = ['humain', 'elfe', 'nain'];
    const sexes = ['male', 'female'];
    
    console.log(`Starting balance tests with ${iterations} iterations per class-race-sex combination...`);
    console.log(`Total simulations: ${classes.length * races.length * sexes.length * iterations} (${classes.length} classes × ${races.length} races × ${sexes.length} sexes × ${iterations} games)`);
    
    let totalGames = 0;
    const totalSimulations = classes.length * races.length * sexes.length * iterations;
    
    for (const classKey of classes) {
        for (const raceKey of races) {
            for (const sexKey of sexes) {
                const comboKey = `${classKey}_${raceKey}_${sexKey}`;
                results.byCombination[comboKey] = [];
                
                console.log(`Testing ${classKey} + ${raceKey} + ${sexKey}...`);
                
                for (let i = 0; i < iterations; i++) {
                    if (i % 100 === 0) {
                        totalGames = ((classes.indexOf(classKey) * races.length + races.indexOf(raceKey)) * sexes.length + sexes.indexOf(sexKey)) * iterations + i;
                        const progress = ((totalGames / totalSimulations) * 100).toFixed(1);
                        console.log(`  Progress: ${progress}% (${totalGames}/${totalSimulations}) - ${classKey}+${raceKey}+${sexKey}: ${i}/${iterations}`);
                    }
                    
                    const result = simulateGame(classKey, raceKey, sexKey);
                    results.byClass[classKey].push(result);
                    results.byRace[raceKey].push(result);
                    results.bySex[sexKey].push(result);
                    results.byCombination[comboKey].push(result);
                }
            }
        }
    }
    
    console.log(`Completed all ${totalSimulations} simulations!`);
    
    return analyzeResults(results);
}

// Run balance tests asynchronously with progress callbacks (for UI)
export async function runBalanceTestsAsync(iterations = 100, progressCallback = null) {
    const results = {
        byClass: {
            guerrier: [],
            magicien: [],
            archer: []
        },
        byRace: {
            humain: [],
            elfe: [],
            nain: []
        },
        bySex: {
            male: [],
            female: []
        },
        byCombination: {}
    };
    
    const classes = ['guerrier', 'magicien', 'archer'];
    const races = ['humain', 'elfe', 'nain'];
    const sexes = ['male', 'female'];
    
    console.log(`Starting balance tests with ${iterations} iterations per class-race-sex combination...`);
    console.log(`Total simulations: ${classes.length * races.length * sexes.length * iterations} (${classes.length} classes × ${races.length} races × ${sexes.length} sexes × ${iterations} games)`);
    
    let totalGames = 0;
    const totalSimulations = classes.length * races.length * sexes.length * iterations;
    
    for (const classKey of classes) {
        for (const raceKey of races) {
            for (const sexKey of sexes) {
                const comboKey = `${classKey}_${raceKey}_${sexKey}`;
                results.byCombination[comboKey] = [];
                
                console.log(`Testing ${classKey} + ${raceKey} + ${sexKey}...`);
                
                for (let i = 0; i < iterations; i++) {
                    // Yield to browser every 10 simulations to keep UI responsive
                    if (i % 10 === 0) {
                        totalGames = ((classes.indexOf(classKey) * races.length + races.indexOf(raceKey)) * sexes.length + sexes.indexOf(sexKey)) * iterations + i;
                        const progress = (totalGames / totalSimulations) * 100;
                        
                        if (progressCallback) {
                            progressCallback({
                                progress: progress,
                                currentGames: totalGames,
                                totalGames: totalSimulations,
                                currentCombo: `${classKey}+${raceKey}+${sexKey}`,
                                currentIteration: i,
                                totalIterations: iterations
                            });
                        }
                        
                        // Yield control to browser to update UI and prevent freezing
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                    
                    const result = simulateGame(classKey, raceKey, sexKey);
                    results.byClass[classKey].push(result);
                    results.byRace[raceKey].push(result);
                    results.bySex[sexKey].push(result);
                    results.byCombination[comboKey].push(result);
                }
            }
        }
    }
    
    console.log(`Completed all ${totalSimulations} simulations!`);
    
    return analyzeResults(results);
}

// Analyze and format results
function analyzeResults(results) {
    const analysis = {
        byClass: {},
        byRace: {},
        bySex: {},
        byCombination: {}
    };
    
    // Analyze by class
    for (const [classKey, games] of Object.entries(results.byClass)) {
        const stats = {
            class: classKey,
            className: characterClasses[classKey].name,
            gamesPlayed: games.length,
            avgLevel: average(games.map(g => g.finalLevel)),
            avgKills: average(games.map(g => g.kills)),
            avgDeaths: average(games.map(g => g.deaths)),
            avgWinRate: average(games.map(g => g.winRate)),
            avgBossesDefeated: average(games.map(g => g.bossesDefeated)),
            avgGoldEarned: average(games.map(g => g.totalGoldEarned)),
            avgGoldSpent: average(games.map(g => g.totalGoldSpent)),
            avgFinalGold: average(games.map(g => g.finalGold)),
            avgItemsPurchased: average(games.map(g => g.itemsPurchased)),
            avgItemsByCategory: {
                heal: average(games.map(g => g.itemsPurchasedByCategory.heal)),
                damage: average(games.map(g => g.itemsPurchasedByCategory.damage)),
                equipment: average(games.map(g => g.itemsPurchasedByCategory.equipment)),
                energy: average(games.map(g => g.itemsPurchasedByCategory.energy)),
                exp: average(games.map(g => g.itemsPurchasedByCategory.exp))
            },
            avgStrength: average(games.map(g => g.finalStrength)),
            avgDefense: average(games.map(g => g.finalDefense)),
            avgHealth: average(games.map(g => g.finalHealth)),
            avgDexterity: average(games.map(g => g.finalDexterity)),
            avgConstitution: average(games.map(g => g.finalConstitution)),
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills)),
            percentReachedLevel20: (games.filter(g => g.reachedLevel20).length / games.length * 100),
            milestones: {
                5: calculateMilestoneStats(games, 5),
                10: calculateMilestoneStats(games, 10),
                15: calculateMilestoneStats(games, 15),
                20: calculateMilestoneStats(games, 20)
            }
        };
        
        analysis.byClass[classKey] = stats;
    }
    
    // Analyze by race
    for (const [raceKey, games] of Object.entries(results.byRace)) {
        const stats = {
            race: raceKey,
            raceName: characterRaces[raceKey].name,
            gamesPlayed: games.length,
            avgLevel: average(games.map(g => g.finalLevel)),
            avgKills: average(games.map(g => g.kills)),
            avgDeaths: average(games.map(g => g.deaths)),
            avgWinRate: average(games.map(g => g.winRate)),
            avgBossesDefeated: average(games.map(g => g.bossesDefeated)),
            avgGoldEarned: average(games.map(g => g.totalGoldEarned)),
            avgGoldSpent: average(games.map(g => g.totalGoldSpent)),
            avgFinalGold: average(games.map(g => g.finalGold)),
            avgItemsPurchased: average(games.map(g => g.itemsPurchased)),
            avgItemsByCategory: {
                heal: average(games.map(g => g.itemsPurchasedByCategory.heal)),
                damage: average(games.map(g => g.itemsPurchasedByCategory.damage)),
                equipment: average(games.map(g => g.itemsPurchasedByCategory.equipment)),
                energy: average(games.map(g => g.itemsPurchasedByCategory.energy)),
                exp: average(games.map(g => g.itemsPurchasedByCategory.exp))
            },
            avgStrength: average(games.map(g => g.finalStrength)),
            avgDefense: average(games.map(g => g.finalDefense)),
            avgHealth: average(games.map(g => g.finalHealth)),
            avgDexterity: average(games.map(g => g.finalDexterity)),
            avgConstitution: average(games.map(g => g.finalConstitution)),
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills)),
            percentReachedLevel20: (games.filter(g => g.reachedLevel20).length / games.length * 100),
            milestones: {
                5: calculateMilestoneStats(games, 5),
                10: calculateMilestoneStats(games, 10),
                15: calculateMilestoneStats(games, 15),
                20: calculateMilestoneStats(games, 20)
            }
        };
        
        analysis.byRace[raceKey] = stats;
    }
    
    // Analyze by sex
    for (const [sexKey, games] of Object.entries(results.bySex)) {
        const stats = {
            sex: sexKey,
            sexName: characterSexes[sexKey].name,
            gamesPlayed: games.length,
            avgLevel: average(games.map(g => g.finalLevel)),
            avgKills: average(games.map(g => g.kills)),
            avgDeaths: average(games.map(g => g.deaths)),
            avgWinRate: average(games.map(g => g.winRate)),
            avgBossesDefeated: average(games.map(g => g.bossesDefeated)),
            avgGoldEarned: average(games.map(g => g.totalGoldEarned)),
            avgGoldSpent: average(games.map(g => g.totalGoldSpent)),
            avgFinalGold: average(games.map(g => g.finalGold)),
            avgItemsPurchased: average(games.map(g => g.itemsPurchased)),
            avgItemsByCategory: {
                heal: average(games.map(g => g.itemsPurchasedByCategory.heal)),
                damage: average(games.map(g => g.itemsPurchasedByCategory.damage)),
                equipment: average(games.map(g => g.itemsPurchasedByCategory.equipment)),
                energy: average(games.map(g => g.itemsPurchasedByCategory.energy)),
                exp: average(games.map(g => g.itemsPurchasedByCategory.exp))
            },
            avgStrength: average(games.map(g => g.finalStrength)),
            avgDefense: average(games.map(g => g.finalDefense)),
            avgHealth: average(games.map(g => g.finalHealth)),
            avgDexterity: average(games.map(g => g.finalDexterity)),
            avgConstitution: average(games.map(g => g.finalConstitution)),
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills)),
            percentReachedLevel20: (games.filter(g => g.reachedLevel20).length / games.length * 100),
            milestones: {
                5: calculateMilestoneStats(games, 5),
                10: calculateMilestoneStats(games, 10),
                15: calculateMilestoneStats(games, 15),
                20: calculateMilestoneStats(games, 20)
            }
        };
        
        analysis.bySex[sexKey] = stats;
    }
    
    // Analyze by combination
    for (const [comboKey, games] of Object.entries(results.byCombination)) {
        const parts = comboKey.split('_');
        const classKey = parts[0];
        const raceKey = parts[1];
        const sexKey = parts[2];
        
        const stats = {
            class: classKey,
            race: raceKey,
            sex: sexKey,
            className: characterClasses[classKey].name,
            raceName: characterRaces[raceKey].name,
            sexName: characterSexes[sexKey].name,
            gamesPlayed: games.length,
            avgLevel: average(games.map(g => g.finalLevel)),
            avgKills: average(games.map(g => g.kills)),
            avgDeaths: average(games.map(g => g.deaths)),
            avgWinRate: average(games.map(g => g.winRate)),
            avgBossesDefeated: average(games.map(g => g.bossesDefeated)),
            avgGoldEarned: average(games.map(g => g.totalGoldEarned)),
            avgGoldSpent: average(games.map(g => g.totalGoldSpent)),
            avgFinalGold: average(games.map(g => g.finalGold)),
            avgItemsPurchased: average(games.map(g => g.itemsPurchased)),
            avgItemsByCategory: {
                heal: average(games.map(g => g.itemsPurchasedByCategory.heal)),
                damage: average(games.map(g => g.itemsPurchasedByCategory.damage)),
                equipment: average(games.map(g => g.itemsPurchasedByCategory.equipment)),
                energy: average(games.map(g => g.itemsPurchasedByCategory.energy)),
                exp: average(games.map(g => g.itemsPurchasedByCategory.exp))
            },
            avgStrength: average(games.map(g => g.finalStrength)),
            avgDefense: average(games.map(g => g.finalDefense)),
            avgHealth: average(games.map(g => g.finalHealth)),
            avgDexterity: average(games.map(g => g.finalDexterity)),
            avgConstitution: average(games.map(g => g.finalConstitution)),
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills)),
            percentReachedLevel20: (games.filter(g => g.reachedLevel20).length / games.length * 100)
        };
        
        analysis.byCombination[comboKey] = stats;
    }
    
    return generateBalanceReport(analysis);
}

// Calculate average
function average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Calculate milestone statistics
function calculateMilestoneStats(games, milestone) {
    const gamesReachedMilestone = games.filter(g => g.milestoneStats && g.milestoneStats[milestone]);
    
    if (gamesReachedMilestone.length === 0) {
        return {
            gamesReached: 0,
            percentReached: 0,
            avgKills: 0,
            avgDeaths: 0,
            avgGold: 0,
            avgStrength: 0,
            avgDefense: 0,
            avgHealth: 0
        };
    }
    
    return {
        gamesReached: gamesReachedMilestone.length,
        percentReached: (gamesReachedMilestone.length / games.length) * 100,
        avgKills: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].kills)),
        avgDeaths: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].deaths)),
        avgGold: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].gold)),
        avgStrength: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].strength)),
        avgDefense: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].defense)),
        avgHealth: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].health))
    };
}

// Generate balance report with suggestions
function generateBalanceReport(analysis) {
    const report = {
        summary: {},
        classStats: analysis.byClass,
        raceStats: analysis.byRace,
        sexStats: analysis.bySex,
        combinationStats: analysis.byCombination,
        balanceScore: { byClass: {}, byRace: {}, bySex: {} },
        suggestions: []
    };
    
    // Calculate overall metrics for classes
    const allClasses = Object.values(analysis.byClass);
    const avgLevelOverall = average(allClasses.map(c => c.avgLevel));
    const avgWinRateOverall = average(allClasses.map(c => c.avgWinRate));
    const avgKillsOverall = average(allClasses.map(c => c.avgKills));
    const avgLevel20Percent = average(allClasses.map(c => c.percentReachedLevel20));
    
    // Calculate overall metrics for races
    const allRaces = Object.values(analysis.byRace);
    const avgLevelOverallRace = average(allRaces.map(r => r.avgLevel));
    const avgWinRateOverallRace = average(allRaces.map(r => r.avgWinRate));
    const avgKillsOverallRace = average(allRaces.map(r => r.avgKills));
    
    // Calculate overall metrics for sexes
    const allSexes = Object.values(analysis.bySex);
    const avgLevelOverallSex = average(allSexes.map(s => s.avgLevel));
    const avgWinRateOverallSex = average(allSexes.map(s => s.avgWinRate));
    const avgKillsOverallSex = average(allSexes.map(s => s.avgKills));
    
    // Calculate total simulations
    const totalSimulations = Object.values(analysis.byCombination).reduce((sum, c) => sum + c.gamesPlayed, 0);
    
    // Calculate average bosses defeated
    const avgBossesDefeated = average(allClasses.map(c => c.avgBossesDefeated));
    
    report.summary = {
        avgLevel: avgLevelOverall.toFixed(2),
        avgWinRate: (avgWinRateOverall * 100).toFixed(2) + '%',
        avgKills: avgKillsOverall.toFixed(2),
        avgBossesDefeated: avgBossesDefeated.toFixed(2),
        percentReachedLevel20: avgLevel20Percent.toFixed(2) + '%',
        totalSimulations: totalSimulations
    };
    
    // Calculate balance scores for classes (deviation from average)
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const levelDeviation = Math.abs(stats.avgLevel - avgLevelOverall) / avgLevelOverall;
        const winRateDeviation = Math.abs(stats.avgWinRate - avgWinRateOverall) / avgWinRateOverall;
        const killsDeviation = Math.abs(stats.avgKills - avgKillsOverall) / avgKillsOverall;
        
        const balanceScore = 100 - ((levelDeviation + winRateDeviation + killsDeviation) / 3 * 100);
        report.balanceScore.byClass[classKey] = balanceScore.toFixed(2);
    }
    
    // Calculate balance scores for races
    for (const [raceKey, stats] of Object.entries(analysis.byRace)) {
        const levelDeviation = Math.abs(stats.avgLevel - avgLevelOverallRace) / avgLevelOverallRace;
        const winRateDeviation = Math.abs(stats.avgWinRate - avgWinRateOverallRace) / avgWinRateOverallRace;
        const killsDeviation = Math.abs(stats.avgKills - avgKillsOverallRace) / avgKillsOverallRace;
        
        const balanceScore = 100 - ((levelDeviation + winRateDeviation + killsDeviation) / 3 * 100);
        report.balanceScore.byRace[raceKey] = balanceScore.toFixed(2);
    }
    
    // Calculate balance scores for sexes
    for (const [sexKey, stats] of Object.entries(analysis.bySex)) {
        const levelDeviation = Math.abs(stats.avgLevel - avgLevelOverallSex) / avgLevelOverallSex;
        const winRateDeviation = Math.abs(stats.avgWinRate - avgWinRateOverallSex) / avgWinRateOverallSex;
        const killsDeviation = Math.abs(stats.avgKills - avgKillsOverallSex) / avgKillsOverallSex;
        
        const balanceScore = 100 - ((levelDeviation + winRateDeviation + killsDeviation) / 3 * 100);
        report.balanceScore.bySex[sexKey] = balanceScore.toFixed(2);
    }
    
    // NEW REQUIREMENT: Only suggest for EXTREME cases - compare all classes/races/sexes
    // Find the single most extreme underperformer for each metric
    
    // 1. Find class that dies the most (compared to others)
    const avgDeathsOverall = average(allClasses.map(c => c.avgDeaths));
    let worstDeathsClass = null;
    let maxDeathDeviation = 0;
    
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const deathDeviation = (stats.avgDeaths - avgDeathsOverall) / avgDeathsOverall;
        if (deathDeviation > maxDeathDeviation && deathDeviation > 0.3) { // At least 30% more deaths
            maxDeathDeviation = deathDeviation;
            worstDeathsClass = { classKey, stats, deviation: deathDeviation };
        }
    }
    
    if (worstDeathsClass) {
        report.suggestions.push({
            category: 'class',
            class: worstDeathsClass.classKey,
            type: 'survivability',
            metric: 'deaths',
            severity: 3,
            suggestion: `${worstDeathsClass.stats.className} meurt beaucoup trop souvent comparé aux autres classes (${worstDeathsClass.stats.avgDeaths.toFixed(1)} morts vs ${avgDeathsOverall.toFixed(1)} en moyenne, +${(maxDeathDeviation * 100).toFixed(0)}%). Suggestion: Augmenter les PV de base de +20 ou améliorer la défense de +3.`
        });
    }
    
    // 2. Find class that kills the least (compared to others)
    let worstKillsClass = null;
    let maxKillDeficit = 0;
    
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const killDeficit = (avgKillsOverall - stats.avgKills) / avgKillsOverall;
        if (killDeficit > maxKillDeficit && killDeficit > 0.2) { // At least 20% fewer kills
            maxKillDeficit = killDeficit;
            worstKillsClass = { classKey, stats, deficit: killDeficit };
        }
    }
    
    if (worstKillsClass) {
        report.suggestions.push({
            category: 'class',
            class: worstKillsClass.classKey,
            type: 'offense',
            metric: 'kills',
            severity: 2,
            suggestion: `${worstKillsClass.stats.className} tue beaucoup moins d'ennemis que les autres classes (${worstKillsClass.stats.avgKills.toFixed(1)} kills vs ${avgKillsOverall.toFixed(1)} en moyenne, -${(maxKillDeficit * 100).toFixed(0)}%). Suggestion: Augmenter la force de base de +3 ou améliorer les gains d'XP de +15%.`
        });
    }
    
    // 3. Find class with the least gold (compared to others)
    const avgFinalGoldOverall = average(allClasses.map(c => c.avgFinalGold));
    let worstGoldClass = null;
    let maxGoldDeficit = 0;
    
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const goldDeficit = (avgFinalGoldOverall - stats.avgFinalGold) / avgFinalGoldOverall;
        if (goldDeficit > maxGoldDeficit && goldDeficit > 0.3) { // At least 30% less gold
            maxGoldDeficit = goldDeficit;
            worstGoldClass = { classKey, stats, deficit: goldDeficit };
        }
    }
    
    if (worstGoldClass) {
        report.suggestions.push({
            category: 'class',
            class: worstGoldClass.classKey,
            type: 'economy',
            metric: 'gold',
            severity: 2,
            suggestion: `${worstGoldClass.stats.className} termine avec beaucoup moins d'or que les autres classes (${worstGoldClass.stats.avgFinalGold.toFixed(0)} or vs ${avgFinalGoldOverall.toFixed(0)} en moyenne, -${(maxGoldDeficit * 100).toFixed(0)}%). Suggestion: Augmenter les récompenses en or de +25% pour cette classe ou réduire le coût de repos de -30%.`
        });
    }
    
    // 4. Find class with worst win rate (if extreme)
    let worstWinRateClass = null;
    let maxWinRateDeficit = 0;
    
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const winRateDeficit = (avgWinRateOverall - stats.avgWinRate) / avgWinRateOverall;
        if (winRateDeficit > maxWinRateDeficit && winRateDeficit > 0.15) { // At least 15% worse
            maxWinRateDeficit = winRateDeficit;
            worstWinRateClass = { classKey, stats, deficit: winRateDeficit };
        }
    }
    
    if (worstWinRateClass) {
        report.suggestions.push({
            category: 'class',
            class: worstWinRateClass.classKey,
            type: 'underpowered',
            metric: 'winRate',
            severity: 3,
            suggestion: `${worstWinRateClass.stats.className} a un taux de victoire très inférieur aux autres classes (${(worstWinRateClass.stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverall * 100).toFixed(1)}% en moyenne, -${(maxWinRateDeficit * 100).toFixed(0)}%). Suggestion: Augmenter la force de base de +2 ET la défense de +2.`
        });
    }
    
    // 5. Check races for extreme differences
    const avgDeathsRace = average(allRaces.map(r => r.avgDeaths));
    let worstDeathsRace = null;
    let maxDeathDeviationRace = 0;
    
    for (const [raceKey, stats] of Object.entries(analysis.byRace)) {
        const deathDeviation = (stats.avgDeaths - avgDeathsRace) / avgDeathsRace;
        if (deathDeviation > maxDeathDeviationRace && deathDeviation > 0.25) {
            maxDeathDeviationRace = deathDeviation;
            worstDeathsRace = { raceKey, stats, deviation: deathDeviation };
        }
    }
    
    if (worstDeathsRace) {
        report.suggestions.push({
            category: 'race',
            race: worstDeathsRace.raceKey,
            type: 'survivability',
            metric: 'deaths',
            severity: 2,
            suggestion: `${worstDeathsRace.stats.raceName} meurt plus souvent que les autres races (${worstDeathsRace.stats.avgDeaths.toFixed(1)} morts vs ${avgDeathsRace.toFixed(1)} en moyenne, +${(maxDeathDeviationRace * 100).toFixed(0)}%). Suggestion: Augmenter le modificateur de constitution de +2.`
        });
    }
    
    // 6. Check sexes for extreme differences
    const avgDeathsSex = average(allSexes.map(s => s.avgDeaths));
    let worstDeathsSex = null;
    let maxDeathDeviationSex = 0;
    
    for (const [sexKey, stats] of Object.entries(analysis.bySex)) {
        const deathDeviation = (stats.avgDeaths - avgDeathsSex) / avgDeathsSex;
        if (deathDeviation > maxDeathDeviationSex && deathDeviation > 0.20) {
            maxDeathDeviationSex = deathDeviation;
            worstDeathsSex = { sexKey, stats, deviation: deathDeviation };
        }
    }
    
    if (worstDeathsSex) {
        report.suggestions.push({
            category: 'sex',
            sex: worstDeathsSex.sexKey,
            type: 'survivability',
            metric: 'deaths',
            severity: 2,
            suggestion: `${worstDeathsSex.stats.sexName} meurt plus souvent que l'autre sexe (${worstDeathsSex.stats.avgDeaths.toFixed(1)} morts vs ${avgDeathsSex.toFixed(1)} en moyenne, +${(maxDeathDeviationSex * 100).toFixed(0)}%). Suggestion: Augmenter les PV de base de +10 ou la défense de +1.`
        });
    }
    
    // Overall game balance suggestions
    if (avgWinRateOverall < 0.6) {
        report.suggestions.push({
            category: 'game',
            class: 'all',
            type: 'difficulty',
            metric: 'overall',
            suggestion: `Le jeu est trop difficile avec un taux de victoire global de ${(avgWinRateOverall * 100).toFixed(1)}%. Suggestion: Réduire la force des ennemis de -10% ou augmenter l'or de départ à 100.`
        });
    }
    
    if (avgWinRateOverall > 0.85) {
        report.suggestions.push({
            category: 'game',
            class: 'all',
            type: 'difficulty',
            metric: 'overall',
            suggestion: `Le jeu est trop facile avec un taux de victoire global de ${(avgWinRateOverall * 100).toFixed(1)}%. Suggestion: Augmenter la force des ennemis de +10% ou réduire l'or de départ à 50.`
        });
    }
    
    // Level 20 progression suggestion
    if (avgLevel20Percent < 10) {
        report.suggestions.push({
            category: 'game',
            class: 'all',
            type: 'progression',
            metric: 'level20',
            suggestion: `Seulement ${avgLevel20Percent.toFixed(1)}% des joueurs atteignent le niveau 20. Suggestion: Augmenter les gains d'XP de +20% ou réduire les requis d'XP par niveau.`
        });
    }
    
    // Item pricing analysis
    const allGames = Object.values(analysis.byCombination).flatMap(combo => 
        Array(combo.gamesPlayed).fill({
            avgGoldSpent: combo.avgGoldSpent,
            avgItemsPurchased: combo.avgItemsPurchased,
            avgItemsByCategory: combo.avgItemsByCategory
        })
    );
    
    const avgGoldPerItem = analysis.byClass[Object.keys(analysis.byClass)[0]].avgGoldSpent / 
                           analysis.byClass[Object.keys(analysis.byClass)[0]].avgItemsPurchased;
    
    if (avgGoldPerItem > 100) {
        report.suggestions.push({
            category: 'economy',
            class: 'all',
            type: 'pricing',
            metric: 'items',
            suggestion: `Les objets coûtent en moyenne ${avgGoldPerItem.toFixed(0)} or, ce qui est élevé. Suggestion: Réduire les prix de 10-15% ou augmenter les gains d'or.`
        });
    }
    
    return report;
}

// Format report as HTML table
export function formatReportAsHTML(report) {
    let html = '<div class="balance-report">';
    
    // Summary
    html += '<div class="report-section">';
    html += '<h3>📊 Résumé Global</h3>';
    html += '<div class="shop-item" style="display: block;">';
    html += `<p><strong>Total de simulations:</strong> ${report.summary.totalSimulations.toLocaleString()}</p>`;
    html += `<p><strong>Niveau moyen atteint:</strong> ${report.summary.avgLevel}</p>`;
    html += `<p><strong>Taux de victoire moyen:</strong> ${report.summary.avgWinRate}</p>`;
    html += `<p><strong>Ennemis vaincus (moyenne):</strong> ${report.summary.avgKills}</p>`;
    html += `<p><strong>% atteignant niveau 20:</strong> ${report.summary.percentReachedLevel20}</p>`;
    html += '</div></div>';
    
    // Class comparison table
    html += '<div class="report-section">';
    html += '<h3>⚔️ Comparaison des Classes</h3>';
    html += '<table class="balance-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
    html += '<thead><tr style="background: rgba(218, 165, 32, 0.3);">';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Classe</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Parties</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Niveau Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Taux Victoire</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Kills Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Morts Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Final</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Équilibre</th>';
    html += '</tr></thead><tbody>';
    
    for (const [classKey, stats] of Object.entries(report.classStats)) {
        const balanceScore = parseFloat(report.balanceScore.byClass[classKey]);
        const scoreColor = balanceScore >= 90 ? '#51cf66' : balanceScore >= 80 ? '#DAA520' : '#ff6b6b';
        
        html += '<tr>';
        html += `<td style="padding: 8px; border: 1px solid #8B4513;"><strong>${stats.className}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.gamesPlayed.toLocaleString()}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgLevel.toFixed(2)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${(stats.avgWinRate * 100).toFixed(1)}%</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgKills.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgDeaths.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgFinalGold.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513; color: ${scoreColor}; font-weight: bold;">${balanceScore.toFixed(0)}/100</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    
    // Race comparison table
    html += '<div class="report-section">';
    html += '<h3>🧝 Comparaison des Races</h3>';
    html += '<table class="balance-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
    html += '<thead><tr style="background: rgba(218, 165, 32, 0.3);">';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Race</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Parties</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Niveau Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Taux Victoire</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Kills Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Morts Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Final</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Équilibre</th>';
    html += '</tr></thead><tbody>';
    
    for (const [raceKey, stats] of Object.entries(report.raceStats)) {
        const balanceScore = parseFloat(report.balanceScore.byRace[raceKey]);
        const scoreColor = balanceScore >= 90 ? '#51cf66' : balanceScore >= 80 ? '#DAA520' : '#ff6b6b';
        
        html += '<tr>';
        html += `<td style="padding: 8px; border: 1px solid #8B4513;"><strong>${stats.raceName}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.gamesPlayed.toLocaleString()}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgLevel.toFixed(2)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${(stats.avgWinRate * 100).toFixed(1)}%</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgKills.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgDeaths.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgFinalGold.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513; color: ${scoreColor}; font-weight: bold;">${balanceScore.toFixed(0)}/100</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    
    // Sex comparison table
    html += '<div class="report-section">';
    html += '<h3>⚧️ Comparaison des Sexes</h3>';
    html += '<table class="balance-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
    html += '<thead><tr style="background: rgba(218, 165, 32, 0.3);">';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Sexe</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Parties</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Niveau Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Taux Victoire</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Kills Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Morts Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Final</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Équilibre</th>';
    html += '</tr></thead><tbody>';
    
    for (const [sexKey, stats] of Object.entries(report.sexStats)) {
        const balanceScore = parseFloat(report.balanceScore.bySex[sexKey]);
        const scoreColor = balanceScore >= 90 ? '#51cf66' : balanceScore >= 80 ? '#DAA520' : '#ff6b6b';
        
        html += '<tr>';
        html += `<td style="padding: 8px; border: 1px solid #8B4513;"><strong>${stats.sexName}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.gamesPlayed.toLocaleString()}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgLevel.toFixed(2)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${(stats.avgWinRate * 100).toFixed(1)}%</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgKills.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgDeaths.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgFinalGold.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513; color: ${scoreColor}; font-weight: bold;">${balanceScore.toFixed(0)}/100</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    
    // Detailed class stats
    html += '<div class="report-section">';
    html += '<h3>📈 Statistiques Détaillées des Classes</h3>';
    for (const [classKey, stats] of Object.entries(report.classStats)) {
        html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
        html += `<h4 style="color: #DAA520;">${characterClasses[classKey].icon} ${stats.className}</h4>`;
        html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.9em;">`;
        html += `<div>Niveau max atteint: ${stats.maxLevel}</div>`;
        html += `<div>Niveau min atteint: ${stats.minLevel}</div>`;
        html += `<div>Kills max: ${stats.maxKills}</div>`;
        html += `<div>Kills min: ${stats.minKills}</div>`;
        html += `<div>Force moyenne: ${stats.avgStrength.toFixed(1)}</div>`;
        html += `<div>Défense moyenne: ${stats.avgDefense.toFixed(1)}</div>`;
        html += `<div>Dextérité moyenne: ${stats.avgDexterity.toFixed(1)}</div>`;
        html += `<div>Constitution moyenne: ${stats.avgConstitution.toFixed(1)}</div>`;
        html += `<div>PV moyens: ${stats.avgHealth.toFixed(0)}</div>`;
        html += `<div>Boss vaincus: ${stats.avgBossesDefeated.toFixed(1)}</div>`;
        html += `<div>Or gagné: ${stats.avgGoldEarned.toFixed(0)} 💰</div>`;
        html += `<div>Or dépensé: ${stats.avgGoldSpent.toFixed(0)} 💰</div>`;
        html += `<div>Objets achetés: ${stats.avgItemsPurchased.toFixed(1)}</div>`;
        html += `<div>% Niveau 20: ${stats.percentReachedLevel20.toFixed(1)}%</div>`;
        html += `<div>Potions soin: ${stats.avgItemsByCategory.heal.toFixed(1)}</div>`;
        html += `<div>Potions force: ${stats.avgItemsByCategory.damage.toFixed(1)}</div>`;
        html += `<div>Équipement: ${stats.avgItemsByCategory.equipment.toFixed(1)}</div>`;
        html += `<div>Potions énergie: ${stats.avgItemsByCategory.energy.toFixed(1)}</div>`;
        html += `<div>Potions XP: ${stats.avgItemsByCategory.exp.toFixed(1)}</div>`;
        html += `</div></div>`;
    }
    html += '</div>';
    
    // Detailed race stats
    html += '<div class="report-section">';
    html += '<h3>📈 Statistiques Détaillées des Races</h3>';
    for (const [raceKey, stats] of Object.entries(report.raceStats)) {
        html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
        html += `<h4 style="color: #DAA520;">${characterRaces[raceKey].icon} ${stats.raceName}</h4>`;
        html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.9em;">`;
        html += `<div>Niveau max atteint: ${stats.maxLevel}</div>`;
        html += `<div>Niveau min atteint: ${stats.minLevel}</div>`;
        html += `<div>Kills max: ${stats.maxKills}</div>`;
        html += `<div>Kills min: ${stats.minKills}</div>`;
        html += `<div>Force moyenne: ${stats.avgStrength.toFixed(1)}</div>`;
        html += `<div>Défense moyenne: ${stats.avgDefense.toFixed(1)}</div>`;
        html += `<div>Dextérité moyenne: ${stats.avgDexterity.toFixed(1)}</div>`;
        html += `<div>Constitution moyenne: ${stats.avgConstitution.toFixed(1)}</div>`;
        html += `<div>PV moyens: ${stats.avgHealth.toFixed(0)}</div>`;
        html += `<div>Boss vaincus: ${stats.avgBossesDefeated.toFixed(1)}</div>`;
        html += `<div>Or gagné: ${stats.avgGoldEarned.toFixed(0)} 💰</div>`;
        html += `<div>Or dépensé: ${stats.avgGoldSpent.toFixed(0)} 💰</div>`;
        html += `<div>Objets achetés: ${stats.avgItemsPurchased.toFixed(1)}</div>`;
        html += `<div>% Niveau 20: ${stats.percentReachedLevel20.toFixed(1)}%</div>`;
        html += `<div>Potions soin: ${stats.avgItemsByCategory.heal.toFixed(1)}</div>`;
        html += `<div>Potions force: ${stats.avgItemsByCategory.damage.toFixed(1)}</div>`;
        html += `<div>Équipement: ${stats.avgItemsByCategory.equipment.toFixed(1)}</div>`;
        html += `<div>Potions énergie: ${stats.avgItemsByCategory.energy.toFixed(1)}</div>`;
        html += `<div>Potions XP: ${stats.avgItemsByCategory.exp.toFixed(1)}</div>`;
        html += `</div></div>`;
    }
    html += '</div>';
    
    // Suggestions
    html += '<div class="report-section">';
    html += '<h3>💡 Suggestions d\'Amélioration</h3>';
    
    if (report.suggestions.length === 0) {
        html += '<div class="shop-item" style="display: block;">';
        html += '<p style="color: #51cf66;">✓ Le jeu est bien équilibré ! Aucune amélioration majeure n\'est nécessaire.</p>';
        html += '</div>';
    } else {
        // Group suggestions by category
        const suggestionsByCategory = {
            game: [],
            economy: [],
            class: { guerrier: [], magicien: [], archer: [] },
            race: { humain: [], elfe: [], nain: [] },
            sex: { male: [], female: [] }
        };
        
        report.suggestions.forEach(s => {
            if (s.category === 'game') {
                suggestionsByCategory.game.push(s);
            } else if (s.category === 'economy') {
                suggestionsByCategory.economy.push(s);
            } else if (s.category === 'class') {
                suggestionsByCategory.class[s.class].push(s);
            } else if (s.category === 'race') {
                suggestionsByCategory.race[s.race].push(s);
            } else if (s.category === 'sex') {
                suggestionsByCategory.sex[s.sex].push(s);
            }
        });
        
        // Display game-wide suggestions
        if (suggestionsByCategory.game.length > 0) {
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">🎮 Suggestions Générales</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            suggestionsByCategory.game.forEach(s => {
                const color = s.type === 'difficulty' ? '#ffd93d' : s.type === 'progression' ? '#51cf66' : '#ffd93d';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            html += '</ul></div>';
        }
        
        // Display economy suggestions
        if (suggestionsByCategory.economy.length > 0) {
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">💰 Suggestions Économie</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            suggestionsByCategory.economy.forEach(s => {
                html += `<li style="margin-bottom: 8px; color: #ffd93d;">${s.suggestion}</li>`;
            });
            html += '</ul></div>';
        }
        
        // Display class suggestions
        for (const [classKey, suggestions] of Object.entries(suggestionsByCategory.class)) {
            if (suggestions.length === 0) continue;
            
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">${characterClasses[classKey].icon} ${characterClasses[classKey].name}</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            
            suggestions.forEach(s => {
                const color = s.type === 'overpowered' ? '#ff6b6b' : s.type === 'underpowered' ? '#ffd93d' : '#51cf66';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            
            html += '</ul></div>';
        }
        
        // Display race suggestions
        for (const [raceKey, suggestions] of Object.entries(suggestionsByCategory.race)) {
            if (suggestions.length === 0) continue;
            
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">${characterRaces[raceKey].icon} ${characterRaces[raceKey].name}</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            
            suggestions.forEach(s => {
                const color = s.type === 'overpowered' ? '#ff6b6b' : s.type === 'underpowered' ? '#ffd93d' : '#51cf66';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            
            html += '</ul></div>';
        }
        
        // Display sex suggestions
        for (const [sexKey, suggestions] of Object.entries(suggestionsByCategory.sex)) {
            if (suggestions.length === 0) continue;
            
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">${characterSexes[sexKey].icon} ${characterSexes[sexKey].name}</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            
            suggestions.forEach(s => {
                const color = s.type === 'overpowered' ? '#ff6b6b' : s.type === 'underpowered' ? '#ffd93d' : '#51cf66';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            
            html += '</ul></div>';
        }
    }
    
    html += '</div>';
    html += '</div>';
    
    return html;
}
