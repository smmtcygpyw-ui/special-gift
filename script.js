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
    // TRAIL & SHOCKWAVE GRAPHICS SYSTEM
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
            this.speed *= 0.98; 
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

    function render() {
        pulseProgress += 0.015;
        const heartbeatFactor = Math.abs(Math.sin(pulseProgress) * Math.sin(pulseProgress * 0.5));

        actx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        
        const radialVignette = actx.createRadialGradient(
            ambientCanvas.width / 2, ambientCanvas.height / 2, 40,
            ambientCanvas.width / 2, ambientCanvas.height / 2, ambientCanvas.width
        );
        radialVignette.addColorStop(0, `rgba(12, 6, 28, ${0.4 + heartbeatFactor * 0.08})`);
        radialVignette.addColorStop(1, "rgba(2, 0, 5, 0.99)");
        actx.fillStyle = radialVignette;
        actx.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);

        ambientParticles.forEach(p => {
            p.update(heartbeatFactor);
            p.draw();
        });

        tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        if (shockwaveWaveform) {
            shockwaveWaveform.update();
            shockwaveWaveform.draw();
            if (shockwaveWaveform.radius >= shockwaveWaveform.maxRadius) {
                shockwaveWaveform = null;
            }
        }

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
    // BULLETPROOF SILK RIBBON SWIPE INTERACTION
    // ==========================================
    const ribbonSystem = document.getElementById("ribbonSystem");
    let isSwiping = false;
    let lastX = null;

    function handleSwipeCut(clientX, clientY) {
        if (ribbonSystem.classList.contains("sliced")) return;

        const rect = ribbonSystem.getBoundingClientRect();
        const ribbonMidX = rect.left + rect.width / 2;

        if (lastX !== null) {
            if ((lastX < ribbonMidX && clientX >= ribbonMidX) || (lastX > ribbonMidX && clientX <= ribbonMidX)) {
                triggerRibbonSlice(clientX, clientY);
            }
        }
        lastX = clientX;
    }

    function triggerRibbonSlice(x, y) {
        ribbonSystem.classList.add("sliced");
        playMusic(); 

        for (let i = 0; i < 40; i++) {
            particlesArray.push(new ElegantSpark(x, y, 4.5));
        }

        // Reveal the Touchstone alignment seal
        setTimeout(() => {
            const waxSeal = document.getElementById("waxSeal");
            waxSeal.classList.add("unlocked");
        }, 500);
    }

    // Touch event binders for iPad
    ribbonSystem.addEventListener("touchstart", (e) => {
        isSwiping = true;
        const touch = e.touches[0];
        lastX = touch.clientX;
    }, { passive: false });

    ribbonSystem.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        e.preventDefault(); 
        const touch = e.touches[0];
        handleSwipeCut(touch.clientX, touch.clientY);
    }, { passive: false });

    ribbonSystem.addEventListener("touchend", () => { isSwiping = false; });

    // Desktop/Mouse dragging fallback
    ribbonSystem.addEventListener("mouseenter", (e) => {
        lastX = e.clientX;
    });
    ribbonSystem.addEventListener("mousemove", (e) => {
        handleSwipeCut(e.clientX, e.clientY);
    });
    ribbonSystem.addEventListener("click", (e) => {
        triggerRibbonSlice(e.clientX, e.clientY);
    });


    // ==========================================
    // "THE ALIGNMENT" TOUCHSTONE SEAL ENGINE
    // ==========================================
    const waxSeal = document.getElementById("waxSeal");
    const progressCircle = document.getElementById("sealProgressCircle");
    const sealHoldPrompt = document.getElementById("sealHoldPrompt");
    
    let holdInterval = null;
    let holdProgress = 0; // Ranges 0 to 100%
    const holdRequiredTime = 1200; // 1.2s total holding requirement
    const maxOffsetValue = 283; // SVG stroke circumference mapping

    function startAlignment(e) {
        // Prevent default actions to stop Safari selection menu and context lists from popping up
        if (e) e.preventDefault();
        
        if (!waxSeal.classList.contains("unlocked") || waxSeal.classList.contains("shattered")) return;

        waxSeal.classList.add("pressing");
        sealHoldPrompt.textContent = "Pausing time...";

        const startTimestamp = Date.now();

        holdInterval = setInterval(() => {
            const timePassed = Date.now() - startTimestamp;
            holdProgress = Math.min((timePassed / holdRequiredTime) * 100, 100);

            // Dynamically draw the SVG orbital path
            const dynamicOffset = maxOffsetValue - (holdProgress / 100) * maxOffsetValue;
            progressCircle.style.strokeDashoffset = dynamicOffset;

            // Continual sparkle cascade directly below seal while pressing
            const rect = waxSeal.getBoundingClientRect();
            sprayTrail(
                rect.left + rect.width / 2 + (Math.random() * 30 - 15), 
                rect.top + rect.height / 2 + (Math.random() * 30 - 15)
            );

            if (holdProgress >= 100) {
                executeCosmicAlignment();
            }
        }, 16);
    }

    function breakAlignment() {
        if (waxSeal.classList.contains("shattered")) return;
        
        clearInterval(holdInterval);
        holdProgress = 0;
        progressCircle.style.strokeDashoffset = maxOffsetValue;
        waxSeal.classList.remove("pressing");
        sealHoldPrompt.textContent = "Touch & hold to align the stars ✧";
    }

    function executeCosmicAlignment() {
        clearInterval(holdInterval);
        waxSeal.classList.remove("pressing");
        waxSeal.classList.add("shattered");

        const rect = waxSeal.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Generate planetary scale expanding wave circle
        shockwaveWaveform = new GoldenShockwave(centerX, centerY);

        // Huge radial dynamic emission of star pieces
        for (let i = 0; i < 70; i++) {
            particlesArray.push(new ElegantSpark(centerX, centerY, 8));
        }

        // Part flaps smoothly
        setTimeout(() => {
            envelopeContainer.classList.add("open");
        }, 800);
    }

    // iPad / Mobile pointer triggers (Rock Solid Support on iOS Safari)
    waxSeal.addEventListener("pointerdown", startAlignment);
    window.addEventListener("pointerup", breakAlignment);
    waxSeal.addEventListener("pointercancel", breakAlignment);
    waxSeal.addEventListener("pointerleave", breakAlignment);

    // Standard touch backup fallback
    waxSeal.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startAlignment();
    }, { passive: false });
    waxSeal.addEventListener("touchend", breakAlignment);


    // ==========================================
    // SCENE TRANSITIONS
    // ==========================================
    const s1 = document.getElementById("scene-1");
    const s2 = document.getElementById("scene-2");
    const s3 = document.getElementById("scene-3");
    const s4 = document.getElementById("scene-4");

    const btnToScene2 = document.getElementById("btn-to-scene2");
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

    btnToScene3.addEventListener("click", (e) => {
        e.stopPropagation();
        switchScene(s2, s3);
    });

    btnToScene4.addEventListener("click", () => {
        switchScene(s3, s4);
    });

    btnRestart.addEventListener("click", () => {
        waxSeal.classList.remove("shattered", "unlocked");
        envelopeContainer.classList.remove("open");
        ribbonSystem.classList.remove("sliced");
        progressCircle.style.strokeDashoffset = maxOffsetValue;
        sealHoldPrompt.textContent = "Touch & hold to align the stars ✧";
        switchScene(s4, s1);
    });


    // ==========================================
    // CINEMATIC 3D PARALLAX LETTER SCENE (IPAD)
    // ==========================================
    const letter3DWrapper = document.getElementById("letter3DWrapper");

    function apply3DTilt(x, y) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        
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
