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
                let typewriterInterval = null;
                let hasReachedLastPage = false;
                let skipTypewriter = false;
                let isTypingComplete = true;

                function typewriteText(element, text, speed = 30) {
                    return new Promise((resolve) => {
                        if (typewriterInterval) {
                            clearInterval(typewriterInterval);
                            typewriterInterval = null;
                        }

                        isTypingComplete = false;
                        element.textContent = '';
                        let index = 0;

                        typewriterInterval = setInterval(() => {
                            if (skipTypewriter) {
                                clearInterval(typewriterInterval);
                                typewriterInterval = null;
                                element.textContent = text;
                                letterDiv.scrollTop = letterDiv.scrollHeight;
                                skipTypewriter = false;
                                isTypingComplete = true;
                                resolve();
                                return;
                            }

                            if (index < text.length) {
                                element.textContent += text.charAt(index);
                                index++;
                                letterDiv.scrollTop = letterDiv.scrollHeight;
                            } else {
                                clearInterval(typewriterInterval);
                                typewriterInterval = null;
                                isTypingComplete = true;
                                resolve();
                            }
                        }, speed);
                    });
                }

                function updateGiftSectionsVisibility() {
                    const isLastPage = currentPageIndex === pages.length - 1;

                    if (isLastPage) {
                        hasReachedLastPage = true;
                    }

                    const shouldShow = hasReachedLastPage;

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
                        setTimeout(initScrollAnimation, 200);
                    }
                }

                async function renderPage(index, direction) {
                    if (pages.length === 0) return;
                    if (index < 0) index = 0;
                    if (index >= pages.length) index = pages.length - 1;

                    if (index === currentPageIndex) return;

                    if (isTransitioning) {
                        skipTypewriter = true;
                        return;
                    }

                    isTransitioning = true;
                    const newIndex = index;

                    const p = letterDiv.querySelector('p');

                    paperImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    paperImg.style.opacity = '0';
                    paperImg.style.transform = 'scale(0.95)';

                    letterDiv.style.opacity = '0';
                    letterDiv.style.transform = 'scale(0.95)';

                    await new Promise(resolve => setTimeout(resolve, 350));

                    if (p) {
                        p.textContent = '';
                    } else {
                        letterDiv.innerHTML = `<p></p>`;
                    }

                    currentPageIndex = newIndex;

                    paperImg.style.opacity = '1';
                    paperImg.style.transform = 'scale(1)';
                    letterDiv.style.opacity = '1';
                    letterDiv.style.transform = 'scale(1)';

                    const newP = letterDiv.querySelector('p');
                    await typewriteText(newP, pages[newIndex], 20);

                    paperImg.style.transition = '';
                    isTransitioning = false;
                    updateButtonVisibility();
                    updateGiftSectionsVisibility();
                }

                function updateButtonVisibility() {
                    const isOverflowing = letterDiv.scrollHeight > letterDiv.clientHeight;
                    const hasMultiplePages = pages.length > 1;
                    const showButtons = hasMultiplePages || isOverflowing;

                    if (showButtons) {
                        nextBtn.style.display = 'inline-block';
                        prevBtn.style.display = 'inline-block';
                    } else {
                        nextBtn.style.display = 'none';
                        prevBtn.style.display = 'none';
                    }

                    if (pages.length > 1) {
                        prevBtn.disabled = (currentPageIndex === 0);
                        nextBtn.disabled = (currentPageIndex === pages.length - 1);
                        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
                        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
                    } else {
                        prevBtn.disabled = true;
                        nextBtn.disabled = true;
                        prevBtn.style.opacity = '0.5';
                        nextBtn.style.opacity = '0.5';
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

                nextBtn.addEventListener('click', function(e) {
                    if (currentPageIndex < pages.length - 1) {
                        renderPage(currentPageIndex + 1, 'next');
                    }
                });

                prevBtn.addEventListener('click', function(e) {
                    if (currentPageIndex > 0) {
                        renderPage(currentPageIndex - 1, 'prev');
                    }
                });

                // Set initial page
                letterDiv.style.opacity = '1';
                paperImg.style.opacity = '1';

                const p = letterDiv.querySelector('p');
                if (p) {
                    p.textContent = pages[currentPageIndex];
                } else {
                    letterDiv.innerHTML = `<p>${pages[currentPageIndex]}</p>`;
                }
                isTypingComplete = true;

                setTimeout(() => {
                    updateButtonVisibility();
                    updateGiftSectionsVisibility();
                }, 100);

                const resizeObserver = new ResizeObserver(() => {
                    if (!isTransitioning) {
                        updateButtonVisibility();
                    }
                });
                resizeObserver.observe(letterDiv);
                resizeObserver.observe(letterContainer);

                window.addEventListener('resize', function() {
                    if (!isTransitioning) {
                        updateButtonVisibility();
                    }
                });

                // Add entrance animation for gift cards with stagger
                setTimeout(() => {
                    updateButtonVisibility();
                    updateGiftSectionsVisibility();
                }, 100);

                document.querySelectorAll('.songs-for-you-img, .photos-of-you-img, .flowers-for-you-img').forEach(img => {
                    img.addEventListener('mouseenter', function() {
                        this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    });
                });
            }
        })();