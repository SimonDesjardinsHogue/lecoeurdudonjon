// Character Classes Module

export const characterClasses = {
    guerrier: {
        name: 'Guerrier',
        icon: '⚔️',
        description: 'Un combattant robuste avec beaucoup de points de vie et une bonne classe d\'armure',
        maxHealth: 148,
        puissance: 15,    // Dominant - strength and endurance
        defense: 9,
        adresse: 14,      // Secondary - dexterity
        esprit: 12,       // Lower - intelligence and wisdom
        presence: 13,     // Lower - leadership and charisma
        maxEnergy: 100
    },
    archer: {
        name: 'Archer',
        icon: '🏹',
        description: 'Un combattant équilibré avec une bonne dextérité',
        maxHealth: 128,
        puissance: 12,    // Lower - strength for bows
        defense: 8,
        adresse: 15,      // Dominant - dexterity and agility
        esprit: 14,       // Secondary - wisdom and perception
        presence: 13,     // Lower - less social
        maxEnergy: 100
    },
    magicien: {
        name: 'Magicien',
        icon: '🧙',
        description: 'Un lanceur de sorts puissant mais fragile',
        maxHealth: 122,
        puissance: 12,    // Lower - physical strength
        defense: 6,
        adresse: 13,      // Lower - dexterity
        esprit: 15,       // Dominant - intelligence and wisdom
        presence: 14,     // Secondary - charisma for spells
        maxEnergy: 100
    },
    enchanteur: {
        name: 'Enchanteur',
        icon: '🌀',
        description: 'Un manipulateur des esprits et des perceptions, maître du contrôle mental et des illusions',
        maxHealth: 125,
        puissance: 14,    // Secondary - physical presence
        defense: 7,
        adresse: 12,      // Lower - dexterity
        esprit: 13,       // Lower - intelligence and wisdom
        presence: 15,     // Dominant - charisma for manipulation
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
    
    console.log(`Applying ${classKey} class: puissance=${charClass.puissance}, presence=${charClass.presence}`);
    
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
    
    console.log(`Player stats after class: puissance=${player.puissance}, presence=${player.presence}`);
}
