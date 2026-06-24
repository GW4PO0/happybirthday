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
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;

// Touch event handlers for candle dragging
candle.addEventListener('touchstart', function(e) {
    if (candle.parentElement === candleStage) {
        e.preventDefault();
        return false;
    }
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isDragging = true;
    candle.style.opacity = '0.8';
}, { passive: true });

candle.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = candleStage.getBoundingClientRect();
    
    // Check if touch is over the candleStage
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        candle.style.border = '2px solid green';
    } else {
        candle.style.border = 'none';
    }
}, { passive: false });

candle.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    candle.style.opacity = '1';
    candle.style.border = 'none';
    
    // Check if the touch ended over the candleStage
    const touch = e.changedTouches[0];
    const rect = candleStage.getBoundingClientRect();
    
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        
        // Drop the candle into candleStage
        if (candle.parentElement === candleHolder) {
            candleStage.appendChild(candle);
            candle.draggable = false;
            candle.style.position = 'relative';
            candle.style.left = '0';
            candle.style.top = '0';
            
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

// Drag events (keep original)
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
    // Handle yes button click
    proceedToGift.href = 'photos.html';
    giftInvitation.style.display = 'none';
}, { passive: false });

noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    // Handle no button click
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

// Prevent scrolling when interacting with the candle
document.querySelector('.candle-container')?.addEventListener('touchmove', function(e) {
    e.preventDefault();
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
