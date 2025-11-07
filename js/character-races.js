// Character Races Module

export const characterRaces = {
    humain: {
        name: 'Humain',
        icon: '👤',
        description: 'Polyvalent et équilibré',
        dexterityMod: 0,
        constitutionMod: 0
    },
    elfe: {
        name: 'Elfe',
        icon: '🧝',
        description: 'Agile et gracieux',
        dexterityMod: 2,
        constitutionMod: -2
    },
    nain: {
        name: 'Nain',
        icon: '🧔',
        description: 'Robuste et résistant',
        dexterityMod: -2,
        constitutionMod: 2
    }
};

// Apply race modifiers to player
export function applyRaceModifiers(player, raceKey) {
    const race = characterRaces[raceKey];
    if (!race) {
        console.error(`Unknown character race: ${raceKey}`);
        return;
    }
    
    player.race = raceKey;
    player.raceName = race.name;
    player.raceIcon = race.icon;
    
    // Apply stat modifiers
    player.dexterity += race.dexterityMod;
    player.constitution += race.constitutionMod;
    
    // Constitution affects max health (each point of constitution = 5 HP)
    const constitutionHealthBonus = race.constitutionMod * 5;
    player.maxHealth += constitutionHealthBonus;
    player.health = player.maxHealth;
}
