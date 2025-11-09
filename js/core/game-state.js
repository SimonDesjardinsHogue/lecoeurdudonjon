// Core Game State Module
// This module manages the central game state and re-exports data from data modules

// Import data from data modules
export { enemies, bosses } from '../data/enemies.js';
export { npcs } from '../data/npcs.js';
export { metals } from '../data/metals.js';
export { rarities, statNames, getStatModifier, hasRandomStats, generateRandomStats } from '../data/game-constants.js';
export { shopItems, rareItems, legendaryItems } from '../data/shop-items.js';
export { randomEvents, riddles, moralChoices } from '../data/events.js';

// Central game state - this is the only mutable state in the game
export const gameState = {
    player: {
        name: '',
        gender: 'male',
        race: 'humain',
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
        bossesDefeated: 0,
        // Metal inventory (in ounces)
        metals: {
            or: 0,        // Gold
            platine: 0,   // Platinum
            argent: 0,    // Silver
            cuivre: 0     // Copper
        },
        // Item inventory - max 4 items (potions and other items)
        inventory: [],
        // Track purchased items from wandering merchant (reset on next encounter)
        merchantPurchasedItems: []
    },
    currentEnemy: null,
    inCombat: false,
    defending: false
};
