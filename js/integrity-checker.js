// Runtime Integrity Checker
// Monitors game state during gameplay to detect tampering

import { gameState } from './game-state.js';
import { validatePlayerData, detectCheatPatterns } from './anti-cheat.js';

// Store snapshots of game state for comparison
let lastSnapshot = null;
let lastCheckTime = Date.now();

// Configuration
const CHECK_INTERVAL = 30000; // Check every 30 seconds
const ANOMALY_THRESHOLD = 3; // Number of anomalies before warning

// Anomaly counter
let anomalyCount = 0;

// Take a snapshot of critical game state
function takeSnapshot() {
    return {
        level: gameState.player.level,
        health: gameState.player.health,
        maxHealth: gameState.player.maxHealth,
        gold: gameState.player.gold,
        xp: gameState.player.xp,
        kills: gameState.player.kills,
        puissance: gameState.player.puissance,
        defense: gameState.player.defense,
        timestamp: Date.now()
    };
}

// Check for suspicious changes between snapshots
function checkForSuspiciousChanges(current, previous) {
    const warnings = [];
    const timeDiff = current.timestamp - previous.timestamp;
    const minutesDiff = timeDiff / (60 * 1000);
    
    // Check for impossible stat increases
    if (current.puissance > previous.puissance + 50) {
        warnings.push(`Suspicious puissance increase: +${current.puissance - previous.puissance}`);
    }
    
    if (current.defense > previous.defense + 50) {
        warnings.push(`Suspicious defense increase: +${current.defense - previous.defense}`);
    }
    
    // Check for impossible gold gain
    const goldDiff = current.gold - previous.gold;
    if (goldDiff > 50000 && minutesDiff < 5) {
        warnings.push(`Rapid gold gain: +${goldDiff} in ${minutesDiff.toFixed(1)} minutes`);
    }
    
    // Check for impossible level gain
    const levelDiff = current.level - previous.level;
    if (levelDiff > 3 && minutesDiff < 5) {
        warnings.push(`Rapid level gain: +${levelDiff} levels in ${minutesDiff.toFixed(1)} minutes`);
    }
    
    // Check for health exceeding max health
    if (current.health > current.maxHealth) {
        warnings.push(`Health (${current.health}) exceeds max health (${current.maxHealth})`);
    }
    
    // Check for stats decreasing (should not happen except through death)
    if (current.level < previous.level) {
        warnings.push('Level decreased');
    }
    
    return warnings;
}

// Perform integrity check
export function performIntegrityCheck() {
    try {
        // Validate current player data
        validatePlayerData(gameState.player);
        
        // Detect cheat patterns
        const patterns = detectCheatPatterns(gameState.player);
        
        // Take current snapshot
        const currentSnapshot = takeSnapshot();
        
        // Compare with previous snapshot if available
        if (lastSnapshot) {
            const warnings = checkForSuspiciousChanges(currentSnapshot, lastSnapshot);
            
            if (warnings.length > 0) {
                anomalyCount += warnings.length;
                console.warn('[Integrity Check] Anomalies detected:', warnings);
                
                // If too many anomalies, show warning to user
                if (anomalyCount >= ANOMALY_THRESHOLD) {
                    console.error('[Integrity Check] Multiple anomalies detected. Game state may be compromised.');
                    // Don't throw or block gameplay, just log
                    anomalyCount = 0; // Reset counter
                }
            } else {
                // No anomalies detected, reduce counter
                anomalyCount = Math.max(0, anomalyCount - 1);
            }
        }
        
        // Update snapshot
        lastSnapshot = currentSnapshot;
        lastCheckTime = Date.now();
        
        return true;
    } catch (error) {
        console.error('[Integrity Check] Validation failed:', error.message);
        // Don't throw - log and continue
        return false;
    }
}

// Start periodic integrity checking
export function startIntegrityMonitoring() {
    console.log('[Integrity Check] Starting runtime integrity monitoring');
    
    // Initial check
    performIntegrityCheck();
    
    // Periodic checks
    setInterval(() => {
        if (gameState.player && gameState.player.name) {
            performIntegrityCheck();
        }
    }, CHECK_INTERVAL);
}

// Validate a specific action (called before critical operations)
export function validateAction(actionType, data) {
    try {
        switch (actionType) {
            case 'levelUp':
                // Ensure level increase is by 1
                if (data.newLevel !== data.oldLevel + 1) {
                    throw new Error('Invalid level increase');
                }
                break;
                
            case 'goldChange':
                // Ensure gold doesn't exceed maximum
                if (data.newGold > 999999) {
                    throw new Error('Gold exceeds maximum');
                }
                break;
                
            case 'statIncrease':
                // Ensure stat doesn't exceed maximum
                if (data.newValue > 150) {
                    throw new Error('Stat exceeds maximum');
                }
                break;
                
            case 'healthChange':
                // Ensure health doesn't exceed max health
                if (data.newHealth > gameState.player.maxHealth) {
                    throw new Error('Health exceeds maximum');
                }
                break;
        }
        
        return true;
    } catch (error) {
        console.error(`[Integrity Check] Action validation failed for ${actionType}:`, error.message);
        throw error;
    }
}

// Export for external use
export { takeSnapshot, checkForSuspiciousChanges };
