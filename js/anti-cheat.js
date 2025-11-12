// Anti-Cheat Module
// Provides comprehensive validation and integrity checks for game data

import { MAX_LEVEL } from './data/game-constants.js';

// Validation ranges for player properties (anti-cheat)
export const VALIDATION_RANGES = {
    level: { min: 1, max: MAX_LEVEL },
    health: { min: 1, max: 3000 },
    maxHealth: { min: 1, max: 3000 },
    puissance: { min: 1, max: 150 },
    defense: { min: 1, max: 150 },
    adresse: { min: 1, max: 150 },
    esprit: { min: 1, max: 150 },
    presence: { min: 1, max: 150 },
    gold: { min: 0, max: 999999 },
    xp: { min: 0, max: 999999 },
    statPoints: { min: 0, max: MAX_LEVEL * 2 },
    kills: { min: 0, max: 99999 },
    deaths: { min: 0, max: 99999 },
    bossesDefeated: { min: 0, max: 4 },
    energy: { min: 0, max: 200 },
    maxEnergy: { min: 0, max: 200 },
    mana: { min: 0, max: 300 },
    maxMana: { min: 0, max: 300 }
};

// Calculate a simple checksum for data integrity
export function calculateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
}

// Verify checksum integrity
export function verifyChecksum(data, expectedChecksum) {
    const actualChecksum = calculateChecksum(data);
    return actualChecksum === expectedChecksum;
}

// Validate player data against acceptable ranges
export function validatePlayerData(player) {
    // Validate numerical ranges
    for (const [prop, range] of Object.entries(VALIDATION_RANGES)) {
        if (player[prop] !== undefined) {
            const value = player[prop];
            if (typeof value !== 'number' || value < range.min || value > range.max) {
                throw new Error(`Invalid ${prop}: ${value} (must be ${range.min}-${range.max})`);
            }
        }
    }
    
    // Logical validations
    if (player.health > player.maxHealth) {
        throw new Error('Health cannot exceed maxHealth');
    }
    
    if (player.energy > player.maxEnergy) {
        throw new Error('Energy cannot exceed maxEnergy');
    }
    
    if (player.mana > player.maxMana) {
        throw new Error('Mana cannot exceed maxMana');
    }
    
    // Validate level progression
    validateLevelProgression(player);
    
    // Validate stat distribution
    validateStatDistribution(player);
    
    return true;
}

// Validate that level progression is reasonable
function validateLevelProgression(player) {
    const level = player.level;
    const xp = player.xp;
    
    // XP should be reasonable for the level
    // Rough formula: each level requires progressively more XP
    const minExpectedXP = level > 1 ? Math.pow(level - 1, 1.5) * 50 : 0;
    const maxExpectedXP = Math.pow(level + 1, 2) * 100;
    
    if (xp < minExpectedXP * 0.5 || xp > maxExpectedXP * 2) {
        console.warn(`Suspicious XP: ${xp} for level ${level}`);
        // Don't throw - just warn, as XP can vary
    }
    
    // Boss defeats should be reasonable for level
    const bossesDefeated = player.bossesDefeated || 0;
    const maxBossesForLevel = Math.min(4, Math.floor(level / 5));
    
    if (bossesDefeated > maxBossesForLevel + 1) {
        console.warn(`Suspicious boss count: ${bossesDefeated} for level ${level}`);
    }
}

// Validate that stat distribution is reasonable
function validateStatDistribution(player) {
    // Calculate total stats (excluding base stats)
    const baseStatsPerStat = 10; // Base value for each stat
    const totalBaseStats = baseStatsPerStat * 5; // 5 stats
    
    const totalStats = (player.puissance || 10) + (player.defense || 10) + 
                       (player.adresse || 10) + (player.esprit || 10) +
                       (player.presence || 10);
    
    // Calculate expected stat points
    // Base: 50 (10 per stat)
    // Level ups: (level - 1) points distributed
    // Race bonuses: usually +2/-2, net 0
    // Items: can add significant bonuses (up to ~50 at high levels)
    const minExpectedStats = totalBaseStats + (player.level - 1) * 0.5; // At least 50% spent
    const maxExpectedStats = totalBaseStats + (player.level - 1) * 5 + 60; // Allow for items and all points
    
    if (totalStats < minExpectedStats || totalStats > maxExpectedStats) {
        console.warn(`Suspicious stats total: ${totalStats} for level ${player.level} (expected ${minExpectedStats}-${maxExpectedStats})`);
        // Don't throw - player might have special items or might not have spent all points
    }
    
    // Validate that health scales reasonably with level and constitution
    const constitution = player.puissance || 10; // Puissance affects HP
    const expectedMinHP = 100 + (player.level - 1) * 15;
    const expectedMaxHP = 200 + (player.level - 1) * 25 + constitution * 5;
    
    if (player.maxHealth < expectedMinHP * 0.5 || player.maxHealth > expectedMaxHP * 1.5) {
        console.warn(`Suspicious max health: ${player.maxHealth} for level ${player.level}`);
    }
}

// Validate inventory items
export function validateInventory(inventory) {
    if (!Array.isArray(inventory)) {
        throw new Error('Inventory must be an array');
    }
    
    // Check for duplicate items with impossible quantities
    const itemCounts = new Map();
    for (const item of inventory) {
        if (!item || typeof item !== 'object') {
            throw new Error('Invalid item in inventory');
        }
        
        // Validate item properties
        if (item.name && typeof item.name !== 'string') {
            throw new Error('Invalid item name');
        }
        
        if (item.quantity !== undefined && (typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 999)) {
            throw new Error(`Invalid item quantity: ${item.quantity}`);
        }
        
        // Track item counts
        const itemKey = `${item.name}_${item.rarity || 'commun'}`;
        itemCounts.set(itemKey, (itemCounts.get(itemKey) || 0) + (item.quantity || 1));
    }
    
    // Check for excessive quantities
    for (const [itemKey, count] of itemCounts.entries()) {
        if (count > 999) {
            console.warn(`Suspicious item count: ${itemKey} = ${count}`);
        }
    }
    
    return true;
}

// Validate progression rate (detect rapid leveling)
export function validateProgressionRate(player, previousState) {
    if (!previousState) {
        return true; // No previous state to compare
    }
    
    const timeDiff = Date.now() - (previousState.lastSaveTime || 0);
    const levelDiff = player.level - (previousState.level || 1);
    
    // If more than 1 level gained in less than 1 minute, flag as suspicious
    if (timeDiff < 60000 && levelDiff > 1) {
        console.warn(`Suspicious leveling rate: ${levelDiff} levels in ${timeDiff / 1000}s`);
        // Don't throw - could be legitimate in some cases
    }
    
    return true;
}

// Add integrity metadata to save data
export function addIntegrityMetadata(saveData) {
    const metadata = {
        timestamp: Date.now(),
        version: saveData.player?.level || 1,
        checksum: null
    };
    
    // Calculate checksum of player data
    if (saveData.player) {
        metadata.checksum = calculateChecksum(saveData.player);
    }
    
    saveData._integrity = metadata;
    return saveData;
}

// Verify integrity metadata
export function verifyIntegrityMetadata(saveData) {
    if (!saveData._integrity) {
        console.warn('Save data missing integrity metadata');
        return false; // Missing metadata, but don't fail (backwards compatibility)
    }
    
    const metadata = saveData._integrity;
    
    // Verify checksum
    if (metadata.checksum && saveData.player) {
        if (!verifyChecksum(saveData.player, metadata.checksum)) {
            console.error('Checksum verification failed - save data may be corrupted or tampered');
            return false;
        }
    }
    
    // Verify timestamp is reasonable
    const timestamp = metadata.timestamp;
    const now = Date.now();
    const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
    const oneYearFuture = now + (365 * 24 * 60 * 60 * 1000);
    
    if (timestamp < oneYearAgo || timestamp > oneYearFuture) {
        console.warn(`Suspicious timestamp: ${new Date(timestamp).toISOString()}`);
    }
    
    return true;
}

// Detect common cheat patterns
export function detectCheatPatterns(player) {
    const warnings = [];
    
    // Pattern 1: Excessive gold without kills
    if (player.gold > 10000 && player.kills < 10) {
        warnings.push('Excessive gold without kills');
    }
    
    // Pattern 2: High level with low kills
    if (player.level > 10 && player.kills < player.level * 5) {
        warnings.push('High level with suspiciously low kills');
    }
    
    // Pattern 3: All bosses defeated but low level
    if (player.bossesDefeated >= 4 && player.level < 15) {
        warnings.push('All bosses defeated at low level');
    }
    
    // Pattern 4: Maximum stats at low level
    const totalStats = (player.puissance || 0) + (player.defense || 0) + 
                       (player.adresse || 0) + (player.esprit || 0) + (player.presence || 0);
    if (totalStats > 200 && player.level < 10) {
        warnings.push('Excessive stats for level');
    }
    
    // Pattern 5: Negative or zero deaths with many kills
    if (player.kills > 100 && (player.deaths === 0 || !player.deaths)) {
        // This is actually possible for skilled players, so just log
        console.log('Player has many kills with no deaths (impressive!)');
    }
    
    if (warnings.length > 0) {
        console.warn('Detected potential cheat patterns:', warnings);
    }
    
    return warnings;
}

// Comprehensive save validation
export function validateSaveData(saveData) {
    try {
        // Basic structure validation
        if (!saveData || typeof saveData !== 'object') {
            throw new Error('Invalid save data structure');
        }
        
        if (!saveData.player || typeof saveData.player !== 'object') {
            throw new Error('Missing or invalid player data');
        }
        
        // Validate player data
        validatePlayerData(saveData.player);
        
        // Validate inventory if present
        if (saveData.player.inventory) {
            validateInventory(saveData.player.inventory);
        }
        
        // Verify integrity metadata
        const integrityValid = verifyIntegrityMetadata(saveData);
        if (!integrityValid) {
            console.warn('Integrity check failed, but allowing load (may be old save)');
        }
        
        // Detect cheat patterns
        detectCheatPatterns(saveData.player);
        
        return true;
    } catch (error) {
        console.error('Save validation failed:', error.message);
        throw error;
    }
}
