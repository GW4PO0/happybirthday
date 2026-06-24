const candle = document.querySelector('.candle');
const candleHolder = document.querySelector('.candle-holder');
const candleStage = document.querySelector('.candle-stage');
const cake = document.querySelector('.cake');
const happyBirthday = document.querySelector('.happy-birthday');
const blowBtn = document.querySelector('.blow-btn');
const fire = document.querySelector('.fire');
const giftInvitation = document.querySelector('.gift-invitation-container');
const yesBtn = document.querySelector('.yes');
const noBtn = document.querySelector('.no');
const proceedToGift = document.querySelector('.proceed-to-gift');
let isShow = true;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;

// Touch event handlers for candle dragging
candle.addEventListener('touchstart', function(e) {
    if (candle.parentElement === candleStage) {
        return;
    }
    
    const touch = e.touches[0];
    const rect = candle.getBoundingClientRect();
    
    // Calculate offset from touch point to candle's top-left corner
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    
    startX = rect.left;
    startY = rect.top;
    
    isDragging = true;
    candle.style.position = 'fixed';
    candle.style.zIndex = '1000';
    candle.style.opacity = '0.8';
    candle.style.pointerEvents = 'none';
    
    // Store original position for fallback
    candle.dataset.originalLeft = rect.left;
    candle.dataset.originalTop = rect.top;
    
    e.preventDefault();
}, { passive: false });

candle.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    
    // Move candle with finger
    candle.style.left = (touch.clientX - offsetX) + 'px';
    candle.style.top = (touch.clientY - offsetY) + 'px';
    
    // Check if over candleStage
    const stageRect = candleStage.getBoundingClientRect();
    const candleRect = candle.getBoundingClientRect();
    const candleCenterX = candleRect.left + candleRect.width / 2;
    const candleCenterY = candleRect.top + candleRect.height / 2;
    
    if (candleCenterX >= stageRect.left && candleCenterX <= stageRect.right &&
        candleCenterY >= stageRect.top && candleCenterY <= stageRect.bottom) {
        candleStage.style.border = '3px solid green';
        candleStage.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
    } else {
        candleStage.style.border = '2px solid #ccc';
        candleStage.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
}, { passive: false });

candle.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    
    candle.style.opacity = '1';
    candle.style.pointerEvents = 'auto';
    candle.style.position = '';
    candle.style.zIndex = '';
    candle.style.left = '';
    candle.style.top = '';
    
    // Reset stage styles
    candleStage.style.border = '2px solid #ccc';
    candleStage.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    
    // Check if dropped on candleStage
    const touch = e.changedTouches[0];
    const stageRect = candleStage.getBoundingClientRect();
    
    // Check if touch point is within candleStage
    if (touch.clientX >= stageRect.left && touch.clientX <= stageRect.right &&
        touch.clientY >= stageRect.top && touch.clientY <= stageRect.bottom) {
        
        // Drop the candle into candleStage
        if (candle.parentElement === candleHolder) {
            candleStage.appendChild(candle);
            candle.draggable = false;
            candle.style.position = 'relative';
            candle.style.left = '0';
            candle.style.top = '0';
            candle.style.width = '';
            candle.style.height = '';
            
            happyBirthday.textContent = 'Happy Birthday To You';
            fire.style.display = 'block';
            candle.style.height = 'clamp(20px, calc(20px + 5vw), 112px)';
            
            const music = document.querySelector('.js-happy-music');
            music.src = 'audio/Happy.mp3';
            music.load();
            
            music.addEventListener('ended', function() {
                happyBirthday.textContent = 'Make a Wish!';
                happyBirthday.style.display = 'block';
                blowBtn.style.display = 'block';
            });
            
            music.play();
        }
    }
}, { passive: true });

// Drag events (keep original for desktop)
candle.addEventListener('dragstart', function(e) {
    if (candle.parentElement === candleStage) {
        e.preventDefault();
        return false;
    }
    
    let selected = e.target;
    
    candleStage.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    candleStage.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (candle.parentElement === candleHolder) {
            candleStage.appendChild(selected);
            candle.draggable = false;
            
            happyBirthday.textContent = 'Happy Birthday To You';
            fire.style.display = 'block';
            candle.style.height = 'clamp(20px, calc(20px + 5vw), 112px)';
            
            const music = document.querySelector('.js-happy-music');
            music.src = 'audio/Happy.mp3';
            music.load();
            
            music.addEventListener('ended', function() {
                happyBirthday.textContent = 'Make a Wish!';
                happyBirthday.style.display = 'block';
                blowBtn.style.display = 'block';
            });
            
            music.play();
        }
    });
});

// Touch event for blow button
blowBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    blowCandle();
}, { passive: false });

// Touch events for invitation buttons
yesBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    proceedToGift.href = 'photos.html';
    giftInvitation.style.display = 'none';
}, { passive: false });

noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    giftInvitation.style.display = 'none';
    cake.style.display = 'block';
    candle.style.display = 'block';
    happyBirthday.style.display = 'block';
    happyBirthday.textContent = 'Make a Wish!';
}, { passive: false });

// Original click events (keep for desktop)
function blowCandle() {
    alert('HAPPY BIRTHDAY JOLY');
    fire.style.display = 'none';
    happyBirthday.textContent = 'May all your wishes come true.';
    showInvitation();
}

function showInvitation() {
    giftInvitation.style.display = 'flex';
    cake.style.display = 'none';
    candle.style.display = 'none';
    happyBirthday.style.display = 'none';
    blowBtn.style.display = 'none';
    giftInvitation.style.display = 'flex';
    proceedToGift.style.textDecoration = 'none';
    proceedToGift.style.color = 'inherit';
}

// Prevent scrolling when dragging the candle
document.addEventListener('touchmove', function(e) {
    if (isDragging) {
        e.preventDefault();
    }
}, { passive: false });

// Click events for buttons (keep for desktop)
blowBtn.addEventListener('click', blowCandle);

yesBtn.addEventListener('click', function() {
    proceedToGift.href = 'photos.html';
    giftInvitation.style.display = 'none';
});

noBtn.addEventListener('click', function() {
    giftInvitation.style.display = 'none';
    cake.style.display = 'block';
    candle.style.display = 'block';
    happyBirthday.style.display = 'block';
    happyBirthday.textContent = 'Make a Wish!';
});
