import React, { useState } from 'react';
import { Key, Copy, Check, RefreshCw, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface ApiKeyGeneratorProps {
  onGenerate: () => Promise<{ key: string; secret?: string }>;
}

const ApiKeyGenerator: React.FC<ApiKeyGeneratorProps> = ({ onGenerate }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<'key' | 'secret' | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const { key, secret } = await onGenerate();
      setApiKey(key);
      setApiSecret(secret || null);
      toast.success('Clé API générée avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération de la clé API:', error);
      toast.error('Erreur lors de la génération de la clé API');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'key' | 'secret') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type === 'key' ? 'Clé API' : 'Secret API'} copié dans le presse-papiers`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 rounded-full mr-3">
          <Key className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium">Clés API</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Générez des clés API pour intégrer Shopopti+ à vos applications ou services tiers.
      </p>
      
      {!apiKey ? (
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Générer une nouvelle clé API
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clé API
            </label>
            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="w-full rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => copyToClipboard(apiKey, 'key')}
                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                {copied === 'key' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {apiSecret && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret API
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={apiSecret}
                    readOnly
                    className="w-full rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecret ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard(apiSecret, 'secret')}
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100"
                >
                  {copied === 'secret' ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-red-500">
                Attention : Notez ce secret maintenant. Il ne sera plus affiché ultérieurement.
              </p>
            </div>
          )}
          
          <div className="pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Régénérer
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setApiKey(null);
                setApiSecret(null);
              }}
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Informations importantes</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Les clés API donnent un accès complet à votre compte Shopopti+</li>
          <li>Ne partagez jamais vos clés API avec des tiers non fiables</li>
          <li>Régénérez vos clés immédiatement si vous soupçonnez qu'elles ont été compromises</li>
          <li>Chaque clé API est valide pendant 1 an</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiKeyGenerator;