// Enemy Data Module
// Enemy templates (34 types for levels 1-24)
// Note: isRanged indicates the enemy attacks from distance and needs to approach for melee
// Note: level indicates the intended player level for encountering this enemy
export const enemies = [
    // Early game enemies (levels 1-5) - XP reduced by ~8%
    { name: 'Rat Géant', icon: '🐀', health: 30, strength: 7, defense: 2, gold: 16, xp: 23, level: 1 },
    { name: 'Gobelin', icon: '👺', health: 50, strength: 9, defense: 4, gold: 26, xp: 37, level: 2 },
    { name: 'Gobelin Archer', icon: '🏹👺', health: 45, strength: 10, defense: 3, gold: 28, xp: 39, isRanged: true, level: 3 },
    { name: 'Araignée Géante', icon: '🕷️', health: 55, strength: 10, defense: 5, gold: 30, xp: 41, level: 4 },
    { name: 'Loup Sauvage', icon: '🐺', health: 48, strength: 11, defense: 4, gold: 24, xp: 38, level: 5 },
    { name: 'Sanglier Enragé', icon: '🐗', health: 58, strength: 11, defense: 6, gold: 28, xp: 42, level: 6 },
    { name: 'Squelette', icon: '💀', health: 60, strength: 12, defense: 6, gold: 36, xp: 46, level: 7 },
    { name: 'Squelette Archer', icon: '🏹💀', health: 55, strength: 13, defense: 5, gold: 38, xp: 48, isRanged: true, level: 8 },
    { name: 'Orc', icon: '👹', health: 80, strength: 15, defense: 8, gold: 51, xp: 64, level: 9 },
    
    // Mid game enemies (levels 6-10)
    { name: 'Bandit', icon: '🗡️', health: 75, strength: 14, defense: 7, gold: 46, xp: 60, level: 10 },
    { name: 'Bandit Arbalétrier', icon: '🎯🗡️', health: 70, strength: 16, defense: 6, gold: 49, xp: 63, isRanged: true, level: 11 },
    { name: 'Ours de la Forêt', icon: '🐻', health: 95, strength: 17, defense: 11, gold: 68, xp: 80, level: 12 },
    { name: 'Loup-Garou', icon: '🐺', health: 100, strength: 18, defense: 10, gold: 76, xp: 83, level: 13 },
    { name: 'Zombie', icon: '🧟', health: 90, strength: 16, defense: 9, gold: 61, xp: 74, level: 14 },
    { name: 'Sorcier Noir', icon: '🧙', health: 110, strength: 20, defense: 12, gold: 91, xp: 92, isRanged: true, level: 15 },
    { name: 'Dragon Mineur', icon: '🐉', health: 150, strength: 23, defense: 15, gold: 152, xp: 138, level: 16 },
    
    // Advanced enemies (levels 11-15)
    { name: 'Golem de Pierre', icon: '🗿', health: 180, strength: 25, defense: 18, gold: 182, xp: 166, level: 17 },
    { name: 'Vampire', icon: '🧛', health: 160, strength: 28, defense: 16, gold: 202, xp: 184, level: 18 },
    { name: 'Élémentaire de Feu', icon: '🔥', health: 170, strength: 30, defense: 14, gold: 223, xp: 202, isRanged: true, level: 19 },
    { name: 'Spectre', icon: '👻', health: 150, strength: 32, defense: 12, gold: 243, xp: 221, level: 20 },
    { name: 'Esprit de la Forêt Corrompu', icon: '🌳', health: 165, strength: 29, defense: 15, gold: 212, xp: 193, level: 21 },
    { name: 'Chevalier Noir', icon: '⚔️', health: 200, strength: 35, defense: 20, gold: 283, xp: 258, level: 22 },
    { name: 'Archer Maudit', icon: '🏹👻', health: 185, strength: 34, defense: 18, gold: 271, xp: 248, isRanged: true, level: 23 },
    
    // Elite enemies (levels 16-24) - multiple enemies per level for variety
    { name: 'Démon Mineur', icon: '😈', health: 220, strength: 38, defense: 22, gold: 324, xp: 294, level: 24 },
    { name: 'Dragon de Glace', icon: '🐲', health: 250, strength: 40, defense: 24, gold: 364, xp: 331, isRanged: true, level: 24 },
    { name: 'Liche Ancestrale', icon: '☠️', health: 240, strength: 42, defense: 23, gold: 405, xp: 368, isRanged: true, level: 24 },
    { name: 'Gardien Ancien de la Forêt', icon: '🛡️🌲', health: 270, strength: 44, defense: 27, gold: 430, xp: 391, level: 24 },
    { name: 'Titan de Fer', icon: '🤖', health: 280, strength: 45, defense: 26, gold: 455, xp: 414, level: 24 },
    { name: 'Tireur d\'Élite Démoniaque', icon: '🎯😈', health: 265, strength: 46, defense: 24, gold: 478, xp: 442, isRanged: true, level: 24 },
    { name: 'Archidémon', icon: '👿', health: 300, strength: 48, defense: 28, gold: 506, xp: 460, level: 24 },
    
    // Legendary enemies (level 24) - top tier enemies available at max level
    { name: 'Seigneur des Ombres', icon: '🌑', health: 320, strength: 50, defense: 30, gold: 531, xp: 483, level: 24 },
    { name: 'Golem Titanesque', icon: '🗿', health: 340, strength: 52, defense: 32, gold: 556, xp: 506, isRanged: false, level: 24 },
    { name: 'Dragon Noir Ancestral', icon: '🐲', health: 360, strength: 54, defense: 34, gold: 582, xp: 529, isRanged: true, level: 24 },
    { name: 'Champion du Chaos', icon: '⚔️👿', health: 380, strength: 56, defense: 36, gold: 607, xp: 552, level: 24 }
];

// Elite enemies - rare encounters with better loot (15% chance to appear)
// These have 50% more stats and 2x gold/xp compared to normal enemies at their level
export const eliteEnemies = [
    { name: 'Rat Géant Féroce', icon: '👑🐀', health: 45, strength: 11, defense: 3, gold: 32, xp: 46, level: 1, isElite: true },
    { name: 'Chef Gobelin', icon: '👑👺', health: 75, strength: 14, defense: 6, gold: 52, xp: 74, level: 2, isElite: true },
    { name: 'Araignée Reine', icon: '👑🕷️', health: 82, strength: 15, defense: 8, gold: 60, xp: 82, level: 4, isElite: true },
    { name: 'Alpha Loup-Garou', icon: '👑🐺', health: 150, strength: 27, defense: 15, gold: 152, xp: 166, level: 13, isElite: true },
    { name: 'Archimage Noir', icon: '👑🧙', health: 165, strength: 30, defense: 18, gold: 182, xp: 184, isRanged: true, level: 15, isElite: true },
    { name: 'Dragon Majeur', icon: '👑🐉', health: 225, strength: 35, defense: 23, gold: 304, xp: 276, level: 16, isElite: true },
    { name: 'Seigneur Vampire', icon: '👑🧛', health: 240, strength: 42, defense: 24, gold: 404, xp: 368, level: 18, isElite: true },
    { name: 'Prince Démon', icon: '👑😈', health: 330, strength: 57, defense: 33, gold: 648, xp: 588, level: 24, isElite: true }
];

// Boss templates - appear at levels 4, 8, 12, 16, 20, and 24
export const bosses = [
    { 
        name: 'Roi Gobelin', 
        icon: '👑👺', 
        health: 180, 
        strength: 22, 
        defense: 14, 
        gold: 250, 
        xp: 280,
        description: 'Le chef rusé de la tribu gobeline',
        ability: 'goblin_horde',
        abilityDescription: 'Appelle ses guerriers pour une attaque coordonnée',
        level: 4
    },
    { 
        name: 'Hydre à Trois Têtes', 
        icon: '🐉', 
        health: 280, 
        strength: 30, 
        defense: 19, 
        gold: 400, 
        xp: 450,
        description: 'Une hydre féroce crachant du venin',
        ability: 'triple_attack',
        abilityDescription: 'Attaque trois fois de suite',
        level: 8
    },
    { 
        name: 'Seigneur Liche', 
        icon: '💀', 
        health: 360, 
        strength: 38, 
        defense: 24, 
        gold: 600, 
        xp: 650,
        description: 'Un sorcier mort-vivant aux pouvoirs nécromantiques',
        ability: 'life_drain',
        abilityDescription: 'Vole 15 HP et les ajoute à sa santé',
        level: 12
    },
    { 
        name: 'Démon des Flammes', 
        icon: '😈', 
        health: 440, 
        strength: 45, 
        defense: 27, 
        gold: 800, 
        xp: 850,
        description: 'Un démon entouré de flammes infernales',
        ability: 'fire_burst',
        abilityDescription: 'Inflige des dégâts de feu ignorant 50% de la défense',
        level: 16
    },
    { 
        name: 'Dragon de Ténèbres', 
        icon: '🐲', 
        health: 520, 
        strength: 52, 
        defense: 31, 
        gold: 1100, 
        xp: 1100,
        description: 'Un dragon ancien maître des ombres',
        ability: 'shadow_breath',
        abilityDescription: 'Souffle d\'ombre qui ignore 40% de la défense',
        level: 20
    },
    { 
        name: 'Le Cœur du Dragon Corrompu', 
        icon: '💎🐉', 
        health: 600, 
        strength: 58, 
        defense: 35, 
        gold: 1500, 
        xp: 1400,
        description: 'L\'artefact légendaire corrompu par les ténèbres',
        ability: 'corruption_wave',
        abilityDescription: 'Vague de corruption infligeant des dégâts massifs et réduisant la défense',
        level: 24
    }
];
