const modal = document.querySelector('#modal') as HTMLDivElement;
const images = document.querySelectorAll('img.popup-image') as NodeListOf<HTMLImageElement>;
const modalImage = document.querySelector('#modal-image') as HTMLImageElement;
const modalCaption = document.querySelector('#modal-caption') as HTMLDivElement;
const closeButton = document.querySelector('#close-modal') as HTMLSpanElement;

for (const image of images)
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImage.src = image.src;
        modalCaption.innerHTML = image.alt;
    });

for (const element of [closeButton, modal]) element.addEventListener('click', () => (modal.style.display = 'none'));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') modal.style.display = 'none';
});
