        // ----- your original script, unchanged -----
        const modal = document.querySelector('.modal-section-container');
        const openCards = document.querySelectorAll('.photo-card-container');
        const closeCard = document.querySelector('.close');

        openCards.forEach(card => {
            card.addEventListener('click', () => {
                modal.classList.add('show');
            });
        });

        closeCard.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        // close on backdrop
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        window.closePhoto = function() {
            modal.classList.remove('show');
        };

        // ----- SCROLL ANIMATION: FLOAT UP (with reset) -----
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.photo-card-container');

            // start all cards hidden (floated down)
            cards.forEach(card => {
                card.classList.add('hidden');
            });

            // Intersection Observer – show/hide with float up animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const card = entry.target;
                    if (entry.isIntersecting) {
                        // when visible: remove hidden, add visible → floats up
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    } else {
                        // when NOT visible: remove visible, add hidden → floats back down
                        card.classList.remove('visible');
                        card.classList.add('hidden');
                    }
                });
            }, {
                threshold: 0.15, // 15% of card visible triggers
                rootMargin: '0px 0px -20px 0px'
            });

            cards.forEach(card => {
                observer.observe(card);
            });

            // Check on load to reveal any cards already in view
            setTimeout(() => {
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const winHeight = window.innerHeight;
                    const isVisible = rect.top < winHeight * 0.85 && rect.bottom > 0;
                    if (isVisible) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    } else {
                        card.classList.remove('visible');
                        card.classList.add('hidden');
                    }
                });
            }, 150);
        });