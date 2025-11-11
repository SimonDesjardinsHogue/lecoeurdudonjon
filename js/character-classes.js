// Character Classes Module

export const characterClasses = {
    guerrier: {
        name: 'Guerrier',
        icon: '⚔️',
        description: 'Un combattant robuste avec beaucoup de points de vie et une bonne classe d\'armure',
        maxHealth: 148,
        puissance: 15,    // Highest - strength and endurance
        defense: 9,
        adresse: 13,      // Decent - dexterity
        esprit: 12,       // Lowest - intelligence and wisdom
        presence: 14,     // Good - leadership and charisma
        maxEnergy: 100
    },
    magicien: {
        name: 'Magicien',
        icon: '🧙',
        description: 'Un lanceur de sorts puissant mais fragile',
        maxHealth: 122,
        puissance: 12,    // Lowest - physical strength
        defense: 6,
        adresse: 13,      // Decent - dexterity
        esprit: 15,       // Highest - intelligence and wisdom
        presence: 14,     // Good - charisma for spells
        maxEnergy: 100
    },
    archer: {
        name: 'Archer',
        icon: '🏹',
        description: 'Un combattant équilibré avec une bonne dextérité',
        maxHealth: 128,
        puissance: 13,    // Decent - strength for bows
        defense: 8,
        adresse: 15,      // Highest - dexterity and agility
        esprit: 14,       // Good - wisdom and perception
        presence: 12,     // Lowest - less social
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
    player.puissance = charClass.puissance;
    player.defense = charClass.defense;
    player.adresse = charClass.adresse;
    player.esprit = charClass.esprit;
    player.presence = charClass.presence;
    player.maxEnergy = charClass.maxEnergy;
    player.energy = charClass.maxEnergy;
}
