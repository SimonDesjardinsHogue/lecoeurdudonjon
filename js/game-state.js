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
    { name: 'Rat Géant', icon: '🐀', health: 30, strength: 8, defense: 2, gold: 15, xp: 25 },
    { name: 'Gobelin', icon: '👺', health: 50, strength: 12, defense: 4, gold: 25, xp: 40 },
    { name: 'Araignée Géante', icon: '🕷️', health: 55, strength: 13, defense: 5, gold: 30, xp: 45 },
    { name: 'Squelette', icon: '💀', health: 60, strength: 15, defense: 6, gold: 35, xp: 50 },
    { name: 'Orc', icon: '👹', health: 80, strength: 18, defense: 8, gold: 50, xp: 70 },
    { name: 'Bandit', icon: '🗡️', health: 75, strength: 17, defense: 7, gold: 45, xp: 65 },
    { name: 'Loup-Garou', icon: '🐺', health: 100, strength: 22, defense: 10, gold: 75, xp: 90 },
    { name: 'Zombie', icon: '🧟', health: 90, strength: 20, defense: 9, gold: 60, xp: 80 },
    { name: 'Sorcier Noir', icon: '🧙', health: 110, strength: 24, defense: 12, gold: 90, xp: 100 },
    { name: 'Dragon Mineur', icon: '🐉', health: 150, strength: 28, defense: 15, gold: 150, xp: 150 }
];

// Shop items (functions will be set by game-logic module)
// Categories: heal, damage, energy, exp, equipment
export const shopItems = [
    // Healing potions
    { name: 'Petite Potion de Soin', icon: '🧪', description: 'Restaure 30 HP', cost: 20, category: 'heal', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion de Soin', icon: '🧪', description: 'Restaure 50 HP', cost: 30, category: 'heal', type: 'potion', strength: 'normal', effect: null },
    { name: 'Grande Potion de Soin', icon: '⚗️', description: 'Restaure 100 HP', cost: 60, category: 'heal', type: 'potion', strength: 'strong', effect: null },
    { name: 'Potion de Soin Suprême', icon: '⚗️', description: 'Restaure 200 HP', cost: 120, category: 'heal', type: 'potion', strength: 'supreme', effect: null },
    
    // Damage potions
    { name: 'Potion de Force Mineure', icon: '💪', description: '+3 Force', cost: 50, category: 'damage', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion de Force', icon: '💪', description: '+5 Force', cost: 80, category: 'damage', type: 'potion', strength: 'normal', effect: null },
    { name: 'Potion de Force Majeure', icon: '💪', description: '+8 Force', cost: 150, category: 'damage', type: 'potion', strength: 'strong', effect: null },
    
    // Energy potions
    { name: 'Potion d\'Énergie Mineure', icon: '⚡', description: 'Restaure 30 Énergie', cost: 25, category: 'energy', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion d\'Énergie', icon: '⚡', description: 'Restaure 50 Énergie', cost: 40, category: 'energy', type: 'potion', strength: 'normal', effect: null },
    { name: 'Potion d\'Énergie Majeure', icon: '⚡', description: 'Restaure 100 Énergie', cost: 80, category: 'energy', type: 'potion', strength: 'strong', effect: null },
    
    // Experience potions
    { name: 'Potion d\'Expérience Mineure', icon: '✨', description: '+30 XP', cost: 40, category: 'exp', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion d\'Expérience', icon: '✨', description: '+60 XP', cost: 70, category: 'exp', type: 'potion', strength: 'normal', effect: null },
    { name: 'Potion d\'Expérience Majeure', icon: '✨', description: '+120 XP', cost: 130, category: 'exp', type: 'potion', strength: 'strong', effect: null },
    
    // Equipment (weapons and armor)
    { name: 'Épée en Acier', icon: '⚔️', description: '+5 Force', cost: 100, category: 'damage', type: 'equipment', effect: null },
    { name: 'Épée Enchantée', icon: '🗡️', description: '+10 Force', cost: 250, category: 'damage', type: 'equipment', effect: null },
    { name: 'Armure de Cuir', icon: '🛡️', description: '+3 Défense', cost: 80, category: 'equipment', type: 'equipment', effect: null },
    { name: 'Bouclier de Fer', icon: '🛡️', description: '+5 Défense', cost: 200, category: 'equipment', type: 'equipment', effect: null }
];

// NPCs
export const npcs = [
    { 
        name: 'Sage Mystérieux',
        icon: '🧙‍♂️',
        dialogue: 'Je sens en toi un grand potentiel, jeune aventurier. Chaque combat te rendra plus fort !',
        reward: null
    },
    { 
        name: 'Forgeron',
        icon: '⚒️',
        dialogue: 'Mes armes sont les meilleures du royaume ! Visite ma boutique si tu as de l\'or.',
        reward: null
    },
    { 
        name: 'Prêtre',
        icon: '⛪',
        dialogue: 'Que la lumière te guide dans les ténèbres du donjon. Tiens, prends cette bénédiction !',
        reward: { type: 'heal', amount: 30 }
    },
    { 
        name: 'Chasseur de Trésors',
        icon: '🗺️',
        dialogue: 'J\'ai trouvé quelques pièces d\'or en explorant. Tiens, prends-les, j\'en ai assez !',
        reward: { type: 'gold', amount: 25 }
    },
    { 
        name: 'Vieux Guerrier',
        icon: '🛡️',
        dialogue: 'La défense est tout aussi importante que l\'attaque. N\'oublie jamais cela !',
        reward: null
    }
];
