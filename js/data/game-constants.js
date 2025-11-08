// Game Constants Module
// Rarity system definitions
export const rarities = {
    commun: { name: 'Commun', color: '#9CA3AF', statBonus: 0 },
    rare: { name: 'Rare', color: '#3B82F6', statBonus: 1 },
    epique: { name: 'Épique', color: '#A855F7', statBonus: 2 },
    legendaire: { name: 'Légendaire', color: '#F59E0B', statBonus: 3 }
};

// Stat names for display
export const statNames = {
    strength: 'Force',
    defense: 'Défense',
    dexterity: 'Dextérité',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Sagesse',
    charisma: 'Charisme'
};

// Calculate stat modifier based on stat value (D&D-style)
export function getStatModifier(statValue) {
    if (statValue >= 20) return 4;
    if (statValue >= 19) return 3;
    if (statValue >= 18) return 3;
    if (statValue >= 16) return 2;
    if (statValue >= 14) return 1;
    if (statValue >= 12) return 0;
    if (statValue >= 10) return -1;
    if (statValue >= 8) return -2;
    if (statValue >= 6) return -3;
    if (statValue >= 4) return -3;
    return -4; // 2 or less
}

// Check if item has random stats based on rarity
export function hasRandomStats(item) {
    return item.rarity && item.rarity !== 'commun';
}

// Generate random bonus stats for rare+ items
export function generateRandomStats(rarity) {
    if (rarity === 'commun') return null;
    
    const bonusRange = rarities[rarity].statBonus;
    const stats = ['strength', 'defense', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    const randomStats = {};
    
    // Number of random stats based on rarity
    const numStats = rarity === 'rare' ? 1 : rarity === 'epique' ? 2 : 3;
    
    // Fisher-Yates shuffle algorithm for proper randomization
    const shuffled = [...stats];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Pick random stats
    for (let i = 0; i < numStats; i++) {
        const stat = shuffled[i];
        randomStats[stat] = Math.floor(Math.random() * bonusRange) + 1;
    }
    
    return randomStats;
}
