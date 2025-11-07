// Particle Effects System
// Handles visual particle effects for combat and special events

class Particle {
    constructor(x, y, vx, vy, color, size, lifetime) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.age = 0;
        this.gravity = 0.2;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.age += deltaTime;
        return this.age < this.lifetime;
    }
    
    draw(ctx) {
        const alpha = 1 - (this.age / this.lifetime);
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.lastTime = 0;
        this.isRunning = false;
    }
    
    // Initialize particle system with a canvas overlay
    init() {
        if (this.canvas) return; // Already initialized
        
        // Create canvas overlay
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particleCanvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Start animation loop
        this.start();
    }
    
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animate();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 16.67; // Normalize to 60fps
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            const alive = particle.update(deltaTime);
            if (alive) particle.draw(this.ctx);
            return alive;
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    // Create attack particles (slashing effect)
    createAttackEffect(element) {
        const rect = element ? element.getBoundingClientRect() : { 
            left: window.innerWidth / 2, 
            top: window.innerHeight / 2,
            width: 100,
            height: 100
        };
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create slashing particles
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI / 4) + (Math.random() - 0.5) * (Math.PI / 2);
            const speed = 3 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle = new Particle(
                centerX,
                centerY,
                vx,
                vy,
                'rgb(255, 100, 100)',
                3 + Math.random() * 3,
                30 + Math.random() * 20
            );
            particle.gravity = 0.1;
            this.particles.push(particle);
        }
    }
    
    // Create defense particles (shield effect)
    createDefenseEffect(element) {
        const rect = element ? element.getBoundingClientRect() : { 
            left: window.innerWidth / 2, 
            top: window.innerHeight / 2,
            width: 100,
            height: 100
        };
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create shield particles in a circle
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const radius = 40 + Math.random() * 20;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const particle = new Particle(
                x,
                y,
                Math.cos(angle) * 2,
                Math.sin(angle) * 2,
                'rgb(100, 150, 255)',
                2 + Math.random() * 2,
                40 + Math.random() * 20
            );
            particle.gravity = 0;
            this.particles.push(particle);
        }
    }
    
    // Create spell/magic particles (sparkles)
    createSpellEffect(element, color = 'rgb(150, 100, 255)') {
        const rect = element ? element.getBoundingClientRect() : { 
            left: window.innerWidth / 2, 
            top: window.innerHeight / 2,
            width: 100,
            height: 100
        };
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create magical sparkles
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle = new Particle(
                centerX + (Math.random() - 0.5) * 40,
                centerY + (Math.random() - 0.5) * 40,
                vx,
                vy,
                color,
                2 + Math.random() * 3,
                40 + Math.random() * 30
            );
            particle.gravity = -0.05; // Float upward
            this.particles.push(particle);
        }
    }
    
    // Create victory particles (celebration)
    createVictoryEffect(element) {
        const rect = element ? element.getBoundingClientRect() : { 
            left: window.innerWidth / 2, 
            top: window.innerHeight / 2,
            width: 100,
            height: 100
        };
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const colors = [
            'rgb(255, 215, 0)',   // Gold
            'rgb(255, 140, 0)',   // Dark orange
            'rgb(255, 255, 100)', // Light yellow
            'rgb(200, 150, 50)'   // Bronze
        ];
        
        // Create burst of particles
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 3; // Initial upward velocity
            
            const particle = new Particle(
                centerX,
                centerY,
                vx,
                vy,
                colors[Math.floor(Math.random() * colors.length)],
                3 + Math.random() * 4,
                60 + Math.random() * 40
            );
            this.particles.push(particle);
        }
    }
    
    // Create healing particles (gentle upward sparkles)
    createHealEffect(element) {
        const rect = element ? element.getBoundingClientRect() : { 
            left: window.innerWidth / 2, 
            top: window.innerHeight / 2,
            width: 100,
            height: 100
        };
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create gentle healing sparkles
        for (let i = 0; i < 20; i++) {
            const vx = (Math.random() - 0.5) * 2;
            const vy = -1 - Math.random() * 2;
            
            const particle = new Particle(
                centerX + (Math.random() - 0.5) * 60,
                centerY + (Math.random() - 0.5) * 60,
                vx,
                vy,
                'rgb(100, 255, 150)',
                2 + Math.random() * 2,
                50 + Math.random() * 30
            );
            particle.gravity = -0.1; // Float upward
            this.particles.push(particle);
        }
    }
    
    // Create level up effect (radiant burst)
    createLevelUpEffect() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const colors = [
            'rgb(100, 150, 255)',
            'rgb(150, 100, 255)',
            'rgb(255, 100, 255)',
            'rgb(100, 255, 255)'
        ];
        
        // Create multiple waves of particles
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 40; i++) {
                    const angle = (Math.PI * 2 * i) / 40;
                    const speed = 4 + Math.random() * 3;
                    const vx = Math.cos(angle) * speed;
                    const vy = Math.sin(angle) * speed;
                    
                    const particle = new Particle(
                        centerX,
                        centerY,
                        vx,
                        vy,
                        colors[Math.floor(Math.random() * colors.length)],
                        3 + Math.random() * 3,
                        50 + Math.random() * 30
                    );
                    particle.gravity = 0.05;
                    this.particles.push(particle);
                }
            }, wave * 150);
        }
    }
    
    // Create hit/damage effect
    createHitEffect(element) {
        const rect = element ? element.getBoundingClientRect() : { 
            left: window.innerWidth / 2, 
            top: window.innerHeight / 2,
            width: 100,
            height: 100
        };
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create impact particles
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle = new Particle(
                centerX,
                centerY,
                vx,
                vy,
                'rgb(255, 50, 50)',
                3 + Math.random() * 2,
                25 + Math.random() * 15
            );
            this.particles.push(particle);
        }
    }
}

// Create and export singleton instance
export const particleSystem = new ParticleSystem();
