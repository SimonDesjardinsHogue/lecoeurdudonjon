// Main Entry Point Module

import { init, startGame, rest, resetGame, showStats, showStatsAndLeaderboard, showProgressionMenu, showOptionsMenu, showSaveOptions, showMain, restoreSaveFromStart, showSaveSelectionModal, showManualSaveModal, showAchievements, showBalanceTest, runBalanceTest, showAdminLogin, showAdminPanel, showServerHosting, deleteAllSaves, spendStatPoint, showLeaderboard, showDailyQuestsScreen, useInventoryItem, sellInventoryItem, visitVillage } from './game-logic.js';
import { showShop, buyItem, buyRareItem } from './systems/shop.js';
import { meetNPC, meetJeweler, buyMetal, sellMetal } from './systems/npc.js';
import { explore, attack, defend, flee, enemyAttack, useCombatPotion, skipDefendTurn } from './combat.js';
import { exportSave, importSave } from './save-load.js';
import { audioManager } from './audio.js';
import { initKeyboardHandler } from './keyboard-handler.js';
import { initTouchGestures, showTouchHint } from './touch-gestures.js';
import { useSkill as useSkillFn } from './skills.js';
import { updateUI, updateEnemyUI, updateSkillsUI, updateCombatInventoryUI, updateShopInventoryUI, toggleInventoryPanel, updateInventoryPanel, toggleEquipmentModal, updateEquipmentModal, updateEventBanner, getCurrentDisplayedEvent } from './ui.js';
import { initNetwork, configureServer, getNetworkState, submitScore, fetchLeaderboard, checkServerHealth, requestLeaderboardUpdate, retryDefaultServerConnection } from './network.js';
import { showMultiplayerSettings, saveServerConfig, testServerConnection, disableMultiplayer, showConnectionNotification, dismissConnectionNotification } from './multiplayer-ui.js';
import * as scheduledEventsModule from './scheduled-events.js';
import * as dailyRewardsModule from './daily-rewards.js';

// Make scheduled events module available globally for UI updates
window.scheduledEventsModule = scheduledEventsModule;

// Make daily rewards module available globally
window.dailyRewardsModule = dailyRewardsModule;

// Make connection notification functions available globally
window.showConnectionNotification = showConnectionNotification;
window.dismissConnectionNotification = dismissConnectionNotification;


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
    
    // Initialize network module for LAN multiplayer
    initNetwork();
    
    // Initialize keyboard handler
    initKeyboardHandler();
    
    // Initialize touch gestures for mobile
    initTouchGestures();
    
    // Initialize scheduled events
    scheduledEventsModule.initializeScheduledEvents();
    
    // Initialize daily rewards
    dailyRewardsModule.initializeDailyRewards();
    
    // Update event banner initially
    updateEventBanner();
    
    // Update event banner every minute
    setInterval(() => {
        scheduledEventsModule.checkActiveEvent();
        updateEventBanner();
    }, 60000); // Update every minute
    
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
window.visitVillage = visitVillage;
window.showShop = showShop;
window.buyItem = buyItem;
window.buyRareItem = buyRareItem;
window.showStats = showStats;
window.showStatsAndLeaderboard = showStatsAndLeaderboard;
window.showProgressionMenu = showProgressionMenu;
window.showOptionsMenu = showOptionsMenu;
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
window.showDailyRewards = dailyRewardsModule.showDailyRewardsScreen;
window.startChest = dailyRewardsModule.startChest;
window.openChest = dailyRewardsModule.openChest;

// Expose useSkill function
window.useSkill = function(skillId) {
    initAudio();
    const success = useSkillFn(skillId);
    if (success) {
        updateEnemyUI();
        updateUI();
        updateSkillsUI();
        
        // Enemy attacks after skill use
        setTimeout(() => {
            enemyAttack();
            updateSkillsUI();
            updateCombatInventoryUI();
        }, 1000);
    }
};
window.showAchievements = showAchievements;
window.buyMetal = buyMetal;
window.sellMetal = sellMetal;
window.meetJeweler = meetJeweler;
window.showBalanceTest = showBalanceTest;
window.runBalanceTest = runBalanceTest;
window.spendStatPoint = spendStatPoint;

// Expose inventory functions
window.sellInventoryItem = function(inventoryIndex) {
    initAudio();
    sellInventoryItem(inventoryIndex);
    updateShopInventoryUI();
};

window.useCombatPotion = function(inventoryIndex) {
    initAudio();
    useCombatPotion(inventoryIndex);
    updateCombatInventoryUI();
};

window.skipDefendTurn = function() {
    initAudio();
    skipDefendTurn();
    updateCombatInventoryUI();
};

// Expose inventory panel functions
window.toggleInventoryPanel = function() {
    initAudio();
    toggleInventoryPanel();
};

window.useInventoryItemFromPanel = function(inventoryIndex) {
    initAudio();
    useInventoryItem(inventoryIndex);
    updateInventoryPanel();
};

// Expose equipment modal functions
window.toggleEquipmentModal = function() {
    initAudio();
    toggleEquipmentModal();
};

// Expose network functions
window.configureMultiplayerServer = configureServer;
window.getNetworkState = getNetworkState;
window.submitScoreToServer = submitScore;
window.fetchNetworkLeaderboard = fetchLeaderboard;
window.checkServerHealth = checkServerHealth;
window.requestLeaderboardUpdate = requestLeaderboardUpdate;

// Expose multiplayer UI functions
window.showMultiplayerSettings = showMultiplayerSettings;
window.saveServerConfig = saveServerConfig;
window.testServerConnection = testServerConnection;
window.disableMultiplayer = disableMultiplayer;

// Expose retry connection function
window.retryServerConnection = async function() {
    await retryDefaultServerConnection();
};

// Expose dismiss banner function
window.dismissConnectionBanner = function() {
    dismissConnectionNotification();
};

// Expose admin functions
window.showAdminLogin = showAdminLogin;
window.showAdminPanel = showAdminPanel;
window.showServerHosting = showServerHosting;
window.deleteAllSaves = deleteAllSaves;

// Expose save management functions
window.showSaveSelectionModal = showSaveSelectionModal;
window.showManualSaveModal = showManualSaveModal;

// Expose event info popup function
window.showEventInfoPopup = function() {
    initAudio();
    const currentEvent = getCurrentDisplayedEvent();
    if (!currentEvent && window.scheduledEventsModule) {
        // Try to get the current event directly
        const { checkActiveEvent, getNextEvent } = window.scheduledEventsModule;
        const activeEvent = checkActiveEvent();
        const nextEvent = getNextEvent();
        const eventToShow = activeEvent || nextEvent;
        
        if (eventToShow && window.scheduledEventsModule.showEventInfo) {
            window.scheduledEventsModule.showEventInfo(eventToShow);
        }
    } else if (currentEvent && window.scheduledEventsModule && window.scheduledEventsModule.showEventInfo) {
        window.scheduledEventsModule.showEventInfo(currentEvent);
    }
};
