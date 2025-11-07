// Keyboard Handler Module
import { gameState } from './game-state.js';

// Get the current active screen
function getCurrentScreen() {
    const screens = document.querySelectorAll('.game-screen');
    for (const screen of screens) {
        if (screen.classList.contains('active')) {
            return screen.id;
        }
    }
    return null;
}

// Handle keyboard events
export function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    const currentScreen = getCurrentScreen();
    
    // Prevent default behavior for game shortcuts
    const gameKeys = ['a', 'd', 'f', 'escape', '1', '2', '3', '4', '5', '6'];
    if (gameKeys.includes(key)) {
        event.preventDefault();
    }
    
    // ESC key - Return to main menu from any screen (except start screen)
    if (key === 'escape') {
        if (currentScreen !== 'startScreen' && currentScreen !== 'mainScreen' && currentScreen !== 'victoryScreen') {
            // If in combat, don't allow escape (player must flee instead)
            if (gameState.inCombat) {
                return;
            }
            window.showMain();
        }
        return;
    }
    
    // Combat screen shortcuts
    if (currentScreen === 'combatScreen' && gameState.inCombat) {
        switch (key) {
            case 'a':
                window.attack();
                break;
            case 'd':
                window.defend();
                break;
            case 'f':
                window.flee();
                break;
        }
        return;
    }
    
    // Main menu shortcuts (1-6)
    if (currentScreen === 'mainScreen') {
        switch (key) {
            case '1':
                window.explore();
                break;
            case '2':
                window.meetNPC();
                break;
            case '3':
                window.showShop();
                break;
            case '4':
                window.rest();
                break;
            case '5':
                window.showStats();
                break;
            case '6':
                window.showLeaderboard();
                break;
        }
        return;
    }
}

// Initialize keyboard handler
export function initKeyboardHandler() {
    document.addEventListener('keydown', handleKeyPress);
}

// Cleanup keyboard handler (if needed)
export function removeKeyboardHandler() {
    document.removeEventListener('keydown', handleKeyPress);
}
