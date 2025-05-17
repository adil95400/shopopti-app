export async function optimizeProductAI(product: {
  name: string;
  description: string;
  category?: string;
}) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const prompt = `
Optimise le produit suivant pour une boutique Shopify :

Nom : ${product.name}
Description : ${product.description}
Catégorie : ${product.category || 'N/A'}

Retourne un JSON avec les champs :
{
  "title": "...",
  "description_html": "...",
  "tags": ["...", "..."]
}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Tu es un assistant e-commerce expert en SEO pour Shopify." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Erreur OpenAI");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error("Erreur de format de réponse IA");
  }
}
export async function askChatGPT(prompt: string) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Tu es un assistant Shopify professionnel." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Erreur OpenAI");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
