// Boss Module
// Responsibility: Handle boss encounter logic

import { gameState, bosses } from '../game-state.js';

// Check if player should face a boss (every 5 levels with probability)
export function shouldFaceBoss() {
    const p = gameState.player;
    // Boss possible at levels 5, 10, 15, 20, etc.
    // 25% chance to encounter boss when at a boss level and haven't defeated this boss yet
    const isAtBossLevel = p.level % 5 === 0 && p.kills > 0 && (p.level / 5) > p.bossesDefeated;
    const bossSpawnChance = 0.25; // 25% chance (increased to get ~4 bosses by level 20)
    return isAtBossLevel && Math.random() < bossSpawnChance;
}

// Create boss enemy
export function createBossEnemy() {
    const p = gameState.player;
    const bossIndex = Math.min(p.bossesDefeated, bosses.length - 1);
    const bossTemplate = bosses[bossIndex];
    
    // Scale boss stats based on player level
    const levelMultiplier = 1 + (p.level - (p.bossesDefeated * 5)) * 0.1;
    
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
