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
import MarketplaceCard from '../components/marketplace/MarketplaceCard';

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
  description: string;
  pros: string[];
  cons: string[];
  monthly_fee: string;
  setup_fee: string;
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
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
      connected: true,
      products: 124,
      status: 'active',
      currency: 'EUR',
      language: 'Multi-language',
      commission: '8-15%',
      requirements: ['VAT registration', 'EU compliance documentation', 'Local return address'],
      description: 'La plus grande marketplace en Europe avec une présence dans 8 pays européens.',
      pros: ['Énorme base de clients', 'Logistique FBA disponible', 'Ventes multi-pays faciles'],
      cons: ['Commissions élevées', 'Concurrence intense', 'Règles strictes'],
      monthly_fee: '39.99€',
      setup_fee: '0€'
    },
    {
      id: 'cdiscount',
      name: 'Cdiscount',
      region: 'France',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/87/Logo_Cdiscount.svg/1280px-Logo_Cdiscount.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'EUR',
      language: 'French',
      commission: '5-12%',
      requirements: ['French business registration', 'SIRET number', 'French customer service'],
      description: 'Deuxième plus grande marketplace en France avec plus de 10 millions de clients actifs.',
      pros: ['Fort trafic en France', 'Commissions compétitives', 'Bonne visibilité pour les nouveaux vendeurs'],
      cons: ['Limité principalement à la France', 'Interface moins intuitive', 'Support vendeur limité'],
      monthly_fee: '39.99€',
      setup_fee: '0€'
    },
    {
      id: 'allegro',
      name: 'Allegro',
      region: 'Poland',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Allegro.pl_sklep_logo.svg/1280px-Allegro.pl_sklep_logo.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'PLN',
      language: 'Polish',
      commission: '6-15%',
      requirements: ['EU VAT number', 'Polish translations', 'Shipping to Poland'],
      description: 'La plus grande marketplace en Pologne avec plus de 20 millions d\'utilisateurs mensuels.',
      pros: ['Domination du marché polonais', 'Pas de frais mensuels', 'Moins de concurrence internationale'],
      cons: ['Barrière linguistique', 'Limité principalement à la Pologne', 'Attentes élevées en matière de livraison'],
      monthly_fee: '0€',
      setup_fee: '0€'
    },
    {
      id: 'bol',
      name: 'Bol.com',
      region: 'Netherlands/Belgium',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bol.com_logo.svg/1280px-Bol.com_logo.svg.png',
      connected: true,
      products: 78,
      status: 'active',
      currency: 'EUR',
      language: 'Dutch',
      commission: '5-17%',
      requirements: ['EU VAT number', 'Dutch/Flemish translations', 'Local return solution'],
      description: 'La plus grande marketplace aux Pays-Bas et en Belgique avec plus de 12 millions de clients.',
      pros: ['Leader du marché au Benelux', 'Clients à fort pouvoir d\'achat', 'Bonne infrastructure logistique'],
      cons: ['Marché plus petit', 'Attentes élevées en matière de service', 'Nécessite du contenu en néerlandais'],
      monthly_fee: '40€',
      setup_fee: '0€'
    },
    {
      id: 'zalando',
      name: 'Zalando',
      region: 'Europe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Zalando_logo.svg/1280px-Zalando_logo.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'EUR',
      language: 'Multi-language',
      commission: '5-20%',
      requirements: ['Brand approval', 'High-quality product images', 'EU compliance'],
      description: 'La plus grande plateforme de mode en ligne d\'Europe, présente dans 16 pays.',
      pros: ['Spécialisé dans la mode', 'Présence dans 16 pays européens', 'Clientèle fidèle'],
      cons: ['Processus d\'approbation strict', 'Limité aux produits de mode', 'Exigences élevées en matière de qualité'],
      monthly_fee: '0€',
      setup_fee: '0€'
    },
    {
      id: 'otto',
      name: 'Otto',
      region: 'Germany',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Otto_GmbH.svg/1280px-Otto_GmbH.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'EUR',
      language: 'German',
      commission: '10-15%',
      requirements: ['German business registration', 'German translations', 'Local customer service'],
      description: 'Deuxième plus grande marketplace en Allemagne avec plus de 9 millions de clients actifs.',
      pros: ['Fort trafic en Allemagne', 'Moins concurrentiel qu\'Amazon', 'Bonne réputation auprès des consommateurs'],
      cons: ['Limité principalement à l\'Allemagne', 'Processus d\'intégration plus long', 'Interface moins moderne'],
      monthly_fee: '39.90€',
      setup_fee: '0€'
    }
  ];
  
  const northAmericanMarketplaces: Marketplace[] = [
    {
      id: 'amazon-us',
      name: 'Amazon US',
      region: 'United States',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
      connected: true,
      products: 156,
      status: 'active',
      currency: 'USD',
      language: 'English',
      commission: '8-15%',
      requirements: ['US business entity', 'US bank account', 'US tax information'],
      description: 'La plus grande marketplace aux États-Unis avec plus de 200 millions de clients.',
      pros: ['Énorme base de clients', 'Logistique FBA disponible', 'Outils marketing avancés'],
      cons: ['Commissions élevées', 'Concurrence intense', 'Règles strictes'],
      monthly_fee: '$39.99',
      setup_fee: '$0'
    },
    {
      id: 'walmart',
      name: 'Walmart Marketplace',
      region: 'United States',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/1280px-Walmart_logo.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'USD',
      language: 'English',
      commission: '6-15%',
      requirements: ['US business entity', 'UPC codes', 'Fast shipping'],
      description: 'Deuxième plus grande marketplace aux États-Unis avec plus de 120 millions de visiteurs mensuels.',
      pros: ['Pas de frais mensuels', 'Moins de concurrence qu\'Amazon', 'Intégration avec les magasins physiques'],
      cons: ['Processus d\'approbation strict', 'Exigences de performance élevées', 'Limité aux États-Unis'],
      monthly_fee: '$0',
      setup_fee: '$0'
    },
    {
      id: 'ebay-us',
      name: 'eBay US',
      region: 'United States',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'USD',
      language: 'English',
      commission: '10-12%',
      requirements: ['PayPal account', 'US return address'],
      description: 'Marketplace établie avec plus de 159 millions d\'acheteurs actifs dans le monde.',
      pros: ['Facile à démarrer', 'Options de vente aux enchères et à prix fixe', 'Présence mondiale'],
      cons: ['Commissions élevées', 'Attentes élevées des acheteurs', 'Concurrence sur les prix'],
      monthly_fee: '$0-$299.95',
      setup_fee: '$0'
    },
    {
      id: 'etsy',
      name: 'Etsy',
      region: 'North America',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png',
      connected: true,
      products: 45,
      status: 'active',
      currency: 'USD',
      language: 'English',
      commission: '5% + $0.20 per listing',
      requirements: ['Handmade, vintage, or craft supplies only', 'Original photos'],
      description: 'Marketplace spécialisée dans les produits faits main, vintage et fournitures créatives.',
      pros: ['Clientèle ciblée et engagée', 'Communauté de vendeurs solidaire', 'Moins concurrentiel pour les produits de niche'],
      cons: ['Limité aux produits artisanaux et vintage', 'Frais par annonce', 'Attentes élevées en matière de qualité'],
      monthly_fee: '$0',
      setup_fee: '$0'
    }
  ];
  
  const asiaOceaniaMarketplaces: Marketplace[] = [
    {
      id: 'amazon-au',
      name: 'Amazon Australia',
      region: 'Australia',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'AUD',
      language: 'English',
      commission: '8-15%',
      requirements: ['Australian business number (ABN)', 'GST registration', 'Local return solution'],
      description: 'La plus grande marketplace en Australie, en pleine croissance depuis son lancement en 2017.',
      pros: ['Marché en croissance rapide', 'Moins concurrentiel que les marchés américain et européen', 'Logistique FBA disponible'],
      cons: ['Base de clients plus petite', 'Coûts d\'expédition élevés', 'Exigences de conformité spécifiques à l\'Australie'],
      monthly_fee: 'AUD 49.95',
      setup_fee: 'AUD 0'
    },
    {
      id: 'rakuten',
      name: 'Rakuten',
      region: 'Japan',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rakuten_Global_Brand_Logo.svg/1280px-Rakuten_Global_Brand_Logo.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'JPY',
      language: 'Japanese',
      commission: '8-12%',
      requirements: ['Japanese business entity', 'Japanese translations', 'Local customer service'],
      description: 'Deuxième plus grande marketplace au Japon avec plus de 50 millions d\'utilisateurs.',
      pros: ['Programme de fidélité puissant', 'Moins concurrentiel qu\'Amazon Japon', 'Forte présence locale'],
      cons: ['Frais d\'installation élevés', 'Barrière linguistique importante', 'Processus d\'intégration complexe'],
      monthly_fee: 'JPY 0-50,000',
      setup_fee: 'JPY 60,000'
    },
    {
      id: 'flipkart',
      name: 'Flipkart',
      region: 'India',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Flipkart_logo.svg/1280px-Flipkart_logo.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'INR',
      language: 'English/Hindi',
      commission: '5-15%',
      requirements: ['Indian business entity', 'GST registration', 'Local warehouse'],
      description: 'La plus grande marketplace en Inde avec plus de 300 millions d\'utilisateurs enregistrés.',
      pros: ['Énorme marché en croissance', 'Moins concurrentiel pour les marques étrangères', 'Options logistiques intégrées'],
      cons: ['Nécessite une présence locale', 'Concurrence sur les prix', 'Complexités réglementaires'],
      monthly_fee: 'INR 0',
      setup_fee: 'INR 0'
    },
    {
      id: 'lazada',
      name: 'Lazada',
      region: 'Southeast Asia',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Lazada_2019.svg/1280px-Lazada_2019.svg.png',
      connected: false,
      products: 0,
      status: 'pending',
      currency: 'Multiple',
      language: 'Multiple',
      commission: '2-5%',
      requirements: ['Business registration in one SEA country', 'Local return solution'],
      description: 'Principale marketplace en Asie du Sud-Est, présente dans 6 pays.',
      pros: ['Commissions basses', 'Marchés en forte croissance', 'Propriété d\'Alibaba (ressources importantes)'],
      cons: ['Logistique complexe', 'Multiples langues et réglementations', 'Attentes en matière de prix bas'],
      monthly_fee: 'USD 0',
      setup_fee: 'USD 0'
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

  const handleViewDetails = (marketplaceId: string) => {
    // In a real app, you would navigate to the marketplace details page
    console.log(`Viewing details for ${marketplaceId}`);
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

      {/* Horizontal filters bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-auto flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une marketplace..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
              <MarketplaceCard 
                key={marketplace.id}
                marketplace={marketplace}
                onConnect={handleConnect}
                onViewDetails={handleViewDetails}
              />
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