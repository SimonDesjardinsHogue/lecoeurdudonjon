// Dice System Module
// Responsibility: Handle all dice rolls in the game (d6-based system)
// The game uses 6-sided dice (d6) throughout, fitting the 4×6=24 level theme

/**
 * Roll a number of 6-sided dice
 * @param {number} numDice - Number of dice to roll
 * @param {number} bonus - Bonus to add to the total roll (default: 0)
 * @returns {object} - { total, rolls, bonus } where rolls is an array of individual die results
 */
export function rollDice(numDice, bonus = 0) {
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * 6) + 1; // 1-6
        rolls.push(roll);
        total += roll;
    }
    
    return {
        total: total + bonus,
        rolls: rolls,
        bonus: bonus,
        diceTotal: total
    };
}

/**
 * Format dice roll for display
 * @param {object} rollResult - Result from rollDice()
 * @param {string} label - Label to display (e.g., "Dégâts", "Initiative")
 * @returns {string} - Formatted string like "Initiative: 3d6 (4+5+2) +2 = 13"
 */
export function formatDiceRoll(rollResult, label = '') {
    const numDice = rollResult.rolls.length;
    const diceStr = rollResult.rolls.join('+');
    const bonusStr = rollResult.bonus >= 0 ? `+${rollResult.bonus}` : `${rollResult.bonus}`;
    
    if (label) {
        if (rollResult.bonus !== 0) {
            return `${label}: ${numDice}d6 (${diceStr}) ${bonusStr} = ${rollResult.total}`;
        } else {
            return `${label}: ${numDice}d6 (${diceStr}) = ${rollResult.total}`;
        }
    } else {
        if (rollResult.bonus !== 0) {
            return `${numDice}d6 (${diceStr}) ${bonusStr} = ${rollResult.total}`;
        } else {
            return `${numDice}d6 (${diceStr}) = ${rollResult.total}`;
        }
    }
}

/**
 * Roll for initiative in combat
 * Initiative uses 2d6 + dexterity modifier
 * @param {number} adresseModifier - Dexterity modifier
 * @returns {object} - Dice roll result
 */
export function rollInitiative(adresseModifier = 0) {
    return rollDice(2, adresseModifier);
}

/**
 * Roll for damage in combat
 * Damage varies based on character level and strength
 * @param {number} numDice - Number of damage dice (based on level/weapon)
 * @param {number} strengthModifier - Strength bonus to add
 * @returns {object} - Dice roll result
 */
export function rollDamage(numDice, strengthModifier = 0) {
    return rollDice(numDice, strengthModifier);
}

/**
 * Roll for health points
 * Used when leveling up or creating characters
 * @param {number} numDice - Number of hit dice (based on class/level)
 * @param {number} constitutionModifier - Constitution bonus
 * @returns {object} - Dice roll result
 */
export function rollHealth(numDice, constitutionModifier = 0) {
    return rollDice(numDice, constitutionModifier);
}

/**
 * Calculate number of damage dice based on player level
 * Early game: 1-2d6, Mid game: 3-4d6, Late game: 5-6d6
 * @param {number} level - Player level (1-24)
 * @returns {number} - Number of damage dice
 */
export function getDamageDiceForLevel(level) {
    if (level <= 4) return 1;       // Levels 1-4: 1d6
    if (level <= 8) return 2;       // Levels 5-8: 2d6
    if (level <= 12) return 3;      // Levels 9-12: 3d6
    if (level <= 16) return 4;      // Levels 13-16: 4d6
    if (level <= 20) return 5;      // Levels 17-20: 5d6
    return 6;                       // Levels 21-24: 6d6
}

/**
 * Calculate number of damage dice for an enemy based on their strength
 * @param {number} strength - Enemy strength value
 * @returns {number} - Number of damage dice
 */
export function getDamageDiceForEnemy(strength) {
    if (strength <= 10) return 1;   // Weak enemies: 1d6
    if (strength <= 20) return 2;   // Normal enemies: 2d6
    if (strength <= 30) return 3;   // Strong enemies: 3d6
    if (strength <= 40) return 4;   // Very strong: 4d6
    if (strength <= 50) return 5;   // Elite enemies: 5d6
    return 6;                       // Legendary: 6d6
}

/**
 * Roll dice to generate a random number in a range
 * This replaces Math.random() patterns with dice-based randomness
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} - Random value between min and max
 * @example rollRange(30, 180) -> could use 5d6×6 to get range 30-180
 */
export function rollRange(min, max) {
    const range = max - min;
    
    // For small ranges (1-6), use a single d6
    if (range <= 5) {
        const roll = Math.floor(Math.random() * 6) + 1;
        return min + Math.min(roll - 1, range);
    }
    
    // For larger ranges, calculate how many d6 we need
    // Each d6 gives us 0-5 of variance, so divide range by 6
    const numDice = Math.ceil(range / 6);
    const result = rollDice(numDice);
    
    // Scale the dice result to fit our range
    // Total possible range from numDice d6: numDice to (numDice * 6)
    // Map this to our desired range
    const diceRange = numDice * 6 - numDice;
    const normalized = (result.diceTotal - numDice) / diceRange;
    return min + Math.floor(normalized * range);
}

/**
 * Roll for gold treasure
 * Uses dice to determine random gold amounts
 * @param {number} baseGold - Base gold amount
 * @param {number} variance - Maximum variance (will use dice to randomize)
 * @returns {number} - Gold amount
 */
export function rollGold(baseGold, variance) {
    return rollRange(baseGold, baseGold + variance);
}

/**
 * Roll for experience points
 * Uses dice to determine random XP amounts
 * @param {number} baseXP - Base XP amount
 * @param {number} variance - Maximum variance (will use dice to randomize)
 * @returns {number} - XP amount
 */
export function rollXP(baseXP, variance) {
    return rollRange(baseXP, baseXP + variance);
}

/**
 * Roll for healing amount
 * Uses dice for percentage-based healing (more consistent than pure random)
 * @param {number} maxHealth - Maximum health
 * @param {number} minPercent - Minimum heal percent (0.0 to 1.0)
 * @param {number} maxPercent - Maximum heal percent (0.0 to 1.0)
 * @returns {number} - Healing amount
 */
export function rollHealing(maxHealth, minPercent, maxPercent) {
    // Use 6d6 for smooth distribution (6-36 range)
    const diceResult = rollDice(6);
    // Normalize to 0-1 range: (6-36) -> (0-30) -> (0-1)
    const normalized = (diceResult.diceTotal - 6) / 30;
    // Scale to min-max percent range
    const healPercent = minPercent + (normalized * (maxPercent - minPercent));
    return Math.floor(maxHealth * healPercent);
}

/**
 * Roll for random selection from array
 * Uses dice to pick random element instead of Math.random()
 * @param {Array} array - Array to select from
 * @returns {*} - Random element from array
 */
export function rollSelect(array) {
    if (!array || array.length === 0) return null;
    if (array.length === 1) return array[0];
    
    // For small arrays (1-6), use single d6
    if (array.length <= 6) {
        const roll = Math.floor(Math.random() * 6) + 1;
        const index = Math.min(roll - 1, array.length - 1);
        return array[index];
    }
    
    // For larger arrays, use multiple dice
    const numDice = Math.ceil(Math.log(array.length) / Math.log(6));
    const result = rollDice(numDice);
    // Map dice result to array index
    const maxRoll = numDice * 6;
    const minRoll = numDice;
    const normalized = (result.diceTotal - minRoll) / (maxRoll - minRoll);
    const index = Math.floor(normalized * array.length);
    return array[Math.min(index, array.length - 1)];
}

/**
 * Roll for percentage chance (0-100%)
 * Uses a single d6 repeatedly to build up a percentage roll
 * This gives a more uniform distribution than using many dice
 * @param {number} chance - Chance percentage (0-100)
 * @returns {boolean} - True if successful, false otherwise
 */
export function rollChance(chance) {
    if (chance <= 0) return false;
    if (chance >= 100) return true;
    
    // Roll a d6 and map 1-6 to percentage ranges
    // We'll use multiple d6 rolls to get finer granularity
    // First d6: determines 0-16%, 17-33%, 34-50%, 51-66%, 67-83%, 84-100%
    // Second d6: refines within that range
    const firstRoll = Math.floor(Math.random() * 6) + 1; // 1-6
    const secondRoll = Math.floor(Math.random() * 6) + 1; // 1-6
    
    // Map to 0-100 range: ((first-1) * 16.67 + (second-1) * 2.78)
    // This gives us 36 possible outcomes distributed across 0-100
    const percentage = ((firstRoll - 1) * 16.67) + ((secondRoll - 1) * 2.78);
    
    return percentage < chance;
}
