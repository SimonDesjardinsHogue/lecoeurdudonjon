// Enemy Data Module
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

// Boss templates - appear every 5 levels
export const bosses = [
    { 
        name: 'Troll des Cavernes', 
        icon: '👹', 
        health: 200, 
        strength: 30, 
        defense: 15, 
        gold: 200, 
        xp: 250,
        description: 'Un troll massif avec une peau de pierre',
        ability: 'regeneration',
        abilityDescription: 'Se régénère de 10 HP chaque tour'
    },
    { 
        name: 'Seigneur Liche', 
        icon: '💀', 
        health: 250, 
        strength: 35, 
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
        strength: 40, 
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
        strength: 45, 
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
        strength: 50, 
        defense: 25, 
        gold: 750, 
        xp: 700,
        description: 'Un dragon légendaire gardien des trésors',
        ability: 'breath_weapon',
        abilityDescription: 'Souffle de dragon infligeant des dégâts massifs'
    }
];
