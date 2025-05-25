import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { askChatGPT } from '@/lib/openai';

export default function SeoCompetitorPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSEO = async () => {
    if (!url.trim()) return alert("Merci d'entrer une URL valide.");
    setLoading(true);
    setResult(null);

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
      const response = await askChatGPT(prompt);
      const data = JSON.parse(response);
      setResult(data);
    } catch (error) {
      alert("Erreur lors de l'analyse SEO.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔍 Analyse SEO Concurrente</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Entrez l’URL d’un concurrent"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={analyzeSEO} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Analyser'}
        </Button>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Résultat SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Score :</strong> {result.score} / 100</p>
            <p><strong>Title :</strong> {result.title}</p>
            <p><strong>Description :</strong> {result.description}</p>
            <div>
              <strong>Recommandations :</strong>
              <ul className="list-disc list-inside">
                {result.recommendations?.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}