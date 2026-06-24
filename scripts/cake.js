let candle = document.querySelector('.js-candle');
let candleBottom = document.querySelector('.candle-container-bottom');
let candleTop = document.querySelector('.candle-container-top');
let music = document.querySelector('.happy-music');
let draggedCandle = null;
let isDragging = false;
let startX, startY, initialOffsetX, initialOffsetY;

let originalLeft, originalTop;

candle.addEventListener("touchstart", function(e) {
    e.preventDefault();
    draggedCandle = this;
    isDragging = true;
    
    
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    
    
    const rect = this.getBoundingClientRect();
    initialOffsetX = startX - rect.left;
    initialOffsetY = startY - rect.top;
    
    
    originalParent = this.parentElement;
    
    this.style.position = 'fixed';
    this.style.zIndex = '9999';
    this.style.opacity = '0.9';
    this.style.width = rect.width + 'px';
    this.style.height = rect.height + 'px';
    this.style.left = rect.left + 'px';
    this.style.top = rect.top + 'px';
    this.style.margin = '0';
    this.style.cursor = 'grabbing';
    this.style.transition = 'none';
});

candle.addEventListener("touchmove", function(e) {
    if (!isDragging || !draggedCandle) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    let newX = touch.clientX - initialOffsetX;
    let newY = touch.clientY - initialOffsetY;
    
    draggedCandle.style.left = newX + 'px';
    draggedCandle.style.top = newY + 'px';
});

candle.addEventListener("touchend", function(e) {
    if (!isDragging || !draggedCandle) return;
    e.preventDefault();

    const topRect = candleTop.getBoundingClientRect();
    const bottomRect = candleBottom.getBoundingClientRect();
    const candleRect = draggedCandle.getBoundingClientRect();
    const centerX = candleRect.left + candleRect.width / 2;
    const centerY = candleRect.top + candleRect.height / 2;
    
    let droppedOnTarget = false;
    
    
    if (centerX >= topRect.left && centerX <= topRect.right && 
    centerY >= topRect.top && centerY <= topRect.bottom) 
    {
        candleTop.appendChild(draggedCandle);
        
        draggedCandle.style.position = '';
        draggedCandle.style.left = '';
        draggedCandle.style.top = '';
        draggedCandle.style.zIndex = '';
        draggedCandle.style.opacity = '';
        draggedCandle.style.cursor = '';
        draggedCandle.style.width = '';
        draggedCandle.style.height = '';
        draggedCandle.style.margin = '';
        draggedCandle.style.transition = '';
        
        if (music) {
            music.currentTime = 0;
            music.play().catch(err => console.log("Play error:", err));
        }
        
        updateHappyBirthdayText(); // ADD THIS LINE
        
        droppedOnTarget = true;
    }
    else if (centerX >= bottomRect.left && centerX <= bottomRect.right && 
             centerY >= bottomRect.top && centerY <= bottomRect.bottom) {
        
        
        candleBottom.appendChild(draggedCandle);
        
        draggedCandle.style.position = '';
        draggedCandle.style.left = '';
        draggedCandle.style.top = '';
        draggedCandle.style.zIndex = '';
        draggedCandle.style.opacity = '';
        draggedCandle.style.cursor = '';
        draggedCandle.style.width = '';
        draggedCandle.style.height = '';
        draggedCandle.style.margin = '';
        draggedCandle.style.transition = '';
        
       
        if (music) {
            music.pause();
            music.currentTime = 0;
            hideButton(); 
        }

        updateHappyBirthdayText(); 
        
        droppedOnTarget = true;
    }
    
    
    if (!droppedOnTarget) {
      
        draggedCandle.style.position = '';
        draggedCandle.style.left = '';
        draggedCandle.style.top = '';
        draggedCandle.style.zIndex = '';
        draggedCandle.style.opacity = '';
        draggedCandle.style.cursor = '';
        draggedCandle.style.width = '';
        draggedCandle.style.height = '';
        draggedCandle.style.margin = '';
        draggedCandle.style.transition = '';
        
       
        if (originalParent) {
            originalParent.appendChild(draggedCandle);
        }
    }
    
    isDragging = false;
    draggedCandle = null;
});


let mouseDraggedCandle = null;

candle.addEventListener("dragstart", function(e) {
    mouseDraggedCandle = e.target;
    e.dataTransfer.setData("text/plain", "candle");
    e.dataTransfer.effectAllowed = "move";
});

candleTop.addEventListener("dragover", function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
});

candleBottom.addEventListener("dragover", function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
});

candleTop.addEventListener("drop", function(e) {
    e.preventDefault();
    
    if (mouseDraggedCandle && mouseDraggedCandle.parentNode !== candleTop) {
        candleTop.appendChild(mouseDraggedCandle);
        
        if (music) {
            music.currentTime = 0;
            music.play().catch(err => console.log("Play error:", err));
            
        }

        updateHappyBirthdayText(); // ADD THIS LINE
        
        mouseDraggedCandle = null;
    }
});


candleBottom.addEventListener("drop", function(e) {
    e.preventDefault();
    
    if (mouseDraggedCandle && mouseDraggedCandle.parentNode !== candleBottom) {
        candleBottom.appendChild(mouseDraggedCandle);
        
        if (music) {
            music.pause();
            music.currentTime = 0;
            hideButton(); 
        }   
        
        updateHappyBirthdayText(); // ADD THIS LINE

        mouseDraggedCandle = null;
    }
});


document.body.addEventListener('touchmove', function(e) {
    if (isDragging) {
        e.preventDefault();
    }
}, { passive: false });

const surpriseBtn = document.querySelector('.popup-button');


// Show button when music ends
music.addEventListener('ended', function() {
    surpriseBtn.classList.add('show');
    
    // Change the happy birthday text to "Make a wish" only if candle is on top
    if (candle.parentElement === candleTop && happyBirthdayText) {
        happyBirthdayText.textContent = 'Make a wish';
        // Re-animate the text
        happyBirthdayText.style.animation = 'none';
        happyBirthdayText.offsetHeight; // Trigger reflow
        happyBirthdayText.style.animation = 'bounceIn 0.6s ease forwards';
    }
});

// Hide button when music is stopped (when candle moves to bottom)
function hideButton() {
    surpriseBtn.classList.remove('show');
}

// Add click functionality
surpriseBtn.addEventListener('click', function() {
    alert('🎉 Happy Birthday! 🎉\nYou are amazing! 🎂✨');
    
});

// Create happy birthday text element
const happyBirthdayText = document.querySelector('.happy-birthday');

// Function to show happy birthday text with animation
function showHappyBirthday() {
    happyBirthdayText.style.display = 'block';
    happyBirthdayText.style.animation = 'none';
    happyBirthdayText.offsetHeight; // Trigger reflow
    happyBirthdayText.style.animation = 'bounceIn 0.6s ease forwards';
}

// Function to hide happy birthday text
function hideHappyBirthday() {
    happyBirthdayText.style.display = 'none';
    happyBirthdayText.style.animation = ''; // Reset animation
}

// Check candle position and show/hide text accordingly
function updateHappyBirthdayText() {
    if (candle.parentElement === candleTop) {
        showHappyBirthday();
    } else {
        hideHappyBirthday();
    }
}

updateHappyBirthdayText();