// Boss Module
// Responsibility: Handle boss encounter logic

import { gameState, bosses } from '../game-state.js';

// Check if player should face a boss (at levels 4, 8, 12, 16, 20, and 24)
export function shouldFaceBoss() {
    const p = gameState.player;
    // Boss possible at levels 4, 8, 12, 16, 20, and 24
    // Probability increases with each exploration to guarantee boss encounter
    const bossLevels = [4, 8, 12, 16, 20, 24];
    const isAtBossLevel = bossLevels.includes(p.level) && p.kills > 0;
    
    if (!isAtBossLevel) {
        return false;
    }
    
    const bossIndex = getBossIndexForLevel(p.level);
    
    // Check if this boss has already been defeated
    if (bossIndex < p.bossesDefeated) {
        return false;
    }
    
    // Initialize boss attempts tracking
    if (!p.bossAttempts) {
        p.bossAttempts = {};
    }
    if (!p.bossAttempts[bossIndex]) {
        p.bossAttempts[bossIndex] = 0;
    }
    
    // Increment attempt counter
    p.bossAttempts[bossIndex]++;
    
    // Escalating probability: 30% base, +10% per attempt (max 95%)
    // This guarantees the boss appears within 7 attempts maximum
    const baseChance = 0.30;
    const bonusPerAttempt = 0.10;
    const maxChance = 0.95;
    const currentChance = Math.min(maxChance, baseChance + (p.bossAttempts[bossIndex] - 1) * bonusPerAttempt);
    
    const willFaceBoss = Math.random() < currentChance;
    
    // Reset attempts counter when boss is encountered
    if (willFaceBoss) {
        p.bossAttempts[bossIndex] = 0;
    }
    
    return willFaceBoss;
}

// Helper function to get the correct boss index for a given level
function getBossIndexForLevel(level) {
    const bossLevels = [4, 8, 12, 16, 20, 24];
    const index = bossLevels.indexOf(level);
    return index; // Returns 0 for level 4, 1 for level 8, etc.
}

// Create boss enemy
export function createBossEnemy() {
    const p = gameState.player;
    const bossIndex = Math.min(p.bossesDefeated, bosses.length - 1);
    const bossTemplate = bosses[bossIndex];
    
    // Scale boss stats based on player level
    const bossLevels = [4, 8, 12, 16, 20, 24];
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
