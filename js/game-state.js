// Game State Management Module
export const gameState = {
    player: {
        name: '',
        level: 1,
        health: 100,
        maxHealth: 100,
        strength: 10,
        defense: 5,
        gold: 50,
        xp: 0,
        xpToLevel: 100,
        kills: 0,
        gamesPlayed: 0,
        energy: 100,
        maxEnergy: 100,
        lastSleepTime: null
    },
    currentEnemy: null,
    inCombat: false,
    defending: false
};

// Enemy templates
export const enemies = [
    { name: 'Rat Géant', health: 30, strength: 8, defense: 2, gold: 15, xp: 25 },
    { name: 'Gobelin', health: 50, strength: 12, defense: 4, gold: 25, xp: 40 },
    { name: 'Squelette', health: 60, strength: 15, defense: 6, gold: 35, xp: 50 },
    { name: 'Orc', health: 80, strength: 18, defense: 8, gold: 50, xp: 70 },
    { name: 'Loup-Garou', health: 100, strength: 22, defense: 10, gold: 75, xp: 90 },
    { name: 'Dragon Mineur', health: 150, strength: 28, defense: 15, gold: 150, xp: 150 }
];

// Shop items (functions will be set by game-logic module)
export const shopItems = [
    { name: 'Potion de Soin', description: 'Restaure 50 HP', cost: 30, effect: null },
    { name: 'Épée en Acier', description: '+5 Force', cost: 100, effect: null },
    { name: 'Armure de Cuir', description: '+3 Défense', cost: 80, effect: null },
    { name: 'Grande Potion', description: 'Restaure 100 HP', cost: 60, effect: null },
    { name: 'Épée Enchantée', description: '+10 Force', cost: 250, effect: null },
    { name: 'Bouclier de Fer', description: '+5 Défense', cost: 200, effect: null }
];
