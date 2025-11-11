// Leaderboard System Module
// Handles all leaderboard-related functionality: displaying local and network leaderboards

import { gameState } from '../game-state.js';
import { showScreen } from '../ui.js';
import { fetchLeaderboard, getNetworkState } from '../network.js';

// Calculate player score for leaderboard
function calculatePlayerScore(player) {
    return (player.level * 100) + (player.kills * 50) + (player.strength * 10) + (player.defense * 5);
}

// Show leaderboard screen
export function showLeaderboard() {
    showScreen('leaderboardScreen');
    
    // Check if multiplayer is enabled
    const networkState = getNetworkState();
    
    if (networkState.enabled) {
        // Display network leaderboard
        displayNetworkLeaderboard();
    } else {
        // Display local leaderboard
        displayLocalLeaderboard();
    }
}

// Display local (single device) leaderboard
async function displayLocalLeaderboard() {
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
            strength: gameState.player.strength,
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
    leaderboardList.innerHTML = '<h4 style="color: #DAA520;">🏠 Classement Local (cet appareil uniquement)</h4>';
    
    if (players.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Aucun héros n\'a encore été enregistré dans les annales du royaume de Valéria.';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.color = '#999';
        leaderboardList.appendChild(emptyMsg);
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
            const displayScore = player.score || ((player.level || 0) * 100) + ((player.kills || 0) * 50) + ((player.strength || 10) * 10) + ((player.defense || 5) * 5);
            const displayStrength = player.strength || 10;
            const displayDefense = player.defense || 5;
            
            const statsSection = document.createElement('div');
            statsSection.style.textAlign = 'right';
            statsSection.innerHTML = `
                <div style="color: #DAA520; font-weight: bold;">${displayScore} pts</div>
                <small>⚔️ ${displayStrength} | 🛡️ ${displayDefense}</small>
            `;
            
            playerDiv.appendChild(nameSection);
            playerDiv.appendChild(statsSection);
            leaderboardList.appendChild(playerDiv);
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
    leaderboardList.appendChild(note);
}

// Display network (LAN multiplayer) leaderboard
async function displayNetworkLeaderboard() {
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
            const displayScore = score.score || ((score.level || 0) * 100) + ((score.kills || 0) * 50) + ((score.strength || 10) * 10) + ((score.defense || 5) * 5);
            const displayStrength = score.strength || 10;
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
