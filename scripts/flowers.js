(function() {
    // ----- Screen full of flowers that then fall down -----
    const showerContainer = document.getElementById('flowerShower');
    const bouquet = document.getElementById('bouquet');

    // ----- Flower images - REPLACE THESE WITH YOUR IMAGE URLs -----
    const flowerImages = [
        // Add your image URLs here
        'images/flower1.webp',
        'images/flower2.png',
        'images/flower3.png',
        'images/flower4.png',
        'images/flower5.png',
        // Fallback: if images don't load, colored boxes will appear
    ];

    // ----- Fallback colors if images don't load -----
    const fallbackColors = [
        '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB',
        '#FF6B6B', '#A29BFE', '#FD79A8', '#00CEC9',
        '#FF7675', '#FDCB6E', '#6C5CE7', '#00B894'
    ];

    let flowersFallen = 0;
    let totalFlowers = 0;
    let bouquetShown = false;
    let hasExploded = false; // Track if explosion has already happened

    // ----- Get BIG dynamic flower size based on screen -----
    function getFlowerSize() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        
        // Calculate BIG size based on viewport - ensure full coverage with overlap
        if (W < 480) {
            return Math.max(80, Math.floor(W / 4)); // 4 columns on small screens
        } else if (W < 768) {
            return Math.max(120, Math.floor(W / 5)); // 5 columns on medium screens
        } else if (W < 1200) {
            return Math.max(150, Math.floor(W / 6)); // 6 columns on large screens
        } else {
            return Math.max(180, Math.floor(W / 8)); // 8 columns on extra large screens
        }
    }

    // ----- Create a flower element with image or colored box -----
    function createFlowerElement(flowerSize) {
        const flower = document.createElement('div');
        flower.className = 'flower-particle';
        flower.style.width = flowerSize + 'px';
        flower.style.height = flowerSize + 'px';

        // Add image
        const img = document.createElement('img');

        if (flowerImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * flowerImages.length);
            const imageUrl = flowerImages[randomIndex];
            img.src = imageUrl;
            img.alt = 'Flower';

            img.onerror = function() {
                // Replace with colored box
                flower.classList.add('color-box');
                const colorIndex = Math.floor(Math.random() * fallbackColors.length);
                flower.style.backgroundColor = fallbackColors[colorIndex];
                if (img.parentNode) {
                    img.remove();
                }
            };

            img.onload = function() {
                flower.classList.remove('color-box');
                flower.style.backgroundColor = 'transparent';
            };

            flower.appendChild(img);
        } else {
            // No images provided - use colored box
            flower.classList.add('color-box');
            const colorIndex = Math.floor(Math.random() * fallbackColors.length);
            flower.style.backgroundColor = fallbackColors[colorIndex];
        }

        return flower;
    }

    // ----- Create flowers to fill the entire screen with OVERLAP -----
    function createFlowerWall() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const flowerSize = getFlowerSize();

        // Calculate grid with 30% overlap to ensure full coverage
        const overlapFactor = 0.7; // 70% spacing = 30% overlap
        const spacingX = flowerSize * overlapFactor;
        const spacingY = flowerSize * overlapFactor;

        const totalCols = Math.ceil(W / spacingX) + 2; // +2 for extra coverage
        const totalRows = Math.ceil(H / spacingY) + 2; // +2 for extra coverage

        // Create a grid of flowers covering the entire screen with OVERLAP
        for (let row = 0; row < totalRows; row++) {
            for (let col = 0; col < totalCols; col++) {
                // Position flowers with overlap
                const x = col * spacingX - flowerSize * 0.15;
                const y = row * spacingY - flowerSize * 0.15;

                const flower = createFlowerElement(flowerSize);

                const centerX = W / 2 - flowerSize / 2;
                const centerY = H / 2 - flowerSize / 2;

                // Start in the center
                flower.style.left = centerX + "px";
                flower.style.top = centerY + "px";
                flower.style.opacity = "0";

                // Store destination
                flower.dataset.targetX = x;
                flower.dataset.targetY = y;

                // Random rotation for variety
                const rotation = Math.random() * 360;
                flower.style.transform = `translate3d(0, 0, 0) rotate(${rotation}deg)`;

                // Random scale for variety (0.8 to 1.2)
                const scale = 0.8 + Math.random() * 0.4;
                flower.style.transform += ` scale(${scale})`;

                // Store data for falling - with staggered timing
                const fallDelay = 0.1 + Math.random() * 1.2;
                const fallDuration = 2.5 + Math.random() * 2;
                const driftX = (Math.random() - 0.5) * 250;

                flower.dataset.fallDelay = fallDelay;
                flower.dataset.fallDuration = fallDuration;
                flower.dataset.driftX = driftX;
                flower.dataset.startX = x;
                flower.dataset.startY = y;

                showerContainer.appendChild(flower);
                totalFlowers++;
            }
        }

        // Add EXTRA flowers randomly to ensure complete coverage
        const extraCount = Math.floor(totalFlowers * 0.3); // 30% more flowers
        for (let i = 0; i < extraCount; i++) {
            const flower = createFlowerElement(flowerSize);
            const x = (Math.random() * W) - flowerSize * 0.2;
            const y = (Math.random() * H) - flowerSize * 0.2;

            const centerX = W / 2 - flowerSize / 2;
            const centerY = H / 2 - flowerSize / 2;

            flower.style.left = centerX + "px";
            flower.style.top = centerY + "px";
            flower.style.opacity = "0";

            flower.dataset.targetX = x;
            flower.dataset.targetY = y;

            const rotation = Math.random() * 360;
            const scale = 0.8 + Math.random() * 0.4;
            flower.style.transform = `translate3d(0, 0, 0) rotate(${rotation}deg) scale(${scale})`;

            const fallDelay = 0.1 + Math.random() * 1.2;
            const fallDuration = 2.5 + Math.random() * 2;
            const driftX = (Math.random() - 0.5) * 250;

            flower.dataset.fallDelay = fallDelay;
            flower.dataset.fallDuration = fallDuration;
            flower.dataset.driftX = driftX;
            flower.dataset.startX = x;
            flower.dataset.startY = y;

            showerContainer.appendChild(flower);
            totalFlowers++;
        }
    }

    function explodeFlowers(callback) {
        // Only explode if it hasn't happened yet
        if (hasExploded) {
            // If already exploded, just show flowers immediately and skip explosion
            const flowers = showerContainer.querySelectorAll(".flower-particle");
            flowers.forEach((flower) => {
                const targetX = parseFloat(flower.dataset.targetX);
                const targetY = parseFloat(flower.dataset.targetY);
                flower.style.left = targetX + "px";
                flower.style.top = targetY + "px";
                flower.style.opacity = "1";
            });
            if (callback) callback();
            return;
        }

        // Mark that explosion has happened
        hasExploded = true;

        const flowers = showerContainer.querySelectorAll(".flower-particle");

        flowers.forEach((flower, index) => {
            const targetX = parseFloat(flower.dataset.targetX);
            const targetY = parseFloat(flower.dataset.targetY);

            const delay = Math.random() * 350;

            setTimeout(() => {
                flower.style.transition =
                    "left 1.2s cubic-bezier(.22,1,.36,1), top 1.2s cubic-bezier(.22,1,.36,1), opacity .5s ease, transform 1.2s ease";

                flower.style.left = targetX + "px";
                flower.style.top = targetY + "px";
                flower.style.opacity = "1";

                const rotation = Math.random() * 720 - 360;
                const scale = 0.8 + Math.random() * 0.4;

                flower.style.transform =
                    `rotate(${rotation}deg) scale(${scale})`;
            }, delay);
        });

        setTimeout(() => {
            if (callback) callback();
        }, 1800);
    }

    // ----- Make all flowers fall down -----
    function startFlowerFall() {
        const flowers = showerContainer.querySelectorAll('.flower-particle');
        const H = window.innerHeight;

        flowers.forEach((flower, index) => {
            const fallDelay = parseFloat(flower.dataset.fallDelay) || 0.5;
            const fallDuration = parseFloat(flower.dataset.fallDuration) || 3;
            const driftX = parseFloat(flower.dataset.driftX) || 0;
            const startX = parseFloat(flower.dataset.startX) || 0;
            const startY = parseFloat(flower.dataset.startY) || 0;

            const fallDistance = H - startY + 100 + Math.random() * 200;

            setTimeout(() => {
                flower.classList.add('falling');
                flower.style.transition = `all ${fallDuration}s cubic-bezier(0.4, 0.1, 0.2, 0.9)`;
                flower.style.top = (startY + fallDistance) + 'px';
                flower.style.left = (startX + driftX) + 'px';

                const currentRotation = parseFloat(flower.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || 0);
                flower.style.transform = `translate3d(0, 0, 0) rotate(${currentRotation + (Math.random() - 0.5) * 400}deg) scale(${0.8 + Math.random() * 0.4})`;

                flower.style.opacity = '0.5';

                setTimeout(() => {
                    flowersFallen++;
                    if (flowersFallen >= totalFlowers) {
                        console.log('All flowers fallen');
                    }
                }, (fallDuration * 1000) + 100);

            }, fallDelay * 1000);
        });
    }

    // ----- Show bouquet after exactly 4 seconds -----
    function showBouquetAfterDelay() {
        setTimeout(() => {
            bouquet.classList.add('show');
            bouquetShown = true;
            console.log('Bouquet shown after 4 seconds');
        }, 2000);
    }

    // ----- Start the intro -----
    function startIntro() {
        // Check if flowers already exist and are visible
        const existingFlowers = showerContainer.querySelectorAll('.flower-particle');
        if (existingFlowers.length > 0 && flowersFallen > 0) {
            // Flowers already fell, don't restart
            return;
        }

        showerContainer.innerHTML = '';
        flowersFallen = 0;
        totalFlowers = 0;
        bouquetShown = false;
        bouquet.classList.remove('show');

        createFlowerWall();

        explodeFlowers(() => {
            // small pause after the explosion
            setTimeout(() => {
                startFlowerFall();
            }, 300);
        });

        showBouquetAfterDelay();
    }

    // ----- handle resize -----
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Only restart if flowers have completely fallen and we're not mid-animation
            if (flowersFallen >= totalFlowers && totalFlowers > 0) {
                // Don't restart on resize if already completed
                return;
            }
            if (flowersFallen < totalFlowers && totalFlowers > 0) {
                // Don't interrupt falling animation
                return;
            }
        }, 300);
    });

    // ----- click bouquet to replay -----
    bouquet.addEventListener('click', function() {
        // Reset the explosion flag when manually replaying
        hasExploded = false;
        startIntro();
    });

    // ----- start automatically -----
    setTimeout(() => {
        startIntro();
    }, 400);

    // ----- Clean up -----
    setInterval(() => {
        const flowers = showerContainer.querySelectorAll('.flower-particle');
        if (flowers.length > 1000) {
            const toRemove = Array.from(flowers).filter(f => {
                const rect = f.getBoundingClientRect();
                return rect.top > window.innerHeight + 100 && parseFloat(f.style.opacity) < 0.1;
            });
            toRemove.forEach(f => f.remove());
        }
    }, 10000);

})();