import { useState } from 'react';
import { aiService } from '../../../services/aiService';

export interface AiAssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAiAssistant(initialContext?: string) {
  const [messages, setMessages] = useState<AiAssistantMessage[]>(
    initialContext 
      ? [{ 
          role: 'assistant', 
          content: initialContext, 
          timestamp: new Date() 
        }] 
      : []
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AiAssistantMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const prompt = `
You are the official AI assistant for Shopopti+, an e-commerce and dropshipping platform.
Respond professionally, concisely, and helpfully.

About Shopopti+:
- All-in-one platform for dropshipping and e-commerce
- Main features: product import, AI optimization, order automation
- Integrations: Shopify, WooCommerce, AliExpress, Amazon, etc.
- Plans: Free, Pro (29€/month), Agency (99€/month)

User's question: "${input}"
`;

      const response = await aiService.generateResponse({
        review: input,
        rating: 5,
        sentiment: 'positive'
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      }]);
    } catch (error: any) {
      console.error('Error getting response:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.message || 
          "I'm sorry, I'm experiencing technical difficulties at the moment. " +
          "Please try again in a few moments or contact our support team at support@shopopti.com.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, sendMessage, loading, error };
}