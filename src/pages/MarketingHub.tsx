import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Mail, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Share2, 
  Calendar, 
  Megaphone, 
  Target, 
  Zap,
  Loader2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';

const MarketingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  
  const handleGenerateContent = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Hub</h1>
          <p className="text-gray-600">
            Centralisez et optimisez toutes vos campagnes marketing
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Campagne
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Campagnes Actives</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <Megaphone className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500 mt-2">3 en attente d'approbation</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Taux d'Ouverture</h3>
            <div className="p-2 bg-green-50 rounded-full">
              <Mail className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">24.8%</p>
          <p className="text-sm text-green-500 mt-2">+2.3% vs mois dernier</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Taux de Conversion</h3>
            <div className="p-2 bg-purple-50 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">3.2%</p>
          <p className="text-sm text-green-500 mt-2">+0.5% vs mois dernier</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">ROI Marketing</h3>
            <div className="p-2 bg-orange-50 rounded-full">
              <BarChart3 className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">342%</p>
          <p className="text-sm text-green-500 mt-2">+15% vs mois dernier</p>
        </div>
      </div>

      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Social Media</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            <span>Automation</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>SMS</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Campagnes Email</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Campagne
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ouvertures
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clics
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'envoi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Promotion Été 2025</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Envoyé
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">28.4%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">12.1%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">3.5%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">15/06/2025</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Bienvenue Nouveaux Clients</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Automatisé
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">42.7%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">18.3%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">5.2%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Continu</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Lancement Produit XYZ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Planifié
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">-</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">-</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">-</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">25/07/2025</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="social">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Publications Sociales</h3>
              <div className="flex space-x-2">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Publication
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        F
                      </div>
                      <span className="ml-2 font-medium">Facebook</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Publié
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm">Découvrez notre nouvelle collection d'été ! 🌞 Profitez de 20% de réduction avec le code SUMMER20 #mode #été</p>
                  <div className="mt-4 h-40 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Image Preview</span>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>15/06/2025</span>
                    <div>
                      <span className="mr-2">👍 45</span>
                      <span>💬 12</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
                        I
                      </div>
                      <span className="ml-2 font-medium">Instagram</span>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Planifié
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm">✨ Notre best-seller est de retour en stock ! Lequel est votre préféré ? #shopping #musthave</p>
                  <div className="mt-4 h-40 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Image Preview</span>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>20/06/2025</span>
                    <div>
                      <span>Programmé</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center text-white">
                        T
                      </div>
                      <span className="ml-2 font-medium">Twitter</span>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Brouillon
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm">Grande nouvelle ! Notre application est maintenant disponible sur iOS et Android. Téléchargez-la dès maintenant ! #app #launch</p>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>Non programmé</span>
                    <div>
                      <Button size="sm" variant="outline">Éditer</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-4">Générer du contenu avec l'IA</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produit ou sujet</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="ex: Nouvelle collection d'été"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plateforme</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ton</label>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Professionnel</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Décontracté</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Enthousiaste</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Informatif</button>
                  </div>
                </div>
              </div>
              <Button 
                className="mt-4"
                onClick={handleGenerateContent}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Générer du contenu
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="automation">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Automatisations Marketing</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Automatisation
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Email de bienvenue</h4>
                    <p className="text-sm text-gray-500">Envoyé automatiquement aux nouveaux clients</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-2">
                      Actif
                    </span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-1"
                        className="sr-only"
                        defaultChecked
                      />
                      <label
                        htmlFor="toggle-1"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Dernière exécution: Aujourd'hui à 14:32</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Panier abandonné</h4>
                    <p className="text-sm text-gray-500">Rappel envoyé 4h après abandon du panier</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-2">
                      Actif
                    </span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-2"
                        className="sr-only"
                        defaultChecked
                      />
                      <label
                        htmlFor="toggle-2"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Dernière exécution: Hier à 18:45</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Réengagement clients inactifs</h4>
                    <p className="text-sm text-gray-500">Envoyé aux clients sans achat depuis 30 jours</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-2">
                      Actif
                    </span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-3"
                        className="sr-only"
                        defaultChecked
                      />
                      <label
                        htmlFor="toggle-3"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Dernière exécution: 12/06/2025</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Anniversaire client</h4>
                    <p className="text-sm text-gray-500">Offre spéciale envoyée le jour de l'anniversaire</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mr-2">
                      En pause
                    </span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-4"
                        className="sr-only"
                      />
                      <label
                        htmlFor="toggle-4"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span className="block h-6 w-6 rounded-full bg-white transform translate-x-0"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Dernière exécution: 05/06/2025</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sms">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Campagnes SMS</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Campagne SMS
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Soldes Flash 24h</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Envoyé
                  </span>
                </div>
                <p className="mt-2 text-sm">Soldes Flash 24h ! Profitez de -30% sur tout le site avec le code FLASH30. Offre valable aujourd'hui uniquement. Shopopti+</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Envoyé le: 10/06/2025</span>
                  <span>1250 destinataires</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <p className="text-xs text-gray-500">Délivrés</p>
                    <p className="font-medium">98.2%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <p className="text-xs text-gray-500">Clics</p>
                    <p className="font-medium">12.5%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md text-center">
                    <p className="text-xs text-gray-500">Conversions</p>
                    <p className="font-medium">3.8%</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Rappel Événement</h4>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Planifié
                  </span>
                </div>
                <p className="mt-2 text-sm">Rappel: Notre événement exclusif commence demain à 19h. N'oubliez pas votre code VIP pour accéder aux offres spéciales. Shopopti+</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Planifié pour: 20/06/2025</span>
                  <span>850 destinataires</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-4">Créer une nouvelle campagne SMS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la campagne</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="ex: Promotion Été 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="all">Tous les clients</option>
                    <option value="new">Nouveaux clients (30 derniers jours)</option>
                    <option value="inactive">Clients inactifs (90+ jours)</option>
                    <option value="vip">Clients VIP</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (160 caractères max)</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Votre message SMS ici..."
                    maxLength={160}
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">N'oubliez pas d'inclure le nom de votre entreprise et un moyen de se désabonner.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'envoi</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure d'envoi</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <Button className="mt-4">
                <Zap className="h-4 w-4 mr-2" />
                Générer avec l'IA
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Analyse Marketing</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md">
                  <option value="30">30 derniers jours</option>
                  <option value="90">90 derniers jours</option>
                  <option value="180">6 derniers mois</option>
                  <option value="365">12 derniers mois</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Performance par canal</h4>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Graphique: Performance par canal</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Canal le plus performant</p>
                    <p className="font-medium">Email Marketing</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Meilleur ROI</p>
                    <p className="font-medium">452% (Email)</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Conversions par campagne</h4>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Graphique: Conversions par campagne</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Campagne la plus performante</p>
                    <p className="font-medium">Soldes d'été 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taux de conversion</p>
                    <p className="font-medium">5.8%</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Segmentation d'audience</h4>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Graphique: Segmentation d'audience</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Segment le plus engagé</p>
                  <p className="font-medium">Clients fidèles (3+ achats)</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Tendances temporelles</h4>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Graphique: Tendances temporelles</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Meilleur moment d'envoi</p>
                  <p className="font-medium">Mardi, 10h-12h</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-4">Recommandations IA</h4>
              <div className="border rounded-lg p-4 bg-blue-50">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <span>Augmentez la fréquence des emails pour le segment "Clients VIP" qui montre un taux d'engagement 45% supérieur à la moyenne.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <span>Optimisez vos campagnes SMS en les envoyant entre 18h et 20h pour améliorer le taux d'ouverture de 12%.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <span>Créez une campagne de réengagement ciblant les 1500 clients inactifs depuis plus de 60 jours avec une offre personnalisée.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingHub;