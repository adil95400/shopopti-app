import React, { useState } from 'react';
import { askChatGPT } from '@/lib/openai';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check, Download, ArrowRight } from 'lucide-react';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';

export default function SEOAIPage() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generateSEO = async () => {
    if (!productName.trim()) {
      alert('Veuillez entrer au moins un nom de produit');
      return;
    }

    setLoading(true);
    try {
      const prompt = `
Produit : ${productName}
Description : ${productDescription}
Catégorie : ${category}

Génère un JSON SEO complet avec :
{
  "metaTitle": "Titre SEO optimisé (max 60 caractères)",
  "metaDescription": "Description méta optimisée (max 160 caractères)",
  "h1": "Titre H1 optimisé",
  "tags": ["tag1", "tag2", "tag3", ...],
  "jsonLD": { 
    "@context": "https://schema.org", 
    "@type": "Product",
    "name": "...",
    "description": "...",
    "brand": { "@type": "Brand", "name": "..." },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "...",
      "priceCurrency": "EUR"
    }
  },
  "recommendations": [
    "Recommandation SEO 1",
    "Recommandation SEO 2",
    "Recommandation SEO 3"
  ]
}
`;
      const raw = await askChatGPT(prompt);
      try {
        const parsed = JSON.parse(raw);
        setSeo(parsed);
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        // Tentative de récupération du JSON dans la réponse
        const jsonMatch = raw.match(/```json\n([\s\S]*?)\n```/) || raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const jsonContent = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonContent);
            setSeo(parsed);
          } catch (e) {
            throw new Error("Impossible de parser la réponse JSON");
          }
        } else {
          throw new Error("Format de réponse invalide");
        }
      }
    } catch (error) {
      console.error("Erreur IA SEO", error);
      alert("Erreur lors de la génération SEO. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadJSON = () => {
    if (!seo) return;
    
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(seo, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `seo-${productName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Optimisation SEO par IA</h1>
          <div className="text-sm text-gray-500">Propulsé par IA avancée</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-medium mb-4">Informations produit</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit *
              </label>
              <Input
                placeholder="Ex: Écouteurs sans fil à réduction de bruit"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description du produit
              </label>
              <Textarea
                placeholder="Décrivez votre produit en quelques phrases..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <Input
                placeholder="Ex: Électronique, Mode, Maison, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={generateSEO} 
              disabled={loading || !productName.trim()} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                'Générer l\'optimisation SEO'
              )}
            </Button>
          </div>
        </div>

        {seo && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Résultats SEO</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={downloadJSON}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger JSON
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Meta Title</h3>
                  <button 
                    onClick={() => copyToClipboard(seo.metaTitle, 'meta-title')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copied === 'meta-title' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {seo.metaTitle}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {seo.metaTitle.length}/60 caractères
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Meta Description</h3>
                  <button 
                    onClick={() => copyToClipboard(seo.metaDescription, 'meta-desc')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copied === 'meta-desc' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {seo.metaDescription}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {seo.metaDescription.length}/160 caractères
                </p>
              </div>
              
              {seo.h1 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Titre H1</h3>
                    <button 
                      onClick={() => copyToClipboard(seo.h1, 'h1')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {copied === 'h1' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    {seo.h1}
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Tags</h3>
                  <button 
                    onClick={() => copyToClipboard(seo.tags.join(', '), 'tags')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copied === 'tags' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seo.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Rich Snippet (JSON-LD)</h3>
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(seo.jsonLD, null, 2), 'json-ld')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copied === 'json-ld' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-gray-50 rounded-md border border-gray-200 overflow-x-auto text-sm">
                  {JSON.stringify(seo.jsonLD, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Recommandations SEO</h3>
                <ul className="space-y-2">
                  {seo.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}