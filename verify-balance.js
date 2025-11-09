#!/usr/bin/env node
// Quick verification test with 100 games per combination (2,400 total)
import { runBalanceTests } from './js/balance-tester.js';

console.log('Running verification test (100 games per combination = 2,400 total)...\n');

const startTime = Date.now();
const report = runBalanceTests(100);
const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log(`\n✓ Completed in ${duration} seconds!\n`);

console.log('═══════════════════════════════════════════════════════════════');
console.log('                  VERIFICATION RESULTS                         ');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`Total Simulations:  ${report.summary.totalSimulations.toLocaleString()}`);
console.log(`Average Win Rate:   ${report.summary.avgWinRate} (target: 60-85%)`);
console.log(`Average Level:      ${report.summary.avgLevel}`);
console.log(`Average Kills:      ${report.summary.avgKills}`);
console.log(`% Reached Lvl 20:   ${report.summary.percentReachedLevel20}`);

console.log('\n📊 Class Balance:');
Object.entries(report.classStats).forEach(([key, stats]) => {
    console.log(`  ${stats.className.padEnd(12)} - WinRate: ${(stats.avgWinRate * 100).toFixed(1)}%, Level: ${stats.avgLevel.toFixed(1)}, Lvl20: ${stats.percentReachedLevel20.toFixed(1)}%`);
});

console.log('\n📊 Milestone Statistics by Class:');
console.log('Class         | Lvl 5         | Lvl 10        | Lvl 15        | Lvl 20');
console.log('--------------|---------------|---------------|---------------|---------------');
Object.entries(report.classStats).forEach(([key, stats]) => {
    const className = stats.className.padEnd(13);
    const m5 = stats.milestones[5].percentReached > 0 
        ? `${stats.milestones[5].percentReached.toFixed(0)}%: K=${stats.milestones[5].avgKills.toFixed(1)} D=${stats.milestones[5].avgDeaths.toFixed(1)}`.padEnd(13)
        : 'N/A'.padEnd(13);
    const m10 = stats.milestones[10].percentReached > 0 
        ? `${stats.milestones[10].percentReached.toFixed(0)}%: K=${stats.milestones[10].avgKills.toFixed(1)} D=${stats.milestones[10].avgDeaths.toFixed(1)}`.padEnd(13)
        : 'N/A'.padEnd(13);
    const m15 = stats.milestones[15].percentReached > 0 
        ? `${stats.milestones[15].percentReached.toFixed(0)}%: K=${stats.milestones[15].avgKills.toFixed(1)} D=${stats.milestones[15].avgDeaths.toFixed(1)}`.padEnd(13)
        : 'N/A'.padEnd(13);
    const m20 = stats.milestones[20].percentReached > 0 
        ? `${stats.milestones[20].percentReached.toFixed(0)}%: K=${stats.milestones[20].avgKills.toFixed(1)} D=${stats.milestones[20].avgDeaths.toFixed(1)}`.padEnd(13)
        : 'N/A'.padEnd(13);
    
    console.log(`${className} | ${m5} | ${m10} | ${m15} | ${m20}`);
});

console.log('\n📊 Sex Balance:');
Object.entries(report.sexStats).forEach(([key, stats]) => {
    console.log(`  ${stats.sexName.padEnd(12)} - WinRate: ${(stats.avgWinRate * 100).toFixed(1)}%, Level: ${stats.avgLevel.toFixed(1)}, Lvl20: ${stats.percentReachedLevel20.toFixed(1)}%`);
});

const avgWinRate = parseFloat(report.summary.avgWinRate);
const improvement = avgWinRate > 41.7 ? 'IMPROVED ✓' : 'needs more work';
const targetMet = avgWinRate >= 60 && avgWinRate <= 85 ? 'TARGET MET ✓' : 'not yet in target range';

console.log(`\n🎯 Balance Status: ${improvement} - ${targetMet}`);
console.log(`   Win rate: ${report.summary.avgWinRate} (was 41.67%, target: 60-85%)\n`);
