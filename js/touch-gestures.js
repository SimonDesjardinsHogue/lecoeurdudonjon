// Touch Gestures Module for Mobile Support
import { gameState } from './game-state.js';

// Configuration
const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe (in pixels)
const SWIPE_TIMEOUT = 300; // Maximum time for a swipe (in milliseconds)

// Touch state
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

/**
 * Handle touch start event
 */
function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
}

/**
 * Handle touch end event
 */
function handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const touchEndTime = Date.now();
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = touchEndTime - touchStartTime;
    
    // Check if it's a valid swipe
    if (deltaTime < SWIPE_TIMEOUT) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Horizontal swipe (left/right)
        if (absDeltaX > SWIPE_THRESHOLD && absDeltaX > absDeltaY) {
            if (deltaX > 0) {
                handleSwipeRight();
            } else {
                handleSwipeLeft();
            }
        }
        // Vertical swipe (up/down)
        else if (absDeltaY > SWIPE_THRESHOLD && absDeltaY > absDeltaX) {
            if (deltaY > 0) {
                handleSwipeDown();
            } else {
                handleSwipeUp();
            }
        }
    }
}

/**
 * Handle swipe right gesture
 */
function handleSwipeRight() {
    // In combat: flee
    if (gameState.inCombat) {
        const currentScreen = getCurrentScreen();
        if (currentScreen === 'combatScreen' && typeof window.flee === 'function') {
            console.log('📱 Swipe right detected: Flee');
            window.flee();
        }
    }
}

/**
 * Handle swipe left gesture
 */
function handleSwipeLeft() {
    // In combat: defend
    if (gameState.inCombat) {
        const currentScreen = getCurrentScreen();
        if (currentScreen === 'combatScreen' && typeof window.defend === 'function') {
            console.log('📱 Swipe left detected: Defend');
            window.defend();
        }
    }
}

/**
 * Handle swipe up gesture
 */
function handleSwipeUp() {
    // Could be used for special actions in the future
}

/**
 * Handle swipe down gesture
 */
function handleSwipeDown() {
    // Could be used to scroll combat log or show more info
}

/**
 * Get the current active screen
 */
function getCurrentScreen() {
    const screens = document.querySelectorAll('.game-screen');
    for (const screen of screens) {
        if (screen.classList.contains('active')) {
            return screen.id;
        }
    }
    return null;
}

/**
 * Initialize touch gesture handlers
 */
export function initTouchGestures() {
    // Only initialize on touch-enabled devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        console.log('📱 Touch gestures enabled');
        
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
            gameContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
        
        // Show touch gesture hints on mobile
        showTouchHints();
    }
}

/**
 * Show touch gesture hints for mobile users
 */
function showTouchHints() {
    // Add a hint indicator that shows available gestures in combat
    const style = document.createElement('style');
    style.textContent = `
        .touch-hints {
            display: none;
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #DAA520;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            z-index: 100;
            pointer-events: none;
            border: 1px solid #8B4513;
            animation: fadeInOut 4s ease-in-out;
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .touch-hints.show {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Display a touch hint message
 */
export function showTouchHint(message, duration = 3000) {
    // Only show on mobile devices
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return;
    }
    
    // Create hint element if it doesn't exist
    let hintElement = document.getElementById('touchHint');
    if (!hintElement) {
        hintElement = document.createElement('div');
        hintElement.id = 'touchHint';
        hintElement.className = 'touch-hints';
        document.body.appendChild(hintElement);
    }
    
    // Update and show the hint
    hintElement.textContent = message;
    hintElement.classList.add('show');
    
    // Hide after duration
    setTimeout(() => {
        hintElement.classList.remove('show');
    }, duration);
}

/**
 * Cleanup touch gesture handlers (if needed)
 */
export function removeTouchGestures() {
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.removeEventListener('touchstart', handleTouchStart);
        gameContainer.removeEventListener('touchend', handleTouchEnd);
    }
}
