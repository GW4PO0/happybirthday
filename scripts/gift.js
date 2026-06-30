(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const letterContainer = document.querySelector('.letter-container');
        const paperImg = document.querySelector('.paper');
        const letterDiv = document.querySelector('.letter');
        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.previous');
        const waitLabel = document.querySelector('.wait-label');
        const otherGiftsSection = document.querySelector('.other-gifts-section');
        const mainContainer = document.querySelector('.main-container');
        const pageIndicator = document.getElementById('pageIndicator');

        if (!letterContainer || !paperImg || !letterDiv || !nextBtn || !prevBtn) {
            console.warn('Required elements not found.');
            return;
        }

        // Add loaded class to images when they load
        document.querySelectorAll('.songs-for-you-img, .photos-of-you-img, .flowers-for-you-img').forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            }
        });

        const originalParagraphs = letterDiv.querySelectorAll('p');
        let pages = [];
        if (originalParagraphs.length > 0) {
            const fullText = originalParagraphs[0].textContent;
            const chunkSize = 500;
            let tempPages = [];
            for (let i = 0; i < fullText.length; i += chunkSize) {
                let chunk = fullText.substring(i, i + chunkSize);
                if (i + chunkSize < fullText.length) {
                    const lastSpace = chunk.lastIndexOf(' ');
                    if (lastSpace > 0) {
                        chunk = chunk.substring(0, lastSpace);
                        i = i + lastSpace;
                    }
                }
                tempPages.push(chunk.trim());
            }
            if (tempPages.length === 0) tempPages = ['(empty)'];
            pages = tempPages;
        } else {
            const text = letterDiv.textContent.trim();
            if (text) {
                const chunkSize = 500;
                let tempPages = [];
                for (let i = 0; i < text.length; i += chunkSize) {
                    let chunk = text.substring(i, i + chunkSize);
                    if (i + chunkSize < text.length) {
                        const lastSpace = chunk.lastIndexOf(' ');
                        if (lastSpace > 0) {
                            chunk = chunk.substring(0, lastSpace);
                            i = i + lastSpace;
                        }
                    }
                    tempPages.push(chunk.trim());
                }
                if (tempPages.length === 0) tempPages = ['(empty)'];
                pages = tempPages;
            } else {
                pages = ['No content to display.'];
            }
        }

        let currentPageIndex = 0;
        let isTransitioning = false;
        let hasReachedLastPage = false;
        let typingInterval = null;
        let isTyping = false;
        let currentTypingText = "";
        let currentTypingElement = null;
        let typingCallback = null;

        // Function to update dots
        function updateDots() {
            if (!pageIndicator) return;
            
            // Clear existing dots
            pageIndicator.innerHTML = '';
            
            // Create dots based on number of pages
            for (let i = 0; i < pages.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                if (i === currentPageIndex) {
                    dot.classList.add('active');
                }
                dot.dataset.index = i;
                dot.addEventListener('click', function() {
                    if (!isTransitioning && !isTyping) {
                        renderPage(parseInt(this.dataset.index));
                    }
                });
                pageIndicator.appendChild(dot);
            }
        }

        function updateGiftSectionsVisibility() {
            const isLastPage = currentPageIndex === pages.length - 1;

            if (isLastPage) {
                hasReachedLastPage = true;
            }

            const shouldShow = hasReachedLastPage;

            // Add/remove class on main container
            if (mainContainer) {
                if (shouldShow) {
                    mainContainer.classList.add('gifts-visible');
                } else {
                    mainContainer.classList.remove('gifts-visible');
                }
            }

            if (waitLabel) {
                if (shouldShow) {
                    waitLabel.style.display = 'block';
                    setTimeout(() => {
                        waitLabel.classList.add('show');
                    }, 50);
                } else {
                    waitLabel.classList.remove('show');
                    setTimeout(() => {
                        waitLabel.style.display = 'none';
                    }, 300);
                }
            }

            if (otherGiftsSection) {
                if (shouldShow) {
                    otherGiftsSection.style.display = 'block';
                    setTimeout(() => {
                        otherGiftsSection.classList.add('show');
                    }, 50);
                } else {
                    otherGiftsSection.classList.remove('show');
                    setTimeout(() => {
                        otherGiftsSection.style.display = 'none';
                    }, 300);
                }
            }

            // Initialize scroll animation when gift section becomes visible
            if (shouldShow) {
                setTimeout(() => {
                    initScrollAnimation();
                    restoreScroll();
                }, 200);
            }
            saveState();
        }

    function typeWriter(element, text, speed = 20, callback = null) {
    clearInterval(typingInterval);

    isTyping = true;
    currentTypingText = text;
    currentTypingElement = element;
    typingCallback = callback;

    /* Reserve the final height */
    element.textContent = text;
    const finalHeight = element.offsetHeight;

    element.textContent = "";
    element.style.minHeight = finalHeight + "px";

    let i = 0;

    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            element.style.minHeight = "";
            isTyping = false;

            if (typingCallback) {
                const cb = typingCallback;
                typingCallback = null;
                cb();
            }
        }
    }, speed);
}

        function finishTyping() {
            if (!isTyping) return;

            clearInterval(typingInterval);

            if (currentTypingElement) {
                currentTypingElement.textContent = currentTypingText;
            }

            isTyping = false;

            if (typingCallback) {
                const cb = typingCallback;
                typingCallback = null;
                cb();
            }
        }

        function restoreScroll() {
            const saved = loadState();
            if (!saved) return;

            let attempts = 0;

            const restore = () => {
                window.scrollTo(0, saved.scrollY || 0);

                attempts++;

                // Keep restoring while the page finishes rendering
                if (attempts < 15) {
                    requestAnimationFrame(restore);
                }
            };

            requestAnimationFrame(restore);
        }

        function saveState() {
            sessionStorage.setItem("letterState", JSON.stringify({
                currentPageIndex,
                hasReachedLastPage,
                scrollY: window.scrollY
            }));
        }

        function loadState() {
            const saved = sessionStorage.getItem("letterState");
            if (!saved) return null;

            try {
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }

        function renderPage(index) {
            if (pages.length === 0) return;
            if (index < 0) index = 0;
            if (index >= pages.length) index = pages.length - 1;

            if (index === currentPageIndex) return;
            if (isTransitioning) return;

            isTransitioning = true;
            const newIndex = index;

            paperImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            paperImg.style.opacity = '0';
            paperImg.style.transform = 'scale(0.95)';

            letterDiv.style.opacity = '0';
            letterDiv.style.transform = 'scale(0.95)';

            setTimeout(() => {
                let p = letterDiv.querySelector('p');
                if (!p) {
                    letterDiv.innerHTML = "<p></p>";
                    p = letterDiv.querySelector('p');
                }

                typeWriter(p, pages[newIndex], 20, () => {
                    updateButtonVisibility();
                    updateGiftSectionsVisibility();
                    updateDots();
                });

                currentPageIndex = newIndex;
                saveState();

                paperImg.style.opacity = '1';
                paperImg.style.transform = 'scale(1)';
                letterDiv.style.opacity = '1';
                letterDiv.style.transform = 'scale(1)';

                paperImg.style.transition = '';
                isTransitioning = false;
            }, 350);
        }

        function updateButtonVisibility() {
            const isOverflowing = letterDiv.scrollHeight > letterDiv.clientHeight;
            const hasMultiplePages = pages.length > 1;
            const showButtons = hasMultiplePages || isOverflowing;

            if (showButtons) {
                nextBtn.style.display = 'flex';
                prevBtn.style.display = 'flex';
                if (pageIndicator) {
                    pageIndicator.style.display = 'flex';
                }
            } else {
                nextBtn.style.display = 'none';
                prevBtn.style.display = 'none';
                if (pageIndicator) {
                    pageIndicator.style.display = 'none';
                }
            }

            if (pages.length > 1) {
                prevBtn.disabled = (currentPageIndex === 0);
                nextBtn.disabled = (currentPageIndex === pages.length - 1);
                prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
                nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
            } else {
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                prevBtn.style.opacity = '0.3';
                nextBtn.style.opacity = '0.3';
            }
        }

        // ----- SCROLL ANIMATION FOR GIFT CARDS (same as photos page) -----
        function initScrollAnimation() {
            const giftContainers = document.querySelectorAll(
                '.songs-for-you-container, .photos-of-you-container, .flowers-for-you-container'
            );

            // Start all hidden (floated down)
            giftContainers.forEach(container => {
                container.classList.add('hidden');
            });

            // Intersection Observer – show/hide with float up animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const container = entry.target;
                    if (entry.isIntersecting) {
                        // when visible: remove hidden, add visible → floats up
                        container.classList.remove('hidden');
                        container.classList.add('visible');
                    } else {
                        // when NOT visible: remove visible, add hidden → floats back down
                        container.classList.remove('visible');
                        container.classList.add('hidden');
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -20px 0px'
            });

            giftContainers.forEach(container => {
                observer.observe(container);
            });

            // Check on load to reveal any containers already in view
            setTimeout(() => {
                giftContainers.forEach(container => {
                    const rect = container.getBoundingClientRect();
                    const winHeight = window.innerHeight;
                    const isVisible = rect.top < winHeight * 0.85 && rect.bottom > 0;
                    if (isVisible) {
                        container.classList.remove('hidden');
                        container.classList.add('visible');
                    } else {
                        container.classList.remove('visible');
                        container.classList.add('hidden');
                    }
                });
            }, 200);
        }

        nextBtn.addEventListener('click', function() {
            if (isTyping) {
                finishTyping();
                return;
            }

            if (currentPageIndex < pages.length - 1) {
                renderPage(currentPageIndex + 1);
            }
        });

        prevBtn.addEventListener('click', function() {
            if (isTyping) {
                finishTyping();
                return;
            }

            if (currentPageIndex > 0) {
                renderPage(currentPageIndex - 1);
            }
        });

        // Set initial page
        letterDiv.style.opacity = '1';
        paperImg.style.opacity = '1';

        let p = letterDiv.querySelector('p');
        if (!p) {
            letterDiv.innerHTML = "<p></p>";
            p = letterDiv.querySelector('p');
        }

        const savedState = loadState();

        if (savedState) {
            currentPageIndex = savedState.currentPageIndex ?? 0;
            hasReachedLastPage = savedState.hasReachedLastPage ?? false;

            p.textContent = pages[currentPageIndex];

            updateButtonVisibility();
            updateGiftSectionsVisibility();
            updateDots();

            restoreScroll();
        } else {
            typeWriter(p, pages[currentPageIndex], 20);
            updateDots();
        }

        setTimeout(() => {
            updateButtonVisibility();
            updateGiftSectionsVisibility();
            updateDots();
        }, 100);

        const resizeObserver = new ResizeObserver(() => {
            if (!isTransitioning) {
                updateButtonVisibility();
                updateDots();
            }
        });
        resizeObserver.observe(letterDiv);
        resizeObserver.observe(letterContainer);

        window.addEventListener('resize', function() {
            if (!isTransitioning) {
                updateButtonVisibility();
                updateDots();
            }
        });


        // Add entrance animation for gift cards with stagger
        setTimeout(() => {
            updateButtonVisibility();
            updateGiftSectionsVisibility();
            updateDots();
        }, 100);

        document.querySelectorAll('.songs-for-you-img, .photos-of-you-img, .flowers-for-you-img').forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });

        document.querySelectorAll('.other-gifts-section a').forEach(link => {
            link.addEventListener('click', () => {
                saveState();
            });
        });
        window.addEventListener("load", () => {
            restoreScroll();
        });

        window.addEventListener("beforeunload", saveState);
    }
})();