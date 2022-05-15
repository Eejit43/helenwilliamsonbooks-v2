const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

const contactForm = document.getElementById('contact-form');

const errorMessage = document.getElementById('error-message');

/* Add event listeners */
['input', 'blur'].forEach((type) => {
    nameInput.addEventListener(type, checkNameField);
});
['input', 'blur'].forEach((type) => {
    emailInput.addEventListener(type, checkEmailField);
});
['input', 'blur'].forEach((type) => {
    messageInput.addEventListener(type, checkMessageField);
});
sendButton.addEventListener('click', submitForm);

let nameComplete, emailComplete, messageComplete, validEmail, captchaState;

function updateErrorMsg() {
    if (nameComplete === false || emailComplete === false || messageComplete === false) errorMessage.innerHTML = 'Please fill out the missing field(s)!<br>';
    else if (validEmail === false) errorMessage.innerHTML = 'Invalid email address!<br>';
    else if (captchaState === 'incomplete') errorMessage.innerHTML = 'Please complete the captcha!<br>';
    else if (captchaState === 'error') errorMessage.innerHTML = 'An error occurred or the captcha expired, please (re)complete!<br>';
    else errorMessage.innerHTML = '';
}

function checkNameField() {
    if (nameInput.value.length === 0) {
        setRedBorder(nameInput);
        nameComplete = false;
        updateErrorMsg();
    } else {
        resetBorder(nameInput);
        nameComplete = true;
        updateErrorMsg();
    }
}

function checkEmailField() {
    if (emailInput.value.length === 0) {
        setRedBorder(emailInput);
        emailComplete = false;
        updateErrorMsg();
    } else {
        validEmail = /^(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(emailInput.value);

        resetBorder(emailInput);
        emailComplete = true;
        updateErrorMsg();

        if (!validEmail) {
            setRedBorder(emailInput);
            errorMessage.innerHTML = 'Invalid email address!<br>';
        }
    }
}

function checkMessageField() {
    if (messageInput.value.length === 0) {
        setRedBorder(messageInput);
        messageComplete = false;
        updateErrorMsg();
    } else {
        resetBorder(messageInput);
        messageComplete = true;
        updateErrorMsg();
    }
}

function recaptchaCompleted() {
    captchaState = 'complete';
    updateErrorMsg();
}

function recaptchaError() {
    captchaState = 'error';
    errorMessage.innerHTML = 'An error occurred or the captcha expired, please (re)complete!<br>';
}

function submitForm() {
    checkNameField();
    checkEmailField();
    checkMessageField();

    if (nameComplete && emailComplete && messageComplete && validEmail && captchaState === 'complete') contactForm.submit();
    else updateErrorMsg();
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
