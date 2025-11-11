// Enemy Data Module
// Enemy templates (30 types for levels 1-20)
// Note: isRanged indicates the enemy attacks from distance and needs to approach for melee
export const enemies = [
    // Early game enemies (levels 1-5) - XP reduced by ~8%
    { name: 'Rat Géant', icon: '🐀', health: 30, strength: 7, defense: 2, gold: 16, xp: 23 },
    { name: 'Gobelin', icon: '👺', health: 50, strength: 9, defense: 4, gold: 26, xp: 37 },
    { name: 'Gobelin Archer', icon: '🏹👺', health: 45, strength: 10, defense: 3, gold: 28, xp: 39, isRanged: true },
    { name: 'Araignée Géante', icon: '🕷️', health: 55, strength: 10, defense: 5, gold: 30, xp: 41 },
    { name: 'Loup Sauvage', icon: '🐺', health: 48, strength: 11, defense: 4, gold: 24, xp: 38 },
    { name: 'Sanglier Enragé', icon: '🐗', health: 58, strength: 11, defense: 6, gold: 28, xp: 42 },
    { name: 'Squelette', icon: '💀', health: 60, strength: 12, defense: 6, gold: 36, xp: 46 },
    { name: 'Squelette Archer', icon: '🏹💀', health: 55, strength: 13, defense: 5, gold: 38, xp: 48, isRanged: true },
    { name: 'Orc', icon: '👹', health: 80, strength: 15, defense: 8, gold: 51, xp: 64 },
    
    // Mid game enemies (levels 6-10)
    { name: 'Bandit', icon: '🗡️', health: 75, strength: 14, defense: 7, gold: 46, xp: 60 },
    { name: 'Bandit Arbalétrier', icon: '🎯🗡️', health: 70, strength: 16, defense: 6, gold: 49, xp: 63, isRanged: true },
    { name: 'Ours de la Forêt', icon: '🐻', health: 95, strength: 17, defense: 11, gold: 68, xp: 80 },
    { name: 'Loup-Garou', icon: '🐺', health: 100, strength: 18, defense: 10, gold: 76, xp: 83 },
    { name: 'Zombie', icon: '🧟', health: 90, strength: 16, defense: 9, gold: 61, xp: 74 },
    { name: 'Sorcier Noir', icon: '🧙', health: 110, strength: 20, defense: 12, gold: 91, xp: 92, isRanged: true },
    { name: 'Dragon Mineur', icon: '🐉', health: 150, strength: 23, defense: 15, gold: 152, xp: 138 },
    
    // Advanced enemies (levels 11-15)
    { name: 'Golem de Pierre', icon: '🗿', health: 180, strength: 25, defense: 18, gold: 182, xp: 166 },
    { name: 'Vampire', icon: '🧛', health: 160, strength: 28, defense: 16, gold: 202, xp: 184 },
    { name: 'Élémentaire de Feu', icon: '🔥', health: 170, strength: 30, defense: 14, gold: 223, xp: 202, isRanged: true },
    { name: 'Spectre', icon: '👻', health: 150, strength: 32, defense: 12, gold: 243, xp: 221 },
    { name: 'Esprit de la Forêt Corrompu', icon: '🌳', health: 165, strength: 29, defense: 15, gold: 212, xp: 193 },
    { name: 'Chevalier Noir', icon: '⚔️', health: 200, strength: 35, defense: 20, gold: 283, xp: 258 },
    { name: 'Archer Maudit', icon: '🏹👻', health: 185, strength: 34, defense: 18, gold: 271, xp: 248, isRanged: true },
    
    // Elite enemies (levels 16-20)
    { name: 'Démon Mineur', icon: '😈', health: 220, strength: 38, defense: 22, gold: 324, xp: 294 },
    { name: 'Dragon de Glace', icon: '🐲', health: 250, strength: 40, defense: 24, gold: 364, xp: 331, isRanged: true },
    { name: 'Liche Ancestrale', icon: '☠️', health: 240, strength: 42, defense: 23, gold: 405, xp: 368, isRanged: true },
    { name: 'Gardien Ancien de la Forêt', icon: '🛡️🌲', health: 270, strength: 44, defense: 27, gold: 430, xp: 391 },
    { name: 'Titan de Fer', icon: '🤖', health: 280, strength: 45, defense: 26, gold: 455, xp: 414 },
    { name: 'Tireur d\'Élite Démoniaque', icon: '🎯😈', health: 265, strength: 46, defense: 24, gold: 478, xp: 442, isRanged: true },
    { name: 'Archidémon', icon: '👿', health: 300, strength: 48, defense: 28, gold: 506, xp: 460 }
];

// Boss templates - appear every 5 levels
export const bosses = [
    { 
        name: 'Troll des Cavernes', 
        icon: '👹', 
        health: 200, 
        strength: 25, 
        defense: 15, 
        gold: 202, 
        xp: 230,
        description: 'Un troll massif avec une peau de pierre',
        ability: 'regeneration',
        abilityDescription: 'Se régénère de 4-7 HP chaque tour'
    },
    { 
        name: 'Seigneur Liche', 
        icon: '💀', 
        health: 250, 
        strength: 28, 
        defense: 18, 
        gold: 304, 
        xp: 322,
        description: 'Un sorcier mort-vivant aux pouvoirs nécromantiques',
        ability: 'life_drain',
        abilityDescription: 'Vole 15 HP et les ajoute à sa santé'
    },
    { 
        name: 'Hydre à Trois Têtes', 
        icon: '🐉', 
        health: 300, 
        strength: 33, 
        defense: 20, 
        gold: 405, 
        xp: 414,
        description: 'Une hydre féroce crachant du venin',
        ability: 'triple_attack',
        abilityDescription: 'Attaque trois fois de suite'
    },
    { 
        name: 'Démon des Flammes', 
        icon: '😈', 
        health: 350, 
        strength: 37, 
        defense: 22, 
        gold: 506, 
        xp: 506,
        description: 'Un démon entouré de flammes infernales',
        ability: 'fire_burst',
        abilityDescription: 'Inflige des dégâts de feu ignorant 50% de la défense'
    },
    { 
        name: 'Dragon Ancien', 
        icon: '🐲', 
        health: 400, 
        strength: 41, 
        defense: 25, 
        gold: 759, 
        xp: 644,
        description: 'Un dragon légendaire gardien des trésors',
        ability: 'breath_weapon',
        abilityDescription: 'Souffle de dragon infligeant des dégâts massifs'
    }
];
