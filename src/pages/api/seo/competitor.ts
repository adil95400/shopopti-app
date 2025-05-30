import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL manquante' });
  }

  const prompt = `
Analyse SEO d'une page concurrente : ${url}
Retourne un JSON avec :
{
  "score": 0 à 100,
  "title": "...",
  "description": "...",
  "recommendations": ["...", "..."]
}`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const output = response.data.choices[0].message?.content ?? '{}';
    const result = JSON.parse(output);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur IA' });
  }
}