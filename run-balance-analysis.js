#!/usr/bin/env node

// Automated Balance Analysis Runner
// Runs 30,000 game simulations and generates a comprehensive balance report
// This script can be run from the command line to perform balance testing

import { runBalanceTests, formatReportAsHTML } from './js/balance-tester.js';
import fs from 'fs';

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║       Le Coeur du Dragon - Automated Balance Analysis         ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('Starting comprehensive balance analysis...');
console.log('This will simulate 30,000 games (2,500 per class-race combination)');
console.log('Estimated time: 2-5 minutes depending on your system\n');

const startTime = Date.now();

// Run the full balance test with 2500 iterations
console.log('Running simulations...\n');
const report = runBalanceTests(2500);

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log(`\n✓ All simulations completed in ${duration} seconds!\n`);

// Display summary results
console.log('═══════════════════════════════════════════════════════════════');
console.log('                       SUMMARY RESULTS                          ');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`Total Simulations:  ${report.summary.totalSimulations.toLocaleString()}`);
console.log(`Average Level:      ${report.summary.avgLevel}`);
console.log(`Average Win Rate:   ${report.summary.avgWinRate}`);
console.log(`Average Kills:      ${report.summary.avgKills}`);

// Display class comparison
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('                    CLASS COMPARISON                            ');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Class        | Games   | Avg Level | Win Rate | Avg Kills | Balance Score');
console.log('-------------|---------|-----------|----------|-----------|---------------');

Object.entries(report.classStats).forEach(([key, stats]) => {
    const score = report.balanceScore.byClass[key];
    const className = stats.className.padEnd(12);
    const games = stats.gamesPlayed.toString().padEnd(7);
    const level = stats.avgLevel.toFixed(2).padEnd(9);
    const winRate = `${(stats.avgWinRate * 100).toFixed(1)}%`.padEnd(8);
    const kills = stats.avgKills.toFixed(1).padEnd(9);
    const balance = `${score}/100`.padEnd(15);
    
    console.log(`${className} | ${games} | ${level} | ${winRate} | ${kills} | ${balance}`);
});

// Display race comparison
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('                     RACE COMPARISON                            ');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Race         | Games   | Avg Level | Win Rate | Avg Kills | Balance Score');
console.log('-------------|---------|-----------|----------|-----------|---------------');

Object.entries(report.raceStats).forEach(([key, stats]) => {
    const score = report.balanceScore.byRace[key];
    const raceName = stats.raceName.padEnd(12);
    const games = stats.gamesPlayed.toString().padEnd(7);
    const level = stats.avgLevel.toFixed(2).padEnd(9);
    const winRate = `${(stats.avgWinRate * 100).toFixed(1)}%`.padEnd(8);
    const kills = stats.avgKills.toFixed(1).padEnd(9);
    const balance = `${score}/100`.padEnd(15);
    
    console.log(`${raceName} | ${games} | ${level} | ${winRate} | ${kills} | ${balance}`);
});

// Display suggestions
if (report.suggestions.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('              BALANCE ADJUSTMENT SUGGESTIONS                   ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Group suggestions by category
    const gameWide = report.suggestions.filter(s => s.category === 'game');
    const classSuggestions = report.suggestions.filter(s => s.category === 'class');
    const raceSuggestions = report.suggestions.filter(s => s.category === 'race');
    
    if (gameWide.length > 0) {
        console.log('🎮 GAME-WIDE ADJUSTMENTS:');
        gameWide.forEach(s => {
            console.log(`   - ${s.suggestion}`);
        });
        console.log('');
    }
    
    if (classSuggestions.length > 0) {
        console.log('⚔️  CLASS ADJUSTMENTS:');
        classSuggestions.forEach(s => {
            console.log(`   - ${s.suggestion}`);
        });
        console.log('');
    }
    
    if (raceSuggestions.length > 0) {
        console.log('🧝 RACE ADJUSTMENTS:');
        raceSuggestions.forEach(s => {
            console.log(`   - ${s.suggestion}`);
        });
        console.log('');
    }
} else {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✓ Game is well balanced! No major adjustments needed.         ');
    console.log('═══════════════════════════════════════════════════════════════\n');
}

// Save HTML report
const htmlReport = formatReportAsHTML(report);
const htmlFilename = `balance-report-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.html`;

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balance Analysis Report - Le Coeur du Dragon</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #d4d4d4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.6);
            border: 2px solid #8B4513;
            border-radius: 10px;
            padding: 30px;
        }
        h1 {
            color: #DAA520;
            text-align: center;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .report-section {
            margin-bottom: 30px;
        }
        .shop-item {
            background: rgba(139, 69, 19, 0.2);
            border: 1px solid #8B4513;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
        }
        table {
            font-size: 0.9em;
        }
        th, td {
            text-align: left;
        }
        .timestamp {
            text-align: center;
            color: #888;
            margin-top: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚔️ Le Coeur du Dragon - Balance Analysis Report ⚔️</h1>
        ${htmlReport}
        <div class="timestamp">
            Generated on ${new Date().toLocaleString('fr-FR')} | Duration: ${duration}s
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(htmlFilename, htmlContent);

console.log(`\n📄 HTML Report saved to: ${htmlFilename}`);
console.log('\nAnalysis complete! Review the suggestions above and the HTML report.\n');
