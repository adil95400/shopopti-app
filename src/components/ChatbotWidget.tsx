// ✅ ChatbotWidget avec animation + son ou alerte visuelle sur réponse IA
import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from "../hooks/useChatbot";
import { Send, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, sendMessage } = useChatbot();
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(messages.length);

  // Notification sonore ou visuelle
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant') {
        // Son notification simple
        const audio = new Audio('/sounds/notify.mp3');
        audio.play().catch(() => {});
      }
      prevMessageCount.current = messages.length;
    }
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          aria-label="Ouvrir le chatbot"
        >
          <MessageCircle size={18} /> Besoin d'aide ?
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="w-80 h-96 bg-white border shadow-xl rounded-xl flex flex-col"
          >
            <div className="p-3 border-b flex justify-between items-center bg-muted">
              <span className="font-semibold text-sm">Assistant IA Shopopti+</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground text-sm">✖</button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`px-3 py-2 rounded-lg max-w-[75%] ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-3 border-t flex items-center gap-2"
            >
              <input
                className="flex-1 border border-border rounded px-2 py-1 text-sm"
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Message chatbot"
              />
              <button type="submit" className="text-primary hover:text-primary/80">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
