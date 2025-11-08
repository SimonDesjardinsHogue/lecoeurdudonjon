// Balance Testing Module
// Runs automated game simulations to test balance

import { characterClasses, applyCharacterClass } from './character-classes.js';
import { characterRaces, applyRaceModifiers } from './character-races.js';
import { characterSexes, applySexBaseStats } from './character-sexes.js';
import { enemies, bosses, getStatModifier } from './game-state.js';
import { shopItems } from './data/shop-items.js';

// Create a simulated player
function createSimulatedPlayer(classKey) {
    const player = {
        name: `Test_${classKey}`,
        gender: 'male',
        race: 'humain',
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
        gold: 50,
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
    
    // Apply character class
    applySexBaseStats(player, 'male');
    applyCharacterClass(player, classKey);
    applyRaceModifiers(player, 'humain');
    
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
        const playerDamage = Math.max(1, player.strength + strengthMod - (enemyCopy.defense + enemyDefenseMod) + Math.floor(Math.random() * 5));
        enemyCopy.health -= playerDamage;
        
        if (enemyCopy.health <= 0) {
            // Victory
            player.gold += enemy.gold;
            player.totalGoldEarned += enemy.gold;
            player.xp += enemy.xp;
            player.kills++;
            player.combatsWon++;
            checkLevelUp(player);
            return true;
        }
        
        // Enemy attacks
        const enemyStrengthMod = getStatModifier(enemyCopy.strength);
        const playerDefenseMod = getStatModifier(player.defense);
        const enemyDamage = Math.max(1, enemyCopy.strength + enemyStrengthMod - (player.defense + playerDefenseMod) + Math.floor(Math.random() * 5));
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
function simulateGame(classKey, maxCombats = 50) {
    const player = createSimulatedPlayer(classKey);
    
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
        winRate: player.combatsWon / (player.combatsWon + player.combatsLost)
    };
}

// Run balance tests
export function runBalanceTests(iterations = 1000) {
    const results = {
        guerrier: [],
        magicien: [],
        archer: [],
        rogue: []
    };
    
    const classes = ['guerrier', 'magicien', 'archer', 'rogue'];
    
    console.log('Starting balance tests...');
    
    for (const classKey of classes) {
        console.log(`Testing ${classKey}...`);
        
        for (let i = 0; i < iterations; i++) {
            if (i % 100 === 0) {
                console.log(`  ${classKey}: ${i}/${iterations} simulations completed`);
            }
            
            const result = simulateGame(classKey);
            results[classKey].push(result);
        }
    }
    
    return analyzeResults(results);
}

// Analyze and format results
function analyzeResults(results) {
    const analysis = {};
    
    for (const [classKey, games] of Object.entries(results)) {
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
            maxLevel: Math.max(...games.map(g => g.finalLevel)),
            minLevel: Math.min(...games.map(g => g.finalLevel)),
            maxKills: Math.max(...games.map(g => g.kills)),
            minKills: Math.min(...games.map(g => g.kills))
        };
        
        analysis[classKey] = stats;
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
        classStats: analysis,
        balanceScore: {},
        suggestions: []
    };
    
    // Calculate overall metrics
    const allClasses = Object.values(analysis);
    const avgLevelOverall = average(allClasses.map(c => c.avgLevel));
    const avgWinRateOverall = average(allClasses.map(c => c.avgWinRate));
    const avgKillsOverall = average(allClasses.map(c => c.avgKills));
    
    report.summary = {
        avgLevel: avgLevelOverall.toFixed(2),
        avgWinRate: (avgWinRateOverall * 100).toFixed(2) + '%',
        avgKills: avgKillsOverall.toFixed(2),
        totalSimulations: allClasses.reduce((sum, c) => sum + c.gamesPlayed, 0)
    };
    
    // Calculate balance scores (deviation from average)
    for (const [classKey, stats] of Object.entries(analysis)) {
        const levelDeviation = Math.abs(stats.avgLevel - avgLevelOverall) / avgLevelOverall;
        const winRateDeviation = Math.abs(stats.avgWinRate - avgWinRateOverall) / avgWinRateOverall;
        const killsDeviation = Math.abs(stats.avgKills - avgKillsOverall) / avgKillsOverall;
        
        const balanceScore = 100 - ((levelDeviation + winRateDeviation + killsDeviation) / 3 * 100);
        report.balanceScore[classKey] = balanceScore.toFixed(2);
        
        // Generate suggestions based on performance
        if (stats.avgWinRate < avgWinRateOverall * 0.9) {
            report.suggestions.push({
                class: classKey,
                type: 'underpowered',
                metric: 'winRate',
                suggestion: `${stats.className} a un taux de victoire inférieur à la moyenne (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverall * 100).toFixed(1)}%). Suggestion: Augmenter la force de base de +2 ou la défense de +1.`
            });
        }
        
        if (stats.avgWinRate > avgWinRateOverall * 1.1) {
            report.suggestions.push({
                class: classKey,
                type: 'overpowered',
                metric: 'winRate',
                suggestion: `${stats.className} a un taux de victoire supérieur à la moyenne (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverall * 100).toFixed(1)}%). Suggestion: Réduire la force de base de -1 ou réduire les PV max de -10.`
            });
        }
        
        if (stats.avgLevel < avgLevelOverall * 0.9) {
            report.suggestions.push({
                class: classKey,
                type: 'progression',
                metric: 'level',
                suggestion: `${stats.className} atteint des niveaux inférieurs à la moyenne (${stats.avgLevel.toFixed(1)} vs ${avgLevelOverall.toFixed(1)}). Suggestion: Augmenter les gains d'XP de +10% pour cette classe ou réduire les requis d'XP par niveau de -5%.`
            });
        }
        
        if (stats.avgDeaths > avgKillsOverall * 0.3) {
            report.suggestions.push({
                class: classKey,
                type: 'survivability',
                metric: 'deaths',
                suggestion: `${stats.className} meurt trop souvent (${stats.avgDeaths.toFixed(1)} morts en moyenne). Suggestion: Augmenter les PV de base de +15 ou améliorer la défense de +2.`
            });
        }
        
        if (stats.avgGoldEarned - stats.avgGoldSpent < 50) {
            report.suggestions.push({
                class: classKey,
                type: 'economy',
                metric: 'gold',
                suggestion: `${stats.className} a peu d'or restant (${(stats.avgGoldEarned - stats.avgGoldSpent).toFixed(0)} or). Suggestion: Augmenter les récompenses en or de +15% ou réduire le coût des objets de base de -10%.`
            });
        }
    }
    
    // Overall game balance suggestions
    if (avgWinRateOverall < 0.6) {
        report.suggestions.push({
            class: 'all',
            type: 'difficulty',
            metric: 'overall',
            suggestion: `Le jeu est trop difficile avec un taux de victoire global de ${(avgWinRateOverall * 100).toFixed(1)}%. Suggestion: Réduire la force des ennemis de -10% ou augmenter l'or de départ à 75.`
        });
    }
    
    if (avgWinRateOverall > 0.85) {
        report.suggestions.push({
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
    html += `<p><strong>Total de simulations:</strong> ${report.summary.totalSimulations}</p>`;
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
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Niveau Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Taux Victoire</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Kills Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Morts Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Final</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Équilibre</th>';
    html += '</tr></thead><tbody>';
    
    for (const [classKey, stats] of Object.entries(report.classStats)) {
        const balanceScore = parseFloat(report.balanceScore[classKey]);
        const scoreColor = balanceScore >= 90 ? '#51cf66' : balanceScore >= 80 ? '#DAA520' : '#ff6b6b';
        
        html += '<tr>';
        html += `<td style="padding: 8px; border: 1px solid #8B4513;"><strong>${stats.className}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgLevel.toFixed(2)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${(stats.avgWinRate * 100).toFixed(1)}%</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgKills.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgDeaths.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgFinalGold.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513; color: ${scoreColor}; font-weight: bold;">${balanceScore.toFixed(0)}/100</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    
    // Detailed stats
    html += '<div class="report-section">';
    html += '<h3>📈 Statistiques Détaillées</h3>';
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
        // Group suggestions by class
        const suggestionsByClass = {
            all: [],
            guerrier: [],
            magicien: [],
            archer: [],
            rogue: []
        };
        
        report.suggestions.forEach(s => {
            suggestionsByClass[s.class].push(s);
        });
        
        for (const [classKey, suggestions] of Object.entries(suggestionsByClass)) {
            if (suggestions.length === 0) continue;
            
            const title = classKey === 'all' ? '🎮 Suggestions Générales' : `${characterClasses[classKey].icon} ${characterClasses[classKey].name}`;
            
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">${title}</h4>`;
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
