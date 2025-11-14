// Security Module
// Provides utilities for sanitizing user input and preventing XSS attacks

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} unsafe - The unsafe string to sanitize
 * @returns {string} - The sanitized string safe for HTML insertion
 */
export function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return '';
    }
    
    const div = document.createElement('div');
    div.textContent = unsafe;
    return div.innerHTML;
}

/**
 * Sanitizes a player name by removing dangerous characters and limiting length
 * Multi-layer defense against XSS:
 * 1. Remove script/style tags iteratively to handle nested/malformed tags
 * 2. Remove all other HTML tags
 * 3. Remove remaining dangerous characters
 * This approach provides defense in depth - even if regex misses edge cases,
 * the final character filtering ensures no HTML/script injection is possible
 * 
 * @param {string} name - The player name to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 20)
 * @returns {string} - The sanitized name
 */
export function sanitizePlayerName(name, maxLength = 20) {
    if (typeof name !== 'string') {
        return 'Héros';
    }
    
    let sanitized = name;
    let previousLength;
    
    // Remove script and style content iteratively until no more changes
    do {
        previousLength = sanitized.length;
        sanitized = sanitized.replace(/<script[\s\S]*?<\/script\s*>/gi, '');
        sanitized = sanitized.replace(/<style[\s\S]*?<\/style\s*>/gi, '');
    } while (sanitized.length !== previousLength);
    
    // Remove all HTML tags iteratively until no more tags exist
    do {
        previousLength = sanitized.length;
        sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, '');
    } while (sanitized.length !== previousLength);
    
    // Final defense: remove ANY remaining characters that could be used in HTML/JS injection
    // This ensures that even if regex misses a tag, the dangerous characters are gone
    sanitized = sanitized.replace(/[<>'"&]/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    // Limit length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }
    
    // If empty after sanitization, provide default name
    if (sanitized.length === 0) {
        return 'Héros';
    }
    
    return sanitized;
}

/**
 * Validates and sanitizes a text input value
 * @param {string} input - The input to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxLength - Maximum allowed length
 * @param {boolean} options.allowSpecialChars - Allow special characters
 * @param {RegExp} options.pattern - Custom validation pattern
 * @returns {Object} - { valid: boolean, sanitized: string, error: string }
 */
export function validateInput(input, options = {}) {
    const {
        maxLength = 100,
        allowSpecialChars = true,
        pattern = null
    } = options;
    
    if (typeof input !== 'string') {
        return { valid: false, sanitized: '', error: 'Input must be a string' };
    }
    
    // Use comprehensive HTML tag removal
    let sanitized = input;
    let previousLength;
    
    // Remove script and style content iteratively
    do {
        previousLength = sanitized.length;
        sanitized = sanitized.replace(/<script[\s\S]*?<\/script\s*>/gi, '');
        sanitized = sanitized.replace(/<style[\s\S]*?<\/style\s*>/gi, '');
    } while (sanitized.length !== previousLength);
    
    // Remove all HTML tags iteratively
    do {
        previousLength = sanitized.length;
        sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, '');
    } while (sanitized.length !== previousLength);
    
    sanitized = sanitized.trim();
    
    // Check length
    if (sanitized.length > maxLength) {
        return { 
            valid: false, 
            sanitized: sanitized.substring(0, maxLength), 
            error: `Input too long (max ${maxLength} characters)` 
        };
    }
    
    // Check for special characters if not allowed
    if (!allowSpecialChars) {
        const specialCharsPattern = /[<>'"&]/g;
        if (specialCharsPattern.test(sanitized)) {
            sanitized = sanitized.replace(specialCharsPattern, '');
        }
    }
    
    // Check custom pattern
    if (pattern && !pattern.test(sanitized)) {
        return { 
            valid: false, 
            sanitized, 
            error: 'Input does not match required pattern' 
        };
    }
    
    return { valid: true, sanitized, error: null };
}

/**
 * Sanitizes a URL to prevent javascript: and data: URI schemes
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url) {
    if (typeof url !== 'string') {
        return '';
    }
    
    const urlLower = url.toLowerCase().trim();
    
    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    for (const protocol of dangerousProtocols) {
        if (urlLower.startsWith(protocol)) {
            console.warn('Blocked dangerous URL protocol:', protocol);
            return '';
        }
    }
    
    return url;
}

/**
 * Creates a safe text node from user input
 * @param {string} text - The text to create a node for
 * @returns {Text} - A text node safe for DOM insertion
 */
export function createSafeTextNode(text) {
    return document.createTextNode(String(text || ''));
}

/**
 * Safely sets HTML content by sanitizing first
 * @param {HTMLElement} element - The element to set content on
 * @param {string} content - The content to set (will be sanitized)
 */
export function setSafeHtml(element, content) {
    if (!element || !(element instanceof HTMLElement)) {
        console.warn('Invalid element provided to setSafeHtml');
        return;
    }
    
    // Sanitize the content
    const sanitized = escapeHtml(content);
    element.innerHTML = sanitized;
}

/**
 * Rate limiting helper for client-side actions
 */
class RateLimiter {
    constructor(maxActions = 10, windowMs = 60000) {
        this.maxActions = maxActions;
        this.windowMs = windowMs;
        this.actions = [];
    }
    
    /**
     * Check if an action is allowed
     * @param {string} key - Unique identifier for the action
     * @returns {boolean} - True if action is allowed
     */
    isAllowed(key) {
        const now = Date.now();
        
        // Filter out old actions
        this.actions = this.actions.filter(action => 
            now - action.timestamp < this.windowMs
        );
        
        // Count actions for this key
        const keyActions = this.actions.filter(action => action.key === key);
        
        if (keyActions.length >= this.maxActions) {
            console.warn(`Rate limit exceeded for ${key}`);
            return false;
        }
        
        // Record this action
        this.actions.push({ key, timestamp: now });
        return true;
    }
    
    /**
     * Reset rate limiting for a specific key
     * @param {string} key - The key to reset
     */
    reset(key) {
        this.actions = this.actions.filter(action => action.key !== key);
    }
}

export const rateLimiter = new RateLimiter();
