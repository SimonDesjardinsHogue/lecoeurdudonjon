// NPC System Module
// Handles all NPC interactions: regular NPCs, wandering merchant (already in shop.js), and jeweler

import { gameState, npcs, metals, getStatModifier } from '../game-state.js';
import { updateUI, showScreen } from '../ui.js';
import { saveGame } from '../save-load.js';
import { audioManager } from '../audio.js';
import { meetWanderingMerchant } from './shop.js';
import { rollSelect } from '../dice.js';

// Meet a random NPC
// location parameter can be 'forest', 'village', or undefined (for backward compatibility)
export function meetNPC(location = null) {
    // Check if player has enough energy to meet an NPC
    if (gameState.player.energy < 2) {
        alert('Vous êtes trop fatigué pour rencontrer un PNJ ! Allez dormir à l\'auberge pour récupérer votre énergie.');
        return;
    }
    
    // Consume energy for meeting an NPC
    gameState.player.energy = Math.max(0, gameState.player.energy - 2);
    
    // Update UI immediately to show energy consumption
    updateUI();
    
    // Filter NPCs by location if specified
    let availableNPCs = npcs;
    if (location) {
        availableNPCs = npcs.filter(npc => npc.location === location || npc.location === 'both');
    }
    
    // If no NPCs available for this location, use all NPCs as fallback
    if (availableNPCs.length === 0) {
        availableNPCs = npcs;
    }
    
    const npc = rollSelect(availableNPCs);
    
    // Anti-cheat: Check NPC cooldown to prevent farming
    if (!gameState.player.npcCooldowns) {
        gameState.player.npcCooldowns = {};
    }
    
    const now = Date.now();
    const cooldownKey = npc.name.replace(/\s+/g, '_');
    const cooldownTime = 1800000; // 30 minutes (reduced from 1 hour for better UX)
    
    if (gameState.player.npcCooldowns[cooldownKey]) {
        const timeSince = now - gameState.player.npcCooldowns[cooldownKey];
        
        if (timeSince < cooldownTime) {
            const minutesLeft = Math.ceil((cooldownTime - timeSince) / 60000);
            // Skip this NPC and try to find another one
            // Filter out NPCs on cooldown
            const availableNPCsNoCooldown = availableNPCs.filter(n => {
                const key = n.name.replace(/\s+/g, '_');
                const lastMet = gameState.player.npcCooldowns[key];
                if (!lastMet) return true;
                const elapsed = now - lastMet;
                return elapsed >= cooldownTime;
            });
            
            // If all NPCs are on cooldown, show message
            if (availableNPCsNoCooldown.length === 0) {
                alert(`⏳ Vous avez déjà rencontré tous les PNJ disponibles récemment. Revenez dans ${minutesLeft} minutes.`);
                // Refund energy
                gameState.player.energy = Math.min(gameState.player.maxEnergy, gameState.player.energy + 2);
                updateUI();
                return;
            }
            
            // Select a random NPC from those not on cooldown using dice
            const selectedNPC = rollSelect(availableNPCsNoCooldown);
            // Update npc variable for the rest of the function
            Object.assign(npc, selectedNPC);
        }
    }
    
    // Check if it's the wandering merchant
    if (npc.special === 'wandering_merchant') {
        meetWanderingMerchant();
        // Record cooldown
        gameState.player.npcCooldowns[cooldownKey] = now;
        saveGame();
        return;
    }
    
    // Check if it's the jeweler
    if (npc.special === 'jeweler') {
        meetJeweler();
        // Record cooldown
        gameState.player.npcCooldowns[cooldownKey] = now;
        saveGame();
        return;
    }
    
    // Switch to mystery music for NPC encounter
    audioManager.startMusic('mystery');
    
    showScreen('npcScreen');
    
    // Show event info container and hide regular NPC content
    const eventInfo = document.getElementById('eventInfo');
    const npcContent = document.getElementById('npcContent');
    eventInfo.style.display = 'flex';
    npcContent.style.display = 'none';
    
    // Set the event icon
    const eventIcon = document.getElementById('eventIcon');
    eventIcon.textContent = npc.icon;
    
    // Set the event name
    const eventName = document.getElementById('eventName');
    eventName.textContent = npc.name;
    
    // Set the event description
    const eventDescription = document.getElementById('eventDescription');
    eventDescription.innerHTML = '';
    
    const dialogue = document.createElement('p');
    dialogue.textContent = `"${npc.dialogue}"`;
    dialogue.style.fontStyle = 'italic';
    dialogue.style.marginBottom = '15px';
    eventDescription.appendChild(dialogue);
    
    // Apply reward if any
    if (npc.reward) {
        const p = gameState.player;
        let rewardText = '';
        
        // Charisma increases NPC rewards: +10% per charisma modifier point
        const presenceMod = getStatModifier(p.presence);
        const rewardBonus = 1 + (presenceMod * 0.10);
        
        if (npc.reward.type === 'heal') {
            const baseHealAmount = npc.reward.amount;
            const bonusHealAmount = Math.floor(baseHealAmount * rewardBonus);
            const healAmount = Math.min(bonusHealAmount, p.maxHealth - p.health);
            p.health = Math.min(p.maxHealth, p.health + bonusHealAmount);
            rewardText = `Vous avez été soigné de ${healAmount} HP !`;
            if (presenceMod > 0) {
                rewardText += ` (+${Math.floor((rewardBonus - 1) * 100)}% grâce à votre charisme)`;
            }
        } else if (npc.reward.type === 'gold') {
            const bonusGoldAmount = Math.floor(npc.reward.amount * rewardBonus);
            p.gold += bonusGoldAmount;
            rewardText = `Vous avez reçu ${bonusGoldAmount} pièces d'or !`;
            if (presenceMod > 0) {
                rewardText += ` (+${Math.floor((rewardBonus - 1) * 100)}% grâce à votre charisme)`;
            }
        }
        
        const rewardPara = document.createElement('p');
        rewardPara.textContent = `✨ ${rewardText}`;
        rewardPara.style.color = '#51cf66';
        rewardPara.style.fontWeight = 'bold';
        eventDescription.appendChild(rewardPara);
    }
    
    // Record NPC cooldown
    gameState.player.npcCooldowns[cooldownKey] = now;
    
    // Save and update UI to reflect energy consumption and cooldown
    saveGame();
    updateUI();
}

// Calculate jeweler's daily profit margin (30-50%)
function getJewelerProfitMargin() {
    // Use current date to determine daily profit
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Use day of year as seed for consistent daily rate
    const seed = dayOfYear % 21; // 21 possible values for 30-50%
    return 0.30 + (seed * 0.01); // 30% to 50%
}

// Meet the Jeweler NPC
export function meetJeweler() {
    // Switch to merchant music for jeweler
    audioManager.startMusic('merchant');
    
    showScreen('shopScreen');
    const shopDiv = document.getElementById('shopItems');
    shopDiv.innerHTML = '';
    
    const profitMargin = getJewelerProfitMargin();
    const profitPercent = Math.round(profitMargin * 100);
    
    // Add jeweler description
    const jewelerDesc = document.createElement('div');
    jewelerDesc.className = 'story-text';
    jewelerDesc.innerHTML = `
        <p>💎 <strong>Bijoutier</strong></p>
        <p>"Bienvenue dans ma bijouterie ! J'achète et vends des métaux précieux. Aujourd'hui, ma marge est de ${profitPercent}% sur toutes les transactions."</p>
        <p style="font-size: 0.9em; color: #999;">Vous pouvez échanger vos pièces d'or contre des métaux précieux, ou vendre vos métaux pour de l'or.</p>
    `;
    shopDiv.appendChild(jewelerDesc);
    
    // Show player's current metals
    const inventoryDiv = document.createElement('div');
    inventoryDiv.className = 'shop-item';
    inventoryDiv.style.display = 'block';
    inventoryDiv.style.marginBottom = '20px';
    inventoryDiv.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💰 Votre Inventaire</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div>Or: ${gameState.player.gold} 💰</div>
            <div>${metals.or.icon} Or: ${gameState.player.metals.or.toFixed(2)} oz</div>
            <div>${metals.platine.icon} Platine: ${gameState.player.metals.platine.toFixed(2)} oz</div>
            <div>${metals.argent.icon} Argent: ${gameState.player.metals.argent.toFixed(2)} oz</div>
            <div>${metals.cuivre.icon} Cuivre: ${gameState.player.metals.cuivre.toFixed(2)} oz</div>
        </div>
    `;
    shopDiv.appendChild(inventoryDiv);
    
    // Metal prices table
    const pricesDiv = document.createElement('div');
    pricesDiv.className = 'shop-item';
    pricesDiv.style.display = 'block';
    pricesDiv.style.marginBottom = '20px';
    pricesDiv.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">📊 Prix des Métaux (CAD/oz)</h4>
        <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #8B4513;">
                <th style="padding: 8px;">Métal</th>
                <th style="padding: 8px;">Valeur Relative</th>
                <th style="padding: 8px;">Prix d'Achat</th>
                <th style="padding: 8px;">Prix de Vente</th>
            </tr>
            ${Object.entries(metals).map(([key, metal]) => {
                const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
                const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
                return `
                    <tr>
                        <td style="padding: 8px;">${metal.icon} ${metal.name}</td>
                        <td style="padding: 8px;">${metal.relativeValue}</td>
                        <td style="padding: 8px; color: #ff6b6b;">${buyPrice} 💰</td>
                        <td style="padding: 8px; color: #51cf66;">${sellPrice} 💰</td>
                    </tr>
                `;
            }).join('')}
        </table>
    `;
    shopDiv.appendChild(pricesDiv);
    
    // Buy metals section
    const buySection = document.createElement('div');
    buySection.className = 'shop-item';
    buySection.style.display = 'block';
    buySection.style.marginBottom = '20px';
    buySection.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💰 Acheter des Métaux (avec vos pièces d'or)</h4>
    `;
    
    Object.entries(metals).forEach(([key, metal]) => {
        const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
        const buyDiv = document.createElement('div');
        buyDiv.style.display = 'flex';
        buyDiv.style.justifyContent = 'space-between';
        buyDiv.style.alignItems = 'center';
        buyDiv.style.marginBottom = '10px';
        buyDiv.style.padding = '10px';
        buyDiv.style.background = 'rgba(0, 0, 0, 0.3)';
        buyDiv.style.borderRadius = '5px';
        
        buyDiv.innerHTML = `
            <div>
                <strong>${metal.icon} ${metal.name}</strong><br>
                <small>${metal.description}</small>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="buy_${key}" min="0.01" step="0.01" value="1" 
                       style="width: 80px; padding: 5px; background: rgba(0,0,0,0.5); color: #f0f0f0; border: 1px solid #8B4513; border-radius: 3px;">
                <span>oz</span>
                <button onclick="window.buyMetal('${key}', document.getElementById('buy_${key}').value)">
                    Acheter (${buyPrice} 💰/oz)
                </button>
            </div>
        `;
        buySection.appendChild(buyDiv);
    });
    shopDiv.appendChild(buySection);
    
    // Sell metals section
    const sellSection = document.createElement('div');
    sellSection.className = 'shop-item';
    sellSection.style.display = 'block';
    sellSection.style.marginBottom = '20px';
    sellSection.innerHTML = `
        <h4 style="color: #DAA520; margin-bottom: 10px;">💎 Vendre des Métaux (pour des pièces d'or)</h4>
    `;
    
    Object.entries(metals).forEach(([key, metal]) => {
        const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
        const sellDiv = document.createElement('div');
        sellDiv.style.display = 'flex';
        sellDiv.style.justifyContent = 'space-between';
        sellDiv.style.alignItems = 'center';
        sellDiv.style.marginBottom = '10px';
        sellDiv.style.padding = '10px';
        sellDiv.style.background = 'rgba(0, 0, 0, 0.3)';
        sellDiv.style.borderRadius = '5px';
        
        sellDiv.innerHTML = `
            <div>
                <strong>${metal.icon} ${metal.name}</strong><br>
                <small>Vous avez: ${gameState.player.metals[key].toFixed(2)} oz</small>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="sell_${key}" min="0.01" step="0.01" value="1" max="${gameState.player.metals[key]}"
                       style="width: 80px; padding: 5px; background: rgba(0,0,0,0.5); color: #f0f0f0; border: 1px solid #8B4513; border-radius: 3px;">
                <span>oz</span>
                <button onclick="window.sellMetal('${key}', document.getElementById('sell_${key}').value)" 
                        ${gameState.player.metals[key] <= 0 ? 'disabled' : ''}>
                    Vendre (${sellPrice} 💰/oz)
                </button>
            </div>
        `;
        sellSection.appendChild(sellDiv);
    });
    shopDiv.appendChild(sellSection);
}

// Buy metal from jeweler
export function buyMetal(metalType, amount) {
    const metal = metals[metalType];
    const profitMargin = getJewelerProfitMargin();
    const buyPrice = Math.round(metal.cadPerOz * (1 + profitMargin));
    const ozAmount = parseFloat(amount);
    
    if (isNaN(ozAmount) || ozAmount <= 0) {
        alert('Quantité invalide !');
        return;
    }
    
    const totalCost = Math.round(buyPrice * ozAmount);
    const p = gameState.player;
    
    if (p.gold >= totalCost) {
        p.gold -= totalCost;
        p.metals[metalType] += ozAmount;
        
        audioManager.playSound('purchase');
        saveGame();
        updateUI();
        
        alert(`Vous avez acheté ${ozAmount.toFixed(2)} oz de ${metal.name} pour ${totalCost} pièces d'or !`);
        meetJeweler(); // Refresh jeweler shop
    } else {
        alert(`Vous n'avez pas assez d'or ! (Coût: ${totalCost} or, Vous avez: ${p.gold} or)`);
    }
}

// Sell metal to jeweler
export function sellMetal(metalType, amount) {
    const metal = metals[metalType];
    const profitMargin = getJewelerProfitMargin();
    const sellPrice = Math.round(metal.cadPerOz * (1 - profitMargin));
    const ozAmount = parseFloat(amount);
    
    if (isNaN(ozAmount) || ozAmount <= 0) {
        alert('Quantité invalide !');
        return;
    }
    
    const p = gameState.player;
    
    if (p.metals[metalType] >= ozAmount) {
        p.metals[metalType] -= ozAmount;
        const goldEarned = Math.round(sellPrice * ozAmount);
        p.gold += goldEarned;
        
        audioManager.playSound('purchase');
        saveGame();
        updateUI();
        
        alert(`Vous avez vendu ${ozAmount.toFixed(2)} oz de ${metal.name} pour ${goldEarned} pièces d'or !`);
        meetJeweler(); // Refresh jeweler shop
    } else {
        alert(`Vous n'avez pas assez de ${metal.name} ! (Requis: ${ozAmount.toFixed(2)} oz, Vous avez: ${p.metals[metalType].toFixed(2)} oz)`);
    }
}
