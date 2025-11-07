// Game State Management Module
export const gameState = {
    player: {
        name: '',
        class: 'guerrier',
        className: 'Guerrier',
        classIcon: '⚔️',
        level: 1,
        health: 100,
        maxHealth: 100,
        strength: 10,
        defense: 5,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        gold: 50,
        xp: 0,
        xpToLevel: 100,
        kills: 0,
        gamesPlayed: 0,
        energy: 100,
        maxEnergy: 100,
        lastSleepTime: null,
        bossesDefeated: 0
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
    { name: 'Épée en Acier', icon: '⚔️', description: '+5 Force', cost: 100, category: 'equipment', type: 'equipment', effect: null },
    { name: 'Épée Enchantée', icon: '🗡️', description: '+10 Force', cost: 250, category: 'equipment', type: 'equipment', effect: null },
    { name: 'Armure de Cuir', icon: '🛡️', description: '+3 Classe d\'armure', cost: 80, category: 'equipment', type: 'equipment', effect: null },
    { name: 'Bouclier de Fer', icon: '🛡️', description: '+5 Classe d\'armure', cost: 200, category: 'equipment', type: 'equipment', effect: null }
];

// Rare items for wandering merchant
export const rareItems = [
    { name: 'Élixir de Résurrection', icon: '🧬', description: 'Restaure toute la santé et l\'énergie', cost: 300, category: 'heal', effect: null },
    { name: 'Potion de Géant', icon: '💪', description: '+12 Force', cost: 350, category: 'damage', effect: null },
    { name: 'Armure Runique', icon: '🛡️', description: '+8 Défense, +2 toutes stats', cost: 450, category: 'equipment', effect: null },
    { name: 'Amulette de Fortune', icon: '🍀', description: '+100 Or, +5 Charisme', cost: 250, category: 'equipment', effect: null },
    { name: 'Grimoire Ancien', icon: '📖', description: '+10 Intelligence, +200 XP', cost: 400, category: 'exp', effect: null }
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
        dialogue: 'La classe d\'armure est tout aussi importante que l\'attaque. N\'oublie jamais cela !',
        reward: null
    },
    {
        name: 'Marchand Itinérant',
        icon: '🧙‍♂️',
        dialogue: 'Psst... J\'ai des objets rares à vendre. Intéressé ?',
        reward: null,
        special: 'wandering_merchant'
    }
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

// Legendary items - rewards from bosses
export const legendaryItems = [
    { name: 'Épée du Conquérant', icon: '⚔️', description: '+15 Force, +5 Dextérité', effect: (p) => { p.strength += 15; p.dexterity += 5; } },
    { name: 'Armure du Titan', icon: '🛡️', description: '+10 Défense, +30 PV Max', effect: (p) => { p.defense += 10; p.maxHealth += 30; p.health += 30; } },
    { name: 'Amulette de Vie', icon: '💎', description: '+50 PV Max, +3 Constitution', effect: (p) => { p.maxHealth += 50; p.health += 50; p.constitution += 3; } },
    { name: 'Anneau de Puissance', icon: '💍', description: '+8 Force, +8 Intelligence', effect: (p) => { p.strength += 8; p.intelligence += 8; } },
    { name: 'Cape de l\'Ombre', icon: '🦇', description: '+7 Dextérité, +5 Défense', effect: (p) => { p.dexterity += 7; p.defense += 5; } },
    { name: 'Couronne de Sagesse', icon: '👑', description: '+10 Intelligence, +10 Sagesse', effect: (p) => { p.intelligence += 10; p.wisdom += 10; } },
    { name: 'Marteau du Forgeron Divin', icon: '🔨', description: '+20 Force, +5 Constitution', effect: (p) => { p.strength += 20; p.constitution += 5; } },
    { name: 'Bâton du Mage Suprême', icon: '🪄', description: '+15 Intelligence, +50 Énergie Max', effect: (p) => { p.intelligence += 15; p.maxEnergy += 50; p.energy += 50; } }
];

// Random events
export const randomEvents = [
    {
        type: 'treasure',
        name: 'Coffre au Trésor',
        icon: '💰',
        description: 'Vous découvrez un coffre rempli de pièces d\'or !',
        effect: (p) => {
            const gold = 50 + Math.floor(Math.random() * 100);
            p.gold += gold;
            return `Vous gagnez ${gold} pièces d\'or !`;
        }
    },
    {
        type: 'treasure',
        name: 'Gemme Magique',
        icon: '💎',
        description: 'Une gemme magique brille dans l\'obscurité...',
        effect: (p) => {
            const xp = 50 + Math.floor(Math.random() * 50);
            p.xp += xp;
            return `Vous absorbez son énergie et gagnez ${xp} XP !`;
        }
    },
    {
        type: 'trap',
        name: 'Piège à Pointes',
        icon: '🗡️',
        description: 'Vous déclenchez un piège caché !',
        effect: (p) => {
            const damage = Math.max(1, 20 - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Vous perdez ${damage} HP !`;
        }
    },
    {
        type: 'trap',
        name: 'Gaz Toxique',
        icon: '☠️',
        description: 'Une brume toxique emplit la pièce !',
        effect: (p) => {
            const damage = Math.max(1, 15 - Math.floor(p.constitution / 2));
            p.health = Math.max(1, p.health - damage);
            return `Vous perdez ${damage} HP à cause du poison !`;
        }
    },
    {
        type: 'special',
        name: 'Fontaine de Guérison',
        icon: '⛲',
        description: 'Vous trouvez une fontaine aux eaux cristallines...',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.5);
            p.health = Math.min(p.maxHealth, p.health + healing);
            return `Vous buvez l\'eau et récupérez ${healing} HP !`;
        }
    },
    {
        type: 'special',
        name: 'Sanctuaire Ancien',
        icon: '⛪',
        description: 'Un sanctuaire ancien vous accorde sa bénédiction...',
        effect: (p) => {
            p.health = p.maxHealth;
            p.energy = Math.min(p.maxEnergy, p.energy + 20);
            return 'Vous êtes complètement guéri et recevez 20 énergie !';
        }
    }
];

// Riddles
export const riddles = [
    {
        question: 'Je parle sans bouche et j\'entends sans oreilles. Je n\'ai pas de corps, mais je prends vie avec le vent. Qui suis-je ?',
        answers: ['écho', 'echo', 'l\'écho', "l'écho"],
        reward: { gold: 100, xp: 75 }
    },
    {
        question: 'Plus on m\'enlève, plus je deviens grand. Que suis-je ?',
        answers: ['trou', 'un trou', 'le trou'],
        reward: { gold: 80, xp: 60 }
    },
    {
        question: 'Je suis toujours devant toi mais tu ne peux jamais me voir. Qui suis-je ?',
        answers: ['futur', 'avenir', 'le futur', 'l\'avenir', "l'avenir"],
        reward: { gold: 90, xp: 70 }
    }
];

// Moral choices
export const moralChoices = [
    {
        situation: 'Un mendiant affamé vous supplie de lui donner de la nourriture. Que faites-vous ?',
        choices: [
            {
                text: 'Donner 50 pièces d\'or',
                effect: (p) => {
                    if (p.gold >= 50) {
                        p.gold -= 50;
                        p.charisma += 2;
                        return 'Vous aidez le mendiant. Votre charisme augmente de 2 ! (-50 or)';
                    } else {
                        return 'Vous n\'avez pas assez d\'or...';
                    }
                }
            },
            {
                text: 'Ignorer et continuer',
                effect: (p) => {
                    p.charisma -= 1;
                    return 'Vous ignorez le mendiant. Votre charisme diminue de 1.';
                }
            }
        ]
    },
    {
        situation: 'Vous trouvez une bourse remplie d\'or près d\'un cadavre. Que faites-vous ?',
        choices: [
            {
                text: 'Prendre l\'or',
                effect: (p) => {
                    p.gold += 75;
                    p.wisdom -= 1;
                    return 'Vous prenez l\'or. Vous gagnez 75 pièces d\'or mais votre sagesse diminue de 1.';
                }
            },
            {
                text: 'Laisser l\'or et prier pour le défunt',
                effect: (p) => {
                    p.wisdom += 2;
                    p.xp += 50;
                    return 'Vous respectez les morts. Votre sagesse augmente de 2 et vous gagnez 50 XP.';
                }
            }
        ]
    }
];
