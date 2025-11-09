// Character Sexes Module
// Provides base stats for male and female characters

export const characterSexes = {
    male: {
        name: 'Masculin',
        icon: '♂️',
        strength: 17,      // FOR
        dexterity: 14,     // DEX
        constitution: 13,  // CON
        intelligence: 18,  // INT
        wisdom: 11,        // SAG
        charisma: 10       // CHA
    },
    female: {
        name: 'Féminin',
        icon: '♀️',
        strength: 15,      // FOR
        dexterity: 14,     // DEX
        constitution: 13,  // CON
        intelligence: 18,  // INT
        wisdom: 13,        // SAG
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
