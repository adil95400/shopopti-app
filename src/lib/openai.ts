import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Simple in-memory request tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between requests

export async function askChatGPT(prompt: string): Promise<string> {
  try {
    // Basic rate limiting
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      throw new Error('Veuillez patienter quelques secondes avant de poser une nouvelle question.');
    }
    lastRequestTime = now;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Aucune réponse générée";
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Handle quota exceeded error
    if (error?.status === 429) {
      throw new Error(
        'Notre service AI est temporairement indisponible en raison d\'une utilisation élevée. ' +
        'Nous vous suggérons de :\n\n' +
        '1. Réessayer dans quelques minutes\n' +
        '2. Contacter notre support à support@shopopti.com si le problème persiste\n' +
        '3. Consulter notre centre d\'aide pour des réponses aux questions fréquentes'
      );
    }
    
    // Handle invalid API key
    if (error?.status === 401) {
      throw new Error(
        'Erreur d\'authentification avec notre service AI. ' +
        'Veuillez contacter le support technique à support@shopopti.com.'
      );
    }
    
    throw new Error(
      'Une erreur est survenue lors de la communication avec notre service AI. ' +
      'Veuillez réessayer plus tard ou contacter notre support.'
    );
  }
}