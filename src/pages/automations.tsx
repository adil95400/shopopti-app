import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function AutomationsPage() {
  const [payload, setPayload] = useState('{\n  "event": "product_added",\n  "name": "Chaussure AI",\n  "price": 49.99\n}');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Add state for toggle switches
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [stockUpdateEnabled, setStockUpdateEnabled] = useState(true);
  const [emailConfirmationEnabled, setEmailConfirmationEnabled] = useState(true);

  const sendWebhook = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      setResult('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult('Webhook envoyé avec succès! Événement traité par le service d\'automatisation.');
      setSuccess(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du webhook:', error);
      setResult('Erreur: Impossible d\'envoyer le webhook. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🔗 Automatisations</h1>
          <p className="text-gray-600 mt-1">Configurez des automatisations pour votre boutique</p>
        </div>
        <Button variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          Nouvelle automatisation
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Tester un webhook</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payload JSON
            </label>
            <Textarea 
              value={payload} 
              onChange={e => setPayload(e.target.value)} 
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          
          <Button 
            onClick={sendWebhook} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer vers Webhook
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
        
        {result && (
          <div className={`mt-4 p-4 rounded ${success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              {success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              ) : (
                <Zap className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              )}
              <div>
                <strong className={success ? 'text-green-700' : 'text-red-700'}>Réponse :</strong>
                <p className={`mt-1 ${success ? 'text-green-600' : 'text-red-600'}`}>{result}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Automatisations actives</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Notification de commande</h3>
                  <p className="text-sm text-gray-500">Envoie une notification quand une nouvelle commande est reçue</p>
                </div>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                  className="sr-only"
                />
                <label
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                    notificationEnabled ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                      notificationEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Mise à jour de stock</h3>
                  <p className="text-sm text-gray-500">Met à jour le stock quand un produit est vendu</p>
                </div>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={stockUpdateEnabled}
                  onChange={(e) => setStockUpdateEnabled(e.target.checked)}
                  className="sr-only"
                />
                <label
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                    stockUpdateEnabled ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                      stockUpdateEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email de confirmation</h3>
                  <p className="text-sm text-gray-500">Envoie un email de confirmation après chaque achat</p>
                </div>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={emailConfirmationEnabled}
                  onChange={(e) => setEmailConfirmationEnabled(e.target.checked)}
                  className="sr-only"
                />
                <label
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                    emailConfirmationEnabled ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                      emailConfirmationEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          Voir toutes les automatisations
        </Button>
      </div>
    </div>
  );
}