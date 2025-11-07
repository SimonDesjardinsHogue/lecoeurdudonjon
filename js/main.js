// Main Entry Point Module
import { init, startGame, rest, showShop, showStats, showSaveOptions, showMain, resetGame, buyItem, restoreSaveFromStart, meetNPC, showLeaderboard, buyRareItem, showDailyQuestsScreen } from './game-logic.js';
import { explore, attack, defend, flee } from './combat.js';
import { exportSave, importSave } from './save-load.js';
import { audioManager } from './audio.js';
import { initKeyboardHandler } from './keyboard-handler.js';

// Initialize audio context after user interaction
function initAudio() {
    audioManager.init();
}

// Toggle audio on/off
function toggleAudio() {
    const isMuted = audioManager.toggleMute();
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.textContent = isMuted ? '🔇' : '🔊';
        audioToggle.classList.toggle('muted', isMuted);
    }
}

// Register Service Worker for offline support (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('[PWA] Service Worker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            console.log('[PWA] New version available');
                        }
                    });
                });
            })
            .catch(error => {
                console.log('[PWA] Service Worker registration failed:', error);
            });
    });
}

// Initialize game on load
window.addEventListener('load', () => {
    init();
    
    // Initialize keyboard handler
    initKeyboardHandler();
    
    // Update audio button state on load
    const isMuted = audioManager.isMuted;
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.textContent = isMuted ? '🔇' : '🔊';
        audioToggle.classList.toggle('muted', isMuted);
    }
    
    // Dispatch event to signal that modules loaded successfully
    window.dispatchEvent(new Event('modulesReady'));
});


// Expose functions to global scope for onclick handlers
window.startGame = function() {
    initAudio();
    startGame();
};
window.explore = function() {
    initAudio();
    explore();
};
window.attack = function() {
    initAudio();
    attack();
};
window.defend = function() {
    initAudio();
    defend();
};
window.flee = function() {
    initAudio();
    flee();
};
window.rest = rest;
window.showShop = showShop;
window.buyItem = buyItem;
window.buyRareItem = buyRareItem;
window.showStats = showStats;
window.showSaveOptions = showSaveOptions;
window.exportSave = exportSave;
window.importSave = importSave;
window.showMain = showMain;
window.resetGame = resetGame;
window.restoreSaveFromStart = restoreSaveFromStart;
window.meetNPC = meetNPC;
window.showLeaderboard = showLeaderboard;
window.toggleAudio = toggleAudio;
window.showDailyQuests = showDailyQuestsScreen;
