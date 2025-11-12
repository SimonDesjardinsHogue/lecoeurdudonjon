// Leaderboard System Module
// Handles all leaderboard-related functionality: displaying local, network (LAN), and global leaderboards

import { gameState } from '../game-state.js';
import { showScreen } from '../ui.js';
import { fetchLeaderboard, getNetworkState } from '../network.js';
import { isFirebaseReady, fetchGlobalLeaderboard, submitGlobalScore } from '../firebase-config.js';

// Calculate player score for leaderboard
function calculatePlayerScore(player) {
    return (player.level * 100) + (player.kills * 50) + (player.puissance * 10) + (player.defense * 5);
}

// Leaderboard mode: 'local', 'lan', or 'global'
let currentLeaderboardMode = 'local';

// Show leaderboard screen
export function showLeaderboard() {
    showScreen('leaderboardScreen');
    
    // Determine which leaderboard to show based on availability
    const networkState = getNetworkState();
    const firebaseReady = isFirebaseReady();
    
    // Show/hide submit to global button
    const submitBtn = document.getElementById('submitGlobalScoreBtn');
    if (submitBtn) {
        submitBtn.style.display = firebaseReady ? 'inline-block' : 'none';
    }
    
    // Default to the best available option
    if (firebaseReady && currentLeaderboardMode === 'global') {
        displayGlobalLeaderboard();
    } else if (networkState.enabled && currentLeaderboardMode === 'lan') {
        displayNetworkLeaderboard();
    } else {
        currentLeaderboardMode = 'local';
        displayLocalLeaderboard();
    }
}

// Switch leaderboard mode
export function switchLeaderboardMode(mode) {
    currentLeaderboardMode = mode;
    showLeaderboard();
}

// Submit current player score to global leaderboard
export async function submitToGlobalLeaderboard() {
    if (!isFirebaseReady()) {
        return { success: false, error: 'Global leaderboard not available' };
    }
    
    if (!gameState.player.name) {
        return { success: false, error: 'Player name required' };
    }
    
    const playerData = {
        name: gameState.player.name,
        level: gameState.player.level,
        kills: gameState.player.kills,
        gold: gameState.player.gold,
        xp: gameState.player.xp,
        className: gameState.player.className,
        race: gameState.player.race,
        gender: gameState.player.gender,
        strength: gameState.player.puissance,
        defense: gameState.player.defense
    };
    
    return await submitGlobalScore(playerData);
}

// Submit player to global leaderboard (with UI feedback)
export async function submitPlayerToGlobalLeaderboard() {
    const submitBtn = document.getElementById('submitGlobalScoreBtn');
    if (!submitBtn) return;
    
    // Disable button during submission
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Envoi en cours...';
    
    const result = await submitToGlobalLeaderboard();
    
    if (result.success) {
        submitBtn.textContent = '✅ Score envoyé !';
        submitBtn.style.backgroundColor = '#51cf66';
        
        // Refresh the leaderboard if we're on global mode
        if (currentLeaderboardMode === 'global') {
            setTimeout(() => {
                displayGlobalLeaderboard();
            }, 1000);
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        }, 3000);
    } else {
        submitBtn.textContent = '❌ Erreur';
        submitBtn.style.backgroundColor = '#ff6b6b';
        
        // Show error message
        console.error('Failed to submit score:', result.error);
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        }, 3000);
    }
}

// Display local (single device) leaderboard
async function displayLocalLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Add mode selector
    addLeaderboardModeSelector(leaderboardList, 'local');
    
    // Get all saved players from leaderboard storage
    const leaderboardData = localStorage.getItem('lecoeurdudragon_leaderboard');
    let players = [];
    
    if (leaderboardData) {
        try {
            players = JSON.parse(leaderboardData);
        } catch (e) {
            console.error('Error loading leaderboard:', e);
        }
    }
    
    // Add current player to leaderboard if they have a name
    if (gameState.player.name) {
        const currentPlayer = {
            name: gameState.player.name,
            level: gameState.player.level,
            kills: gameState.player.kills,
            strength: gameState.player.puissance,
            defense: gameState.player.defense,
            score: calculatePlayerScore(gameState.player)
        };
        
        // Check if player already exists in leaderboard
        const existingIndex = players.findIndex(p => p.name === currentPlayer.name);
        if (existingIndex >= 0) {
            // Update if current score is higher
            if (currentPlayer.score > players[existingIndex].score) {
                players[existingIndex] = currentPlayer;
            }
        } else {
            players.push(currentPlayer);
        }
        
        // Save updated leaderboard
        localStorage.setItem('lecoeurdudragon_leaderboard', JSON.stringify(players));
    }
    
    // Sort players by score (highest first)
    players.sort((a, b) => b.score - a.score);
    
    // Display leaderboard
    const leaderboardList = document.getElementById('leaderboardList');
    const contentContainer = document.createElement('div');
    contentContainer.id = 'leaderboard-content';
    
    const titleEl = document.createElement('h4');
    titleEl.style.color = '#DAA520';
    titleEl.textContent = '🏠 Classement Local (cet appareil uniquement)';
    contentContainer.appendChild(titleEl);
    
    if (players.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun héros n\'a encore été enregistré dans les annales du royaume de Valéria.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        contentContainer.appendChild(emptyMsg);
    } else {
        players.slice(0, 10).forEach((player, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'shop-item';
            playerDiv.style.display = 'flex';
            playerDiv.style.justifyContent = 'space-between';
            playerDiv.style.alignItems = 'center';
            playerDiv.style.marginBottom = '10px';
            
            // Add medal for top 3
            let medal = '';
            if (index === 0) medal = '🥇 ';
            else if (index === 1) medal = '🥈 ';
            else if (index === 2) medal = '🥉 ';
            else medal = `${index + 1}. `;
            
            const nameSection = document.createElement('div');
            nameSection.innerHTML = `
                <strong>${medal}${player.name}</strong><br>
                <small>Niveau ${player.level || 0} | ${player.kills || 0} victoires</small>
            `;
            
            // Provide default values for potentially missing fields
            const displayScore = player.score || ((player.level || 0) * 100) + ((player.kills || 0) * 50) + ((player.puissance || 10) * 10) + ((player.defense || 5) * 5);
            const displayStrength = player.puissance || 10;
            const displayDefense = player.defense || 5;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${displayScore} pts</div>
                <small>⚔️ ${displayStrength} | 🛡️ ${displayDefense}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            contentContainer.appendChild(playerDiv);
        });
    }
    
    // Add note about multiplayer
    const note = document.createElement('div');
    note.style.cssText = 'margin-top: 20px; padding: 15px; background: rgba(139, 69, 19, 0.3); border-radius: 5px; border: 1px solid #8B4513;';
    note.innerHTML = `
        <p style="margin: 0; color: #DAA520;">💡 <strong>Astuce:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 0.9em;">
            Activez le mode multijoueur LAN dans les paramètres pour partager le classement avec votre famille sur le réseau local !
        </p>
    `;
    contentContainer.appendChild(note);
    leaderboardList.appendChild(contentContainer);
}

// Display network (LAN multiplayer) leaderboard
async function displayNetworkLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Add mode selector
    addLeaderboardModeSelector(leaderboardList, 'lan');
    
    const contentContainer = document.createElement('div');
    contentContainer.id = 'leaderboard-content';
    
    const titleEl = document.createElement('h4');
    titleEl.style.color = '#DAA520';
    titleEl.textContent = '🌐 Classement Réseau Local';
    contentContainer.appendChild(titleEl);
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'multiplayerStatus';
    statusDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;';
    statusDiv.textContent = '⏳ Chargement du classement...';
    contentContainer.appendChild(statusDiv);
    
    leaderboardList.appendChild(contentContainer);
    
    // Fetch leaderboard from server
    const result = await fetchLeaderboard(10);
    
    if (!result.success) {
        statusDiv.style.cssText = 'color: #ff6b6b; padding: 15px; background: rgba(255, 0, 0, 0.1); border-radius: 5px;';
        statusDiv.innerHTML = `
            ❌ Impossible de se connecter au serveur multijoueur.<br>
            <small>${result.error || 'Vérifiez que le serveur est démarré.'}</small>
        `;
        return;
    }
    
    statusDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(81, 207, 102, 0.2); border-radius: 5px; color: #51cf66;';
    statusDiv.textContent = '🟢 Connecté au serveur multijoueur';
    
    // Make function available globally for WebSocket updates
    window.updateNetworkLeaderboard = function(scores) {
        updateLeaderboardDisplay(scores);
    };
    
    updateLeaderboardDisplay(result.scores);
}

// Display global (online) leaderboard
async function displayGlobalLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Add mode selector
    addLeaderboardModeSelector(leaderboardList, 'global');
    
    const contentContainer = document.createElement('div');
    contentContainer.id = 'leaderboard-content';
    
    const titleEl = document.createElement('h4');
    titleEl.style.color = '#DAA520';
    titleEl.textContent = '🌍 Classement Mondial';
    contentContainer.appendChild(titleEl);
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'globalStatus';
    statusDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;';
    statusDiv.textContent = '⏳ Chargement du classement mondial...';
    contentContainer.appendChild(statusDiv);
    
    leaderboardList.appendChild(contentContainer);
    
    // Fetch global leaderboard
    const result = await fetchGlobalLeaderboard(50);
    
    if (!result.success) {
        statusDiv.style.cssText = 'color: #ff6b6b; padding: 15px; background: rgba(255, 0, 0, 0.1); border-radius: 5px;';
        statusDiv.innerHTML = `
            ❌ Impossible de charger le classement mondial.<br>
            <small>${result.error || 'Vérifiez votre connexion internet.'}</small>
        `;
        return;
    }
    
    statusDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(81, 207, 102, 0.2); border-radius: 5px; color: #51cf66;';
    statusDiv.textContent = '🟢 Connecté au classement mondial';
    
    displayGlobalScores(result.scores);
}

// Display global scores
function displayGlobalScores(scores) {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Remove old scores if any
    const existingScores = leaderboardList.querySelector('.global-scores');
    if (existingScores) {
        existingScores.remove();
    }
    
    const scoresContainer = document.createElement('div');
    scoresContainer.className = 'global-scores';
    
    if (scores.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun score mondial n\'a encore été enregistré. Soyez le premier !';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        scoresContainer.appendChild(emptyMsg);
    } else {
        scores.slice(0, 50).forEach((score, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'shop-item';
            playerDiv.style.display = 'flex';
            playerDiv.style.justifyContent = 'space-between';
            playerDiv.style.alignItems = 'center';
            playerDiv.style.marginBottom = '10px';
            
            // Add medal for top 3
            let medal = '';
            if (index === 0) medal = '🥇 ';
            else if (index === 1) medal = '🥈 ';
            else if (index === 2) medal = '🥉 ';
            else medal = `${index + 1}. `;
            
            const nameSection = document.createElement('div');
            nameSection.innerHTML = `
                <strong>${medal}${score.playerName}</strong><br>
                <small>Niveau ${score.level || 0} | ${score.kills || 0} victoires</small>
            `;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${score.score || 0} pts</div>
                <small>⚔️ ${score.strength || 10} | 🛡️ ${score.defense || 5}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            scoresContainer.appendChild(playerDiv);
        });
    }
    
    leaderboardList.appendChild(scoresContainer);
}

// Add leaderboard mode selector
function addLeaderboardModeSelector(container, currentMode) {
    const networkState = getNetworkState();
    const firebaseReady = isFirebaseReady();
    
    container.innerHTML = '';
    
    const modeSelector = document.createElement('div');
    modeSelector.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;';
    
    // Local mode button
    const localBtn = document.createElement('button');
    localBtn.className = currentMode === 'local' ? 'btn-primary' : 'btn-secondary';
    localBtn.textContent = '🏠 Local';
    localBtn.onclick = () => switchLeaderboardMode('local');
    localBtn.style.flex = '1';
    localBtn.style.minWidth = '100px';
    modeSelector.appendChild(localBtn);
    
    // LAN mode button
    if (networkState.enabled) {
        const lanBtn = document.createElement('button');
        lanBtn.className = currentMode === 'lan' ? 'btn-primary' : 'btn-secondary';
        lanBtn.textContent = '🌐 LAN';
        lanBtn.onclick = () => switchLeaderboardMode('lan');
        lanBtn.style.flex = '1';
        lanBtn.style.minWidth = '100px';
        modeSelector.appendChild(lanBtn);
    }
    
    // Global mode button
    if (firebaseReady) {
        const globalBtn = document.createElement('button');
        globalBtn.className = currentMode === 'global' ? 'btn-primary' : 'btn-secondary';
        globalBtn.textContent = '🌍 Mondial';
        globalBtn.onclick = () => switchLeaderboardMode('global');
        globalBtn.style.flex = '1';
        globalBtn.style.minWidth = '100px';
        modeSelector.appendChild(globalBtn);
    }
    
    container.appendChild(modeSelector);
}

// Display network (LAN multiplayer) leaderboard
async function displayNetworkLeaderboard_OLD() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = `
        <h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>
        <div id="multiplayerStatus" style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;">
            ⏳ Chargement du classement...
        </div>
    `;
    
    // Fetch leaderboard from server
    const result = await fetchLeaderboard(10);
    
    if (!result.success) {
        leaderboardList.innerHTML = `
            <h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>
            <div style="color: #ff6b6b; padding: 15px; background: rgba(255, 0, 0, 0.1); border-radius: 5px;">
                ❌ Impossible de se connecter au serveur multijoueur.<br>
                <small>${result.error || 'Vérifiez que le serveur est démarré.'}</small>
            </div>
        `;
        return;
    }
    
    leaderboardList.innerHTML = '<h4 style="color: #DAA520;">🌐 Classement Réseau Local</h4>';
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'multiplayerStatus';
    statusDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(81, 207, 102, 0.2); border-radius: 5px; color: #51cf66;';
    statusDiv.textContent = '🟢 Connecté au serveur multijoueur';
    leaderboardList.appendChild(statusDiv);
    
    // Make function available globally for WebSocket updates
    window.updateNetworkLeaderboard = function(scores) {
        updateLeaderboardDisplay(scores);
    };
    
    updateLeaderboardDisplay(result.scores);
}

// Update leaderboard display with scores
function updateLeaderboardDisplay(scores) {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Remove old scores if any
    const existingScores = leaderboardList.querySelector('.network-scores');
    if (existingScores) {
        existingScores.remove();
    }
    
    const scoresContainer = document.createElement('div');
    scoresContainer.className = 'network-scores';
    
    if (scores.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun score n\'a encore été enregistré sur le serveur.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        scoresContainer.appendChild(emptyMsg);
    } else {
        scores.forEach((score, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'shop-item';
            playerDiv.style.display = 'flex';
            playerDiv.style.justifyContent = 'space-between';
            playerDiv.style.alignItems = 'center';
            playerDiv.style.marginBottom = '10px';
            
            // Add medal for top 3
            let medal = '';
            if (index === 0) medal = '🥇 ';
            else if (index === 1) medal = '🥈 ';
            else if (index === 2) medal = '🥉 ';
            else medal = `${index + 1}. `;
            
            const nameSection = document.createElement('div');
            nameSection.innerHTML = `
                <strong>${medal}${score.playerName}</strong><br>
                <small>Niveau ${score.level || 0} | ${score.kills || 0} victoires</small>
            `;
            
            // Provide default values for potentially missing fields
            const displayScore = score.score || ((score.level || 0) * 100) + ((score.kills || 0) * 50) + ((score.puissance || 10) * 10) + ((score.defense || 5) * 5);
            const displayStrength = score.puissance || 10;
            const displayDefense = score.defense || 5;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${displayScore} pts</div>
                <small>⚔️ ${displayStrength} | 🛡️ ${displayDefense}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            scoresContainer.appendChild(playerDiv);
        });
    }
    
    leaderboardList.appendChild(scoresContainer);
}
