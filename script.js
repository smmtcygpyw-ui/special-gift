document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // AUDIO ORB ENGINE
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
                audioLabel.textContent = "Sound On";
            })
            .catch(err => console.log("Engine blocked audio:", err));
    }

    function pauseMusic() {
        bgMusic.pause();
        audioToggle.classList.remove("playing");
        soundWaves.classList.add("hidden");
        audioLabel.textContent = "Sound Off";
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
    // AMBIENT HEARTBEAT GRAPHICS SYSTEM
    // ==========================================
    const ambientCanvas = document.getElementById("ambientCanvas");
    const actx = ambientCanvas.getContext("2d");
    let ambientParticles = [];
    let pulseProgress = 0;

    function resizeAmbient() {
        ambientCanvas.width = window.innerWidth;
        ambientCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeAmbient);
    resizeAmbient();

    class CosmicPulseStar {
        constructor() {
            this.reset();
            this.y = Math.random() * ambientCanvas.height;
        }
        reset() {
            this.x = Math.random() * ambientCanvas.width;
            this.y = ambientCanvas.height + 10;
            this.size = Math.random() * 2 + 0.5;
            this.baseSpeed = Math.random() * 0.2 + 0.08;
            this.speedX = Math.random() * 0.1 - 0.05;
            this.baseOpacity = Math.random() * 0.45 + 0.15;
            this.opacity = this.baseOpacity;
        }
        update(pulseFactor) {
            // Stars flow upwards but pulse size & speed with the heartbeat
            this.y -= this.baseSpeed * (1 + pulseFactor * 0.4);
            this.x += this.speedX;
            this.opacity = this.baseOpacity * (1 + pulseFactor * 0.35);

            if (this.y < -10) this.reset();
        }
        draw() {
            actx.beginPath();
            actx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            actx.fillStyle = `rgba(226, 192, 116, ${this.opacity})`;
            actx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        ambientParticles.push(new CosmicPulseStar());
    }


    // ==========================================
    // TRAIL & SHOCKWAVE GRAPHICS SYSTEM (TOUCH EXPLOSION)
    // ==========================================
    const trailCanvas = document.getElementById("trailCanvas");
    const tctx = trailCanvas.getContext("2d");
    let particlesArray = [];
    let shockwaveWaveform = null;

    function resizeTrail() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeTrail);
    resizeTrail();

    // High fidelity Gold Sparkle Spark
    class ElegantSpark {
        constructor(x, y, power) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4.5 + 1.5;
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * power + 0.5;
            this.speedX = Math.cos(angle) * force;
            this.speedY = Math.sin(angle) * force;
            this.color = `hsl(${Math.random() * 12 + 38}, 85%, ${Math.random() * 20 + 70}%)`;
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.01;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.decay;
        }
        draw() {
            tctx.save();
            tctx.globalAlpha = this.opacity;
            tctx.shadowBlur = this.size * 3;
            tctx.shadowColor = "rgba(226, 192, 116, 0.6)";
            tctx.beginPath();
            tctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            tctx.fillStyle = this.color;
            tctx.fill();
            tctx.restore();
        }
    }

    // Shockwave Ripple class for when wax seal cracks
    class GoldenShockwave {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8;
            this.opacity = 1;
            this.speed = 10;
        }
        update() {
            this.radius += this.speed;
            this.opacity = 1 - (this.radius / this.maxRadius);
            this.speed *= 0.98; // Natural expansion friction
        }
        draw() {
            tctx.save();
            tctx.strokeStyle = `rgba(226, 192, 116, ${this.opacity * 0.55})`;
            tctx.lineWidth = 4 * (1 - this.radius / this.maxRadius);
            tctx.shadowBlur = 15;
            tctx.shadowColor = "rgba(226, 192, 116, 0.4)";
            tctx.beginPath();
            tctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            tctx.stroke();
            tctx.restore();
        }
    }

    // Touch handlers to spray spark trail
    function sprayTrail(x, y) {
        for (let i = 0; i < 3; i++) {
            particlesArray.push(new ElegantSpark(x, y, 1.8));
        }
    }

    window.addEventListener("mousemove", (e) => sprayTrail(e.clientX, e.clientY));
    window.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        sprayTrail(touch.clientX, touch.clientY);
    });

    // Dynamic Render Engine Processing Loop
    function render() {
        // Calculate the Slow Rhythmic Heartbeat pulse
        pulseProgress += 0.015;
        // Simulates human sinus rhythm heartbeat mapping (fast thump, slower recovery)
        const heartbeatFactor = Math.abs(Math.sin(pulseProgress) * Math.sin(pulseProgress * 0.5));

        // Clear Ambient Layer
        actx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        
        // Deep Ambient Radial Gold Vignette
        const radialVignette = actx.createRadialGradient(
            ambientCanvas.width / 2, ambientCanvas.height / 2, 40,
            ambientCanvas.width / 2, ambientCanvas.height / 2, ambientCanvas.width
        );
        radialVignette.addColorStop(0, `rgba(12, 6, 28, ${0.4 + heartbeatFactor * 0.08})`);
        radialVignette.addColorStop(1, "rgba(2, 0, 5, 0.99)");
        actx.fillStyle = radialVignette;
        actx.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);

        // Update background dust particles in sync with the pulse
        ambientParticles.forEach(p => {
            p.update(heartbeatFactor);
            p.draw();
        });

        // Clear Interaction Overlays
        tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        // Update shockwaves
        if (shockwaveWaveform) {
            shockwaveWaveform.update();
            shockwaveWaveform.draw();
            if (shockwaveWaveform.radius >= shockwaveWaveform.maxRadius) {
                shockwaveWaveform = null;
            }
        }

        // Update sparkles
        particlesArray.forEach((s, idx) => {
            s.update();
            s.draw();
            if (s.opacity <= 0) {
                particlesArray.splice(idx, 1);
            }
        });

        requestAnimationFrame(render);
    }
    render();


    // ==========================================
    // INTERACTIVE SILK RIBBON SWIPE-TO-CUT
    // ==========================================
    const ribbonSystem = document.getElementById("ribbonSystem");
    let isSwiping = false;

    function handleSwipeCut(clientX, clientY) {
        if (ribbonSystem.classList.contains("sliced")) return;

        const rect = ribbonSystem.getBoundingClientRect();
        // Check if touch/drag is moving over the vertical middle golden split
        const ribbonMidX = rect.left + rect.width / 2;
        if (Math.abs(clientX - ribbonMidX) < 35) {
            triggerRibbonSlice(clientX, clientY);
        }
    }

    function triggerRibbonSlice(x, y) {
        ribbonSystem.classList.add("sliced");
        playMusic(); // Direct trigger starting background music seamlessly

        // Explode sparks along the cut axis
        for (let i = 0; i < 45; i++) {
            particlesArray.push(new ElegantSpark(x, y, 4.5));
        }

        // Unlock the A + S Monogram Seal now that ribbon is destroyed
        setTimeout(() => {
            document.getElementById("waxSeal").classList.add("unlocked");
        }, 300);
    }

    // Capture dragging fingers on tablet screen
    ribbonSystem.addEventListener("touchstart", () => { isSwiping = true; });
    ribbonSystem.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        const touch = e.touches[0];
        handleSwipeCut(touch.clientX, touch.clientY);
    });
    ribbonSystem.addEventListener("touchend", () => { isSwiping = false; });

    // Fallback click helper to slice ribbon smoothly
    ribbonSystem.addEventListener("click", (e) => {
        triggerRibbonSlice(e.clientX, e.clientY);
    });


    // ==========================================
    // SCENE TRANSITIONS
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
        }, 1600);
    }

    btnToScene2.addEventListener("click", () => {
        playMusic();
        switchScene(s1, s2);
    });

    // Step 3: Interactive Monogram Seal Break & Shockwave
    waxSeal.addEventListener("click", (e) => {
        e.stopPropagation();
        if (waxSeal.classList.contains("unlocked") && !waxSeal.classList.contains("shattered")) {
            waxSeal.classList.add("shattered");

            const rect = waxSeal.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Trigger physical Golden Ring wave shockwave
            shockwaveWaveform = new GoldenShockwave(centerX, centerY);

            // Explode intense fireworks of stars
            for (let i = 0; i < 50; i++) {
                particlesArray.push(new ElegantSpark(centerX, centerY, 6));
            }

            // Open Envelope flaps
            setTimeout(() => {
                envelopeContainer.classList.add("open");
                document.getElementById("envelopePrompt").style.opacity = "0";
            }, 700);
        }
    });

    btnToScene3.addEventListener("click", (e) => {
        e.stopPropagation();
        switchScene(s2, s3);
    });

    btnToScene4.addEventListener("click", () => {
        switchScene(s3, s4);
    });

    // Complete Reset
    btnRestart.addEventListener("click", () => {
        waxSeal.classList.remove("shattered", "unlocked");
        envelopeContainer.classList.remove("open");
        ribbonSystem.classList.remove("sliced");
        document.getElementById("envelopePrompt").style.opacity = "0.6";
        switchScene(s4, s1);
    });


    // ==========================================
    // CINEMATIC 3D PARALLAX LETTER SCENE (IPAD)
    // ==========================================
    const letter3DWrapper = document.getElementById("letter3DWrapper");

    function apply3DTilt(x, y) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        
        // Exquisite smooth tilt angles on dragging axes
        const tiltX = -(y - halfHeight) / 22;
        const tiltY = (x - halfWidth) / 22;

        letter3DWrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    window.addEventListener("mousemove", (e) => {
        if (s3.classList.contains("active")) {
            apply3DTilt(e.clientX, e.clientY);
        }
    });

    window.addEventListener("touchmove", (e) => {
        if (s3.classList.contains("active")) {
            const touch = e.touches[0];
            apply3DTilt(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    const resetTilt = () => {
        letter3DWrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
    };
    window.addEventListener("mouseleave", resetTilt);
    window.addEventListener("touchend", resetTilt);
});
