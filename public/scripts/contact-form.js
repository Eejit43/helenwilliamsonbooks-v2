import { showAlert } from '/scripts/functions.js';

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

const contactForm = document.getElementById('contact-form');

const errorMessage = document.getElementById('error-message');

/* Add event listeners */
['input', 'blur'].forEach((type) => nameInput.addEventListener(type, checkNameField));
['input', 'blur'].forEach((type) => emailInput.addEventListener(type, checkEmailField));
['input', 'blur'].forEach((type) => messageInput.addEventListener(type, checkMessageField));
sendButton.addEventListener('click', submitForm);

let nameComplete, emailComplete, messageComplete, validEmail;

const result = new URL(window.location.href).searchParams.get('result');

if (result === 'success') showAlert('Message sent successfully!', 'success');
else if (result === 'captcha-failure') showAlert('Captcha verification failed!', 'error');
else if (result === 'error') showAlert('An error occurred while processing your request!', 'error');

if (result && history.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.delete('result');
    history.replaceState(null, null, url.href);
}

/**
 * Updates the output error message
 */
window.updateErrorMsg = () => {
    if (nameComplete === false || emailComplete === false || messageComplete === false) errorMessage.innerHTML = 'Please fill out the missing field(s)!<br>';
    else if (validEmail === false) errorMessage.innerHTML = 'Invalid email address!<br>';
    else if (window.captchaState === 'incomplete') errorMessage.innerHTML = 'Please complete the captcha!<br>';
    else if (window.captchaState === 'error') errorMessage.innerHTML = 'An error occurred or the captcha expired, please (re)complete!<br>';
    else errorMessage.innerHTML = '';
};

/**
 * Checks the name input field
 */
function checkNameField() {
    if (nameInput.value.length === 0) {
        setRedBorder(nameInput);
        nameComplete = false;
        window.updateErrorMsg();
    } else {
        resetBorder(nameInput);
        nameComplete = true;
        window.updateErrorMsg();
    }
}

/**
 * Checks the email input field
 */
function checkEmailField() {
    if (emailInput.value.length === 0) {
        setRedBorder(emailInput);
        emailComplete = false;
        window.updateErrorMsg();
    } else {
        validEmail = /^[a-z0-9._%+!$&*=^|~#%'`?{}/-]+@([a-z0-9-]+\.){1,}([a-z]{2,16})$/.test(emailInput.value);

        resetBorder(emailInput);
        emailComplete = true;
        window.updateErrorMsg();

        if (!validEmail) {
            setRedBorder(emailInput);
            errorMessage.innerHTML = 'Invalid email address!<br>';
        }
    }
}

/**
 * Checks the message input field
 */
function checkMessageField() {
    if (messageInput.value.length === 0) {
        setRedBorder(messageInput);
        messageComplete = false;
        window.updateErrorMsg();
    } else {
        resetBorder(messageInput);
        messageComplete = true;
        window.updateErrorMsg();
    }
}

/**
 * If all options completed, submits the form, or else updates the error message
 */
function submitForm() {
    checkNameField();
    checkEmailField();
    checkMessageField();

    if (nameComplete && emailComplete && messageComplete && validEmail && window.captchaState === 'complete') contactForm.submit();
    else window.updateErrorMsg();
}

/**
 * Adds a red border to an element
 * @param {HTMLElement} element The element to update
 */
function setRedBorder(element) {
    element.style.border = '1px solid #ff5555';
}

/**
 * Resets an element's border
 * @param {HTMLElement} element The element to update
 */
function resetBorder(element) {
    element.style.border = '';
}
