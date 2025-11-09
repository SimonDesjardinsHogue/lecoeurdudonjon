// Network Client Module for LAN Multiplayer
// Handles communication with the local server for leaderboard and scores

import { gameState } from './game-state.js';

// Default configuration
const DEFAULT_CONFIG = {
  serverUrl: '192.168.68.61:3000'
};

// Network state
const networkState = {
  serverUrl: null,
  socket: null,
  connected: false,
  playerId: null,
  enabled: false
};

// Initialize player ID (create if doesn't exist)
export function initPlayerId() {
  let playerId = localStorage.getItem('lecoeurdudragon_playerId');
  
  if (!playerId) {
    // Generate unique player ID
    playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('lecoeurdudragon_playerId', playerId);
    console.log('✓ Nouveau ID joueur créé:', playerId);
  }
  
  networkState.playerId = playerId;
  return playerId;
}

// Get player ID
export function getPlayerId() {
  if (!networkState.playerId) {
    return initPlayerId();
  }
  return networkState.playerId;
}

// Configure server URL
export function configureServer(serverUrl) {
  if (!serverUrl) {
    networkState.enabled = false;
    networkState.serverUrl = null;
    disconnectFromServer();
    localStorage.removeItem('lecoeurdudragon_serverUrl');
    console.log('✓ Mode multijoueur désactivé');
    return;
  }
  
  // Ensure URL has protocol
  if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
    serverUrl = 'http://' + serverUrl;
  }
  
  // Remove trailing slash
  serverUrl = serverUrl.replace(/\/$/, '');
  
  networkState.serverUrl = serverUrl;
  networkState.enabled = true;
  localStorage.setItem('lecoeurdudragon_serverUrl', serverUrl);
  
  console.log('✓ Serveur configuré:', serverUrl);
  
  // Try to connect
  connectToServer();
}

// Get default server URL from config
export function getDefaultServerUrl() {
  return DEFAULT_CONFIG.serverUrl;
}

// Load saved server URL
export function loadServerConfig() {
  const savedUrl = localStorage.getItem('lecoeurdudragon_serverUrl');
  if (savedUrl) {
    configureServer(savedUrl);
  } else {
    // If no saved URL, auto-test default server
    console.log('ℹ️ Aucune configuration sauvegardée. Test du serveur par défaut:', DEFAULT_CONFIG.serverUrl);
    autoTestDefaultServer();
  }
}

// Auto-test default server connection
async function autoTestDefaultServer() {
  // Show connection banner with testing status
  showConnectionBanner('testing');
  
  // Temporarily set server URL to test health (without enabling)
  const tempServerUrl = 'http://' + DEFAULT_CONFIG.serverUrl;
  networkState.serverUrl = tempServerUrl;
  
  const health = await checkServerHealth();
  
  if (health.success) {
    // Server is accessible, auto-configure it
    console.log('✓ Serveur par défaut accessible, configuration automatique');
    configureServer(DEFAULT_CONFIG.serverUrl);
    showConnectionBanner('connected');
    
    // Auto-hide success banner after 5 seconds
    setTimeout(() => {
      dismissConnectionBanner();
    }, 5000);
  } else {
    // Server is not accessible, show retry option
    console.log('⚠️ Serveur par défaut non accessible');
    networkState.serverUrl = null;
    networkState.enabled = false;
    showConnectionBanner('error');
  }
}

// Show connection banner with status
function showConnectionBanner(status) {
  if (typeof window.showConnectionNotification === 'function') {
    window.showConnectionNotification(status);
  }
}

// Dismiss connection banner
function dismissConnectionBanner() {
  if (typeof window.dismissConnectionNotification === 'function') {
    window.dismissConnectionNotification();
  }
}

// Retry connection to default server (exported for UI button)
export async function retryDefaultServerConnection() {
  await autoTestDefaultServer();
}


// Connect to server via WebSocket
export function connectToServer() {
  if (!networkState.enabled || !networkState.serverUrl) {
    return false;
  }
  
  // Don't reconnect if already connected
  if (networkState.connected && networkState.socket) {
    return true;
  }
  
  try {
    // Dynamically import Socket.IO client
    import('https://cdn.socket.io/4.6.1/socket.io.min.js').then(() => {
      if (typeof io === 'undefined') {
        console.error('Socket.IO client non disponible');
        return;
      }
      
      networkState.socket = io(networkState.serverUrl, {
        transports: ['websocket', 'polling']
      });
      
      networkState.socket.on('connect', () => {
        console.log('✓ Connecté au serveur multijoueur');
        networkState.connected = true;
        updateConnectionStatus(true);
      });
      
      networkState.socket.on('disconnect', () => {
        console.log('✗ Déconnecté du serveur multijoueur');
        networkState.connected = false;
        updateConnectionStatus(false);
      });
      
      networkState.socket.on('leaderboard-update', (data) => {
        console.log('📊 Mise à jour du classement reçue');
        updateLeaderboardUI(data.scores);
      });
      
      networkState.socket.on('connect_error', (error) => {
        console.error('Erreur de connexion au serveur:', error.message);
        networkState.connected = false;
        updateConnectionStatus(false);
      });
    }).catch(error => {
      console.error('Erreur chargement Socket.IO:', error);
    });
    
    return true;
  } catch (error) {
    console.error('Erreur connexion serveur:', error);
    return false;
  }
}

// Disconnect from server
export function disconnectFromServer() {
  if (networkState.socket) {
    networkState.socket.disconnect();
    networkState.socket = null;
  }
  networkState.connected = false;
  updateConnectionStatus(false);
}

// Update connection status in UI
function updateConnectionStatus(connected) {
  const statusElement = document.getElementById('multiplayerStatus');
  if (statusElement) {
    if (connected) {
      statusElement.textContent = '🟢 Connecté au réseau local';
      statusElement.style.color = '#51cf66';
    } else if (networkState.enabled) {
      statusElement.textContent = '🔴 Déconnecté du serveau';
      statusElement.style.color = '#ff6b6b';
    } else {
      statusElement.textContent = '⚪ Mode solo (aucun serveur configuré)';
      statusElement.style.color = '#999';
    }
  }
}

// Submit score to server
export async function submitScore() {
  if (!networkState.enabled || !networkState.serverUrl) {
    console.log('Mode multijoueur désactivé, score non envoyé');
    return { success: false, offline: true };
  }
  
  const player = gameState.player;
  const scoreData = {
    playerId: getPlayerId(),
    playerName: player.name,
    level: player.level,
    kills: player.kills,
    gold: player.gold,
    xp: player.xp,
    className: player.className || 'Guerrier',
    race: player.race || 'humain',
    gender: player.gender || 'male'
  };
  
  try {
    const response = await fetch(`${networkState.serverUrl}/api/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scoreData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✓ Score envoyé au serveur:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erreur envoi du score:', error);
    return { success: false, error: error.message };
  }
}

// Fetch leaderboard from server
export async function fetchLeaderboard(limit = 10) {
  if (!networkState.enabled || !networkState.serverUrl) {
    return { success: false, offline: true, scores: [] };
  }
  
  try {
    const response = await fetch(`${networkState.serverUrl}/api/leaderboard?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✓ Classement reçu du serveur:', result.count, 'scores');
    return { success: true, scores: result.scores };
  } catch (error) {
    console.error('Erreur récupération du classement:', error);
    return { success: false, error: error.message, scores: [] };
  }
}

// Fetch player's personal scores
export async function fetchPlayerScores(playerId = null) {
  if (!networkState.enabled || !networkState.serverUrl) {
    return { success: false, offline: true, scores: [] };
  }
  
  const id = playerId || getPlayerId();
  
  try {
    const response = await fetch(`${networkState.serverUrl}/api/player/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✓ Scores personnels reçus:', result.count, 'scores');
    return { success: true, scores: result.scores };
  } catch (error) {
    console.error('Erreur récupération scores personnels:', error);
    return { success: false, error: error.message, scores: [] };
  }
}

// Check server health
export async function checkServerHealth() {
  if (!networkState.serverUrl) {
    return { success: false, offline: true };
  }
  
  try {
    const response = await fetch(`${networkState.serverUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Serveur non accessible:', error);
    return { success: false, error: error.message };
  }
}

// Update leaderboard UI (will be called by Socket.IO events)
function updateLeaderboardUI(scores) {
  // This function will be called when the UI module is ready
  if (window.updateNetworkLeaderboard) {
    window.updateNetworkLeaderboard(scores);
  }
}

// Get current network state
export function getNetworkState() {
  return {
    enabled: networkState.enabled,
    connected: networkState.connected,
    serverUrl: networkState.serverUrl,
    playerId: networkState.playerId
  };
}

// Request leaderboard update via WebSocket
export function requestLeaderboardUpdate() {
  if (networkState.connected && networkState.socket) {
    networkState.socket.emit('request-leaderboard');
  }
}

// Initialize network module
export function initNetwork() {
  initPlayerId();
  loadServerConfig();
  console.log('✓ Module réseau initialisé');
}
