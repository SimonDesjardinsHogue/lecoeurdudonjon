// Character Classes Module

export const characterClasses = {
    guerrier: {
        name: 'Guerrier',
        icon: '⚔️',
        description: 'Un combattant robuste avec une grande santé et défense',
        maxHealth: 120,
        strength: 12,
        defense: 8,
        maxEnergy: 100
    },
    magicien: {
        name: 'Magicien',
        icon: '🧙',
        description: 'Un lanceur de sorts puissant mais fragile',
        maxHealth: 80,
        strength: 15,
        defense: 3,
        maxEnergy: 100
    },
    archer: {
        name: 'Archer',
        icon: '🏹',
        description: 'Un combattant équilibré avec une bonne force',
        maxHealth: 100,
        strength: 13,
        defense: 5,
        maxEnergy: 100
    },
    rogue: {
        name: 'Rogue',
        icon: '🗡️',
        description: 'Un assassin agile avec une force élevée mais peu de santé',
        maxHealth: 90,
        strength: 14,
        defense: 4,
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
    player.maxEnergy = charClass.maxEnergy;
    player.energy = charClass.maxEnergy;
}
