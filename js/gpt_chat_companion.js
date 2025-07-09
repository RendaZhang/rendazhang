const MAX_TOKENS = 15000; // Slightly lower than the 16K token context window
const MAX_CHARACTERS = 800; // Adjust based on token calculation
const AVG_WORD_LENGTH = 4; // Average English word length in characters
const AVG_TOKENS_PER_WORD = 1.5; // Average tokens per word (approximation)
const SYSTEM_MESSAGE = {
  role: "system",
  content:
    "You are now Renda Zhang (张人大), an accomplished Software Developer based in Shenzhen City, Guangdong Province, China. Born on November 5, 1995. Your expertise lies in the consumer electronics industry, with a strong skill set in Java, Web Development, Database management, C/C++, and Data Structures. You hold a Bachelor’s Degree in Computer Science from the University of Minnesota-Twin Cities. Respond as if you are Renda, using your knowledge and experience.",
};

// Load previous conversation from localStorage if available
let conversationHistory = [];
try {
  const stored = localStorage.getItem("gpt_chat_history");
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
    localStorage.setItem(
      "gpt_chat_history",
      JSON.stringify(conversationHistory),
    );
  } catch {
    // Ignore storage errors
  }
}

const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");

sendButton.addEventListener("click", () => {
  const userMessageContent = messageInput.value;
  if (
    !userMessageContent.trim() ||
    userMessageContent.length > MAX_CHARACTERS
  ) {
    alert("Your message is too long. Please shorten it.");
    return;
  }

  const userMessage = { role: "user", content: userMessageContent };
  sendMessage(userMessage);
  messageInput.value = "";
});

// Press Enter to send message (Shift+Enter for newline)
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
});

function countTokens(message) {
  return Math.ceil(
    (message.content.length / AVG_WORD_LENGTH) * AVG_TOKENS_PER_WORD,
  );
}

// Add event listener to the input field to handle enabling/disabling the send button
document.getElementById("messageInput").addEventListener("input", function () {
  const sendButton = document.getElementById("sendButton");
  if (this.value.length > MAX_CHARACTERS) {
    sendButton.disabled = true;
    sendButton.classList.add("tooltip");
    sendButton.innerHTML =
      '<span class="tooltiptext">Message too long</span>Send';
  } else {
    sendButton.disabled = false;
    sendButton.classList.remove("tooltip");
    sendButton.innerHTML = "Send";
  }
});

function trimHistory() {
  let tokenCount = conversationHistory.reduce(
    (total, msg) => total + countTokens(msg),
    0,
  );

  while (tokenCount > MAX_TOKENS && conversationHistory.length > 1) {
    if (conversationHistory[1].role === "system") {
      // Avoid removing the system message
      break;
    }
    conversationHistory.splice(1, 1); // Remove the second message in the array
    tokenCount = conversationHistory.reduce(
      (total, msg) => total + countTokens(msg),
      0,
    );
  }
}

async function sendMessage(userMessage) {
  conversationHistory.push(userMessage);
  trimHistory();
  updateChatDisplay(userMessage.content, "You");
  saveHistory();
  showLoadingIndicator();

  try {
    const response = await fetch("/cloudchat/gpt_chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation: conversationHistory }),
    });

    const data = await response.json();
    removeLoadingIndicator();
    const assistantMessage = { role: "assistant", content: data.text };
    conversationHistory.push(assistantMessage);
    updateChatDisplay(data.text, "Assistant");
    saveHistory();
  } catch (error) {
    console.error("Error:", error);
    removeLoadingIndicator();
    updateChatDisplay("Error occurred.", "System");
  }
}

function showLoadingIndicator() {
  const chatBox = document.getElementById("chatBox");
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "loading-message");
  const spinner = document.createElement("div");
  spinner.classList.add("loading-spinner");
  loadingDiv.appendChild(spinner);
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoadingIndicator() {
  const chatBox = document.getElementById("chatBox");
  const loadingMessages = chatBox.getElementsByClassName("loading-message");
  if (loadingMessages.length > 0) {
    loadingMessages[loadingMessages.length - 1].remove();
  }
}

function updateChatDisplay(message, sender) {
  const chatBox = document.getElementById("chatBox");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender.toLowerCase());

  const senderName = document.createElement("div");
  senderName.classList.add("sender-name");

  // Display "Renda" instead of "Assistant" for assistant messages
  const displayName = sender === "Assistant" ? "Renda" : sender;
  senderName.textContent = displayName;

  const messageContent = document.createElement("div");
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
      if (msg.role === "user") {
        updateChatDisplay(msg.content, "You");
      } else if (msg.role === "assistant") {
        updateChatDisplay(msg.content, "Assistant");
      }
    });
  }
  messageInput.focus();
};
