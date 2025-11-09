// Enemy Data Module
// Enemy templates (20 types for levels 1-20)
export const enemies = [
    // Early game enemies (levels 1-5)
    { name: 'Rat Géant', icon: '🐀', health: 30, strength: 7, defense: 2, gold: 15, xp: 25 },
    { name: 'Gobelin', icon: '👺', health: 50, strength: 9, defense: 4, gold: 25, xp: 40 },
    { name: 'Araignée Géante', icon: '🕷️', health: 55, strength: 10, defense: 5, gold: 30, xp: 45 },
    { name: 'Squelette', icon: '💀', health: 60, strength: 12, defense: 6, gold: 35, xp: 50 },
    { name: 'Orc', icon: '👹', health: 80, strength: 15, defense: 8, gold: 50, xp: 70 },
    
    // Mid game enemies (levels 6-10)
    { name: 'Bandit', icon: '🗡️', health: 75, strength: 14, defense: 7, gold: 45, xp: 65 },
    { name: 'Loup-Garou', icon: '🐺', health: 100, strength: 18, defense: 10, gold: 75, xp: 90 },
    { name: 'Zombie', icon: '🧟', health: 90, strength: 16, defense: 9, gold: 60, xp: 80 },
    { name: 'Sorcier Noir', icon: '🧙', health: 110, strength: 20, defense: 12, gold: 90, xp: 100 },
    { name: 'Dragon Mineur', icon: '🐉', health: 150, strength: 23, defense: 15, gold: 150, xp: 150 },
    
    // Advanced enemies (levels 11-15)
    { name: 'Golem de Pierre', icon: '🗿', health: 180, strength: 25, defense: 18, gold: 180, xp: 180 },
    { name: 'Vampire', icon: '🧛', health: 160, strength: 28, defense: 16, gold: 200, xp: 200 },
    { name: 'Élémentaire de Feu', icon: '🔥', health: 170, strength: 30, defense: 14, gold: 220, xp: 220 },
    { name: 'Spectre', icon: '👻', health: 150, strength: 32, defense: 12, gold: 240, xp: 240 },
    { name: 'Chevalier Noir', icon: '⚔️', health: 200, strength: 35, defense: 20, gold: 280, xp: 280 },
    
    // Elite enemies (levels 16-20)
    { name: 'Démon Mineur', icon: '😈', health: 220, strength: 38, defense: 22, gold: 320, xp: 320 },
    { name: 'Dragon de Glace', icon: '🐲', health: 250, strength: 40, defense: 24, gold: 360, xp: 360 },
    { name: 'Liche Ancestrale', icon: '☠️', health: 240, strength: 42, defense: 23, gold: 400, xp: 400 },
    { name: 'Titan de Fer', icon: '🤖', health: 280, strength: 45, defense: 26, gold: 450, xp: 450 },
    { name: 'Archidémon', icon: '👿', health: 300, strength: 48, defense: 28, gold: 500, xp: 500 }
];

// Boss templates - appear every 5 levels
export const bosses = [
    { 
        name: 'Troll des Cavernes', 
        icon: '👹', 
        health: 200, 
        strength: 25, 
        defense: 15, 
        gold: 200, 
        xp: 250,
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
        gold: 300, 
        xp: 350,
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
        gold: 400, 
        xp: 450,
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
        gold: 500, 
        xp: 550,
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
        gold: 750, 
        xp: 700,
        description: 'Un dragon légendaire gardien des trésors',
        ability: 'breath_weapon',
        abilityDescription: 'Souffle de dragon infligeant des dégâts massifs'
    }
];
