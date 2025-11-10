// Inventory System Module
// Handles all inventory-related functionality: using and selling items

import { gameState, shopItems } from '../game-state.js';
import { updateUI } from '../ui.js';
import { saveGame } from '../save-load.js';

// Use item from inventory
export function useInventoryItem(inventoryIndex) {
    const p = gameState.player;
    if (!p.inventory || inventoryIndex < 0 || inventoryIndex >= p.inventory.length) {
        return;
    }
    
    const inventoryItem = p.inventory[inventoryIndex];
    const shopItem = shopItems[inventoryItem.shopIndex];
    
    if (shopItem && shopItem.effect) {
        // Use the item
        shopItem.effect();
        
        // Remove from inventory
        p.inventory.splice(inventoryIndex, 1);
        
        saveGame();
        updateUI();
    }
}

// Sell item from inventory to merchant
export function sellInventoryItem(inventoryIndex) {
    const p = gameState.player;
    if (!p.inventory || inventoryIndex < 0 || inventoryIndex >= p.inventory.length) {
        return;
    }
    
    const inventoryItem = p.inventory[inventoryIndex];
    // Merchant buys at 50% of original value
    const sellPrice = Math.floor(inventoryItem.cost * 0.5);
    
    p.gold += sellPrice;
    p.inventory.splice(inventoryIndex, 1);
    
    alert(`Vous avez vendu ${inventoryItem.name} pour ${sellPrice} or !`);
    
    saveGame();
    updateUI();
}
