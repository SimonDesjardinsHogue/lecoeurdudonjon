// Main Entry Point Module

import { init, startGame as startGameLogic, rest as restLogic, resetGame as resetGameLogic, showStats, showStatsAndLeaderboard, showProgressionMenu, showOptionsMenu, showSaveOptions, showMain, restoreSaveFromStart, showSaveSelectionModal, showManualSaveModal, showAchievements, showBalanceTest, runBalanceTest, showAdminLogin, showAdminPanel, showServerHosting, deleteAllSaves, spendStatPoint, showLeaderboard, submitToGlobalLeaderboard, submitPlayerToGlobalLeaderboard, switchLeaderboardMode, showDailyQuestsScreen, useInventoryItem, sellInventoryItem, visitVillage as visitVillageLogic } from './game-logic.js';
import { showShop, buyItem, buyRareItem } from './systems/shop.js';
import { meetNPC, meetJeweler, buyMetal, sellMetal } from './systems/npc.js';
import { explore as exploreLogic, attack as attackLogic, defend as defendLogic, flee as fleeLogic, enemyAttack, useCombatPotion, skipDefendTurn } from './combat.js';
import { exportSave, importSave } from './save-load.js';
import { audioManager } from './audio.js';
import { initKeyboardHandler } from './keyboard-handler.js';
import { initTouchGestures, showTouchHint } from './touch-gestures.js';
import { addMobileHelpButton, showFirstTimeMobileHelp } from './mobile-help.js';
import { useSkill as useSkillFn } from './skills.js';
import { updateUI, updateEnemyUI, updateSkillsUI, updateCombatInventoryUI, updateShopInventoryUI, toggleInventoryPanel, updateInventoryPanel, toggleEquipmentModal, updateEquipmentModal, updateEventBanner, getCurrentDisplayedEvent } from './ui.js';
import { gameState } from './game-state.js';
import { initNetwork, configureServer, getNetworkState, submitScore, fetchLeaderboard, checkServerHealth, requestLeaderboardUpdate, retryDefaultServerConnection } from './network.js';
import { showMultiplayerSettings, saveServerConfig, testServerConnection, disableMultiplayer, showConnectionNotification, dismissConnectionNotification } from './multiplayer-ui.js';
import * as scheduledEventsModule from './scheduled-events.js';
import * as dailyRewardsModule from './daily-rewards.js';
import { initI18n, setLanguage, getCurrentLanguage, getLanguageFlag } from './i18n/i18n.js';
import { updateLanguageUI } from './i18n/language-ui.js';
import { initializeFirebase } from './firebase-config.js';


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

// Toggle language menu
function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    if (menu) {
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
        
        // Update active state
        if (!isVisible) {
            updateLanguageMenuActiveState();
        }
    }
}

// Update active state in language menu
function updateLanguageMenuActiveState() {
    const currentLang = getCurrentLanguage();
    const buttons = document.querySelectorAll('.language-menu button');
    buttons.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Change language
function changeLanguage(lang) {
    if (setLanguage(lang)) {
        // Update all UI text
        updateLanguageUI();
        
        // Update game UI if player exists (in-game)
        if (gameState && gameState.player) {
            updateUI();
        }
        
        // Update language toggle button with flag
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.textContent = getLanguageFlag(lang);
        }
        
        // Close the menu
        const menu = document.getElementById('languageMenu');
        if (menu) {
            menu.style.display = 'none';
        }
        
        // Update active state
        updateLanguageMenuActiveState();
    }
}

// Close language menu when clicking outside
document.addEventListener('click', (event) => {
    const menu = document.getElementById('languageMenu');
    const toggle = document.getElementById('languageToggle');
    
    if (menu && toggle && menu.style.display === 'block') {
        if (!menu.contains(event.target) && !toggle.contains(event.target)) {
            menu.style.display = 'none';
        }
    }
});


// Register Service Worker for offline support (PWA)
let deferredPrompt;

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

// PWA Install functionality
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install banner
    showInstallBanner();
});

function showInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    if (installBanner) {
        // Check if user has previously dismissed the banner
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
            installBanner.style.display = 'block';
        }
    }
}

function installPWA() {
    const installBanner = document.getElementById('installBanner');
    if (installBanner) {
        installBanner.style.display = 'none';
    }
    
    if (!deferredPrompt) {
        console.log('[PWA] Install prompt not available');
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
        } else {
            console.log('[PWA] User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
}

function dismissInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    if (installBanner) {
        installBanner.style.display = 'none';
    }
    // Remember that user dismissed the banner
    localStorage.setItem('pwa-install-dismissed', 'true');
}

// Detect if app is installed
window.addEventListener('appinstalled', () => {
    console.log('[PWA] App was installed');
    const installBanner = document.getElementById('installBanner');
    if (installBanner) {
        installBanner.style.display = 'none';
    }
    deferredPrompt = null;
});

// Make PWA functions available globally
window.installPWA = installPWA;
window.dismissInstallBanner = dismissInstallBanner;

// Initialize game on load
window.addEventListener('load', () => {
    // Initialize i18n first
    const currentLang = initI18n();
    
    // Update language toggle button with current language flag
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.textContent = getLanguageFlag(currentLang);
    }
    
    // Update all UI text with current language
    updateLanguageUI();
    
    // Update active state in language menu
    updateLanguageMenuActiveState();
    
    init();
    
    // Initialize Firebase for global leaderboard
    initializeFirebase().then(success => {
        if (success) {
            console.log('✓ Firebase global leaderboard enabled');
        } else {
            console.log('ℹ️ Global leaderboard not available (Firebase not configured)');
        }
    });
    
    // Initialize network module for LAN multiplayer
    initNetwork();
    
    // Initialize keyboard handler
    initKeyboardHandler();
    
    // Initialize touch gestures for mobile
    initTouchGestures();
    
    // Add mobile help button
    addMobileHelpButton();
    
    // Show first-time mobile help if needed
    showFirstTimeMobileHelp();
    
    // Initialize scheduled events
    scheduledEventsModule.initializeScheduledEvents();
    
    // Initialize daily rewards
    dailyRewardsModule.initializeDailyRewards();
    
    // Start runtime integrity monitoring
    startIntegrityMonitoring();
    
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
    startGameLogic();
};
window.explore = function() {
    initAudio();
    exploreLogic();
};
window.attack = function() {
    initAudio();
    attackLogic();
};
window.defend = function() {
    initAudio();
    defendLogic();
};
window.flee = function() {
    initAudio();
    fleeLogic();
};
window.rest = restLogic;
window.visitVillage = visitVillageLogic;
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
window.resetGame = resetGameLogic;
window.restoreSaveFromStart = restoreSaveFromStart;
window.meetNPC = meetNPC;
window.showLeaderboard = showLeaderboard;
window.submitToGlobalLeaderboard = submitToGlobalLeaderboard;
window.submitPlayerToGlobalLeaderboard = submitPlayerToGlobalLeaderboard;
window.switchLeaderboardMode = switchLeaderboardMode;
window.toggleAudio = toggleAudio;
window.toggleLanguageMenu = toggleLanguageMenu;
window.changeLanguage = changeLanguage;
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
