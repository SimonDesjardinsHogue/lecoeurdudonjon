// Initiative Module
// Responsibility: Handle combat initiative rolls and turn order

import { gameState, getStatModifier } from '../game-state.js';
import { addCombatLog } from '../ui.js';

// Roll initiative for combat
// Returns the initiative roll (d10 + dexterity modifier)
export function rollInitiative(character) {
    const d10Roll = Math.floor(Math.random() * 10) + 1; // Roll 1d10
    // Use character's dexterity if available, otherwise estimate based on enemy type
    let dexterity = character.dexterity;
    if (dexterity === undefined && character.name) {
        // Enemies don't have explicit dexterity, estimate based on type
        // Ranged enemies get bonus dexterity, heavy enemies get penalty
        if (character.isRanged) {
            dexterity = 14; // Ranged enemies are more agile
        } else if (character.name.includes('Golem') || character.name.includes('Titan')) {
            dexterity = 8; // Heavy enemies are slower
        } else {
            dexterity = 10; // Default dexterity for enemies
        }
    } else if (dexterity === undefined) {
        dexterity = 10; // Fallback default
    }
    const dexMod = getStatModifier(dexterity);
    return d10Roll + dexMod;
}

// Determine who goes first in combat and display initiative results
export function determineInitiative() {
    const player = gameState.player;
    const enemy = gameState.currentEnemy;
    
    // Roll initiative for both combatants
    const playerInitiative = rollInitiative(player);
    const enemyInitiative = rollInitiative(enemy);
    
    // Store initiative results
    gameState.playerInitiative = playerInitiative;
    gameState.enemyInitiative = enemyInitiative;
    
    // Display initiative rolls
    const playerDexMod = getStatModifier(player.dexterity);
    
    // Calculate enemy dexterity for display
    let enemyDex = enemy.dexterity;
    if (enemyDex === undefined) {
        if (enemy.isRanged) {
            enemyDex = 14;
        } else if (enemy.name.includes('Golem') || enemy.name.includes('Titan')) {
            enemyDex = 8;
        } else {
            enemyDex = 10;
        }
    }
    const enemyDexMod = getStatModifier(enemyDex);
    
    addCombatLog(`⚡ Jets d'initiative !`, 'info');
    addCombatLog(`Vous : ${playerInitiative} (Bonus DEX: ${playerDexMod >= 0 ? '+' : ''}${playerDexMod})`, 'player-damage');
    addCombatLog(`${enemy.name} : ${enemyInitiative} (Bonus DEX: ${enemyDexMod >= 0 ? '+' : ''}${enemyDexMod})`, 'damage');
    
    // Determine who goes first
    if (playerInitiative > enemyInitiative) {
        gameState.playerHasInitiative = true;
        addCombatLog(`✨ Vous agissez en premier !`, 'special');
        return true; // Player goes first
    } else if (enemyInitiative > playerInitiative) {
        gameState.playerHasInitiative = false;
        addCombatLog(`⚠️ ${enemy.name} agit en premier !`, 'damage');
        return false; // Enemy goes first
    } else {
        // Tie - player wins
        gameState.playerHasInitiative = true;
        addCombatLog(`⚖️ Égalité ! Vous agissez en premier par défaut.`, 'special');
        return true; // Player goes first on tie
    }
}
