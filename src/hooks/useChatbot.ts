import { useState } from 'react';
import { askChatGPT } from "../lib/openai";

export function useChatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const response = await askChatGPT(
      `Répond comme un assistant support Shopopti+. Question : "${input}"`
    );

    setMessages([...newMessages, { role: 'assistant', content: response }]);
  };

  return { messages, input, setInput, sendMessage };
}
