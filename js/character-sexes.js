// Character Sexes Module
// Provides stat modifiers for male and female characters

export const characterSexes = {
    male: {
        name: 'Masculin',
        icon: '♂️',
        puissanceMod: 1,   // +1 to power (stronger)
        adresseMod: 0,     // No modifier to skill
        espritMod: 0,      // No modifier to spirit
        presenceMod: -1    // -1 to presence (less charismatic)
    },
    female: {
        name: 'Féminin',
        icon: '♀️',
        puissanceMod: -1,  // -1 to power (less strong)
        adresseMod: 0,     // No modifier to skill
        espritMod: 0,      // No modifier to spirit
        presenceMod: 1     // +1 to presence (more charismatic)
    }
};

// Apply sex-based stat modifiers to player
// This should be called AFTER applying class base stats
export function applySexModifiers(player, sexKey) {
    const sex = characterSexes[sexKey];
    if (!sex) {
        console.error(`Unknown character sex: ${sexKey}`);
        return;
    }
    
    // Apply stat modifiers from sex
    player.puissance += sex.puissanceMod;
    player.adresse += sex.adresseMod;
    player.esprit += sex.espritMod;
    player.presence += sex.presenceMod;
}
