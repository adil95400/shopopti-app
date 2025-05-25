import React, { useState } from 'react';
import { askChatGPT } from '../lib/openai';

const Assistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);
    try {
      const response = await askChatGPT(query);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Erreur OpenAI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assistant IA (GPT)</h1>
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto border p-4 rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.role === 'user' ? '👤' : '🤖'}</strong> {msg.text}</p>
        ))}
        {loading && <p>⏳ Réflexion en cours...</p>}
      </div>
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pose ta question..." className="border px-3 py-2 rounded w-full" />
        <button onClick={handleSend} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Envoyer</button>
      </div>
    </div>
  );
};

export default Assistant;
