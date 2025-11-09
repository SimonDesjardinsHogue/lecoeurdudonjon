// Character Classes Module

export const characterClasses = {
    guerrier: {
        name: 'Guerrier',
        icon: '⚔️',
        description: 'Un combattant robuste avec beaucoup de points de vie et une bonne classe d\'armure',
        maxHealth: 130,
        strength: 13,
        defense: 9,
        dexterity: 10,
        constitution: 14,
        intelligence: 8,
        wisdom: 10,
        charisma: 10,
        maxEnergy: 100
    },
    magicien: {
        name: 'Magicien',
        icon: '🧙',
        description: 'Un lanceur de sorts puissant mais fragile',
        maxHealth: 105,
        strength: 19,
        defense: 6,
        dexterity: 10,
        constitution: 8,
        intelligence: 16,
        wisdom: 14,
        charisma: 12,
        maxEnergy: 100
    },
    archer: {
        name: 'Archer',
        icon: '🏹',
        description: 'Un combattant équilibré avec une bonne force',
        maxHealth: 112,
        strength: 15,
        defense: 8,
        dexterity: 16,
        constitution: 12,
        intelligence: 10,
        wisdom: 12,
        charisma: 10,
        maxEnergy: 100
    }
};

// Apply character class to player
export function applyCharacterClass(player, classKey) {
    const charClass = characterClasses[classKey];
    if (!charClass) {
        console.error(`Unknown character class: ${classKey}`);
        return;
    }
    
    player.class = classKey;
    player.className = charClass.name;
    player.classIcon = charClass.icon;
    player.maxHealth = charClass.maxHealth;
    player.health = charClass.maxHealth;
    player.strength = charClass.strength;
    player.defense = charClass.defense;
    player.dexterity = charClass.dexterity;
    player.constitution = charClass.constitution;
    player.intelligence = charClass.intelligence;
    player.wisdom = charClass.wisdom;
    player.charisma = charClass.charisma;
    player.maxEnergy = charClass.maxEnergy;
    player.energy = charClass.maxEnergy;
}
