import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Globe, 
  ShoppingBag, 
  Check, 
  AlertTriangle, 
  Search, 
  Filter, 
  Settings,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface Marketplace {
  id: string;
  name: string;
  region: string;
  logo: string;
  connected: boolean;
  products: number;
  status: 'active' | 'pending' | 'error';
  currency: string;
  language: string;
  commission: string;
  requirements: string[];
}

const GlobalMarketplaces: React.FC = () => {
  const [activeTab, setActiveTab] = useState('europe');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const europeanMarketplaces: Marketplace[] = [
    {
      id: 'amazon-eu',
      name: 'Amazon EU',
      region: 'Europe',
      logo: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: true,
      products: 124,
      status: 'active',
      currency: 'EUR',
      language: 'Multi-language',
      commission: '8-15%',
      requirements: ['VAT registration', 'EU compliance documentation', 'Local return address']
    },
    {
      id: 'cdiscount',
      name: 'Cdiscount',
      region: 'France',
      logo: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'EUR',
      language: 'French',
      commission: '5-12%',
      requirements: ['French business registration', 'SIRET number', 'French customer service']
    },
    {
      id: 'allegro',
      name: 'Allegro',
      region: 'Poland',
      logo: 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'PLN',
      language: 'Polish',
      commission: '6-15%',
      requirements: ['EU VAT number', 'Polish translations', 'Shipping to Poland']
    },
    {
      id: 'bol',
      name: 'Bol.com',
      region: 'Netherlands/Belgium',
      logo: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: true,
      products: 78,
      status: 'active',
      currency: 'EUR',
      language: 'Dutch',
      commission: '5-17%',
      requirements: ['EU VAT number', 'Dutch/Flemish translations', 'Local return solution']
    },
    {
      id: 'zalando',
      name: 'Zalando',
      region: 'Europe',
      logo: 'https://images.pexels.com/photos/5632396/pexels-photo-5632396.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'EUR',
      language: 'Multi-language',
      commission: '5-20%',
      requirements: ['Brand approval', 'High-quality product images', 'EU compliance']
    },
    {
      id: 'otto',
      name: 'Otto',
      region: 'Germany',
      logo: 'https://images.pexels.com/photos/5632395/pexels-photo-5632395.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'EUR',
      language: 'German',
      commission: '10-15%',
      requirements: ['German business registration', 'German translations', 'Local customer service']
    }
  ];
  
  const northAmericanMarketplaces: Marketplace[] = [
    {
      id: 'amazon-us',
      name: 'Amazon US',
      region: 'United States',
      logo: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: true,
      products: 156,
      status: 'active',
      currency: 'USD',
      language: 'English',
      commission: '8-15%',
      requirements: ['US business entity', 'US bank account', 'US tax information']
    },
    {
      id: 'walmart',
      name: 'Walmart Marketplace',
      region: 'United States',
      logo: 'https://images.pexels.com/photos/5632401/pexels-photo-5632401.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'USD',
      language: 'English',
      commission: '6-15%',
      requirements: ['US business entity', 'UPC codes', 'Fast shipping']
    },
    {
      id: 'ebay-us',
      name: 'eBay US',
      region: 'United States',
      logo: 'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'USD',
      language: 'English',
      commission: '10-12%',
      requirements: ['PayPal account', 'US return address']
    },
    {
      id: 'etsy',
      name: 'Etsy',
      region: 'North America',
      logo: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: true,
      products: 45,
      status: 'active',
      currency: 'USD',
      language: 'English',
      commission: '5% + $0.20 per listing',
      requirements: ['Handmade, vintage, or craft supplies only', 'Original photos']
    }
  ];
  
  const asiaOceaniaMarketplaces: Marketplace[] = [
    {
      id: 'amazon-au',
      name: 'Amazon Australia',
      region: 'Australia',
      logo: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'AUD',
      language: 'English',
      commission: '8-15%',
      requirements: ['Australian business number (ABN)', 'GST registration', 'Local return solution']
    },
    {
      id: 'rakuten',
      name: 'Rakuten',
      region: 'Japan',
      logo: 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'JPY',
      language: 'Japanese',
      commission: '8-12%',
      requirements: ['Japanese business entity', 'Japanese translations', 'Local customer service']
    },
    {
      id: 'flipkart',
      name: 'Flipkart',
      region: 'India',
      logo: 'https://images.pexels.com/photos/5632393/pexels-photo-5632393.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'INR',
      language: 'English/Hindi',
      commission: '5-15%',
      requirements: ['Indian business entity', 'GST registration', 'Local warehouse']
    },
    {
      id: 'lazada',
      name: 'Lazada',
      region: 'Southeast Asia',
      logo: 'https://images.pexels.com/photos/5632392/pexels-photo-5632392.jpeg?auto=compress&cs=tinysrgb&w=300',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'Multiple',
      language: 'Multiple',
      commission: '2-5%',
      requirements: ['Business registration in one SEA country', 'Local return solution']
    }
  ];

  const getMarketplacesByRegion = (region: string) => {
    switch (region) {
      case 'europe':
        return europeanMarketplaces;
      case 'north-america':
        return northAmericanMarketplaces;
      case 'asia-oceania':
        return asiaOceaniaMarketplaces;
      default:
        return [...europeanMarketplaces, ...northAmericanMarketplaces, ...asiaOceaniaMarketplaces];
    }
  };

  const filteredMarketplaces = getMarketplacesByRegion(activeTab).filter(
    marketplace => marketplace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConnect = async (marketplaceId: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    // In a real app, you would update the marketplace connection status
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplaces Mondiales</h1>
          <p className="text-gray-600">
            Connectez et gérez vos produits sur les marketplaces internationales
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une marketplace..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Marketplace
          </Button>
        </div>
      </div>

      <Tabs defaultValue="europe" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="europe" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span>Europe</span>
          </TabsTrigger>
          <TabsTrigger value="north-america" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span>Amérique du Nord</span>
          </TabsTrigger>
          <TabsTrigger value="asia-oceania" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span>Asie & Océanie</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarketplaces.map((marketplace) => (
              <div key={marketplace.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-lg overflow-hidden mr-3">
                        <img 
                          src={marketplace.logo} 
                          alt={marketplace.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{marketplace.name}</h3>
                        <p className="text-sm text-gray-500">{marketplace.region}</p>
                      </div>
                    </div>
                    {marketplace.connected && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Connecté
                      </span>
                    )}
                  </div>
                  
                  {marketplace.connected ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Produits</p>
                          <p className="font-medium">{marketplace.products}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Statut</p>
                          <div className="flex items-center">
                            {marketplace.status === 'active' && (
                              <span className="flex items-center text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                Actif
                              </span>
                            )}
                            {marketplace.status === 'pending' && (
                              <span className="flex items-center text-yellow-600">
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                En attente
                              </span>
                            )}
                            {marketplace.status === 'error' && (
                              <span className="flex items-center text-red-600">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Erreur
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Gérer les produits
                        </Button>
                        <Button variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Informations</p>
                          <Button variant="outline" size="sm">
                            Plus de détails
                          </Button>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Devise:</span>
                            <span>{marketplace.currency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Langue:</span>
                            <span>{marketplace.language}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Commission:</span>
                            <span>{marketplace.commission}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleConnect(marketplace.id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connexion...
                          </>
                        ) : (
                          <>
                            Connecter
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800">Expansion internationale simplifiée</h3>
            <p className="mt-2 text-sm text-blue-700">
              Shopopti+ vous permet de vendre facilement à l'international grâce à nos intégrations avec les plus grandes marketplaces mondiales. Gérez vos produits, commandes et inventaire depuis une seule interface.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium text-blue-800">Traduction automatique</h4>
                <p className="text-sm text-blue-700 mt-1">Traduisez vos fiches produit dans 40+ langues avec notre IA</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium text-blue-800">Conformité locale</h4>
                <p className="text-sm text-blue-700 mt-1">Assistance pour les exigences légales et fiscales par pays</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium text-blue-800">Expédition mondiale</h4>
                <p className="text-sm text-blue-700 mt-1">Intégration avec les transporteurs internationaux</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMarketplaces;