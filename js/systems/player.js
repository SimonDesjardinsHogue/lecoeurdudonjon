// Player System Module
// Handles all player-related functionality: healing, energy, experience, leveling, and stat management

import { gameState, getStatModifier } from '../game-state.js';
import { MAX_LEVEL } from '../data/game-constants.js';
import { updateUI, addCombatLog } from '../ui.js';
import { saveGame } from '../save-load.js';
import { audioManager } from '../audio.js';
import { particleSystem } from '../particles.js';
import { checkAchievements } from '../achievements.js';

// Heal player by a specific amount
export function healPlayer(amount) {
    const p = gameState.player;
    const oldHealth = p.health;
    
    // Wisdom increases healing effectiveness: +5% per wisdom modifier point
    const wisdomMod = getStatModifier(p.wisdom);
    const healingBonus = 1 + (wisdomMod * 0.05);
    const finalAmount = Math.floor(amount * healingBonus);
    
    p.health = Math.min(p.maxHealth, p.health + finalAmount);
    
    // Only play sound and particles if actually healed
    if (p.health > oldHealth) {
        audioManager.playSound('heal');
        const healthElement = document.getElementById('playerHealth');
        if (healthElement) {
            particleSystem.createHealEffect(healthElement.parentElement);
        }
    }
    
    saveGame();
    updateUI();
}

// Restore energy
export function restoreEnergy(amount) {
    const p = gameState.player;
    
    // Wisdom increases energy restoration: +5% per wisdom modifier point
    const wisdomMod = getStatModifier(p.wisdom);
    const energyBonus = 1 + (wisdomMod * 0.05);
    const finalAmount = Math.floor(amount * energyBonus);
    
    p.energy = Math.min(p.maxEnergy, p.energy + finalAmount);
    saveGame();
    updateUI();
}

// Restore mana
export function restoreMana(amount) {
    const p = gameState.player;
    
    // Intelligence increases mana restoration: +5% per intelligence modifier point
    const intelligenceMod = getStatModifier(p.intelligence);
    const manaBonus = 1 + (intelligenceMod * 0.05);
    const finalAmount = Math.floor(amount * manaBonus);
    
    p.mana = Math.min(p.maxMana, p.mana + finalAmount);
    saveGame();
    updateUI();
}

// Add experience and check for level up
export function addExperience(amount) {
    const p = gameState.player;
    p.xp += amount;
    checkLevelUp();
    saveGame();
    updateUI();
}

// Check if player should level up
export function checkLevelUp() {
    const p = gameState.player;
    
    // Check if player has reached max level
    if (p.level >= MAX_LEVEL) {
        // Player is at max level, convert excess XP to gold
        if (p.xp >= p.xpToLevel) {
            const excessXP = p.xp;
            const goldBonus = Math.floor(excessXP / 10); // 10 XP = 1 gold
            p.gold += goldBonus;
            p.xp = 0; // Reset XP
            
            addCombatLog(`⭐ Niveau maximum atteint ! +${goldBonus} or pour l'XP excédentaire.`, 'victory');
            
            saveGame();
            updateUI();
        }
        return;
    }
    
    if (p.xp >= p.xpToLevel) {
        p.level++;
        p.xp -= p.xpToLevel;
        p.xpToLevel = Math.floor(p.xpToLevel * 1.51);
        
        // Class-based HP increase
        let hpIncrease = 10; // Default for Guerrier
        if (p.class === 'archer') {
            hpIncrease = 6;
        } else if (p.class === 'magicien') {
            hpIncrease = 4;
        }
        
        // Stat increases
        p.maxHealth += hpIncrease;
        p.health = p.maxHealth;
        p.strength += 3;
        p.defense += 2;
        
        // Every 4 levels, increase armor class by +1
        if (p.level % 4 === 0) {
            p.defense += 1;
        }
        
        // Grant stat points per level: +2 every 5 levels, +1 otherwise
        const statPointsGained = (p.level % 5 === 0) ? 2 : 1;
        p.statPoints = (p.statPoints || 0) + statPointsGained;
        
        addCombatLog(`🎉 Niveau supérieur ! Vous êtes maintenant niveau ${p.level}/20 ! (+${hpIncrease} PV, +${statPointsGained} point${statPointsGained > 1 ? 's' : ''} de stats)`, 'victory');
        
        // Play level up sound and show particles
        audioManager.playSound('levelup');
        particleSystem.createLevelUpEffect();
        
        // Check achievements after level up
        checkAchievements();
        
        saveGame();
        updateUI();
    }
}

// Spend stat point on a specific stat
export function spendStatPoint(statName) {
    const p = gameState.player;
    
    if (!p.statPoints || p.statPoints <= 0) {
        alert('Vous n\'avez pas de points de stats disponibles !');
        return;
    }
    
    // Valid stat names
    const validStats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    if (!validStats.includes(statName)) {
        console.error(`Invalid stat name: ${statName}`);
        return;
    }
    
    // Confirm spending the point
    const statDisplayNames = {
        'strength': 'Force',
        'dexterity': 'Dextérité',
        'constitution': 'Constitution',
        'intelligence': 'Intelligence',
        'wisdom': 'Sagesse',
        'charisma': 'Charisme'
    };
    
    if (!confirm(`Voulez-vous ajouter 1 point à ${statDisplayNames[statName]} ?`)) {
        return;
    }
    
    // Spend the point
    p[statName]++;
    p.statPoints--;
    
    // If constitution increases, also increase max health by 2
    if (statName === 'constitution') {
        p.maxHealth += 2;
        p.health += 2; // Also heal by 2
        addCombatLog(`✨ +1 ${statDisplayNames[statName]} ! (+2 PV max)`, 'info');
    } else {
        addCombatLog(`✨ +1 ${statDisplayNames[statName]} !`, 'info');
    }
    
    saveGame();
    updateUI();
}
