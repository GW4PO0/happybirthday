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

function blowCandle(){
    alert('HAPPY BIRTHDAY JOLY');
    fire.style.display = 'none';
    happyBirthday.textContent = 'May all your wishes come true.'

    showInvitation();
}

function showInvitation(){
    giftInvitation.style.display = 'flex';
    cake.style.display = 'none';
    candle.style.display = 'none';
    happyBirthday.style.display = 'none';
    blowBtn.style.display = 'none';
    giftInvitation.style.display = 'flex';
    proceedToGift.style.textDecoration = 'none';
    proceedToGift.style.color = 'inherit';
}


