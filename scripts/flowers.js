 (function() {
            // ----- Screen full of flowers that then fall down -----
            const showerContainer = document.getElementById('flowerShower');
            const bouquet = document.getElementById('bouquet');

            // ----- Flower images - REPLACE THESE WITH YOUR IMAGE URLs -----
            const flowerImages = [
                // Add your image URLs here
                'images/flower1.jpg',
                'images/flower2.jpg',
                'images/flower3.jpg',
                'images/flower4.jpg',
                'images/flower5.jpg',
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

            // ----- Create a flower element with image or colored box -----
            function createFlowerElement() {
                const flower = document.createElement('div');
                flower.className = 'flower-particle';

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

            // ----- Create flowers to fill the entire screen - NO GAPS -----
            function createFlowerWall() {
                const W = window.innerWidth;
                const H = window.innerHeight;
                const flowerSize = 120; // Same size for all flowers

                // Calculate exact grid to cover screen with NO GAPS
                const cols = Math.ceil(W / flowerSize);
                const rows = Math.ceil(H / flowerSize);

                // Add extra rows/cols to ensure full coverage
                const extraCols = 1;
                const extraRows = 1;
                const totalCols = cols + extraCols;
                const totalRows = rows + extraRows;

                // Calculate spacing - NO GAPS (exact fit)
                const spacingX = W / totalCols;
                const spacingY = H / totalRows;

                // Create a grid of flowers covering the entire screen with NO GAPS
                for (let row = 0; row < totalRows; row++) {
                    for (let col = 0; col < totalCols; col++) {
                        // Position flowers with NO GAPS
                        const x = col * spacingX;
                        const y = row * spacingY;

                        const flower = createFlowerElement();

                        flower.style.left = x + 'px';
                        flower.style.top = y + 'px';
                        flower.style.opacity = '1';

                        // Random rotation for variety
                        const rotation = Math.random() * 360;
                        flower.style.transform = `translate3d(0, 0, 0) rotate(${rotation}deg)`;

                        // Store data for falling - with staggered timing
                        const fallDelay = 0.2 + Math.random() * 1.5;
                        const fallDuration = 2.5 + Math.random() * 2;
                        const driftX = (Math.random() - 0.5) * 200;

                        flower.dataset.fallDelay = fallDelay;
                        flower.dataset.fallDuration = fallDuration;
                        flower.dataset.driftX = driftX;
                        flower.dataset.startX = x;
                        flower.dataset.startY = y;

                        showerContainer.appendChild(flower);
                        totalFlowers++;
                    }
                }

                // Add extra flowers randomly to ensure complete coverage
                const extraCount = Math.floor(totalFlowers * 0.2);
                for (let i = 0; i < extraCount; i++) {
                    const flower = createFlowerElement();
                    const x = Math.random() * W;
                    const y = Math.random() * H;

                    flower.style.left = x + 'px';
                    flower.style.top = y + 'px';
                    flower.style.opacity = '1';

                    const rotation = Math.random() * 360;
                    flower.style.transform = `translate3d(0, 0, 0) rotate(${rotation}deg)`;

                    const fallDelay = 0.2 + Math.random() * 1.5;
                    const fallDuration = 2.5 + Math.random() * 2;
                    const driftX = (Math.random() - 0.5) * 200;

                    flower.dataset.fallDelay = fallDelay;
                    flower.dataset.fallDuration = fallDuration;
                    flower.dataset.driftX = driftX;
                    flower.dataset.startX = x;
                    flower.dataset.startY = y;

                    showerContainer.appendChild(flower);
                    totalFlowers++;
                }
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

                    const fallDistance = H - startY + 80 + Math.random() * 150;

                    setTimeout(() => {
                        flower.classList.add('falling');
                        flower.style.transition = `all ${fallDuration}s cubic-bezier(0.4, 0.1, 0.2, 0.9)`;
                        flower.style.top = (startY + fallDistance) + 'px';
                        flower.style.left = (startX + driftX) + 'px';

                        const currentRotation = parseFloat(flower.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || 0);
                        flower.style.transform = `translate3d(0, 0, 0) rotate(${currentRotation + (Math.random() - 0.5) * 400}deg)`;

                        flower.style.opacity = '0.6';

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
                showerContainer.innerHTML = '';
                flowersFallen = 0;
                totalFlowers = 0;
                bouquetShown = false;
                bouquet.classList.remove('show');

                createFlowerWall();

                // Start the fall after a short delay
                setTimeout(() => {
                    startFlowerFall();
                }, 500);

                // Show bouquet after exactly 4 seconds
                showBouquetAfterDelay();
            }

            // ----- handle resize -----
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (flowersFallen < totalFlowers && totalFlowers > 0) {
                        // Don't interrupt
                    } else {
                        startIntro();
                    }
                }, 300);
            });

            // ----- click bouquet to replay -----
            bouquet.addEventListener('click', function() {
                startIntro();
            });

            // ----- start automatically -----
            setTimeout(() => {
                startIntro();
            }, 400);

            // ----- Clean up -----
            setInterval(() => {
                const flowers = showerContainer.querySelectorAll('.flower-particle');
                if (flowers.length > 500) {
                    const toRemove = Array.from(flowers).filter(f => {
                        const rect = f.getBoundingClientRect();
                        return rect.top > window.innerHeight + 100 && parseFloat(f.style.opacity) < 0.1;
                    });
                    toRemove.forEach(f => f.remove());
                }
            }, 10000);

        })();