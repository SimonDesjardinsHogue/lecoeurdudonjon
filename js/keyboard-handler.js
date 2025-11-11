// Keyboard Handler Module
import { gameState } from './game-state.js';

// Configuration: Combat action keys
const COMBAT_KEYS = ['a', 'd', 'f'];

// Configuration: Main menu navigation keys
const MENU_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8'];

// Configuration: Universal navigation keys
const UNIVERSAL_KEYS = ['escape'];

// Configuration: All game keys that should prevent default browser behavior
const GAME_KEYS = [...COMBAT_KEYS, ...MENU_KEYS, ...UNIVERSAL_KEYS];

// Configuration: Screens where ESC key should not return to main menu
const ESC_DISABLED_SCREENS = ['startScreen', 'mainScreen', 'victoryScreen'];

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
    
    // Don't capture shortcuts if user is typing in an input or textarea
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
    }
    
    // Prevent default behavior for game shortcuts
    if (GAME_KEYS.includes(key)) {
        event.preventDefault();
    }
    
    // ESC key - Return to main menu from any screen
    if (key === 'escape') {
        if (!ESC_DISABLED_SCREENS.includes(currentScreen)) {
            // Prevent ESC during combat - players must use 'F' to flee instead
            if (gameState.inCombat) {
                return;
            }
            window.showMain();
        }
        return;
    }
    
    // Combat screen shortcuts - only work when in combat AND on combat screen
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
                window.showShop();
                break;
            case '3':
                window.rest();
                break;
            case '4':
                window.showStatsAndLeaderboard();
                break;
            case '5':
                window.showProgressionMenu();
                break;
            case '6':
                window.showOptionsMenu();
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
