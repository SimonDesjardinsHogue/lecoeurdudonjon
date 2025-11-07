// Main Entry Point Module
import { init, startGame, rest, showShop, showStats, showSaveOptions, showMain, resetGame, buyItem, restoreSaveFromStart, meetNPC, showLeaderboard } from './game-logic.js';
import { explore, attack, defend, flee } from './combat.js';
import { exportSave, importSave } from './save-load.js';
import { audioManager } from './audio.js';

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

// Initialize game on load
window.addEventListener('load', () => {
    init();
    
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
