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

/**
 * Updates the output error message
 */
function updateErrorMsg() {
    if (nameComplete === false || emailComplete === false || messageComplete === false) errorMessage.innerHTML = 'Please fill out the missing field(s)!<br>';
    else if (validEmail === false) errorMessage.innerHTML = 'Invalid email address!<br>';
    else if (captchaState === 'incomplete') errorMessage.innerHTML = 'Please complete the captcha!<br>';
    else if (captchaState === 'error') errorMessage.innerHTML = 'An error occurred or the captcha expired, please (re)complete!<br>';
    else errorMessage.innerHTML = '';
}

/**
 * Checks the name input field
 */
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

/**
 * Checks the email input field
 */
function checkEmailField() {
    if (emailInput.value.length === 0) {
        setRedBorder(emailInput);
        emailComplete = false;
        updateErrorMsg();
    } else {
        validEmail = /^[a-z0-9._%+!$&*=^|~#%'`?{}/-]+@([a-z0-9-]+\.){1,}([a-z]{2,16})$/.test(emailInput.value);

        resetBorder(emailInput);
        emailComplete = true;
        updateErrorMsg();

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
        updateErrorMsg();
    } else {
        resetBorder(messageInput);
        messageComplete = true;
        updateErrorMsg();
    }
}

/**
 * If all options completed, submits the form, or else updates the error message
 */
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
