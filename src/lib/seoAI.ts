export async function auditSEOWithAI({
  title,
  description,
  tags
}: {
  title: string;
  description: string;
  tags: string;
}) {
  const prompt = `
Analyse SEO d'une fiche produit :
Titre : ${title}
Description : ${description}
Tags : ${tags}

Retourne un JSON avec :
{
  "score": 85,
  "title": "...",
  "meta_description": "...",
  "rich_snippet": "{...}",
  "recommendations": ["..."]
}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${import.meta.env.VITE_OPENAI_API_KEY}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Tu es un expert en SEO e-commerce." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await res.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}