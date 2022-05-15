// Adds modal functionality to all images on the current page with the "popup-image" class
const modal = document.getElementById('modal');
const images = document.querySelectorAll('.popup-image');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const closeButton = document.getElementById('close-modal');

for (let i = 0; i < images.length; i++) {
    const image = images[i];
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImage.src = image.src;
        modalCaption.innerHTML = image.alt;
    });
}

[closeButton, modal].forEach((element) => {
    element.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});
