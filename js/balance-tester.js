// Balance Testing Module
// Runs automated game simulations to test balance

import { characterClasses, applyCharacterClass } from './character-classes.js';
import { characterRaces, applyRaceModifiers } from './character-races.js';
import { characterSexes, applySexBaseStats } from './character-sexes.js';
import { enemies, bosses, getStatModifier } from './game-state.js';
import { shopItems } from './data/shop-items.js';

// Create a simulated player
function createSimulatedPlayer(classKey, raceKey = 'humain') {
    const player = {
        name: `Test_${classKey}_${raceKey}`,
        gender: 'male',
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
        combatsWon: 0,
        combatsLost: 0,
        metals: { or: 0, platine: 0, argent: 0, cuivre: 0 }
    };
    
    // Apply character class and race
    applySexBaseStats(player, 'male');
    applyCharacterClass(player, classKey);
    applyRaceModifiers(player, raceKey);
    
    return player;
}

// Check if player should level up
function checkLevelUp(player) {
    while (player.xp >= player.xpToLevel) {
        player.level++;
        player.xp -= player.xpToLevel;
        player.xpToLevel = Math.floor(player.xpToLevel * 1.5);
        
        // Stat increases
        player.maxHealth += 20;
        player.health = player.maxHealth;
        player.strength += 5;
        player.defense += 3;
    }
}

// Simulate intelligent item purchasing
function simulatePurchasing(player) {
    // Priority: healing if low health, then weapons/armor, then potions
    const purchasableItems = shopItems.filter(item => {
        // Can afford
        if (item.cost > player.gold) return false;
        
        // Check class restriction
        if (item.classRestriction && item.classRestriction !== player.class) return false;
        
        return true;
    });
    
    if (purchasableItems.length === 0) return;
    
    // Sort by priority
    const sortedItems = purchasableItems.sort((a, b) => {
        // If health is low (< 50%), prioritize healing
        if (player.health < player.maxHealth * 0.5) {
            if (a.category === 'heal' && b.category !== 'heal') return -1;
            if (a.category !== 'heal' && b.category === 'heal') return 1;
        }
        
        // Prioritize equipment (weapons and armor)
        if (a.type === 'weapon' || a.type === 'armor') {
            if (b.type !== 'weapon' && b.type !== 'armor') return -1;
        }
        if (b.type === 'weapon' || b.type === 'armor') {
            if (a.type !== 'weapon' && a.type !== 'armor') return 1;
        }
        
        // Higher cost items generally better
        return b.cost - a.cost;
    });
    
    // Buy the best affordable item
    const itemToBuy = sortedItems[0];
    if (itemToBuy) {
        player.gold -= itemToBuy.cost;
        player.totalGoldSpent += itemToBuy.cost;
        player.itemsPurchased++;
        
        // Apply item effect based on category
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
            } else if (itemToBuy.type === 'armor') {
                const defBonus = itemToBuy.bonus || parseInt(itemToBuy.description.match(/\d+/)?.[0] || 0);
                player.defense += defBonus;
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
function simulateGame(classKey, raceKey = 'humain', maxCombats = 50) {
    const player = createSimulatedPlayer(classKey, raceKey);
    
    for (let i = 0; i < maxCombats; i++) {
        // Try to purchase items if we have gold
        if (player.gold >= 15) {
            simulatePurchasing(player);
        }
        
        // Select enemy based on player level
        const maxEnemyIndex = Math.min(enemies.length - 1, player.level);
        const enemyTemplate = enemies[Math.floor(Math.random() * (maxEnemyIndex + 1))];
        
        // Check if should face boss (every 5 levels)
        let enemy;
        if (player.level % 5 === 0 && player.kills > 0 && (player.level / 5) > player.bossesDefeated) {
            const bossIndex = Math.min(player.bossesDefeated, bosses.length - 1);
            const bossTemplate = bosses[bossIndex];
            const levelMultiplier = 1 + (player.level - (player.bossesDefeated * 5)) * 0.1;
            
            enemy = {
                ...bossTemplate,
                health: Math.floor(bossTemplate.health * levelMultiplier),
                strength: Math.floor(bossTemplate.strength * levelMultiplier),
                defense: Math.floor(bossTemplate.defense * levelMultiplier),
                gold: Math.floor(bossTemplate.gold * levelMultiplier),
                xp: Math.floor(bossTemplate.xp * levelMultiplier),
                isBoss: true
            };
        } else {
            enemy = { ...enemyTemplate };
        }
        
        const won = simulateCombat(player, enemy);
        
        if (won && enemy.isBoss) {
            player.bossesDefeated++;
        }
        
        // Small chance to rest if health is low
        if (player.health < player.maxHealth * 0.3 && player.gold >= 20) {
            player.gold -= 20;
            player.health = player.maxHealth;
        }
    }
    
    return {
        class: classKey,
        race: raceKey,
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
        finalStrength: player.strength,
        finalDefense: player.defense,
        finalHealth: player.maxHealth,
        finalDexterity: player.dexterity,
        finalConstitution: player.constitution,
        winRate: player.combatsWon / (player.combatsWon + player.combatsLost)
    };
}

// Run balance tests
export function runBalanceTests(iterations = 2500) {
    const results = {
        byClass: {
            guerrier: [],
            magicien: [],
            archer: [],
            rogue: []
        },
        byRace: {
            humain: [],
            elfe: [],
            nain: []
        },
        byCombination: {}
    };
    
    const classes = ['guerrier', 'magicien', 'archer', 'rogue'];
    const races = ['humain', 'elfe', 'nain'];
    
    console.log(`Starting balance tests with ${iterations} iterations per class-race combination...`);
    console.log(`Total simulations: ${classes.length * races.length * iterations} (${classes.length} classes × ${races.length} races × ${iterations} games)`);
    
    let totalGames = 0;
    const totalSimulations = classes.length * races.length * iterations;
    
    for (const classKey of classes) {
        for (const raceKey of races) {
            const comboKey = `${classKey}_${raceKey}`;
            results.byCombination[comboKey] = [];
            
            console.log(`Testing ${classKey} + ${raceKey}...`);
            
            for (let i = 0; i < iterations; i++) {
                if (i % 100 === 0) {
                    totalGames = (classes.indexOf(classKey) * races.length + races.indexOf(raceKey)) * iterations + i;
                    const progress = ((totalGames / totalSimulations) * 100).toFixed(1);
                    console.log(`  Progress: ${progress}% (${totalGames}/${totalSimulations}) - ${classKey}+${raceKey}: ${i}/${iterations}`);
                }
                
                const result = simulateGame(classKey, raceKey);
                results.byClass[classKey].push(result);
                results.byRace[raceKey].push(result);
                results.byCombination[comboKey].push(result);
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
            avgStrength: average(games.map(g => g.finalStrength)),
            avgDefense: average(games.map(g => g.finalDefense)),
            avgHealth: average(games.map(g => g.finalHealth)),
            avgDexterity: average(games.map(g => g.finalDexterity)),
            avgConstitution: average(games.map(g => g.finalConstitution)),
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills))
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
            avgStrength: average(games.map(g => g.finalStrength)),
            avgDefense: average(games.map(g => g.finalDefense)),
            avgHealth: average(games.map(g => g.finalHealth)),
            avgDexterity: average(games.map(g => g.finalDexterity)),
            avgConstitution: average(games.map(g => g.finalConstitution)),
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills))
        };
        
        analysis.byRace[raceKey] = stats;
    }
    
    // Analyze by combination
    for (const [comboKey, games] of Object.entries(results.byCombination)) {
        const [classKey, raceKey] = comboKey.split('_');
        const stats = {
            class: classKey,
            race: raceKey,
            className: characterClasses[classKey].name,
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
            avgStrength: average(games.map(g => g.finalStrength)),
            avgDefense: average(games.map(g => g.finalDefense)),
            avgHealth: average(games.map(g => g.finalHealth)),
            avgDexterity: average(games.map(g => g.finalDexterity)),
            avgConstitution: average(games.map(g => g.finalConstitution)),
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills))
        };
        
        analysis.byCombination[comboKey] = stats;
    }
    
    return generateBalanceReport(analysis);
}

// Calculate average
function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Generate balance report with suggestions
function generateBalanceReport(analysis) {
    const report = {
        summary: {},
        classStats: analysis.byClass,
        raceStats: analysis.byRace,
        combinationStats: analysis.byCombination,
        balanceScore: { byClass: {}, byRace: {} },
        suggestions: []
    };
    
    // Calculate overall metrics for classes
    const allClasses = Object.values(analysis.byClass);
    const avgLevelOverall = average(allClasses.map(c => c.avgLevel));
    const avgWinRateOverall = average(allClasses.map(c => c.avgWinRate));
    const avgKillsOverall = average(allClasses.map(c => c.avgKills));
    
    // Calculate overall metrics for races
    const allRaces = Object.values(analysis.byRace);
    const avgLevelOverallRace = average(allRaces.map(r => r.avgLevel));
    const avgWinRateOverallRace = average(allRaces.map(r => r.avgWinRate));
    const avgKillsOverallRace = average(allRaces.map(r => r.avgKills));
    
    // Calculate total simulations
    const totalSimulations = Object.values(analysis.byCombination).reduce((sum, c) => sum + c.gamesPlayed, 0);
    
    report.summary = {
        avgLevel: avgLevelOverall.toFixed(2),
        avgWinRate: (avgWinRateOverall * 100).toFixed(2) + '%',
        avgKills: avgKillsOverall.toFixed(2),
        totalSimulations: totalSimulations
    };
    
    // Calculate balance scores for classes (deviation from average)
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const levelDeviation = Math.abs(stats.avgLevel - avgLevelOverall) / avgLevelOverall;
        const winRateDeviation = Math.abs(stats.avgWinRate - avgWinRateOverall) / avgWinRateOverall;
        const killsDeviation = Math.abs(stats.avgKills - avgKillsOverall) / avgKillsOverall;
        
        const balanceScore = 100 - ((levelDeviation + winRateDeviation + killsDeviation) / 3 * 100);
        report.balanceScore.byClass[classKey] = balanceScore.toFixed(2);
        
        // Generate suggestions based on performance
        if (stats.avgWinRate < avgWinRateOverall * 0.9) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'underpowered',
                metric: 'winRate',
                suggestion: `${stats.className} a un taux de victoire inférieur à la moyenne (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverall * 100).toFixed(1)}%). Suggestion: Augmenter la force de base de +2 ou la défense de +1.`
            });
        }
        
        if (stats.avgWinRate > avgWinRateOverall * 1.1) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'overpowered',
                metric: 'winRate',
                suggestion: `${stats.className} a un taux de victoire supérieur à la moyenne (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverall * 100).toFixed(1)}%). Suggestion: Réduire la force de base de -1 ou réduire les PV max de -10.`
            });
        }
        
        if (stats.avgLevel < avgLevelOverall * 0.9) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'progression',
                metric: 'level',
                suggestion: `${stats.className} atteint des niveaux inférieurs à la moyenne (${stats.avgLevel.toFixed(1)} vs ${avgLevelOverall.toFixed(1)}). Suggestion: Augmenter les gains d'XP de +10% pour cette classe ou réduire les requis d'XP par niveau de -5%.`
            });
        }
        
        if (stats.avgDeaths > avgKillsOverall * 0.3) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'survivability',
                metric: 'deaths',
                suggestion: `${stats.className} meurt trop souvent (${stats.avgDeaths.toFixed(1)} morts en moyenne). Suggestion: Augmenter les PV de base de +15 ou améliorer la défense de +2.`
            });
        }
        
        if (stats.avgGoldEarned - stats.avgGoldSpent < 50) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'economy',
                metric: 'gold',
                suggestion: `${stats.className} a peu d'or restant (${(stats.avgGoldEarned - stats.avgGoldSpent).toFixed(0)} or). Suggestion: Augmenter les récompenses en or de +15% ou réduire le coût des objets de base de -10%.`
            });
        }
    }
    
    // Calculate balance scores for races
    for (const [raceKey, stats] of Object.entries(analysis.byRace)) {
        const levelDeviation = Math.abs(stats.avgLevel - avgLevelOverallRace) / avgLevelOverallRace;
        const winRateDeviation = Math.abs(stats.avgWinRate - avgWinRateOverallRace) / avgWinRateOverallRace;
        const killsDeviation = Math.abs(stats.avgKills - avgKillsOverallRace) / avgKillsOverallRace;
        
        const balanceScore = 100 - ((levelDeviation + winRateDeviation + killsDeviation) / 3 * 100);
        report.balanceScore.byRace[raceKey] = balanceScore.toFixed(2);
        
        // Generate suggestions based on performance
        if (stats.avgWinRate < avgWinRateOverallRace * 0.95) {
            report.suggestions.push({
                category: 'race',
                race: raceKey,
                type: 'underpowered',
                metric: 'winRate',
                suggestion: `${stats.raceName} a un taux de victoire inférieur à la moyenne (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverallRace * 100).toFixed(1)}%). Suggestion: Ajuster les modificateurs de race (+1 constitution ou +1 dextérité).`
            });
        }
        
        if (stats.avgWinRate > avgWinRateOverallRace * 1.05) {
            report.suggestions.push({
                category: 'race',
                race: raceKey,
                type: 'overpowered',
                metric: 'winRate',
                suggestion: `${stats.raceName} a un taux de victoire supérieur à la moyenne (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverallRace * 100).toFixed(1)}%). Suggestion: Réduire légèrement les modificateurs de race (-1 constitution ou -1 dextérité).`
            });
        }
        
        if (stats.avgLevel < avgLevelOverallRace * 0.95) {
            report.suggestions.push({
                category: 'race',
                race: raceKey,
                type: 'progression',
                metric: 'level',
                suggestion: `${stats.raceName} atteint des niveaux inférieurs à la moyenne (${stats.avgLevel.toFixed(1)} vs ${avgLevelOverallRace.toFixed(1)}). Suggestion: Augmenter le modificateur de constitution de +1.`
            });
        }
    }
    
    // Overall game balance suggestions
    if (avgWinRateOverall < 0.6) {
        report.suggestions.push({
            category: 'game',
            class: 'all',
            type: 'difficulty',
            metric: 'overall',
            suggestion: `Le jeu est trop difficile avec un taux de victoire global de ${(avgWinRateOverall * 100).toFixed(1)}%. Suggestion: Réduire la force des ennemis de -10% ou augmenter l'or de départ à 75.`
        });
    }
    
    if (avgWinRateOverall > 0.85) {
        report.suggestions.push({
            category: 'game',
            class: 'all',
            type: 'difficulty',
            metric: 'overall',
            suggestion: `Le jeu est trop facile avec un taux de victoire global de ${(avgWinRateOverall * 100).toFixed(1)}%. Suggestion: Augmenter la force des ennemis de +10% ou réduire l'or de départ à 30.`
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
            class: { guerrier: [], magicien: [], archer: [], rogue: [] },
            race: { humain: [], elfe: [], nain: [] }
        };
        
        report.suggestions.forEach(s => {
            if (s.category === 'game') {
                suggestionsByCategory.game.push(s);
            } else if (s.category === 'class') {
                suggestionsByCategory.class[s.class].push(s);
            } else if (s.category === 'race') {
                suggestionsByCategory.race[s.race].push(s);
            }
        });
        
        // Display game-wide suggestions
        if (suggestionsByCategory.game.length > 0) {
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">🎮 Suggestions Générales</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            suggestionsByCategory.game.forEach(s => {
                const color = s.type === 'difficulty' ? '#ffd93d' : '#51cf66';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
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
    }
    
    html += '</div>';
    html += '</div>';
    
    return html;
}
