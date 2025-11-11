// Boss Module
// Responsibility: Handle boss encounter logic

import { gameState, bosses } from '../game-state.js';

// Check if player should face a boss (at levels 6, 12, 18, and 24)
export function shouldFaceBoss() {
    const p = gameState.player;
    // Boss possible at levels 6, 12, 18, and 24
    // 25% chance to encounter boss when at a boss level and haven't defeated this boss yet
    const bossLevels = [6, 12, 18, 24];
    const isAtBossLevel = bossLevels.includes(p.level) && p.kills > 0 && getBossIndexForLevel(p.level) > p.bossesDefeated - 1;
    const bossSpawnChance = 0.25; // 25% chance
    return isAtBossLevel && Math.random() < bossSpawnChance;
}

// Helper function to get the correct boss index for a given level
function getBossIndexForLevel(level) {
    const bossLevels = [6, 12, 18, 24];
    const index = bossLevels.indexOf(level);
    return index; // Returns 0 for level 6, 1 for level 12, 2 for level 18, 3 for level 24
}

// Create boss enemy
export function createBossEnemy() {
    const p = gameState.player;
    const bossIndex = Math.min(p.bossesDefeated, bosses.length - 1);
    const bossTemplate = bosses[bossIndex];
    
    // Scale boss stats based on player level
    const bossLevels = [6, 12, 18, 24];
    const baseLevelForBoss = bossLevels[bossIndex] || 24;
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
