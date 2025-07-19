const MAX_TOKENS = 15000; // Slightly lower than the 16K token context window
const MAX_CHARACTERS = 800; // Adjust based on token calculation
const AVG_WORD_LENGTH = 4; // Average English word length in characters
const AVG_TOKENS_PER_WORD = 1.5; // Average tokens per word (approximation)
const SYSTEM_MESSAGE = {
  role: 'system',
  content:
    'You are now Renda Zhang (张人大), an accomplished Software Developer based in Shenzhen City, Guangdong Province, China. Born on November 5, 1995. Your expertise lies in the consumer electronics industry, with a strong skill set in Java, Web Development, Database management, C/C++, and Data Structures. You hold a Bachelor’s Degree in Computer Science from the University of Minnesota-Twin Cities. Respond as if you are Renda, using your knowledge and experience.'
};

// Load previous conversation from localStorage if available
let conversationHistory = [];
try {
  const stored = localStorage.getItem('deepseek_chat_history');
  if (stored) {
    conversationHistory = JSON.parse(stored);
  } else {
    conversationHistory = [SYSTEM_MESSAGE];
  }
} catch {
  conversationHistory = [SYSTEM_MESSAGE];
}

function saveHistory() {
  try {
    localStorage.setItem('deepseek_chat_history', JSON.stringify(conversationHistory));
  } catch {
    // Ignore storage errors
  }
}

const sendButton = document.getElementById('sendButton');
const resetButton = document.getElementById('resetButton');
const messageInput = document.getElementById('messageInput');

sendButton.addEventListener('click', () => {
  const userMessageContent = messageInput.value;
  if (!userMessageContent.trim() || userMessageContent.length > MAX_CHARACTERS) {
    alert('Your message is too long. Please shorten it.');
    return;
  }

  const userMessage = { role: 'user', content: userMessageContent };
  sendMessage(userMessage);
  messageInput.value = '';
});

resetButton.addEventListener('click', () => {
  resetChat();
});

// Press Enter to send message (Shift+Enter for newline)
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
});

function countTokens(message) {
  return Math.ceil((message.content.length / AVG_WORD_LENGTH) * AVG_TOKENS_PER_WORD);
}

// Add event listener to the input field to handle enabling/disabling the send button
document.getElementById('messageInput').addEventListener('input', function () {
  const sendButton = document.getElementById('sendButton');
  if (this.value.length > MAX_CHARACTERS) {
    sendButton.disabled = true;
    sendButton.classList.add('tooltip');
    sendButton.innerHTML = '<span class="tooltiptext">Message too long</span>Send';
  } else {
    sendButton.disabled = false;
    sendButton.classList.remove('tooltip');
    sendButton.innerHTML = 'Send';
  }
});

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

async function sendMessage(userMessage) {
  conversationHistory.push(userMessage);
  trimHistory();
  updateChatDisplay(userMessage.content, 'You');
  saveHistory();
  showLoadingIndicator();

  try {
    const response = await fetch('/cloudchat/deepseek_chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage.content })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    removeLoadingIndicator();

    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'assistant');
    const senderName = document.createElement('div');
    senderName.classList.add('sender-name');
    senderName.textContent = 'Renda';
    const messageContent = document.createElement('div');
    messageDiv.appendChild(senderName);
    messageDiv.appendChild(messageContent);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.trim());
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.text) {
            assistantText += data.text;
            messageContent.textContent = assistantText;
            chatBox.scrollTop = chatBox.scrollHeight;
            MathJax.typesetPromise();
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }

    const assistantMessage = { role: 'assistant', content: assistantText };
    conversationHistory.push(assistantMessage);
    saveHistory();
  } catch (error) {
    console.error('Error:', error);
    removeLoadingIndicator();
    updateChatDisplay('Error occurred.', 'System');
  }
}

async function resetChat() {
  if (!confirm('Are you sure you want to reset the conversation?')) {
    return;
  }
  try {
    const response = await fetch('/cloudchat/reset_chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`Reset failed: ${response.status}`);
    }

    conversationHistory = [SYSTEM_MESSAGE];
    saveHistory();
    document.getElementById('chatBox').innerHTML = '';
  } catch (error) {
    alert(`Reset failed: ${error.message}`);
    console.error('Reset error:', error);
  }
}

function showLoadingIndicator() {
  const chatBox = document.getElementById('chatBox');
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('message', 'loading-message');
  const spinner = document.createElement('div');
  spinner.classList.add('loading-spinner');
  loadingDiv.appendChild(spinner);
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoadingIndicator() {
  const chatBox = document.getElementById('chatBox');
  const loadingMessages = chatBox.getElementsByClassName('loading-message');
  if (loadingMessages.length > 0) {
    loadingMessages[loadingMessages.length - 1].remove();
  }
}

function updateChatDisplay(message, sender) {
  const chatBox = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender.toLowerCase());

  const senderName = document.createElement('div');
  senderName.classList.add('sender-name');

  // Display "Renda" instead of "Assistant" for assistant messages
  const displayName = sender === 'Assistant' ? 'Renda' : sender;
  senderName.textContent = displayName;

  const messageContent = document.createElement('div');
  messageContent.textContent = message;

  messageDiv.appendChild(senderName);
  messageDiv.appendChild(messageContent);

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom

  // Process MathJax content
  MathJax.typesetPromise();
}

// Restore previous conversation and focus the input when the page loads
window.onload = function () {
  if (conversationHistory.length > 1) {
    conversationHistory.forEach((msg) => {
      if (msg.role === 'user') {
        updateChatDisplay(msg.content, 'You');
      } else if (msg.role === 'assistant') {
        updateChatDisplay(msg.content, 'Assistant');
      }
    });
  }
  messageInput.focus();
};
