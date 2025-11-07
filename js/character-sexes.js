// Character Sexes Module
// Provides base stats for male and female characters

export const characterSexes = {
    male: {
        name: 'Masculin',
        icon: '♂️',
        strength: 10,      // FOR
        dexterity: 10,     // DEX
        constitution: 11,  // CON
        intelligence: 11,  // INT
        wisdom: 9,         // SAG
        charisma: 9        // CHA
    },
    female: {
        name: 'Féminin',
        icon: '♀️',
        strength: 9,       // FOR
        dexterity: 11,     // DEX
        constitution: 10,  // CON
        intelligence: 10,  // INT
        wisdom: 10,        // SAG
        charisma: 10       // CHA
    }
};

// Apply sex-based base stats to player
// This should be called BEFORE applying class and race modifiers
export function applySexBaseStats(player, sexKey) {
    const sex = characterSexes[sexKey];
    if (!sex) {
        console.error(`Unknown character sex: ${sexKey}`);
        return;
    }
    
    // Set base stats from sex
    player.strength = sex.strength;
    player.dexterity = sex.dexterity;
    player.constitution = sex.constitution;
    player.intelligence = sex.intelligence;
    player.wisdom = sex.wisdom;
    player.charisma = sex.charisma;
}
