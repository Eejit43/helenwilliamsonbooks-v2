declare global {
    interface Window {
        grecaptcha: { reset: () => void };
        recaptchaCompleted: (response: string) => void;
        recaptchaError: () => void;
    }
}

import { showAlert } from './functions.js';

/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const contactForm = document.querySelector('#contact-form') as HTMLFormElement;
const nameInput = document.querySelector('#name') as HTMLInputElement;
const emailInput = document.querySelector('#email') as HTMLInputElement;
const messageInput = document.querySelector('#message') as HTMLTextAreaElement;
const captchaMessage = document.querySelector('#recaptcha-message') as HTMLInputElement;
const submitButton = document.querySelector('#contact-form button[type="submit"]') as HTMLButtonElement;
const submitButtonSpinner = document.querySelector('#submit-spinner') as HTMLSpanElement;
/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */

contactForm.addEventListener('submit', async (event) => {
    contactForm.classList.add('was-validated');
    event.preventDefault();
    event.stopPropagation();

    if (contactForm.checkValidity()) {
        submitButtonSpinner.classList.remove('d-none');

        for (const element of [nameInput, emailInput, messageInput, submitButton]) element.disabled = true;

        const result = await fetch('/contact/submit', {
            method: 'POST',
            body: new URLSearchParams({
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value,
                'g-recaptcha-response': captchaMessage.value
            })
        });

        switch (await result.text()) {
            case 'success': {
                showAlert('Message sent successfully!', 'success');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                break;
            }
            case 'captcha-failure': {
                showAlert('Failed to verify captcha!', 'error');
                window.grecaptcha.reset();
                break;
            }
            default: {
                showAlert('Failed to send message!', 'error');
                break;
            }
        }

        for (const element of [nameInput, emailInput, messageInput, submitButton]) element.disabled = false;
        window.grecaptcha.reset();
        submitButtonSpinner.classList.add('d-none');
    }
});

/**
 * Function used by Google's recaptcha on completion.
 * @param response The recaptcha response.
 */
window.recaptchaCompleted = (response) => {
    captchaMessage.value = response;
    captchaMessage.dispatchEvent(new Event('change'));
};

/**
 * Function used by Google's recaptcha on error.
 */
window.recaptchaError = () => {
    captchaMessage.value = '';
    captchaMessage.dispatchEvent(new Event('change'));
};
