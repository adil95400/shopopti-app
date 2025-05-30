import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Truck, MapPin, Calendar, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      setError("Veuillez entrer un numéro de suivi");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer un résultat fictif pour la démonstration
      if (trackingNumber.length < 5) {
        throw new Error("Numéro de suivi invalide");
      }
      
      // Générer un résultat aléatoire
      const mockStatuses = [
        { code: 'delivered', label: 'Livré', color: 'success' },
        { code: 'in_transit', label: 'En transit', color: 'primary' },
        { code: 'out_for_delivery', label: 'En cours de livraison', color: 'primary' },
        { code: 'pending', label: 'En attente', color: 'warning' },
        { code: 'exception', label: 'Problème de livraison', color: 'error' }
      ];
      
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      const detectedCarrier = ['FedEx', 'UPS', 'DHL', 'La Poste', 'Colissimo'][Math.floor(Math.random() * 5)];
      
      // Générer un historique fictif
      const today = new Date();
      const history = [];
      
      if (randomStatus.code === 'delivered') {
        history.push({
          date: new Date(today.getTime() - 1000 * 60 * 60 * 2).toLocaleString(),
          location: 'Adresse de livraison',
          status: 'Colis livré',
          description: 'Le colis a été livré au destinataire'
        });
      }
      
      if (['delivered', 'out_for_delivery', 'in_transit', 'exception'].includes(randomStatus.code)) {
        history.push({
          date: new Date(today.getTime() - 1000 * 60 * 60 * 8).toLocaleString(),
          location: 'Centre de distribution local',
          status: randomStatus.code === 'exception' ? 'Problème de livraison' : 'En cours de livraison',
          description: randomStatus.code === 'exception' ? 'Adresse incomplète' : 'Le colis est en cours de livraison'
        });
        
        history.push({
          date: new Date(today.getTime() - 1000 * 60 * 60 * 24).toLocaleString(),
          location: 'Centre de tri régional',
          status: 'En transit',
          description: 'Le colis est en cours d\'acheminement'
        });
      }
      
      history.push({
        date: new Date(today.getTime() - 1000 * 60 * 60 * 48).toLocaleString(),
        location: 'Centre de tri national',
        status: 'Colis reçu',
        description: 'Le colis a été reçu et est en cours de traitement'
      });
      
      history.push({
        date: new Date(today.getTime() - 1000 * 60 * 60 * 72).toLocaleString(),
        location: 'Entrepôt expéditeur',
        status: 'Colis expédié',
        description: 'Le colis a été expédié par le vendeur'
      });
      
      setResult({
        trackingNumber,
        carrier: detectedCarrier,
        status: randomStatus,
        estimatedDelivery: randomStatus.code === 'delivered' ? null : new Date(today.getTime() + 1000 * 60 * 60 * 24 * 2).toLocaleDateString(),
        history: history.reverse()
      });
    } catch (err: any) {
      console.error('Erreur de suivi:', err);
      setError(err.message || "Une erreur est survenue lors du suivi du colis");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suivi de livraison</h1>
        <div className="text-sm text-gray-500">Suivi multi-transporteurs</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de suivi
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Entrez votre numéro de suivi"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading || !trackingNumber.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recherche...
                  </>
                ) : (
                  'Suivre'
                )}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transporteur (optionnel)
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
            >
              <option value="auto">Détection automatique</option>
              <option value="fedex">FedEx</option>
              <option value="ups">UPS</option>
              <option value="dhl">DHL</option>
              <option value="laposte">La Poste</option>
              <option value="colissimo">Colissimo</option>
              <option value="chronopost">Chronopost</option>
              <option value="dpd">DPD</option>
              <option value="gls">GLS</option>
              <option value="tnt">TNT</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur de suivi</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center">
                <h2 className="text-lg font-medium">Colis {result.trackingNumber}</h2>
                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  result.status.color === 'success' ? 'bg-green-100 text-green-800' :
                  result.status.color === 'error' ? 'bg-red-100 text-red-800' :
                  result.status.color === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {result.status.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Transporteur: {result.carrier}
              </p>
            </div>
            
            {result.estimatedDelivery && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Livraison estimée</p>
                <p className="font-medium">{result.estimatedDelivery}</p>
              </div>
            )}
          </div>
          
          <div className="relative pb-12">
            {result.history.map((event: any, index: number) => (
              <div key={index} className="relative pb-8">
                {index < result.history.length - 1 && (
                  <div className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                )}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <div className={`relative px-1 ${
                      index === 0 ? 
                        result.status.code === 'delivered' ? 'bg-green-500' : 
                        result.status.code === 'exception' ? 'bg-red-500' : 
                        'bg-blue-500' 
                      : 'bg-gray-300'
                    } h-10 w-10 rounded-full flex items-center justify-center`}>
                      {index === 0 ? (
                        result.status.code === 'delivered' ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : result.status.code === 'exception' ? (
                          <AlertTriangle className="h-6 w-6 text-white" />
                        ) : (
                          <Truck className="h-6 w-6 text-white" />
                        )
                      ) : (
                        <Package className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.status}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {event.date}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <p className="mt-1">{event.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <Button variant="outline">
                Imprimer
              </Button>
              <Button>
                Contacter le transporteur
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Suivi multi-transporteurs</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Notre système prend en charge le suivi de colis pour plus de 600 transporteurs dans le monde entier, dont FedEx, UPS, DHL, La Poste, Colissimo, et bien d'autres.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}