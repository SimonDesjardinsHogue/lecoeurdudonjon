// Analysis Module
// Responsibility: Analyze balance test results and generate reports

import { characterClasses } from '../character-classes.js';
import { characterRaces } from '../character-races.js';
import { characterSexes } from '../character-sexes.js';

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
            avgPuissance: 0,
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
        avgPuissance: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].puissance)),
        avgDefense: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].defense)),
        avgHealth: average(gamesReachedMilestone.map(g => g.milestoneStats[milestone].health))
    };
}

// Analyze and format results
export function analyzeResults(results) {
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
            avgPuissance: average(games.map(g => g.finalStrength)),
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
            avgPuissance: average(games.map(g => g.finalStrength)),
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
            avgPuissance: average(games.map(g => g.finalStrength)),
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
            avgPuissance: average(games.map(g => g.finalStrength)),
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
    
    // Level 20 progression suggestion - Target: Level 20 in ~14 hours
    // Estimate: ~600-700 combats in 14 hours of gameplay (assuming 1-1.5 min per combat cycle)
    const targetCombatsFor14Hours = 650; // Middle estimate
    const targetLevel = 20;
    const acceptableRange = 2; // +/- 2 levels
    
    // Calculate average progression rate from milestone data
    // Use the average kills needed to reach level 20 across all games that reached it
    const allGamesData = Object.values(analysis.byCombination).flatMap(combo => {
        // We need to reconstruct the game data from stats
        return Array(combo.gamesPlayed).fill(null);
    });
    
    // Calculate from class stats (more reliable aggregation)
    let totalGamesReachingLevel20 = 0;
    let totalKillsToReachLevel20 = 0;
    
    for (const stats of Object.values(analysis.byClass)) {
        const level20Stats = stats.milestones[20];
        if (level20Stats && level20Stats.gamesReached > 0) {
            totalGamesReachingLevel20 += level20Stats.gamesReached;
            totalKillsToReachLevel20 += level20Stats.avgKills * level20Stats.gamesReached;
        }
    }
    
    // Calculate estimated level after 14 hours based on progression rate
    let estimatedLevelAt14Hours = avgLevelOverall;
    
    if (totalGamesReachingLevel20 > 0) {
        const avgKillsToLevel20 = totalKillsToReachLevel20 / totalGamesReachingLevel20;
        
        // Estimate what level would be reached with targetCombatsFor14Hours combats
        // Linear interpolation based on kills to level 20
        const progressionRate = targetLevel / avgKillsToLevel20;
        estimatedLevelAt14Hours = Math.min(targetLevel, targetCombatsFor14Hours * progressionRate);
    } else {
        // If no one reached level 20, estimate based on average final level and kills
        const avgFinalKills = average(allClasses.map(c => c.avgKills));
        if (avgFinalKills > 0) {
            const progressionRate = avgLevelOverall / avgFinalKills;
            estimatedLevelAt14Hours = Math.min(targetLevel, targetCombatsFor14Hours * progressionRate);
        }
    }
    
    // Only suggest if estimated level is outside the acceptable range (18-22)
    const minAcceptable = targetLevel - acceptableRange;
    const maxAcceptable = targetLevel + acceptableRange;
    
    if (estimatedLevelAt14Hours < minAcceptable) {
        // Progression is too slow
        const levelDeficit = minAcceptable - estimatedLevelAt14Hours;
        report.suggestions.push({
            category: 'game',
            class: 'all',
            type: 'progression',
            metric: 'level20',
            severity: 3,
            suggestion: `Progression trop lente: Niveau ${estimatedLevelAt14Hours.toFixed(1)} estimé après 14h de jeu (cible: niveau ${targetLevel} ± ${acceptableRange}). Il manque ~${levelDeficit.toFixed(1)} niveaux. Suggestion: Augmenter les gains d'XP de +${Math.round(levelDeficit * 15)}% ou réduire les requis d'XP par niveau de -${Math.round(levelDeficit * 10)}%.`
        });
    } else if (estimatedLevelAt14Hours > maxAcceptable) {
        // Progression is too fast
        const levelSurplus = estimatedLevelAt14Hours - maxAcceptable;
        report.suggestions.push({
            category: 'game',
            class: 'all',
            type: 'progression',
            metric: 'level20',
            severity: 2,
            suggestion: `Progression trop rapide: Niveau ${estimatedLevelAt14Hours.toFixed(1)} estimé après 14h de jeu (cible: niveau ${targetLevel} ± ${acceptableRange}). Il y a ~${levelSurplus.toFixed(1)} niveaux de trop. Suggestion: Réduire les gains d'XP de -${Math.round(levelSurplus * 10)}% ou augmenter les requis d'XP par niveau de +${Math.round(levelSurplus * 8)}%.`
        });
    }
    // If estimatedLevelAt14Hours is between minAcceptable and maxAcceptable, no suggestion is added
    
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
    
    // ADDITIONAL BALANCE CHECKS
    
    // 7. Check boss defeat rate consistency
    const avgBossesOverall = average(allClasses.map(c => c.avgBossesDefeated));
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const bossDeficit = (avgBossesOverall - stats.avgBossesDefeated) / avgBossesOverall;
        if (bossDeficit > 0.30) { // 30% fewer bosses defeated
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'boss_difficulty',
                metric: 'bosses',
                severity: 2,
                suggestion: `${stats.className} a du mal à vaincre les boss (${stats.avgBossesDefeated.toFixed(1)} vs ${avgBossesOverall.toFixed(1)} en moyenne, -${(bossDeficit * 100).toFixed(0)}%). Suggestion: Augmenter les PV ou la défense pour améliorer la survie contre les boss.`
            });
        }
    }
    
    // 8. Check level progression consistency - ensure all classes can progress similarly
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const levelDeficit = (avgLevelOverall - stats.avgLevel) / avgLevelOverall;
        if (levelDeficit > 0.15) { // 15% lower level
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'progression',
                metric: 'level',
                severity: 2,
                suggestion: `${stats.className} progresse trop lentement (niveau ${stats.avgLevel.toFixed(1)} vs ${avgLevelOverall.toFixed(1)} en moyenne, -${(levelDeficit * 100).toFixed(0)}%). Suggestion: Augmenter les gains d'XP de +${Math.round(levelDeficit * 100)}% ou améliorer la survie.`
            });
        }
    }
    
    // 9. Check item purchasing patterns - ensure classes buy appropriate items
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const equipmentRatio = stats.avgItemsByCategory.equipment / stats.avgItemsPurchased;
        if (equipmentRatio < 0.15) { // Less than 15% equipment purchases
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'economy',
                metric: 'items',
                severity: 1,
                suggestion: `${stats.className} achète peu d'équipement (${(equipmentRatio * 100).toFixed(0)}% des achats). Cela peut indiquer que l'équipement est trop cher ou que la classe meurt trop souvent pour économiser.`
            });
        }
    }
    
    // 10. Check data consistency - ensure no class has NaN or invalid values
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        if (isNaN(stats.avgLevel) || isNaN(stats.avgWinRate) || isNaN(stats.avgKills)) {
            report.suggestions.push({
                category: 'error',
                class: classKey,
                type: 'data_integrity',
                metric: 'overall',
                severity: 3,
                suggestion: `ERREUR: ${stats.className} a des données invalides (NaN détecté). Vérifier la simulation pour cette classe.`
            });
        }
    }
    
    // 11. Check milestone progression - ensure consistent progression through levels
    for (const [classKey, stats] of Object.entries(analysis.byClass)) {
        const level5Reached = stats.milestones[5].percentReached;
        const level10Reached = stats.milestones[10].percentReached;
        const level15Reached = stats.milestones[15].percentReached;
        const level20Reached = stats.milestones[20].percentReached;
        
        // Check if there's a significant drop-off at any milestone
        if (level5Reached < 80) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'early_game',
                metric: 'level5',
                severity: 3,
                suggestion: `${stats.className} a du mal à atteindre le niveau 5 (seulement ${level5Reached.toFixed(0)}% des parties). Suggestion: Augmenter les PV de départ de +20 ou réduire la difficulté des premiers ennemis.`
            });
        }
        
        if (level10Reached < 50 && level5Reached >= 80) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'mid_game',
                metric: 'level10',
                severity: 2,
                suggestion: `${stats.className} a du mal à progresser de niveau 5 à 10 (${level10Reached.toFixed(0)}% atteignent niveau 10 vs ${level5Reached.toFixed(0)}% atteignent niveau 5). Suggestion: Réduire les requis d'XP entre niveaux 5-10 de -15%.`
            });
        }
        
        if (level20Reached < avgLevel20Percent * 0.70) {
            report.suggestions.push({
                category: 'class',
                class: classKey,
                type: 'late_game',
                metric: 'level20',
                severity: 2,
                suggestion: `${stats.className} a du mal à atteindre le niveau maximum (${level20Reached.toFixed(0)}% vs ${avgLevel20Percent.toFixed(0)}% en moyenne). Suggestion: Ajuster la courbe d'XP ou améliorer les stats de fin de partie.`
            });
        }
    }
    
    // 12. Check race balance across all metrics
    for (const [raceKey, stats] of Object.entries(analysis.byRace)) {
        const levelDeficit = (avgLevelOverallRace - stats.avgLevel) / avgLevelOverallRace;
        if (levelDeficit > 0.20) { // 20% lower level
            report.suggestions.push({
                category: 'race',
                race: raceKey,
                type: 'progression',
                metric: 'level',
                severity: 2,
                suggestion: `${stats.raceName} progresse beaucoup plus lentement (niveau ${stats.avgLevel.toFixed(1)} vs ${avgLevelOverallRace.toFixed(1)} en moyenne, -${(levelDeficit * 100).toFixed(0)}%). Suggestion: Améliorer les modificateurs raciaux (+1 constitution, +1 force).`
            });
        }
        
        const winRateDeficit = (avgWinRateOverallRace - stats.avgWinRate) / avgWinRateOverallRace;
        if (winRateDeficit > 0.20) { // 20% worse win rate
            report.suggestions.push({
                category: 'race',
                race: raceKey,
                type: 'combat',
                metric: 'winRate',
                severity: 3,
                suggestion: `${stats.raceName} a un taux de victoire très inférieur (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverallRace * 100).toFixed(1)}% en moyenne, -${(winRateDeficit * 100).toFixed(0)}%). Suggestion: Augmenter les modificateurs de combat (+2 force ou +2 défense).`
            });
        }
    }
    
    // 13. Check sex balance - ensure no significant disparity
    for (const [sexKey, stats] of Object.entries(analysis.bySex)) {
        const levelDeficit = (avgLevelOverallSex - stats.avgLevel) / avgLevelOverallSex;
        if (levelDeficit > 0.10) { // 10% lower level
            report.suggestions.push({
                category: 'sex',
                sex: sexKey,
                type: 'progression',
                metric: 'level',
                severity: 2,
                suggestion: `${stats.sexName} progresse plus lentement (niveau ${stats.avgLevel.toFixed(1)} vs ${avgLevelOverallSex.toFixed(1)} en moyenne, -${(levelDeficit * 100).toFixed(0)}%). Suggestion: Vérifier les modificateurs de sexe pour l'équilibrage.`
            });
        }
        
        const winRateDeficit = (avgWinRateOverallSex - stats.avgWinRate) / avgWinRateOverallSex;
        if (winRateDeficit > 0.15) { // 15% worse win rate
            report.suggestions.push({
                category: 'sex',
                sex: sexKey,
                type: 'combat',
                metric: 'winRate',
                severity: 2,
                suggestion: `${stats.sexName} a un taux de victoire inférieur (${(stats.avgWinRate * 100).toFixed(1)}% vs ${(avgWinRateOverallSex * 100).toFixed(1)}% en moyenne, -${(winRateDeficit * 100).toFixed(0)}%). Suggestion: Ajuster les modificateurs de combat.`
            });
        }
    }
    
    return report;
}
