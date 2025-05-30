import { useState } from 'react';
import { askChatGPT } from "../lib/openai";

export function useChatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const prompt = `
Tu es l'assistant support officiel de Shopopti+, une plateforme de dropshipping et e-commerce.
Réponds de manière professionnelle, concise et utile.

Informations sur Shopopti+ :
- Plateforme tout-en-un pour le dropshipping et l'e-commerce
- Fonctionnalités principales : importation de produits, optimisation par IA, automatisation des commandes
- Intégrations : Shopify, WooCommerce, AliExpress, Amazon, etc.
- Forfaits : Gratuit, Pro (29€/mois), Agency (99€/mois)

Question du client : "${input}"
`;

      const response = await askChatGPT(prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error('Error getting response:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.message || 
          "Je suis désolé, je rencontre actuellement des difficultés techniques. " +
          "Veuillez réessayer dans quelques instants ou contacter notre équipe support à support@shopopti.com."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, sendMessage, loading, error };
}