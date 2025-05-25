
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { askChatGPT } from '@/lib/openai';

export default function SEOAIPage() {
  const [productName, setProductName] = useState('');
  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateSEO = async () => {
    setLoading(true);
    const prompt = \`
Produit : \${productName}

Génère un JSON SEO complet avec :
{
  "metaTitle": "...",
  "metaDescription": "...",
  "tags": ["...", "...", "..."],
  "jsonLD": { "@context": "https://schema.org", ... }
}
\`;

    try {
      const raw = await askChatGPT(prompt);
      const parsed = JSON.parse(raw);
      setSeo(parsed);
    } catch (err) {
      console.error("Erreur IA SEO", err);
      alert("Erreur lors de la génération SEO.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🔍 Génération SEO IA</h1>
      <Input
        placeholder="Nom du produit"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <Button onClick={generateSEO} disabled={loading}>
        {loading ? 'Génération en cours...' : 'Générer SEO'}
      </Button>

      {seo && (
        <div className="space-y-3 mt-4 p-4 bg-muted rounded">
          <h2 className="text-lg font-semibold">Résultats SEO générés</h2>
          <p><strong>Meta Title :</strong> {seo.metaTitle}</p>
          <p><strong>Meta Description :</strong> {seo.metaDescription}</p>
          <p><strong>Tags :</strong> {seo.tags?.join(', ')}</p>
          <div>
            <strong>Rich Snippet JSON-LD :</strong>
            <Textarea value={JSON.stringify(seo.jsonLD, null, 2)} rows={8} className="mt-2" readOnly />
          </div>
        </div>
      )}
    </div>
  );
}
