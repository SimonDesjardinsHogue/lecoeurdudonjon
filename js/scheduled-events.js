// Scheduled Events Module
// Manages daily timed events that occur at specific hours
import { gameState } from './game-state.js';
import { saveGame } from './save-load.js';
import { updateUI } from './ui.js';
import { audioManager } from './audio.js';

// Event types that can occur
const eventTypes = [
    {
        id: 'treasure_rush',
        name: 'Ruée vers le Trésor',
        icon: '💰',
        description: 'Les trésors sont plus nombreux pendant 30 minutes !',
        benefit: 'Double l\'or trouvé lors de l\'exploration',
        effect: (p) => {
            // This will be checked in game logic to double gold rewards
            return { goldMultiplier: 2 };
        }
    },
    {
        id: 'experience_boost',
        name: 'Vague d\'Énergie Mystique',
        icon: '✨',
        description: 'Une énergie mystique amplifie votre apprentissage !',
        benefit: '+50% d\'expérience pendant 30 minutes',
        effect: (p) => {
            return { xpMultiplier: 1.5 };
        }
    },
    {
        id: 'merchant_sale',
        name: 'Vente du Marchand',
        icon: '🏪',
        description: 'Le marchand offre des rabais spéciaux !',
        benefit: '30% de rabais sur tous les articles',
        effect: (p) => {
            return { shopDiscount: 0.30 };
        }
    },
    {
        id: 'blessing_of_strength',
        name: 'Bénédiction de Force',
        icon: '⚔️',
        description: 'Les dieux de la guerre vous accordent leur bénédiction !',
        benefit: '+20% de force en combat pendant 30 minutes',
        effect: (p) => {
            return { strengthMultiplier: 1.2 };
        }
    },
    {
        id: 'healing_sanctuary',
        name: 'Sanctuaire de Guérison',
        icon: '⛲',
        description: 'Un sanctuaire sacré ouvre ses portes !',
        benefit: 'Repos gratuit et régénération améliorée',
        effect: (p) => {
            return { freeRest: true, healingBonus: 1.5 };
        }
    },
    {
        id: 'monster_invasion',
        name: 'Invasion de Monstres',
        icon: '👹',
        description: 'Une horde de monstres envahit le donjon !',
        benefit: 'Plus d\'ennemis mais doubles récompenses',
        effect: (p) => {
            return { enemySpawnRate: 1.5, combatRewardMultiplier: 2 };
        }
    },
    {
        id: 'lucky_hour',
        name: 'Heure de Chance',
        icon: '🍀',
        description: 'La chance est de votre côté !',
        benefit: 'Meilleures chances de trouver des objets rares',
        effect: (p) => {
            return { luckBonus: 2, criticalChance: 1.5 };
        }
    },
    {
        id: 'ancient_knowledge',
        name: 'Révélation Ancienne',
        icon: '📖',
        description: 'Les M&M partagent leurs connaissances anciennes !',
        benefit: '+2 à toutes les caractéristiques temporairement',
        effect: (p) => {
            return { allStatsBonus: 2 };
        }
    }
];

// Initialize scheduled events in game state
export function initializeScheduledEvents() {
    if (!gameState.scheduledEvents) {
        gameState.scheduledEvents = {
            lastReset: null,
            todayEvents: [],
            activeEvent: null,
            stats: {
                totalEventsAttended: 0,
                favoriteEvent: null,
                eventsAttendedByType: {}
            }
        };
    }
    
    // Check if we need to generate new events for today
    checkAndGenerateEvents();
}

// Get current time in Toronto timezone
function getTorontoTime() {
    // Toronto is in America/Toronto timezone (EST/EDT)
    const now = new Date();
    const torontoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    return torontoTime;
}

// Check if we need to generate new events (daily reset)
export function checkAndGenerateEvents() {
    const events = gameState.scheduledEvents;
    const now = getTorontoTime();
    
    // Get today's date at midnight in Toronto time
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // If no last reset or last reset was before today, generate new events
    if (!events.lastReset || new Date(events.lastReset) < today) {
        generateDailyEvents();
        events.lastReset = today.toISOString();
        saveGame();
    }
}

// Generate random time between start and end hour
function generateRandomTime(startHour, endHour) {
    const now = getTorontoTime();
    const eventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Random hour between start and end
    const hour = startHour + Math.floor(Math.random() * (endHour - startHour));
    
    // Random minute (0-59)
    const minute = Math.floor(Math.random() * 60);
    
    eventDate.setHours(hour, minute, 0, 0);
    return eventDate;
}

// Generate two daily events
export function generateDailyEvents() {
    const events = gameState.scheduledEvents;
    
    // Shuffle event types to get random events
    const shuffledTypes = [...eventTypes].sort(() => Math.random() - 0.5);
    
    // Morning event: 8am - 2pm (14h)
    const morningEvent = {
        ...shuffledTypes[0],
        startTime: generateRandomTime(8, 14),
        endTime: null // Will be set based on start time
    };
    morningEvent.endTime = new Date(morningEvent.startTime.getTime() + 30 * 60 * 1000); // +30 minutes
    
    // Afternoon event: 2pm (14h) - 8pm (20h)
    const afternoonEvent = {
        ...shuffledTypes[1],
        startTime: generateRandomTime(14, 20), // 14 is 2pm, 20 is 8pm
        endTime: null
    };
    afternoonEvent.endTime = new Date(afternoonEvent.startTime.getTime() + 30 * 60 * 1000); // +30 minutes
    
    events.todayEvents = [morningEvent, afternoonEvent];
}

// Check if any event is currently active
export function checkActiveEvent() {
    const events = gameState.scheduledEvents;
    if (!events || !events.todayEvents) return null;
    
    const now = getTorontoTime();
    
    for (const event of events.todayEvents) {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);
        
        if (now >= startTime && now <= endTime) {
            // Event is active
            if (!events.activeEvent || events.activeEvent.id !== event.id) {
                // New event just started
                activateEvent(event);
            }
            return event;
        }
    }
    
    // No active event
    if (events.activeEvent) {
        deactivateEvent();
    }
    
    return null;
}

// Activate an event
function activateEvent(event) {
    const events = gameState.scheduledEvents;
    events.activeEvent = event;
    
    // Track stats
    if (!events.stats.eventsAttendedByType[event.id]) {
        events.stats.eventsAttendedByType[event.id] = 0;
    }
    events.stats.eventsAttendedByType[event.id]++;
    events.stats.totalEventsAttended++;
    
    // Play sound
    audioManager.playSound('levelup');
    
    // Show notification
    showEventNotification(event, true);
    
    saveGame();
}

// Deactivate the current event
function deactivateEvent() {
    const events = gameState.scheduledEvents;
    
    if (events.activeEvent) {
        showEventNotification(events.activeEvent, false);
        events.activeEvent = null;
        saveGame();
    }
}

// Show event notification
function showEventNotification(event, isStarting) {
    const message = isStarting
        ? `🎉 ÉVÉNEMENT COMMENCÉ ! 🎉\n\n${event.icon} ${event.name}\n\n${event.description}\n\n✨ ${event.benefit}\n\nDurée: 30 minutes`
        : `⏰ L'événement "${event.name}" est terminé.\n\nMerci d'avoir participé !`;
    
    alert(message);
}

// Get next scheduled event
export function getNextEvent() {
    const events = gameState.scheduledEvents;
    if (!events || !events.todayEvents) return null;
    
    const now = getTorontoTime();
    
    // Find the next event that hasn't ended yet
    for (const event of events.todayEvents) {
        const endTime = new Date(event.endTime);
        if (now < endTime) {
            return event;
        }
    }
    
    return null;
}

// Get time until next event in milliseconds
export function getTimeUntilNextEvent() {
    const nextEvent = getNextEvent();
    if (!nextEvent) return null;
    
    const now = getTorontoTime();
    const startTime = new Date(nextEvent.startTime);
    
    // If event is active, return time until end
    if (now >= startTime) {
        const endTime = new Date(nextEvent.endTime);
        return endTime - now;
    }
    
    // Event hasn't started yet
    return startTime - now;
}

// Format time remaining as human-readable string
export function formatTimeRemaining(milliseconds) {
    if (!milliseconds || milliseconds < 0) return 'Aucun événement à venir';
    
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Get event effect multipliers for game logic
export function getEventEffects() {
    const activeEvent = gameState.scheduledEvents?.activeEvent;
    if (!activeEvent || !activeEvent.effect) {
        return {};
    }
    
    return activeEvent.effect(gameState.player);
}

// Check if a specific effect is active
export function hasEventEffect(effectName) {
    const effects = getEventEffects();
    return effects.hasOwnProperty(effectName);
}

// Get event multiplier (default 1 if no event)
export function getEventMultiplier(effectName, defaultValue = 1) {
    const effects = getEventEffects();
    return effects[effectName] || defaultValue;
}
