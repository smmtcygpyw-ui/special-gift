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
            this.maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.9;
            this.opacity = 1;
            this.speed = 12;
        }
        update() {
            this.radius += this.speed;
            this.opacity = 1 - (this.radius / this.maxRadius);
            this.speed *= 0.985; 
        }
        draw() {
            tctx.save();
            tctx.strokeStyle = `rgba(226, 192, 116, ${this.opacity * 0.65})`;
            tctx.lineWidth = 5 * (1 - this.radius / this.maxRadius);
            tctx.shadowBlur = 20;
            tctx.shadowColor = "rgba(226, 192, 116, 0.5)";
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
    // CELESTIAL CONVERGENCE INTERACTION ENGINE
    // ==========================================
    const convergenceSystem = document.getElementById("convergenceSystem");
    const nodeA = document.getElementById("nodeA");
    const nodeS = document.getElementById("nodeS");
    const orbitFill = document.getElementById("orbitFill");
    const convergencePrompt = document.getElementById("convergencePrompt");
    const envelopeContainer = document.getElementById("envelopeContainer");

    let isDragging = false;
    let startX = 0;
    let currentLeft = 0;
    let maxDragDistance = 0;

    function initConvergenceMetrics() {
        const systemWidth = convergenceSystem.clientWidth;
        const nodeWidth = nodeA.clientWidth;
        // Total path length between left and right edges minus node sizes
        maxDragDistance = systemWidth - nodeWidth;
    }

    // Initialize metrics on layout
    setTimeout(initConvergenceMetrics, 200);
    window.addEventListener("resize", initConvergenceMetrics);

    function handleDragStart(clientX) {
        if (convergenceSystem.classList.contains("fused")) return;
        isDragging = true;
        startX = clientX - currentLeft;
        playMusic();
        
        // Visual class while dragging
        nodeA.querySelector(".node-core").style.transform = "scale(1.2)";
    }

    function handleDragMove(clientX) {
        if (!isDragging) return;

        let newLeft = clientX - startX;
        
        // Restrict drag strictly to track boundaries
        newLeft = Math.max(0, Math.min(newLeft, maxDragDistance));
        currentLeft = newLeft;

        // Position A Node
        nodeA.style.left = `${currentLeft}px`;

        // Calculate progress percentage
        const progressPercent = (currentLeft / maxDragDistance) * 100;
        orbitFill.style.width = `${progressPercent}%`;

        // Interactive dynamic text feedback
        if (progressPercent > 75) {
            convergencePrompt.textContent = "Almost there... ✧";
        } else if (progressPercent > 35) {
            convergencePrompt.textContent = "Closing the gap... ✦";
        } else {
            convergencePrompt.textContent = "Bridging the distance... ✧";
        }

        // Spray stellar sparks on drag path
        const rect = nodeA.getBoundingClientRect();
        sprayTrail(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Check Convergence point
        if (progressPercent >= 98) {
            triggerConvergence();
        }
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        nodeA.querySelector(".node-core").style.transform = "scale(1)";

        // If not aligned, snap elegant star 'A' smoothly back to home
        if (!convergenceSystem.classList.contains("fused")) {
            nodeA.style.transition = "left 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            orbitFill.style.transition = "width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            
            currentLeft = 0;
            nodeA.style.left = "0px";
            orbitFill.style.width = "0%";
            convergencePrompt.textContent = "Drag A to S to bridge the distance ✧";

            setTimeout(() => {
                nodeA.style.transition = "";
                orbitFill.style.transition = "";
            }, 500);
        }
    }

    function triggerConvergence() {
        isDragging = false;
        convergenceSystem.classList.add("fused");

        const rectS = nodeS.getBoundingClientRect();
        const mergeX = rectS.left + rectS.width / 2;
        const mergeY = rectS.top + rectS.height / 2;

        // Generate spectacular physical shockwave
        shockwaveWaveform = new GoldenShockwave(mergeX, mergeY);

        // Explode beautiful sparks at touchpoint
        for (let i = 0; i < 70; i++) {
            particlesArray.push(new ElegantSpark(mergeX, mergeY, 8));
        }

        // Open Envelope smoothly
        setTimeout(() => {
            envelopeContainer.classList.add("open");
        }, 800);
    }

    // Unified Pointer Events (Highly reliable on mobile and iPad Safari)
    nodeA.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        handleDragStart(e.clientX);
    });

    window.addEventListener("pointermove", (e) => {
        handleDragMove(e.clientX);
    });

    window.addEventListener("pointerup", () => {
        handleDragEnd();
    });

    // Native iOS Safari touch fallbacks
    nodeA.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleDragStart(touch.clientX);
    }, { passive: false });

    window.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        handleDragMove(touch.clientX);
    }, { passive: true });

    window.addEventListener("touchend", () => {
        handleDragEnd();
    });


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
            if (toScene === s2) {
                initConvergenceMetrics(); // Re-measure track bounds when showing
            }
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
        convergenceSystem.classList.remove("fused");
        envelopeContainer.classList.remove("open");
        currentLeft = 0;
        nodeA.style.left = "0px";
        orbitFill.style.width = "0%";
        convergencePrompt.textContent = "Drag A to S to bridge the distance ✧";
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
