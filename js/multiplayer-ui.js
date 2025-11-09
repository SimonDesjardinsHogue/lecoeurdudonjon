// Multiplayer UI Functions
import { configureServer, getNetworkState, checkServerHealth, getPlayerId, getDefaultServerUrl } from './network.js';
import { showScreen } from './ui.js';

// Show multiplayer settings screen
export function showMultiplayerSettings() {
    showScreen('multiplayerSettingsScreen');
    
    // Display player ID
    const playerIdDisplay = document.getElementById('playerIdDisplay');
    if (playerIdDisplay) {
        playerIdDisplay.textContent = getPlayerId();
    }
    
    // Load and display current server URL
    const networkState = getNetworkState();
    const serverUrlInput = document.getElementById('serverUrlInput');
    if (serverUrlInput) {
        if (networkState.serverUrl) {
            // Remove http:// or https:// prefix for display
            const displayUrl = networkState.serverUrl.replace(/^https?:\/\//, '');
            serverUrlInput.value = displayUrl;
        } else {
            // Pre-populate with default server URL
            serverUrlInput.value = getDefaultServerUrl();
        }
    }
    
    // Update status
    updateMultiplayerStatus();
}

// Save server configuration
export async function saveServerConfig() {
    const serverUrlInput = document.getElementById('serverUrlInput');
    const resultDiv = document.getElementById('serverConfigResult');
    
    if (!serverUrlInput) return;
    
    const serverUrl = serverUrlInput.value.trim();
    
    if (!serverUrl) {
        if (resultDiv) {
            resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ Veuillez entrer une adresse serveur.</p>';
        }
        return;
    }
    
    // Configure the server
    configureServer(serverUrl);
    
    // Test connection
    const health = await checkServerHealth();
    
    if (resultDiv) {
        if (health.success) {
            resultDiv.innerHTML = '<p style="color: #51cf66;">✓ Serveur configuré et connecté avec succès !</p>';
            updateMultiplayerStatus();
        } else {
            resultDiv.innerHTML = `
                <p style="color: #FFA500;">⚠️ Serveur configuré mais non accessible.</p>
                <p style="font-size: 0.9em; color: #999;">${health.error || 'Vérifiez que le serveur est démarré.'}</p>
            `;
        }
    }
}

// Test server connection
export async function testServerConnection() {
    const resultDiv = document.getElementById('serverConfigResult');
    
    if (resultDiv) {
        resultDiv.innerHTML = '<p style="color: #DAA520;">⏳ Test de connexion en cours...</p>';
    }
    
    const health = await checkServerHealth();
    
    if (resultDiv) {
        if (health.success) {
            resultDiv.innerHTML = `
                <p style="color: #51cf66;">✓ Serveur accessible !</p>
                <p style="font-size: 0.9em; color: #999;">Statut: ${health.data.status}</p>
            `;
            updateMultiplayerStatus();
        } else {
            resultDiv.innerHTML = `
                <p style="color: #ff6b6b;">❌ Impossible de se connecter au serveur.</p>
                <p style="font-size: 0.9em; color: #999;">${health.error || 'Vérifiez l\'adresse et que le serveur est démarré.'}</p>
            `;
        }
    }
}

// Disable multiplayer
export function disableMultiplayer() {
    configureServer(null);
    
    const serverUrlInput = document.getElementById('serverUrlInput');
    if (serverUrlInput) {
        serverUrlInput.value = '';
    }
    
    const resultDiv = document.getElementById('serverConfigResult');
    if (resultDiv) {
        resultDiv.innerHTML = '<p style="color: #51cf66;">✓ Mode multijoueur désactivé.</p>';
    }
    
    updateMultiplayerStatus();
}

// Update multiplayer status display
function updateMultiplayerStatus() {
    const statusElement = document.getElementById('multiplayerStatus');
    if (!statusElement) return;
    
    const networkState = getNetworkState();
    
    if (networkState.connected) {
        statusElement.textContent = '🟢 Connecté au réseau local';
        statusElement.style.color = '#51cf66';
    } else if (networkState.enabled) {
        statusElement.textContent = '🔴 Déconnecté du serveur';
        statusElement.style.color = '#ff6b6b';
    } else {
        statusElement.textContent = '⚪ Mode solo (aucun serveur configuré)';
        statusElement.style.color = '#999';
    }
}

// Show connection notification banner
export function showConnectionNotification(status) {
    const banner = document.getElementById('connectionBanner');
    const icon = document.getElementById('connectionBannerIcon');
    const text = document.getElementById('connectionBannerText');
    const retryBtn = document.getElementById('retryConnectionBtn');
    const dismissBtn = document.getElementById('dismissConnectionBtn');
    
    if (!banner || !icon || !text) return;
    
    // Remove existing status classes
    banner.classList.remove('connected', 'error');
    
    if (status === 'testing') {
        icon.textContent = '🔄';
        text.textContent = 'Test de connexion au serveur 192.168.68.61:3000...';
        retryBtn.style.display = 'none';
        dismissBtn.style.display = 'none';
    } else if (status === 'connected') {
        banner.classList.add('connected');
        icon.textContent = '✅';
        text.textContent = 'Connecté au serveur multijoueur 192.168.68.61:3000';
        retryBtn.style.display = 'none';
        dismissBtn.style.display = 'inline-block';
    } else if (status === 'error') {
        banner.classList.add('error');
        icon.textContent = '⚠️';
        text.textContent = 'Serveur 192.168.68.61:3000 non accessible';
        retryBtn.style.display = 'inline-block';
        dismissBtn.style.display = 'inline-block';
    }
    
    banner.style.display = 'block';
}

// Dismiss connection notification banner
export function dismissConnectionNotification() {
    const banner = document.getElementById('connectionBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}

