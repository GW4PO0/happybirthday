const modal = document.querySelector('.modal-section-container');
const openCards = document.querySelectorAll('.photo-card-container'); // Gets ALL of them
const closeCard = document.querySelector('.close');

openCards.forEach(card => {
    card.addEventListener('click', () => {
        modal.classList.add('show');
    });
});


closeCard.addEventListener('click', () => {
    modal.classList.remove('show');
});
