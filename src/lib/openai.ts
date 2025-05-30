import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function askChatGPT(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Aucune réponse générée";
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Gérer spécifiquement l'erreur de quota dépassé
    if (error?.status === 429) {
      throw new Error('Le service est temporairement indisponible en raison d\'une utilisation élevée. Veuillez réessayer dans quelques minutes ou contacter le support si le problème persiste.');
    }
    
    throw new Error('Une erreur est survenue lors de la communication avec notre service AI. Veuillez réessayer plus tard.');
  }
}