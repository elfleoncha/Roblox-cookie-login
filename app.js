// Function to see the errors
function showError(message, inputElement, buttonElement) {
    const errorElement = document.querySelector('.error');
    errorElement.textContent = message;
    errorElement.classList.add('shown');
    inputElement.classList.add('errored');
    buttonElement.disabled = false;
}

// Function for change the cookie
async function setCookie(value, tabUrl) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000); // the time that will make the cookie last

    await chrome.cookies.set({
        url: tabUrl,
        domain: "roblox.com",
        name: ".ROBLOSECURITY",
        value: value,
        expirationDate: expirationDate.getTime() / 1000,
        path: '/',
        secure: true,
        httpOnly: true
    });
}

// Main event
function initialize() {
    const button = document.querySelector('.button');
    const input = document.querySelector('.cookie-input');

    if (!button || !input) return;

    button.addEventListener('click', async (event) => {
        const inputValue = input.value.trim();
        const buttonElement = event.target;

        buttonElement.disabled = true;

        // Makes shure that what you put at the imput works like a cookie
        if (inputValue.length < 500) {
            showError('Invalid Cookie Provided.', input, buttonElement);
            return;
        }

        // Get the open tab on the browser
        const [tab] = await chrome.tabs.query({ active: true });
        if (!tab || !tab.url) {
            showError('Could not retrieve active tab.', input, buttonElement);
            return;
        }

        try {
            await setCookie(inputValue, tab.url);
            chrome.tabs.reload();
        } catch (error) {
            showError('Failed to set cookie.', input, buttonElement);
        }
    });
}

// Triger the event
initialize();

export {};
