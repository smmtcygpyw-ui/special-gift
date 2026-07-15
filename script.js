document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // AUDIO CONTROLLER ENGINE
    // ==========================================
    const audioToggle = document.getElementById("audioToggle");
    const bgMusic = document.getElementById("bgMusic");
    const speakerPath = document.getElementById("speaker-path");
    const soundWaves = document.getElementById("sound-waves");
    const audioLabel = audioToggle.querySelector(".audio-label");

    let audioAttempted = false;

    // Toggle Audio Control
    audioToggle.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    audioToggle.classList.add("playing");
                    soundWaves.classList.remove("hidden");
                    audioLabel.textContent = "Mute";
                })
                .catch(err => console.log("Audio failed to start:", err));
        } else {
            bgMusic.pause();
            audioToggle.classList.remove("playing");
            soundWaves.classList.add("hidden");
            audioLabel.textContent = "Play Music";
        }
    });

    // Auto-initiate audio on absolute first human physical interaction (clicks / touches)
    const initAudioOnTouch = () => {
        if (!audioAttempted) {
            audioAttempted = true;
            // Play secretly muted or start playing directly
            bgMusic.play()
                .then(() => {
                    audioToggle.classList.add("playing");
                    soundWaves.classList.remove("hidden");
                    audioLabel.textContent = "Mute";
                })
                .catch(() => {
                    // Browsers strictly block if no interaction occurred yet
                    audioAttempted = false; 
                });
            
            // Cleanup listeners
            window.removeEventListener("click", initAudioOnTouch);
            window.removeEventListener("touchstart", initAudioOnTouch);
        }
    };
    
    window.addEventListener("click", initAudioOnTouch);
    window.addEventListener("touchstart", initAudioOnTouch);


    // ==========================================
    // AMBIENT GOLD DUST CANVAS PARTICLE SYSTEM
    // ==========================================
    const canvas = document.getElementById("ambientCanvas");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const maxParticles = 60; // Clean, non-distracting visual limit

    // Handle Resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle Object
    class GoldDust {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height + canvas.height; // Always emerge from bottom
            this.size = Math.random() * 2.5 + 0.5; // Very fine grain
            this.speedY = -(Math.random() * 0.4 + 0.1); // Slow drift
            this.speedX = Math.random() * 0.3 - 0.15; // Soft sway
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.01 + 0.005;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Wrap or recreate when going off-screen
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }

            // Continuous breathing glowing animation
            this.opacity += this.pulseSpeed;
            if (this.opacity > 0.8 || this.opacity < 0.2) {
                this.pulseSpeed = -this.pulseSpeed;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(226, 192, 116, ${this.opacity})`;
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = "rgba(226, 192, 116, 0.4)";
            ctx.fill();
            ctx.shadowBlur = 0; // Reset canvas shadow state
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new GoldDust());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw elegant linear backdrop gradient to bind elements
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 20, 
            canvas.width / 2, canvas.height / 2, canvas.width
        );
        gradient.addColorStop(0, "rgba(11, 7, 30, 0.35)");
        gradient.addColorStop(1, "rgba(4, 2, 9, 0.95)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // ==========================================
    // WEBSITE FLOW CONTROLLER (SCENE TO SCENE)
    // ==========================================
    const s1 = document.getElementById("scene-1");
    const s2 = document.getElementById("scene-2");
    const s3 = document.getElementById("scene-3");
    const s4 = document.getElementById("scene-4");

    const btnToScene2 = document.getElementById("btn-to-scene2");
    const envelopeContainer = document.getElementById("envelopeContainer");
    const btnToScene3 = document.getElementById("btn-to-scene3");
    const btnToScene4 = document.getElementById("btn-to-scene4");
    const btnRestart = document.getElementById("btn-restart");

    // Phase transition wrapper helper
    function switchScene(fromScene, toScene) {
        fromScene.classList.remove("active");
        setTimeout(() => {
            toScene.classList.add("active");
        }, 1200); // Perfect sync delay to allow previous screen fade out smoothly
    }

    // Step 1: Click "Open Your Surprise" -> Scene 2
    btnToScene2.addEventListener("click", () => {
        switchScene(s1, s2);
    });

    // Step 2: Click/Tap Envelope -> Triggers Open Animation
    let envelopeOpened = false;
    envelopeContainer.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid event collision on target
        if (!envelopeOpened) {
            envelopeContainer.classList.add("open");
            document.getElementById("envelopePrompt").style.opacity = "0";
            envelopeOpened = true;
        }
    });

    // Step 3: Click "Read the Letter" -> Scene 3
    btnToScene3.addEventListener("click", (e) => {
        e.stopPropagation(); // Stop bubble up events
        switchScene(s2, s3);
    });

    // Step 4: Click "Continue" -> Scene 4 (Emotional Ending)
    btnToScene4.addEventListener("click", () => {
        switchScene(s3, s4);
    });

    // Step 5: Click "Replay the experience" -> Soft Reset
    btnRestart.addEventListener("click", () => {
        // Reset states
        envelopeContainer.classList.remove("open");
        envelopeOpened = false;
        document.getElementById("envelopePrompt").style.opacity = "0.6";
        
        switchScene(s4, s1);
    });
});
