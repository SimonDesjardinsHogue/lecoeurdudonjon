/**
 * DOM Element Cache
 * Caches frequently accessed DOM elements to reduce repeated querySelector/getElementById calls
 * This improves performance and code maintainability
 */

class DOMCache {
    constructor() {
        this.cache = new Map();
        this.initialized = false;
    }

    /**
     * Initializes the cache with frequently accessed elements
     * Should be called once after DOM is loaded
     */
    init() {
        if (this.initialized) return;

        // Cache all frequently accessed elements
        const elements = {
            // Screens
            gameStats: 'gameStats',
            combatLog: 'combatLog',
            
            // Event banner
            eventBanner: 'eventBanner',
            eventBannerIcon: 'eventBannerIcon',
            eventBannerText: 'eventBannerText',
            eventBannerDetails: 'eventBannerDetails',
            
            // Player stats (main stats display)
            playerNameLabel: 'playerNameLabel',
            playerLevel: 'playerLevel',
            playerGold: 'playerGold',
            playerHealth: 'playerHealth',
            healthFill: 'healthFill',
            playerPuissance: 'playerPuissance',
            playerDefense: 'playerDefense',
            playerWeaponDamage: 'playerWeaponDamage',
            weaponIcon: 'weaponIcon',
            manaRow: 'manaRow',
            playerMana: 'playerMana',
            manaFill: 'manaFill',
            playerAdresse: 'playerAdresse',
            playerEsprit: 'playerEsprit',
            playerPresence: 'playerPresence',
            playerXP: 'playerXP',
            playerEnergy: 'playerEnergy',
            energyFill: 'energyFill',
            playerClass: 'playerClass',
            playerRace: 'playerRace',
            playerGender: 'playerGender',
            
            // Inline stats
            playerHealthInline: 'playerHealthInline',
            healthFillInline: 'healthFillInline',
            manaRowInline: 'manaRowInline',
            playerManaInline: 'playerManaInline',
            manaFillInline: 'manaFillInline',
            playerEnergyInline: 'playerEnergyInline',
            energyFillInline: 'energyFillInline',
            
            // Start screen
            nameInput: 'nameInput',
            restoreSaveBtn: 'restoreSaveBtn',
            
            // NPC/Event screens
            eventInfo: 'eventInfo',
            npcContent: 'npcContent'
        };

        // Populate cache
        for (const [key, id] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                this.cache.set(key, element);
            }
        }

        this.initialized = true;
    }

    /**
     * Gets a cached element by key
     * Falls back to document.getElementById if not cached
     * @param {string} key - The cache key or element ID
     * @returns {HTMLElement|null} The cached element or null
     */
    get(key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        // Fallback to getElementById
        const element = document.getElementById(key);
        if (element) {
            this.cache.set(key, element);
        }
        return element;
    }

    /**
     * Checks if an element exists in cache or DOM
     * @param {string} key - The cache key or element ID
     * @returns {boolean} True if element exists
     */
    has(key) {
        return this.cache.has(key) || document.getElementById(key) !== null;
    }

    /**
     * Clears the cache (useful for testing or dynamic content)
     */
    clear() {
        this.cache.clear();
        this.initialized = false;
    }

    /**
     * Removes a specific element from cache
     * @param {string} key - The cache key to remove
     */
    remove(key) {
        this.cache.delete(key);
    }

    /**
     * Updates a cached element (useful when DOM changes)
     * @param {string} key - The cache key
     * @param {HTMLElement} element - The new element
     */
    update(key, element) {
        if (element instanceof HTMLElement) {
            this.cache.set(key, element);
        }
    }
}

// Export singleton instance
export const domCache = new DOMCache();
