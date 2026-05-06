// 3D Loading Animation - Using same design as main page
(function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'loading-3d-canvas';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1';
    
    const blobs = loadingScreen.querySelector('.ll-blobs');
    if (blobs?.nextElementSibling) {
        loadingScreen.insertBefore(canvas, blobs.nextElementSibling);
    } else {
        loadingScreen.insertBefore(canvas, loadingScreen.firstChild);
    }
    
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function generateParticles() {
        particles = [];
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 100,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2.5 + 1,
                baseOpacity: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    function update() {
        particles.forEach(particle => {
            // Apply damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            particle.vz *= 0.99;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            
            // Add drift for organic motion
            particle.vx += (Math.random() - 0.5) * 0.02;
            particle.vy += (Math.random() - 0.5) * 0.02;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Wrap z depth
            if (particle.z < 0) particle.z = 100;
            if (particle.z > 100) particle.z = 0;
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dark mode colors (bright tech colors)
        const colors = ['#0066ff', '#00d4ff', '#7000ff', '#00b4ff'];
        const baseOpacity = 0.8;
        
        particles.forEach(particle => {
            // Depth-based scaling (parallax effect)
            const scale = (particle.z / 100) * 0.6 + 0.4;
            const displaySize = particle.size * scale;
            const opacity = particle.baseOpacity * baseOpacity;
            
            // Color based on z depth
            const colorIndex = Math.floor((particle.z / 100) * colors.length);
            ctx.fillStyle = colors[Math.min(colorIndex, colors.length - 1)];
            ctx.globalAlpha = opacity;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, displaySize, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect for frontmost particles
            if (particle.z > 70) {
                ctx.strokeStyle = colors[Math.min(colorIndex, colors.length - 1)];
                ctx.globalAlpha = opacity * 0.4;
                ctx.lineWidth = displaySize * 0.5;
                ctx.stroke();
            }
        });
        
        ctx.globalAlpha = 1;
    }
    
    function animate() {
        update();
        draw();
        animationId = requestAnimationFrame(animate);
    }
    
    resize();
    generateParticles();
    window.addEventListener('resize', resize);
    animate();
    
    window.loadingAnimationCleanup = function() {
        if (animationId) cancelAnimationFrame(animationId);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
})();
