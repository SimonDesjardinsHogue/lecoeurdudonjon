// Boss Module
// Responsibility: Handle boss encounter logic

import { gameState, bosses } from '../game-state.js';

// Check if player should face a boss (every 5 levels with probability, plus level 24)
export function shouldFaceBoss() {
    const p = gameState.player;
    // Boss possible at levels 5, 10, 15, 20, and 24 (final boss)
    // 25% chance to encounter boss when at a boss level and haven't defeated this boss yet
    const isAtBossLevel = ((p.level % 5 === 0) || p.level === 24) && p.kills > 0 && getBossIndexForLevel(p.level) > p.bossesDefeated - 1;
    const bossSpawnChance = 0.25; // 25% chance
    return isAtBossLevel && Math.random() < bossSpawnChance;
}

// Helper function to get the correct boss index for a given level
function getBossIndexForLevel(level) {
    if (level === 24) return 5; // Final boss (index 5)
    return Math.floor(level / 5) - 1; // Levels 5, 10, 15, 20 -> indices 0, 1, 2, 3, 4
}

// Create boss enemy
export function createBossEnemy() {
    const p = gameState.player;
    const bossIndex = Math.min(p.bossesDefeated, bosses.length - 1);
    const bossTemplate = bosses[bossIndex];
    
    // Scale boss stats based on player level
    const baseLevelForBoss = bossIndex < 4 ? (bossIndex + 1) * 5 : 24; // Levels 5,10,15,20 for first 4, level 24 for final
    const levelMultiplier = 1 + (p.level - baseLevelForBoss) * 0.1;
    
    return {
        ...bossTemplate,
        maxHealth: Math.floor(bossTemplate.health * levelMultiplier),
        health: Math.floor(bossTemplate.health * levelMultiplier),
        strength: Math.floor(bossTemplate.strength * levelMultiplier),
        defense: Math.floor(bossTemplate.defense * levelMultiplier),
        gold: Math.floor(bossTemplate.gold * levelMultiplier),
        xp: Math.floor(bossTemplate.xp * levelMultiplier),
        isBoss: true,
        distance: 0 // Bosses always start at melee range
    };
}
