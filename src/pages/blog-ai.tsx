import React, { useState } from 'react';
import { askChatGPT } from '@/lib/openai';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check, Download, ArrowRight } from 'lucide-react';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';

export default function BlogAIPage() {
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [wordCount, setWordCount] = useState('500');
  const [blogContent, setBlogContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateBlog = async () => {
    if (!productName.trim()) {
      alert('Veuillez entrer un nom de produit');
      return;
    }

    setLoading(true);
    try {
      const prompt = `
Rédige un article de blog optimisé SEO pour le produit suivant :
- Produit/Sujet : ${productName}
- Mots-clés à inclure : ${keywords || 'à déterminer selon le produit'}
- Ton : ${tone}
- Longueur approximative : ${wordCount} mots

L'article doit inclure :
- Un titre accrocheur
- Une introduction engageante
- Des sous-titres structurés
- Des paragraphes informatifs
- Une conclusion avec appel à l'action
- Optimisation SEO naturelle

Format : Article complet en HTML simple (utilise des balises h1, h2, p, ul, li, etc.)
`;
      const content = await askChatGPT(prompt);
      setBlogContent(content);
    } catch (error) {
      console.error("Erreur lors de la génération du blog:", error);
      alert("Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blogContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsHTML = () => {
    const element = document.createElement("a");
    const file = new Blob([blogContent], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `blog-${productName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Générateur de Blog IA</h1>
          <div className="text-sm text-gray-500">Propulsé par IA avancée</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-medium mb-4">Paramètres de l'article</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produit ou sujet de l'article *
              </label>
              <Input
                placeholder="Ex: Écouteurs sans fil à réduction de bruit"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mots-clés (séparés par des virgules)
              </label>
              <Input
                placeholder="Ex: écouteurs bluetooth, réduction de bruit, sans fil, audio"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Laissez vide pour que l'IA détermine les mots-clés pertinents
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ton de l'article
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="professional">Professionnel</option>
                  <option value="casual">Décontracté</option>
                  <option value="enthusiastic">Enthousiaste</option>
                  <option value="informative">Informatif</option>
                  <option value="persuasive">Persuasif</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longueur approximative (mots)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                >
                  <option value="300">Court (~300 mots)</option>
                  <option value="500">Moyen (~500 mots)</option>
                  <option value="800">Long (~800 mots)</option>
                  <option value="1200">Très long (~1200 mots)</option>
                </select>
              </div>
            </div>
            
            <Button 
              onClick={generateBlog} 
              disabled={loading || !productName.trim()} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                'Générer l\'article'
              )}
            </Button>
          </div>
        </div>

        {blogContent && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Article généré</h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copier
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadAsHTML}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50 max-h-[600px] overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: blogContent }} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}