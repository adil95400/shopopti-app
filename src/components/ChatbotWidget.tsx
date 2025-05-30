import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from "../hooks/useChatbot";
import { Send, MessageCircle, X, User, Bot, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, sendMessage, loading } = useChatbot();
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(messages.length);

  // Notification sonore ou visuelle
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant') {
        // Son notification simple
        try {
          const audio = new Audio('/sounds/notify.mp3');
          audio.play().catch(() => {});
        } catch (error) {
          console.log('Audio notification not supported');
        }
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
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setOpen(true)}
          className="bg-primary text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
          aria-label="Ouvrir le chatbot"
        >
          <MessageCircle size={20} />
          <span className="font-medium">Besoin d'aide ?</span>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-96 h-[500px] bg-white border shadow-xl rounded-xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b bg-primary/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-primary" />
                <span className="font-semibold">Assistant Shopopti+</span>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                  <Bot size={40} className="text-primary/40 mb-4" />
                  <p className="font-medium text-gray-600 mb-2">Comment puis-je vous aider aujourd'hui ?</p>
                  <p className="text-sm">Posez-moi une question sur Shopopti+, l'importation de produits, ou toute autre fonctionnalité.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[80%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                        msg.role === 'user' ? 'bg-primary text-white ml-2' : 'bg-gray-200'
                      }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`px-4 py-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white shadow-sm rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[80%]">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 bg-gray-200">
                      <Bot size={16} />
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-white shadow-sm rounded-tl-none">
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 text-primary animate-spin mr-2" />
                        <span className="text-gray-500">En train d'écrire...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage();
                }
              }}
              className="p-4 border-t bg-white flex items-center gap-2"
            >
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Message chatbot"
              />
              <button 
                type="submit" 
                className={`p-2 rounded-full ${input.trim() ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                disabled={!input.trim() || loading}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}