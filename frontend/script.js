console.log("script.js is loading!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired!");

    const chatBox = document.getElementById('chat-box');
    const questionButtonsDiv = document.getElementById('question-buttons');
    const whenBtn = document.getElementById('when-btn');
    const venueBtn = document.getElementById('venue-btn');
    const tellBtn = document.getElementById('tell-btn');
    const tellUsMoreBtn = document.getElementById('tell-us-more-btn'); // New button
    const chatBackgroundOverlay = document.getElementById('chat-background-overlay');
    const chatHeaderStatus = document.getElementById('chat-header-status');

    const appendMessage = (message, sender) => {
        console.log(`Attempting to append message: "${message}" from "${sender}"`);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(`${sender}-message`);
        messageElement.innerHTML = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        console.log('Message appended successfully.');
    };

    const showTypingIndicator = () => {
        chatHeaderStatus.textContent = 'Typing...';
    };

    const hideTypingIndicator = () => {
        chatHeaderStatus.textContent = 'Online';
    };

    // New function to type messages line by line
    const typeMessageLineByLine = async (lines, sender, delayPerLine = 500) => {
        showTypingIndicator();
        for (const line of lines) {
            appendMessage(line, sender);
            chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom after each line
            await new Promise(resolve => setTimeout(resolve, delayPerLine));
        }
        hideTypingIndicator();
    };

    const sendMessageToBot = async (message) => {
        console.log('Sending message to bot:', message);
        showTypingIndicator();
        try {
            const response = await fetch(`/api/chat?message=${encodeURIComponent(message)}`);
            console.log('Received response from bot (raw):', response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Parsed data from bot:', data);

            if (data && data.response) {
                console.log('Calling appendMessage with bot response:', data.response);
                // Check if the response is an array (for line-by-line display)
                if (Array.isArray(data.response)) {
                    let delayForThisResponse = 500; // Default delay
                    if (message === 'tell us more') { // Check if it's the specific message
                        delayForThisResponse = 1000; // Increased delay for "tell us more"
                    }
                    await typeMessageLineByLine(data.response, 'bot', delayForThisResponse);
                } else {
                    appendMessage(data.response, 'bot');
                }
            } else {
                console.warn('Bot response was empty or malformed:', data);
                appendMessage('Oops! The bot did not provide a clear response. Please check the console for details.', 'bot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            appendMessage('Oops! Something went wrong. Please try again. Check the console for network errors.', 'bot');
        } finally {
            hideTypingIndicator();
        }
    };

    // Initial message sequence
    let delay = 1000; // Increased initial delay

    // 1. Namaskaram! 🙏
    setTimeout(() => {
        appendMessage("Namaskaram! 🙏", 'bot');
        showTypingIndicator();
    }, delay);

    // 2. We Avadhani and Aiswarya getting married 👩‍❤️‍👨
    delay += 2500; // Increased delay
    setTimeout(() => {
        hideTypingIndicator();
        appendMessage("Guided by divine grace and the blessings of our elders, We are cordially inviting you to witness the sacred beginning of our new journey together", 'bot');

        showTypingIndicator();
    }, delay);

    // 3. Guided by divine grace...
    delay += 3000; // Increased delay
    setTimeout(() => {
        hideTypingIndicator();
        appendMessage("We Avadhani and Aiswarya getting married 👩‍❤️‍👨", 'bot');        
        // Show the first question button after the last welcome message
        setTimeout(() => {
            questionButtonsDiv.style.display = 'flex';
            whenBtn.style.display = 'block';
            venueBtn.style.display = 'none';
            tellBtn.style.display = 'none';
            tellUsMoreBtn.style.display = 'none'; // Hide new button initially
        }, 500);
    }, delay);



    whenBtn.addEventListener('click', async () => {
        whenBtn.style.display = 'none';
        appendMessage('When is the wedding?', 'user');
        await sendMessageToBot('date');
        
        setTimeout(() => {
            venueBtn.style.display = 'block';
        }, 500);
    });

    venueBtn.addEventListener('click', async () => {
        venueBtn.style.display = 'none';
        appendMessage('Where is the venue?', 'user');
        await sendMessageToBot('venue');

        // Removed the line that changes the background image
        // if (chatBackgroundOverlay) {
        //     chatBackgroundOverlay.style.backgroundImage = 'url("/static/images/backtwo.png")';
        // }

        setTimeout(() => {
            tellBtn.style.display = 'block';
        }, 500);
    });

    tellBtn.addEventListener('click', async () => {
        tellBtn.style.display = 'none';
        appendMessage('Tell me more?', 'user');
        await sendMessageToBot('tell me more');

        setTimeout(() => {
            tellUsMoreBtn.style.display = 'block'; // Show new button after this response
        }, 500);
    });

    tellUsMoreBtn.addEventListener('click', async () => {
        tellUsMoreBtn.style.display = 'none';
        appendMessage('Tell us more?', 'user');
        await sendMessageToBot('tell us more');
    });
});
