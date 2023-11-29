const MAX_TOKENS = 1000; // Adjust the token limit as needed
const AVG_WORD_LENGTH = 4; // Average English word length in characters
const AVG_TOKENS_PER_WORD = 1.5; // Average tokens per word (approximation)
const SYSTEM_MESSAGE = { "role": "system", "content": "You are a helpful assistant." };

let conversationHistory = [SYSTEM_MESSAGE];

document.getElementById('sendButton').addEventListener('click', () => {
    let userMessageContent = document.getElementById('messageInput').value;
    if (!userMessageContent.trim()) return;

    let userMessage = { "role": "user", "content": userMessageContent };
    sendMessage(userMessage);
    document.getElementById('messageInput').value = ''; // Clear input field
});

function countTokens(message) {
    return Math.ceil((message.content.length / AVG_WORD_LENGTH) * AVG_TOKENS_PER_WORD);
}

function trimHistory() {
    let tokenCount = conversationHistory.reduce((total, msg) => total + countTokens(msg), 0);

    while (tokenCount > MAX_TOKENS && conversationHistory.length > 1) {
        if (conversationHistory[1].role === 'system') {
            // Avoid removing the system message
            break;
        }
        conversationHistory.splice(1, 1); // Remove the second message in the array
        tokenCount = conversationHistory.reduce((total, msg) => total + countTokens(msg), 0);
    }
}

function sendMessage(userMessage) {
    conversationHistory.push(userMessage);
    trimHistory();
    updateChatDisplay(userMessage.content, 'You');

    fetch('/cloudchat/gpt_chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'conversation': conversationHistory }),
    })
    .then(response => response.json())
    .then(data => {
        let assistantMessage = { "role": "assistant", "content": data.text };
        conversationHistory.push(assistantMessage);
        updateChatDisplay(data.text, 'Assistant');
    })
    .catch((error) => {
        console.error('Error:', error);
        updateChatDisplay('Error occurred.', 'System');
    });
}

function updateChatDisplay(message, sender) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    messageDiv.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Additional functions for handling chat UI can be added here
