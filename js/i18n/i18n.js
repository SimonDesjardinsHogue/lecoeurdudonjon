// i18n (Internationalization) Module
import { fr } from './fr.js';
import { en } from './en.js';
import { es } from './es.js';

const STORAGE_KEY = 'game_language';
const DEFAULT_LANGUAGE = 'fr';

// Available languages
const languages = {
    fr,
    en,
    es
};

// Current language
let currentLanguage = DEFAULT_LANGUAGE;

// Initialize i18n system
export function initI18n() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (savedLanguage && languages[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    return currentLanguage;
}

// Get translation for a key
export function t(key) {
    const translation = languages[currentLanguage]?.[key];
    if (translation === undefined) {
        console.warn(`Missing translation for key: ${key} in language: ${currentLanguage}`);
        return key;
    }
    return translation;
}

// Get current language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Set language
export function setLanguage(lang) {
    if (!languages[lang]) {
        console.error(`Language not supported: ${lang}`);
        return false;
    }
    
    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    
    return true;
}

// Get all available languages
export function getAvailableLanguages() {
    return Object.keys(languages);
}

// Get language name in its own language
export function getLanguageName(lang) {
    switch(lang) {
        case 'fr': return 'Français';
        case 'en': return 'English';
        case 'es': return 'Español';
        default: return lang;
    }
}

// Get language flag emoji
export function getLanguageFlag(lang) {
    switch(lang) {
        case 'fr': return '🇫🇷';
        case 'en': return '🇬🇧';
        case 'es': return '🇪🇸';
        default: return '🌐';
    }
}
