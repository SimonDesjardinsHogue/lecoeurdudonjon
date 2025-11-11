// Audio Management Module
// Handles background music and sound effects

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.music = null;
        this.isMuted = false;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.musicGainNode = null;
        this.sfxGainNode = null;
        this.currentMusicType = 'default'; // Track current music type
        
        // Load settings from localStorage
        this.loadSettings();
    }
    
    // Initialize audio context (must be called after user interaction)
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes for volume control
            this.musicGainNode = this.audioContext.createGain();
            this.musicGainNode.connect(this.audioContext.destination);
            this.musicGainNode.gain.value = this.isMuted ? 0 : this.musicVolume;
            
            this.sfxGainNode = this.audioContext.createGain();
            this.sfxGainNode.connect(this.audioContext.destination);
            this.sfxGainNode.gain.value = this.isMuted ? 0 : this.sfxVolume;
            
            this.generateSounds();
            this.startMusic('default');
        }
    }
    
    // Generate procedural sounds using Web Audio API
    generateSounds() {
        // Attack sound - short aggressive tone
        this.sounds.attack = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
        
        // Defense sound - shield block
        this.sounds.defend = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
        
        // Victory sound - ascending fanfare
        this.sounds.victory = () => {
            const notes = [262, 330, 392, 523]; // C, E, G, C
            notes.forEach((freq, i) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.sfxGainNode);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.15);
                
                gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime + i * 0.15);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.15 + 0.3);
                
                oscillator.start(this.audioContext.currentTime + i * 0.15);
                oscillator.stop(this.audioContext.currentTime + i * 0.15 + 0.3);
            });
        };
        
        // Hit/damage sound
        this.sounds.hit = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.08);
            
            gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.08);
        };
        
        // Flee sound - quick descending tone
        this.sounds.flee = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
        
        // Purchase/gold sound - coin clink
        this.sounds.purchase = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.12);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.12);
        };
        
        // Level up sound - powerful ascending tone
        this.sounds.levelup = () => {
            const notes = [392, 494, 587, 784]; // G, B, D, G
            notes.forEach((freq, i) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.sfxGainNode);
                
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.12);
                
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + i * 0.12);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.12 + 0.4);
                
                oscillator.start(this.audioContext.currentTime + i * 0.12);
                oscillator.stop(this.audioContext.currentTime + i * 0.12 + 0.4);
            });
        };
        
        // Heal sound - soft upward tone
        this.sounds.heal = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.35);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.35);
        };
    }
    
    // Get melody for music type
    getMelodyForType(type) {
        switch (type) {
            case 'combat':
                // Fast, intense combat music with minor key
                return [
                    { freq: 330, duration: 0.25 },  // E
                    { freq: 392, duration: 0.25 },  // G
                    { freq: 330, duration: 0.25 },  // E
                    { freq: 294, duration: 0.25 },  // D
                    { freq: 330, duration: 0.25 },  // E
                    { freq: 392, duration: 0.25 },  // G
                    { freq: 440, duration: 0.5 },   // A
                    { freq: 392, duration: 0.5 },   // G
                ];
            
            case 'mystery':
                // Mysterious, ethereal music with longer notes
                return [
                    { freq: 261, duration: 1.0 },   // C
                    { freq: 311, duration: 1.0 },   // Eb
                    { freq: 349, duration: 0.75 },  // F
                    { freq: 392, duration: 0.75 },  // G
                    { freq: 466, duration: 1.5 },   // Bb
                ];
            
            case 'merchant':
                // Rhythmic, forge-like music with hammering pattern
                return [
                    { freq: 196, duration: 0.3 },   // G (low)
                    { freq: 196, duration: 0.2 },   // G (short)
                    { freq: 220, duration: 0.3 },   // A
                    { freq: 196, duration: 0.2 },   // G (short)
                    { freq: 247, duration: 0.3 },   // B
                    { freq: 196, duration: 0.2 },   // G (short)
                    { freq: 220, duration: 0.3 },   // A
                    { freq: 196, duration: 0.2 },   // G (short)
                ];
            
            default: // 'default'
                // Peaceful medieval-style melody
                return [
                    { freq: 392, duration: 0.5 },  // G
                    { freq: 440, duration: 0.5 },  // A
                    { freq: 392, duration: 0.5 },  // G
                    { freq: 349, duration: 0.5 },  // F
                    { freq: 330, duration: 1.0 },  // E
                    { freq: 294, duration: 0.5 },  // D
                    { freq: 330, duration: 0.5 },  // E
                    { freq: 349, duration: 1.0 },  // F
                ];
        }
    }
    
    // Get oscillator type for music type
    getOscillatorType(type) {
        switch (type) {
            case 'combat':
                return 'sawtooth'; // More aggressive sound
            case 'mystery':
                return 'triangle'; // Softer, mysterious sound
            case 'merchant':
                return 'square'; // Percussive sound for hammering
            default:
                return 'sine'; // Smooth, peaceful sound
        }
    }
    
    // Start music with a specific type
    startMusic(type = 'default') {
        // If already playing the same type, don't restart
        if (this.music && this.currentMusicType === type) return;
        
        // Stop current music before starting new one
        this.stopMusic();
        this.currentMusicType = type;
        
        const playMusicLoop = () => {
            if (!this.audioContext) return;
            
            const melody = this.getMelodyForType(type);
            const oscillatorType = this.getOscillatorType(type);
            
            // Only schedule audio nodes if not muted
            if (!this.isMuted) {
                let currentTime = this.audioContext.currentTime;
                
                melody.forEach(note => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.musicGainNode);
                    
                    oscillator.type = oscillatorType;
                    oscillator.frequency.setValueAtTime(note.freq, currentTime);
                    
                    // Adjust volume based on music type
                    const baseVolume = type === 'combat' ? 0.10 : type === 'merchant' ? 0.07 : 0.08;
                    
                    gainNode.gain.setValueAtTime(0, currentTime);
                    gainNode.gain.linearRampToValueAtTime(baseVolume, currentTime + 0.05);
                    gainNode.gain.linearRampToValueAtTime(baseVolume * 0.75, currentTime + note.duration * 0.8);
                    gainNode.gain.linearRampToValueAtTime(0, currentTime + note.duration);
                    
                    oscillator.start(currentTime);
                    oscillator.stop(currentTime + note.duration);
                    
                    currentTime += note.duration;
                });
            }
            
            // Always schedule next loop, regardless of mute state
            const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
            this.music = setTimeout(playMusicLoop, totalDuration * 1000);
        };
        
        playMusicLoop();
    }
    
    // Stop music
    stopMusic() {
        if (this.music) {
            clearTimeout(this.music);
            this.music = null;
        }
    }
    
    // Play a sound effect
    playSound(soundName) {
        if (!this.audioContext || this.isMuted || !this.sounds[soundName]) return;
        
        try {
            this.sounds[soundName]();
        } catch (e) {
            console.error('Error playing sound:', e);
        }
    }
    
    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.isMuted ? 0 : this.musicVolume;
        }
        if (this.sfxGainNode) {
            this.sfxGainNode.gain.value = this.isMuted ? 0 : this.sfxVolume;
        }
        
        // Restart music if unmuted
        if (!this.isMuted && !this.music) {
            this.startMusic(this.currentMusicType);
        }
        
        this.saveSettings();
        return this.isMuted;
    }
    
    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGainNode && !this.isMuted) {
            this.musicGainNode.gain.value = this.musicVolume;
        }
        this.saveSettings();
    }
    
    // Set sound effects volume
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGainNode && !this.isMuted) {
            this.sfxGainNode.gain.value = this.sfxVolume;
        }
        this.saveSettings();
    }
    
    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('lecoeurdudragon_audio', JSON.stringify({
            isMuted: this.isMuted,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume
        }));
    }
    
    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('lecoeurdudragon_audio');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.isMuted = settings.isMuted || false;
                this.musicVolume = settings.musicVolume || 0.3;
                this.sfxVolume = settings.sfxVolume || 0.5;
            } catch (e) {
                console.error('Error loading audio settings:', e);
            }
        }
    }
}

// Create and export singleton instance
export const audioManager = new AudioManager();
