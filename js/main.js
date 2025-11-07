// Main Entry Point Module
import { init, startGame, rest, showShop, showStats, showSaveOptions, showMain, resetGame, buyItem, restoreSaveFromStart, meetNPC, showLeaderboard } from './game-logic.js';
import { explore, attack, defend, flee } from './combat.js';
import { exportSave, importSave } from './save-load.js';
import { audioManager } from './audio.js';
import { particleSystem } from './particles.js';

// Initialize game on load
window.addEventListener('load', () => {
    init();
    // Initialize particle system
    particleSystem.init();
});

// Initialize audio on first user interaction
let audioInitialized = false;
function initAudio() {
    if (!audioInitialized) {
        audioManager.init();
        audioInitialized = true;
    }
}

// Toggle audio function
window.toggleAudio = function() {
    initAudio();
    const isMuted = audioManager.toggleMute();
    const btn = document.getElementById('audioToggle');
    if (btn) {
        btn.textContent = isMuted ? '🔇' : '🔊';
        btn.classList.toggle('muted', isMuted);
    }
};

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
window.showStats = showStats;
window.showSaveOptions = showSaveOptions;
window.exportSave = exportSave;
window.importSave = importSave;
window.showMain = showMain;
window.resetGame = resetGame;
window.restoreSaveFromStart = restoreSaveFromStart;
window.meetNPC = meetNPC;
window.showLeaderboard = showLeaderboard;
