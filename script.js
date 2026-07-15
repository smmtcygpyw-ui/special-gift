document.addEventListener("DOMContentLoaded", () => {
    
    const audioToggle = document.getElementById("audioToggle");
    const bgMusic = document.getElementById("bgMusic");
    const soundWaves = document.getElementById("sound-waves");
    const audioLabel = audioToggle.querySelector(".audio-label");

    // Helper function to play music safely (Safari-friendly)
    function playMusic() {
        bgMusic.play()
            .then(() => {
                audioToggle.classList.add("playing");
                soundWaves.classList.remove("hidden");
                audioLabel.textContent = "Mute";
            })
            .catch(err => {
                console.log("Playback failed/blocked by browser:", err);
            });
    }

    // Helper function to pause music
    function pauseMusic() {
        bgMusic.pause();
        audioToggle.classList.remove("playing");
        soundWaves.classList.add("hidden");
        audioLabel.textContent = "Play Music";
    }

    // 1. Explicit Toggle Button Click
    audioToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

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

    function switchScene(fromScene, toScene) {
        fromScene.classList.remove("active");
        setTimeout(() => {
            toScene.classList.add("active");
        }, 1200);
    }

    // Step 1: Click "Open Your Surprise" -> Scene 2
    // Music is directly triggered here. Safari allows this because it is a direct user click!
    btnToScene2.addEventListener("click", () => {
        playMusic();
        switchScene(s1, s2);
    });

    // Step 2: Click/Tap Envelope
    let envelopeOpened = false;
    envelopeContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        playMusic(); // Secondary backup trigger
        if (!envelopeOpened) {
            envelopeContainer.classList.add("open");
            document.getElementById("envelopePrompt").style.opacity = "0";
            envelopeOpened = true;
        }
    });

    // Step 3: Click "Read the Letter" -> Scene 3
    btnToScene3.addEventListener("click", (e) => {
        e.stopPropagation();
        playMusic(); // Another helper to make sure music keeps playing
        switchScene(s2, s3);
    });

    // Step 4: Click "Continue" -> Scene 4
    btnToScene4.addEventListener("click", () => {
        switchScene(s3, s4);
    });

    // Step 5: Click "Replay the experience"
    btnRestart.addEventListener("click", () => {
        envelopeContainer.classList.remove("open");
        envelopeOpened = false;
        document.getElementById("envelopePrompt").style.opacity = "0.6";
        switchScene(s4, s1);
    });

    // ==========================================
    // AMBIENT GOLD DUST CANVAS PARTICLE SYSTEM
    // ==========================================
    const canvas = document.getElementById("ambientCanvas");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const maxParticles = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class GoldDust {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height + canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.speedX = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.01 + 0.005;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }

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
            ctx.shadowBlur = 0;
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
});
