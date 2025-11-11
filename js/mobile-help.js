// Mobile Help Module
// Provides guidance for mobile users on how to use touch gestures and mobile features

/**
 * Show mobile help popup
 */
export function showMobileHelp() {
    const helpModal = document.createElement('div');
    helpModal.id = 'mobileHelpModal';
    helpModal.className = 'modal';
    helpModal.style.display = 'block';
    
    helpModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2 style="color: #DAA520; margin-bottom: 15px;">📱 Guide Mobile</h2>
            
            <div style="text-align: left; line-height: 1.8;">
                <h3 style="color: #DAA520; margin-top: 20px;">🎮 Navigation</h3>
                <p>• Utilisez les boutons à l'écran pour naviguer</p>
                <p>• Les raccourcis clavier (1-6, A-D-F) sont indiqués entre parenthèses</p>
                <p>• Touchez n'importe quel bouton pour interagir</p>
                
                <h3 style="color: #DAA520; margin-top: 20px;">⚔️ Combat - Gestes tactiles</h3>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <p><strong>👆 Toucher</strong> : Attaquer (bouton ⚔️)</p>
                    <p><strong>← Balayer à gauche</strong> : Défendre</p>
                    <p><strong>→ Balayer à droite</strong> : Fuir</p>
                </div>
                <p style="font-size: 0.9em; color: #999;">Les gestes de balayage sont optionnels - vous pouvez toujours utiliser les boutons.</p>
                
                <h3 style="color: #DAA520; margin-top: 20px;">📊 Interface</h3>
                <p>• <strong>🎒</strong> : Touchez pour ouvrir/fermer votre inventaire</p>
                <p>• <strong>Statistiques</strong> : Touchez FOR, DEX, etc. pour améliorer avec vos points</p>
                <p>• <strong>Défilement</strong> : Faites glisser pour voir plus de contenu</p>
                
                <h3 style="color: #DAA520; margin-top: 20px;">💡 Conseils</h3>
                <p>• Jouez en mode portrait pour une meilleure expérience</p>
                <p>• Le jeu se sauvegarde automatiquement après chaque action</p>
                <p>• Vous pouvez ajouter le jeu à votre écran d'accueil (PWA)</p>
                <p>• Activez le son pour une meilleure immersion 🔊</p>
                
                <h3 style="color: #DAA520; margin-top: 20px;">🌐 Mode Hors Ligne</h3>
                <p>Ce jeu fonctionne hors ligne une fois chargé grâce à la technologie PWA !</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="padding: 12px 30px; font-size: 1.1em;">
                    ✓ Compris !
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(helpModal);
}

/**
 * Check if user is on mobile device
 */
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || ('ontouchstart' in window)
        || (navigator.maxTouchPoints > 0);
}

/**
 * Show first-time mobile help if needed
 */
export function showFirstTimeMobileHelp() {
    // Check if user is on mobile and hasn't seen the help before
    const hasSeenMobileHelp = localStorage.getItem('hasSeenMobileHelp');
    
    if (isMobileDevice() && !hasSeenMobileHelp) {
        // Wait a bit before showing to not overwhelm the user
        setTimeout(() => {
            showMobileHelp();
            localStorage.setItem('hasSeenMobileHelp', 'true');
        }, 2000);
    }
}

/**
 * Add mobile help button to the UI
 */
export function addMobileHelpButton() {
    if (!isMobileDevice()) {
        return; // Only show on mobile devices
    }
    
    // Create help button
    const helpButton = document.createElement('button');
    helpButton.id = 'mobileHelpButton';
    helpButton.className = 'mobile-help-button';
    helpButton.innerHTML = '❓';
    helpButton.title = 'Aide Mobile';
    helpButton.onclick = showMobileHelp;
    
    // Add CSS for the button
    const style = document.createElement('style');
    style.textContent = `
        .mobile-help-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
            border: 2px solid #DAA520;
            color: #DAA520;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            -webkit-user-select: none;
            user-select: none;
        }
        
        .mobile-help-button:hover,
        .mobile-help-button:active {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(218, 165, 32, 0.6);
        }
        
        @media (max-width: 768px) {
            .mobile-help-button {
                bottom: 15px;
                right: 15px;
                width: 45px;
                height: 45px;
                font-size: 22px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(helpButton);
}
