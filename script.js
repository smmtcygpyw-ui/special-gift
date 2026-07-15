document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // AUDIO CONTROLLER ENGINE
    // ==========================================
    const audioToggle = document.getElementById("audioToggle");
    const bgMusic = document.getElementById("bgMusic");
    const soundWaves = document.getElementById("sound-waves");
    const audioLabel = audioToggle.querySelector(".audio-label");

    function playMusic() {
        bgMusic.play()
            .then(() => {
                audioToggle.classList.add("playing");
                soundWaves.classList.remove("hidden");
                audioLabel.textContent = "Mute";
            })
            .catch(err => console.log("Audio play blocked by browser:", err));
    }

    function pauseMusic() {
        bgMusic.pause();
        audioToggle.classList.remove("playing");
        soundWaves.classList.add("hidden");
        audioLabel.textContent = "Play Music";
    }

    audioToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });


    // ==========================================
    // AMBIENT GOLD DUST CANVAS SYSTEM
    // ==========================================
    const ambientCanvas = document.getElementById("ambientCanvas");
    const actx = ambientCanvas.getContext("2d");
    let ambientParticles = [];

    function resizeAmbient() {
        ambientCanvas.width = window.innerWidth;
        ambientCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeAmbient);
    resizeAmbient();

    class AmbientDust {
        constructor() {
            this.x = Math.random() * ambientCanvas.width;
            this.y = Math.random() * ambientCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.3 + 0.1);
            this.speedX = Math.random() * 0.2 - 0.1;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.pulse = Math.random() * 0.01 + 0.003;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < -10) {
                this.y = ambientCanvas.height + 10;
                this.x = Math.random() * ambientCanvas.width;
            }
            this.opacity += this.pulse;
            if (this.opacity > 0.6 || this.opacity < 0.1) {
                this.pulse = -this.pulse;
            }
        }
        draw() {
            actx.beginPath();
            actx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            actx.fillStyle = `rgba(226, 192, 116, ${this.opacity})`;
            actx.fill();
        }
    }

    for (let i = 0; i < 40; i++) {
        ambientParticles.push(new AmbientDust());
    }


    // ==========================================
    // INTERACTIVE TOUCH SPARKLE ENGINE (IPAD CHIC)
    // ==========================================
    const trailCanvas = document.getElementById("trailCanvas");
    const tctx = trailCanvas.getContext("2d");
    let sparklesArray = [];

    function resizeTrail() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeTrail);
    resizeTrail();

    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 1.5;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `hsl(${Math.random() * 15 + 35}, 75%, ${Math.random() * 20 + 70}%)`; // Warm glowing gold ranges
            this.opacity = 1;
            this.decay = Math.random() * 0.02 + 0.015;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.decay;
        }
        draw() {
            tctx.save();
            tctx.globalAlpha = this.opacity;
            tctx.shadowBlur = this.size * 2;
            tctx.shadowColor = "rgba(226, 192, 116, 0.8)";
            tctx.beginPath();
            tctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            tctx.fillStyle = this.color;
            tctx.fill();
            tctx.restore();
        }
    }

    // Handles finger movements & mouse sweeps
    function handleDrawSparkles(x, y) {
        for (let i = 0; i < 3; i++) {
            sparklesArray.push(new Sparkle(x, y));
        }
    }

    window.addEventListener("mousemove", (e) => handleDrawSparkles(e.clientX, e.clientY));
    window.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        handleDrawSparkles(touch.clientX, touch.clientY);
    });

    // Render loop processing both particle systems
    function render() {
        // Render Ambient Background Space
        actx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        
        const radialGradient = actx.createRadialGradient(
            ambientCanvas.width / 2, ambientCanvas.height / 2, 50,
            ambientCanvas.width / 2, ambientCanvas.height / 2, ambientCanvas.width
        );
        radialGradient.addColorStop(0, "rgba(10, 6, 26, 0.45)");
        radialGradient.addColorStop(1, "rgba(3, 1, 7, 0.98)");
        actx.fillStyle = radialGradient;
        actx.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);

        ambientParticles.forEach(p => {
            p.update();
            p.draw();
        });

        // Render Touch Sparkles
        tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        sparklesArray.forEach((s, idx) => {
            s.update();
            s.draw();
            if (s.opacity <= 0) {
                sparklesArray.splice(idx, 1);
            }
        });

        requestAnimationFrame(render);
    }
    render();


    // ==========================================
    // WEBSITE FLOW CONTROLLER
    // ==========================================
    const s1 = document.getElementById("scene-1");
    const s2 = document.getElementById("scene-2");
    const s3 = document.getElementById("scene-3");
    const s4 = document.getElementById("scene-4");

    const btnToScene2 = document.getElementById("btn-to-scene2");
    const waxSeal = document.getElementById("waxSeal");
    const envelopeContainer = document.getElementById("envelopeContainer");
    const btnToScene3 = document.getElementById("btn-to-scene3");
    const btnToScene4 = document.getElementById("btn-to-scene4");
    const btnRestart = document.getElementById("btn-restart");

    function switchScene(fromScene, toScene) {
        fromScene.classList.remove("active");
        setTimeout(() => {
            toScene.classList.add("active");
        }, 1400);
    }

    // Step 1: Open Journey
    btnToScene2.addEventListener("click", () => {
        playMusic();
        switchScene(s1, s2);
    });

    // Step 2: Wax Seal Interactive Crack
    let sealBroken = false;
    waxSeal.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!sealBroken) {
            sealBroken = true;
            waxSeal.classList.add("broken");
            playMusic(); // Play/resume backup trigger

            // Spawn a burst of 40 sparkles centered exactly on the broken wax seal
            const rect = waxSeal.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            for (let i = 0; i < 40; i++) {
                sparklesArray.push(new Sparkle(centerX, centerY));
            }

            // Unfold the envelope smoothly after the crack pop
            setTimeout(() => {
                envelopeContainer.classList.add("open");
                document.getElementById("envelopePrompt").style.opacity = "0";
            }, 600);
        }
    });

    // Step 3: Transition to 3D Letter View
    btnToScene3.addEventListener("click", (e) => {
        e.stopPropagation();
        switchScene(s2, s3);
    });

    // Step 4: Continue to Ending
    btnToScene4.addEventListener("click", () => {
        switchScene(s3, s4);
    });

    // Step 5: Reset
    btnRestart.addEventListener("click", () => {
        sealBroken = false;
        waxSeal.classList.remove("broken");
        envelopeContainer.classList.remove("open");
        document.getElementById("envelopePrompt").style.opacity = "0.6";
        switchScene(s4, s1);
    });


    // ==========================================
    // CINEMATIC 3D TILT PARALLAX EFFECT FOR IPAD
    // ==========================================
    const letter3DWrapper = document.getElementById("letter3DWrapper");

    function apply3DTilt(x, y) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        
        // Calculate tilt angles based on position relative to center
        const tiltX = -(y - halfHeight) / 18; // Keep it subtle and professional
        const tiltY = (x - halfWidth) / 18;

        letter3DWrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    // Follow mouse sweeps on desktop browsers
    window.addEventListener("mousemove", (e) => {
        if (s3.classList.contains("active")) {
            apply3DTilt(e.clientX, e.clientY);
        }
    });

    // Follow finger drags across the iPad screen
    window.addEventListener("touchmove", (e) => {
        if (s3.classList.contains("active")) {
            const touch = e.touches[0];
            apply3DTilt(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    // Reset smooth tilt position when finger/mouse leaves
    const resetTilt = () => {
        letter3DWrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
    };
    window.addEventListener("mouseleave", resetTilt);
    window.addEventListener("touchend", resetTilt);
});
