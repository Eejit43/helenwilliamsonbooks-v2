// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.

const modal = document.getElementById("modal");
const images = document.querySelectorAll("img.popup-image");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const closeButton = document.getElementById("close-modal");
for (const image of images)
  image.addEventListener("click", () => {
    modal.style.display = "block";
    modalImage.src = image.src;
    modalCaption.innerHTML = image.alt;
  });
[closeButton, modal].forEach((element) => {
  element.addEventListener("click", () => modal.style.display = "none");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.style.display === "block")
    modal.style.display = "none";
});
