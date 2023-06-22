// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.

import { showAlert } from "./functions.js";
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const captchaMessage = document.getElementById("recaptcha-message");
const submitButton = document.querySelector('#contact-form button[type="submit"]');
const submitButtonSpinner = document.getElementById("submit-spinner");
contactForm.addEventListener("submit", async (event) => {
  contactForm.classList.add("was-validated");
  event.preventDefault();
  event.stopPropagation();
  if (contactForm.checkValidity()) {
    submitButtonSpinner.classList.remove("d-none");
    [nameInput, emailInput, messageInput, submitButton].forEach((element) => element.disabled = true);
    const result = await fetch("/contact/submit", {
      method: "POST",
      body: new URLSearchParams({
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value,
        "g-recaptcha-response": captchaMessage.value
        // eslint-disable-line @typescript-eslint/naming-convention
      })
    });
    switch (await result.text()) {
      case "success":
        showAlert("Message sent successfully!", "success");
        contactForm.reset();
        contactForm.classList.remove("was-validated");
        break;
      case "captcha-failure":
        showAlert("Failed to verify captcha!", "error");
        window.grecaptcha.reset();
        break;
      case "error":
      default:
        showAlert("Failed to send message!", "error");
        break;
    }
    [nameInput, emailInput, messageInput, submitButton].forEach((element) => element.disabled = false);
    window.grecaptcha.reset();
    submitButtonSpinner.classList.add("d-none");
  }
});
window.recaptchaCompleted = (response) => {
  captchaMessage.value = response;
  captchaMessage.dispatchEvent(new Event("change"));
};
window.recaptchaError = () => {
  captchaMessage.value = "";
  captchaMessage.dispatchEvent(new Event("change"));
};
