// Main Entry Point Module
import { init, startGame, rest, showShop, showStats, showSaveOptions, showMain, resetGame, buyItem, restoreSaveFromStart, meetNPC, showLeaderboard } from './game-logic.js';
import { explore, attack, defend, flee } from './combat.js';
import { exportSave, importSave } from './save-load.js';

// Initialize game on load
window.addEventListener('load', init);

// Expose functions to global scope for onclick handlers
window.startGame = startGame;
window.explore = explore;
window.attack = attack;
window.defend = defend;
window.flee = flee;
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
