// src/services/chatService.js
export async function sendMessage(message) {
  const response = await fetch('https://www.rendazhang.com/cloudchat/deepseek_chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://www.rendazhang.com'
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response; // 返回响应对象，以便处理流式数据
}

export async function resetChat() {
  const response = await fetch('https://www.rendazhang.com/cloudchat/reset_chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://www.rendazhang.com'
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    throw new Error(`Reset failed: ${response.status}`);
  }
}
