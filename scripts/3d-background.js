// ===================================
// 3D PARTICLE BACKGROUND SYSTEM
// Animated floating particles with theme support
// ===================================

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.particleCount = 80;
        this.animationId = null;
        this.isInitialized = false;
        this.firstFrameDrawn = false;
        
        // Initialize
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        // Set canvas size
        this.resizeCanvas();
        
        // Generate particles
        this.generateParticles();
        
        // Start animation loop
        this.animate();
        this.isInitialized = true;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Adjust particle count based on viewport size
        const area = this.canvas.width * this.canvas.height;
        this.particleCount = Math.max(40, Math.min(120, Math.floor(area / 15000)));
        
        // Regenerate particles if resizing significantly changes count
        if (this.particles.length > this.particleCount + 10) {
            this.particles = this.particles.slice(0, this.particleCount);
        } else if (this.particles.length < this.particleCount - 10 && this.isInitialized) {
            this.generateParticles();
        }
    }
    
    generateParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 100,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2.5 + 1,
                baseOpacity: Math.random() * 0.5 + 0.5,
                attractToMouse: Math.random() > 0.7 // 30% of particles attracted to mouse
            });
        }
    }
    
    getThemeColors() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const computedStyle = getComputedStyle(document.documentElement);
        
        if (isDarkMode) {
            // Dark mode: bright tech colors
            return {
                colors: ['#0066ff', '#00d4ff', '#7000ff', '#00b4ff'],
                opacity: 0.8
            };
        } else {
            // Light mode: deeper blues for better visibility
            return {
                colors: ['#1D4ED8', '#0284c7', '#0369a1', '#2563EB'],
                opacity: 0.7
            };
        }
    }
    
    update() {
        for (let particle of this.particles) {
            // Mouse attraction (gentle pull)
            if (particle.attractToMouse) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200 * 0.02;
                    particle.vx += (dx / distance) * force;
                    particle.vy += (dy / distance) * force;
                }
            }
            
            // Apply damping (slow down slightly)
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            particle.vz *= 0.99;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            
            // Add slight drift/noise for organic motion
            particle.vx += (Math.random() - 0.5) * 0.02;
            particle.vy += (Math.random() - 0.5) * 0.02;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Wrap z depth
            if (particle.z < 0) particle.z = 100;
            if (particle.z > 100) particle.z = 0;
        }
    }
    
    draw() {
        // Clear canvas (transparent - don't fill with background color)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const colors = this.getThemeColors().colors;
        const baseOpacity = this.getThemeColors().opacity;
        
        // Draw particles with depth-based scaling
        for (let particle of this.particles) {
            // Depth affects size and opacity (parallax effect)
            const scale = (particle.z / 100) * 0.6 + 0.4; // Range: 0.4 to 1.0
            const displaySize = particle.size * scale;
            const opacity = particle.baseOpacity * baseOpacity;
            
            // Get color based on z depth
            const colorIndex = Math.floor((particle.z / 100) * colors.length);
            this.ctx.fillStyle = colors[Math.min(colorIndex, colors.length - 1)];
            this.ctx.globalAlpha = opacity;
            
            // Draw particle as soft circle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, displaySize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Optional: add glow effect for frontmost particles
            if (particle.z > 70) {
                this.ctx.strokeStyle = colors[Math.min(colorIndex, colors.length - 1)];
                this.ctx.globalAlpha = opacity * 0.4;
                this.ctx.lineWidth = displaySize * 0.5;
                this.ctx.stroke();
            }
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Update colors when theme changes (listen for toggle button clicks)
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // Re-trigger draw with new colors on next frame
                // (colors are fetched dynamically in getThemeColors())
            });
        }
    }
    
    updateColors() {
        // Force color update (called externally when theme changes)
        // Colors are already dynamic via getThemeColors()
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
}

// Initialize particle background when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const particleBackground = new ParticleBackground('particleCanvas');
    
    // Optionally expose to window for debugging
    window.particleBackground = particleBackground;
});
