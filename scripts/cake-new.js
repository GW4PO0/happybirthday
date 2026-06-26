const introSection = document.getElementById('introSection');
const mainContainer = document.getElementById('mainContainer');
const introLabel = document.getElementById('introLabel');
const micBtn = document.getElementById('micPermissionBtn');
let micPermissionGranted = false;

// Hide intro and show main content
function hideIntro() {
    introSection.classList.add('hidden');
    setTimeout(() => {
        introSection.style.display = 'none';
        mainContainer.style.display = 'flex';
    }, 800);
}

// Handle microphone permission
async function requestMicrophonePermission() {
    // If already granted, just proceed
    if (micPermissionGranted) {
        hideIntro();
        return;
    }
    
    try {
        // Show loading state
        micBtn.classList.add('loading');
        micBtn.textContent = 'Requesting...';
        introLabel.style.color = '#ffffff'; // Reset color
        
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Success - close the stream immediately since we only need permission
        stream.getTracks().forEach(track => track.stop());
        
        // Update UI for success
        micBtn.classList.remove('loading');
        micBtn.classList.add('success');
        micBtn.textContent = '✅ Done';
        introLabel.textContent = '✅ You are now good to proceed!';
        introLabel.classList.add('success');
        introLabel.style.color = '#4ade80';
        micPermissionGranted = true;
        
        // Hide intro after 1.5 seconds
        setTimeout(() => {
            hideIntro();
        }, 1500);
        
    } catch (err) {
        console.error('Microphone permission error:', err);
        
        // Handle different error types
        let errorMessage = '❌ Microphone access is required.';
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = '❌ Microphone access was denied. Please allow microphone access in your browser settings and try again.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage = '❌ No microphone found. Please connect a microphone and try again.';
        } else if (err.name === 'NotReadableError') {
            errorMessage = '❌ Could not access microphone. Please check if it\'s being used by another app.';
        }
        
        // Reset button state
        micBtn.classList.remove('loading');
        micBtn.textContent = '🎤 Try Again';
        micBtn.classList.remove('success');
        introLabel.textContent = errorMessage;
        introLabel.style.color = '#f87171';
        introLabel.classList.remove('success');
        
        // Reset permission flag
        micPermissionGranted = false;
    }
}

// Event listener for microphone button - allows multiple attempts
micBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Always try to request permission, even if previously failed
    requestMicrophonePermission();
});

// Also allow clicking the intro label to trigger permission
introLabel.addEventListener('click', function(e) {
    e.preventDefault();
    if (!micPermissionGranted) {
        requestMicrophonePermission();
    }
});

// Add keyboard support (Enter/Space on button)
micBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        requestMicrophonePermission();
    }
});

const candle = document.querySelector('.candle');
const candleHolder = document.querySelector('.candle-holder');
const candleStage = document.querySelector('.candle-stage');
const cake = document.querySelector('.cake');
const happyBirthday = document.querySelector('.happy-birthday');
const fire = document.querySelector('.fire');
const giftInvitation = document.querySelector('.gift-invitation-container');
const yesBtn = document.querySelector('.yes');
const noBtn = document.querySelector('.no');
const body = document.body;
const instructionMessage = document.getElementById('instructionMessage');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let musicPlayed = false;
let userInteracted = false;
let fireworksActive = false;
let fireworkAnimId = null;
let particles = [];
let canvas, ctx;

// --- Fireworks Setup ---
function initFireworks() {
    canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color || `hsl(${Math.random() * 360}, 80%, 60%)`;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 1;
        this.alpha = 1;
        this.decay = Math.random() * 0.01 + 0.004;
        this.size = Math.random() * 5 + 2;
        this.gravity = 0.05;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createExplosion(x, y) {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#ff9f43', '#00d2d3'];
    for (let i = 0; i < 70; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

function animateFireworks() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha > 0) alive = true;
        else particles.splice(i, 1);
    }
    if (Math.random() < 0.04 && fireworksActive) {
        const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
        const y = Math.random() * canvas.height * 0.4 + 30;
        createExplosion(x, y);
    }
    if (fireworksActive || particles.length > 0) {
        fireworkAnimId = requestAnimationFrame(animateFireworks);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function startFireworks() {
    if (fireworksActive) return;
    fireworksActive = true;
    particles = [];
    if (!canvas) initFireworks();
    if (fireworkAnimId) cancelAnimationFrame(fireworkAnimId);
    animateFireworks();
    setTimeout(() => {
        if (canvas) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
                    const y = Math.random() * canvas.height * 0.4 + 30;
                    createExplosion(x, y);
                }, i * 200);
            }
        }
    }, 300);
}

function stopFireworks() {
    fireworksActive = false;
    if (fireworkAnimId) {
        cancelAnimationFrame(fireworkAnimId);
        fireworkAnimId = null;
    }
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
}

// --- Dark Mode + Fireworks ---
function setDarkModeAndFireworks(enable) {
    if (enable) {
        body.classList.add('dark-mode');
        if (!fireworksActive) startFireworks();
    } else {
        body.classList.remove('dark-mode');
        stopFireworks();
    }
}

// --- Play Music ---
function playHappyMusic() {
    const music = document.querySelector('.js-happy-music');
    music.currentTime = 0;
    music.src = 'audio/Happy.mp3';
    music.load();
    
    function attemptPlay() {
        if (!userInteracted) {
            document.addEventListener('touchstart', function playOnTouch() {
                music.play().catch(e => console.log('Play failed:', e));
                document.removeEventListener('touchstart', playOnTouch);
            }, { once: true });
            document.addEventListener('click', function playOnClick() {
                music.play().catch(e => console.log('Play failed:', e));
                document.removeEventListener('click', playOnClick);
            }, { once: true });
            return;
        }
        music.play()
            .then(() => {
                console.log('Music playing');
                setDarkModeAndFireworks(true);
            })
            .catch(error => {
                console.error('Play failed:', error);
            });
    }
    music.addEventListener('canplaythrough', attemptPlay, { once: true });
    setTimeout(attemptPlay, 1000);
    
    music.addEventListener('ended', function() {
        console.log('Music ended, stopping fireworks');
        stopFireworks();
    });
}

// --- User Interaction Tracking ---
document.addEventListener('touchstart', function() { userInteracted = true; }, { once: true, passive: true });
document.addEventListener('click', function() { userInteracted = true; }, { once: true, passive: true });
candle.addEventListener('touchstart', function() { userInteracted = true; }, { once: true, passive: true });
candle.addEventListener('click', function() { userInteracted = true; }, { once: true, passive: true });

// --- Touch Drag Events ---
candle.addEventListener('touchstart', function(e) {
    if (candle.parentElement === candleStage) return;
    const touch = e.touches[0];
    const rect = candle.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    isDragging = true;
    candle.style.position = 'fixed';
    candle.style.zIndex = '1000';
    candle.style.opacity = '0.8';
    candle.style.pointerEvents = 'none';
    candle.style.width = rect.width + 'px';
    candle.style.height = rect.height + 'px';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });

candle.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    candle.style.left = (touch.clientX - offsetX) + 'px';
    candle.style.top = (touch.clientY - offsetY) + 'px';
}, { passive: false });

candle.addEventListener('touchend', function(e) {
    if (!isDragging) { 
        candle.style.opacity = '1';
        candle.style.pointerEvents = 'auto';
        candle.style.position = '';
        candle.style.zIndex = '';
        candle.style.left = '';
        candle.style.top = '';
        candle.style.width = '';
        candle.style.height = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        return; 
    }
    isDragging = false;
    
    const touch = e.changedTouches[0];
    const stageRect = candleStage.getBoundingClientRect();
    
    if (touch.clientX >= stageRect.left && touch.clientX <= stageRect.right &&
        touch.clientY >= stageRect.top && touch.clientY <= stageRect.bottom) {
        if (candle.parentElement === candleHolder && !musicPlayed) {
            candle.style.opacity = '1';
            candle.style.pointerEvents = 'auto';
            candle.style.position = '';
            candle.style.zIndex = '';
            candle.style.left = '';
            candle.style.top = '';
            candle.style.width = '';
            candle.style.height = '';
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            placeCandleOnCake();
        }
    } else {
        candle.style.opacity = '1';
        candle.style.pointerEvents = 'auto';
        candle.style.position = '';
        candle.style.zIndex = '';
        candle.style.left = '';
        candle.style.top = '';
        candle.style.width = '';
        candle.style.height = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }
    e.preventDefault();
}, { passive: false });

// --- Desktop Drag Events ---
candle.addEventListener('dragstart', function(e) {
    if (candle.parentElement === candleStage) {
        e.preventDefault();
        return false;
    }
    e.dataTransfer.setData('text/plain', 'candle');
});

candleStage.addEventListener('dragover', function(e) {
    e.preventDefault();
});

candleStage.addEventListener('drop', function(e) {
    e.preventDefault();
    if (candle.parentElement === candleHolder && !musicPlayed) {
        placeCandleOnCake();
    }
});

// --- Transition Helpers ---
function smoothTextChange(element, newText, duration = 500) {
    return new Promise((resolve) => {
        element.style.transition = `opacity ${duration/2}ms ease, transform ${duration/2}ms ease`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            setTimeout(resolve, duration/2);
        }, duration/2);
    });
}

// --- Place Candle on Cake ---
async function placeCandleOnCake() {
    candleHolder.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    candleHolder.style.opacity = '0';
    candleHolder.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        candleStage.appendChild(candle);
        candle.draggable = false;
        candle.style.position = 'relative';
        candle.style.left = '0';
        candle.style.top = '0';
        candle.style.width = '';
        candle.style.height = '';
        candle.style.opacity = '1';
        candle.style.pointerEvents = 'auto';
        
        candle.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        candle.style.transform = 'scale(0.5)';
        candle.style.opacity = '0';
        setTimeout(() => {
            candle.style.transform = 'scale(1)';
            candle.style.opacity = '1';
        }, 50);
    }, 500);
    
    await smoothTextChange(happyBirthday, 'Happy Birthday To You');
    
    fire.style.display = 'block';
    fire.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fire.style.opacity = '0';
    fire.style.transform = 'scale(0.5)';
    setTimeout(() => {
        fire.style.opacity = '1';
        fire.style.transform = 'scale(1)';
    }, 100);
    
    candle.style.height = 'clamp(20px, calc(20px + 5vw), 112px)';
    
    setTimeout(() => {
        instructionMessage.classList.add('visible');
        instructionMessage.style.opacity = '1';
    }, 3000);
    
    playHappyMusic();
    
    const music = document.querySelector('.js-happy-music');
    music.addEventListener('ended', function() {
        smoothTextChange(happyBirthday, 'Blow the candle! 💨').then(() => {
            // Update instruction message to prompt blowing
            instructionMessage.textContent = '🎤 Blow into the microphone!';
            instructionMessage.classList.add('visible');
            instructionMessage.style.opacity = '1';
            
            // Auto-start blow detection
            startBlowDetection();
        });
        
        instructionMessage.classList.remove('visible');
        setTimeout(() => {
            instructionMessage.style.display = 'none';
        }, 800);
    }, { once: true });
    
    musicPlayed = true;
}

// --- Blow Detection using Microphone ---
let audioContext = null;
let analyser = null;
let dataArray = null;
let isListening = false;
let blowDetected = false;
let blowTimeout = null;

function initMicrophone() {
    if (audioContext) return Promise.resolve();
    
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            dataArray = new Uint8Array(analyser.fftSize);
            isListening = true;
            console.log('Microphone initialized');
            return true;
        })
        .catch(err => {
            console.error('Microphone access denied:', err);
            alert('Please allow microphone access to blow the candle!');
            return false;
        });
}

function detectBlow() {
    if (!isListening || !analyser) return false;
    
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    
    const threshold = 0.15;
    return rms > threshold;
}

function startBlowDetection() {
    if (blowDetected) return;
    
    initMicrophone().then(success => {
        if (!success) return;
        
        happyBirthday.textContent = 'Blow into the microphone! 🎤';
        
        let blowCounter = 0;
        const requiredBlows = 2;
        
        function checkBlow() {
            if (!isListening) return;
            
            const isBlowing = detectBlow();
            
            if (isBlowing) {
                blowCounter++;
                console.log(`Blow detected! (${blowCounter}/${requiredBlows})`);
                
                if (blowCounter === 1) {
                    happyBirthday.textContent = 'Keep blowing! 💨';
                }
                
                if (blowCounter >= requiredBlows) {
                    blowDetected = true;
                    executeBlowAction();
                    return;
                }
            } else {
                if (blowTimeout) {
                    clearTimeout(blowTimeout);
                }
                blowTimeout = setTimeout(() => {
                    blowCounter = 0;
                    console.log('Blow counter reset');
                    happyBirthday.textContent = 'Blow into the microphone! 🎤';
                }, 1500);
            }
            
            if (!blowDetected && isListening) {
                requestAnimationFrame(checkBlow);
            }
        }
        
        checkBlow();
    });
}

function executeBlowAction() {
    if (blowTimeout) {
        clearTimeout(blowTimeout);
        blowTimeout = null;
    }
    isListening = false;
    
    if (audioContext) {
        audioContext.close().catch(() => {});
        audioContext = null;
        analyser = null;
    }
    
    fire.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fire.style.opacity = '0';
    fire.style.transform = 'scale(0.3)';
    
    setTimeout(() => {
        fire.style.display = 'none';
        smoothTextChange(happyBirthday, 'May all of your wishes come true. ✨');
    }, 500);
    
    setTimeout(() => {
        showInvitation();
    }, 6000);
}

// --- Show Invitation ---
async function showInvitation() {
    const elementsToFade = [cake, candle, happyBirthday, instructionMessage];
    
    for (let el of elementsToFade) {
        if (el && el.style) {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(0.9) translateY(20px)';
        }
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    for (let el of elementsToFade) {
        if (el) el.style.display = 'none';
    }
    
    giftInvitation.style.display = 'flex';
    giftInvitation.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    giftInvitation.style.opacity = '0';
    giftInvitation.style.transform = 'scale(0.8) translateY(30px)';
    
    void giftInvitation.offsetWidth;
    
    giftInvitation.style.opacity = '1';
    giftInvitation.style.transform = 'scale(1) translateY(0)';
    
    const buttons = document.querySelectorAll('.yes, .no');
    buttons.forEach((btn, index) => {
        btn.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        }, 200 + (index * 150));
    });
    
    blowDetected = false;
    isListening = false;
}

// --- Event Listeners ---
yesBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'gift.html';
});
yesBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    window.location.href = 'gift.html';
}, { passive: false });

noBtn.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Maybe next time!');
});
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    alert('Maybe next time!');
}, { passive: false });

// --- Init ---
initFireworks();

const observer = new MutationObserver(() => {
    if (body.classList.contains('dark-mode') && !fireworksActive) {
        startFireworks();
    }
});
observer.observe(body, { attributes: true, attributeFilter: ['class'] });

document.addEventListener('touchmove', function(e) {
    if (isDragging) e.preventDefault();
}, { passive: false });

console.log('Cake page loaded! Drag the candle onto the cake.');