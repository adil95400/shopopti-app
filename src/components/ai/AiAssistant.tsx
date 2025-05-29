import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiAssistantProps {
  initialContext?: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ initialContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: initialContext || 'Hello! I\'m your AI assistant. How can I help you with your e-commerce business today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate response based on user input
      let response = '';
      
      if (input.toLowerCase().includes('product')) {
        response = "I can help you optimize your product listings. Would you like me to suggest improvements for titles, descriptions, or pricing strategies?";
      } else if (input.toLowerCase().includes('supplier') || input.toLowerCase().includes('vendor')) {
        response = "Finding reliable suppliers is crucial. I can help you evaluate suppliers based on shipping times, product quality, and customer reviews. What specific criteria are you looking for?";
      } else if (input.toLowerCase().includes('marketing') || input.toLowerCase().includes('advertis')) {
        response = "For marketing your products, I recommend focusing on high-quality images, compelling product descriptions, and targeted social media campaigns. Would you like specific strategies for your niche?";
      } else if (input.toLowerCase().includes('trend') || input.toLowerCase().includes('popular')) {
        response = "Based on current market data, trending products include smart home devices, eco-friendly items, and wellness products. Would you like me to analyze specific niches for you?";
      } else {
        response = "I'm here to help with your e-commerce business. I can assist with product research, supplier evaluation, marketing strategies, and more. What specific area would you like to focus on?";
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Bot className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-medium">AI Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 relative group ${
              message.role === 'user'
                ? 'bg-blue-100 text-blue-900'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <div className="flex items-center mb-1">
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 mr-1 text-blue-600" />
                ) : (
                  <User className="h-4 w-4 mr-1 text-blue-600" />
                )}
                <span className="text-xs text-gray-500">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(message.content, index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
              <div className="flex items-center mb-1">
                <Bot className="h-4 w-4 mr-1 text-blue-600" />
                <span className="text-xs text-gray-500">
                  {formatTimestamp(new Date())}
                </span>
              </div>
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                <span className="text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className="rounded-l-none"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
          <span>Powered by AI - Responses are generated automatically</span>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;