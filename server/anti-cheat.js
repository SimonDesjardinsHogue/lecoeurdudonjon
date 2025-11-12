// Server-side Anti-Cheat Module
// Validates player scores and detects suspicious activity

const MAX_LEVEL = 24;

// Validation ranges for player properties (server-side anti-cheat)
const VALIDATION_RANGES = {
    level: { min: 1, max: MAX_LEVEL },
    kills: { min: 0, max: 99999 },
    gold: { min: 0, max: 999999 },
    xp: { min: 0, max: 999999 },
    puissance: { min: 1, max: 150 },
    defense: { min: 1, max: 150 }
};

// Rate limiting - track submission times per player
const submissionHistory = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 10;

// Validate score data
function validateScoreData(scoreData) {
    const { playerId, playerName, level, kills, gold, xp, puissance, defense } = scoreData;
    
    // Required fields
    if (!playerId || !playerName) {
        throw new Error('playerId and playerName are required');
    }
    
    // Type validation
    if (typeof level !== 'number' || typeof kills !== 'number' || typeof gold !== 'number') {
        throw new Error('level, kills, and gold must be numbers');
    }
    
    // Range validation
    for (const [prop, range] of Object.entries(VALIDATION_RANGES)) {
        const value = scoreData[prop];
        if (value !== undefined && value !== null) {
            if (typeof value !== 'number' || value < range.min || value > range.max) {
                throw new Error(`Invalid ${prop}: ${value} (must be ${range.min}-${range.max})`);
            }
        }
    }
    
    // Logical validations
    validateLevelProgression(scoreData);
    validateStatDistribution(scoreData);
    
    return true;
}

// Validate that level progression is reasonable
function validateLevelProgression(scoreData) {
    const { level, xp, kills } = scoreData;
    
    // XP should be reasonable for the level
    const minExpectedXP = level > 1 ? Math.pow(level - 1, 1.5) * 50 : 0;
    const maxExpectedXP = Math.pow(level + 1, 2) * 100;
    
    if (xp < minExpectedXP * 0.3 || xp > maxExpectedXP * 3) {
        console.warn(`[Anti-Cheat] Suspicious XP: ${xp} for level ${level}`);
    }
    
    // Kills should be reasonable for level
    const minExpectedKills = level > 1 ? (level - 1) * 3 : 0;
    const maxExpectedKills = level * 100;
    
    if (kills < minExpectedKills * 0.3 || kills > maxExpectedKills * 2) {
        console.warn(`[Anti-Cheat] Suspicious kills: ${kills} for level ${level}`);
    }
}

// Validate that stat distribution is reasonable
function validateStatDistribution(scoreData) {
    const { level, puissance, defense } = scoreData;
    
    if (puissance !== undefined && puissance !== null) {
        const maxExpectedPuissance = 10 + (level * 3) + 30; // Base + level progression + items
        if (puissance > maxExpectedPuissance) {
            console.warn(`[Anti-Cheat] Suspicious puissance: ${puissance} for level ${level}`);
        }
    }
    
    if (defense !== undefined && defense !== null) {
        const maxExpectedDefense = 10 + (level * 3) + 30; // Base + level progression + items
        if (defense > maxExpectedDefense) {
            console.warn(`[Anti-Cheat] Suspicious defense: ${defense} for level ${level}`);
        }
    }
}

// Check for rate limiting violations
function checkRateLimit(playerId) {
    const now = Date.now();
    
    if (!submissionHistory.has(playerId)) {
        submissionHistory.set(playerId, []);
    }
    
    const history = submissionHistory.get(playerId);
    
    // Remove submissions older than the rate limit window
    const recentSubmissions = history.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    // Check if player exceeded rate limit
    if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_WINDOW) {
        throw new Error(`Rate limit exceeded: max ${MAX_SUBMISSIONS_PER_WINDOW} submissions per ${RATE_LIMIT_WINDOW / 1000} seconds`);
    }
    
    // Add current submission
    recentSubmissions.push(now);
    submissionHistory.set(playerId, recentSubmissions);
    
    return true;
}

// Detect anomalous progression
function detectAnomalousProgression(playerId, newScore, previousScores) {
    if (previousScores.length === 0) {
        return []; // No previous data to compare
    }
    
    const warnings = [];
    const latestPrevious = previousScores[0]; // Most recent previous score
    
    // Check for impossible level jumps
    const levelDiff = newScore.level - latestPrevious.level;
    const timeDiff = new Date(newScore.timestamp) - new Date(latestPrevious.timestamp);
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (levelDiff > 5 && hoursDiff < 0.5) {
        warnings.push(`Rapid level gain: ${levelDiff} levels in ${hoursDiff.toFixed(1)} hours`);
    }
    
    // Check for impossible gold gains
    const goldDiff = newScore.gold - latestPrevious.gold;
    if (goldDiff > 50000 && hoursDiff < 1) {
        warnings.push(`Rapid gold gain: ${goldDiff} gold in ${hoursDiff.toFixed(1)} hours`);
    }
    
    // Check for level regression (should not decrease)
    if (newScore.level < latestPrevious.level) {
        warnings.push('Level regression detected');
    }
    
    if (warnings.length > 0) {
        console.warn(`[Anti-Cheat] Player ${playerId} anomalies:`, warnings);
    }
    
    return warnings;
}

// Calculate score checksum for integrity
function calculateScoreChecksum(scoreData) {
    const { level, kills, gold, xp } = scoreData;
    const str = `${level}:${kills}:${gold}:${xp}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
}

// Clean up old rate limit entries periodically
function cleanupRateLimitHistory() {
    const now = Date.now();
    for (const [playerId, history] of submissionHistory.entries()) {
        const recentSubmissions = history.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
        if (recentSubmissions.length === 0) {
            submissionHistory.delete(playerId);
        } else {
            submissionHistory.set(playerId, recentSubmissions);
        }
    }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitHistory, 5 * 60 * 1000);

export {
    validateScoreData,
    checkRateLimit,
    detectAnomalousProgression,
    calculateScoreChecksum,
    VALIDATION_RANGES
};
