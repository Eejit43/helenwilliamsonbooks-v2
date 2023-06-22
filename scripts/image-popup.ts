// Adds modal functionality to all images with the "popup-image" class

const modal = document.getElementById('modal') as HTMLDivElement;
const images = document.querySelectorAll('img.popup-image') as NodeListOf<HTMLImageElement>; // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
const modalImage = document.getElementById('modal-image') as HTMLImageElement;
const modalCaption = document.getElementById('modal-caption') as HTMLDivElement;
const closeButton = document.getElementById('close-modal') as HTMLSpanElement;

for (const image of images)
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImage.src = image.src;
        modalCaption.innerHTML = image.alt;
    });

[closeButton, modal].forEach((element) => {
    element.addEventListener('click', () => (modal.style.display = 'none'));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') modal.style.display = 'none';
});
