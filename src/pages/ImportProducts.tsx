import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';
import { Tab } from '@headlessui/react';
import { 
  FileSpreadsheet, 
  FileJson, 
  FileCode, 
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Server,
  ShoppingBag,
  Store,
  AlertCircle,
  ArrowRight,
  Database,
  Globe,
  Search,
  Filter,
  Plus,
  Settings,
  Layers,
  CheckCircle,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import CSVImporter from '../components/import/CSVImporter';
import JSONImporter from '../components/import/JSONImporter';
import XMLImporter from '../components/import/XMLImporter';
import ImageImporter from '../components/import/ImageImporter';
import URLImporter from '../components/import/URLImporter';
import FTPImporter from '../components/import/FTPImporter';
import MarketplaceImporter from '../components/import/MarketplaceImporter';
import SupplierCatalogImporter from '../components/import/SupplierCatalogImporter';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';
import { toast } from 'sonner';

const importMethods = [
  {
    id: 'csv',
    name: 'CSV / Excel',
    icon: FileSpreadsheet,
    description: 'Importez des produits depuis un fichier CSV ou Excel',
    component: CSVImporter
  },
  {
    id: 'json',
    name: 'JSON',
    icon: FileJson,
    description: 'Importez des produits depuis un fichier JSON',
    component: JSONImporter
  },
  {
    id: 'xml',
    name: 'XML',
    icon: FileCode,
    description: 'Importez des produits depuis un fichier XML',
    component: XMLImporter
  },
  {
    id: 'image',
    name: 'Images en masse',
    icon: ImageIcon,
    description: 'Importez des produits à partir d\'images',
    component: ImageImporter
  },
  {
    id: 'url',
    name: 'URL / Liens',
    icon: LinkIcon,
    description: 'Importez des produits depuis des URLs',
    component: URLImporter
  },
  {
    id: 'ftp',
    name: 'FTP / SFTP',
    icon: Server,
    description: 'Importez des produits via FTP/SFTP',
    component: FTPImporter
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    icon: ShoppingBag,
    description: 'Importez des produits depuis AliExpress',
    component: MarketplaceImporter
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: Store,
    description: 'Importez des produits depuis Amazon',
    component: MarketplaceImporter
  },
  {
    id: 'supplier',
    name: 'Catalogue Fournisseur',
    icon: Database,
    description: 'Importez des produits depuis le catalogue fournisseur',
    component: SupplierCatalogImporter
  }
];

const marketplaces = [
  { id: 'shopify', name: 'Shopify', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png' },
  { id: 'woocommerce', name: 'WooCommerce', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Woocommerce_logo.svg/2560px-Woocommerce_logo.svg.png' },
  { id: 'amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png' },
  { id: 'ebay', name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png' },
  { id: 'etsy', name: 'Etsy', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png' },
  { id: 'bigcommerce', name: 'BigCommerce', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bigcommerce_logo.svg/1280px-Bigcommerce_logo.svg.png' },
  { id: 'squarespace', name: 'Squarespace', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Squarespace_logo.svg/1280px-Squarespace_logo.svg.png' },
  { id: 'wix', name: 'Wix', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Wix.com_website_logo.svg/2560px-Wix.com_website_logo.svg.png' },
  { id: 'aliexpress', name: 'AliExpress', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/AliExpress_logo.svg/1280px-AliExpress_logo.svg.png' }
];

const ImportProducts: React.FC = () => {
  const { isConnected, connectShopify } = useShop();
  const [selectedMethod, setSelectedMethod] = useState(importMethods[0]);
  const [recentImports, setRecentImports] = useState([
    { id: 1, source: 'AliExpress', date: '2025-06-01', count: 15, status: 'completed' },
    { id: 2, source: 'CSV Import', date: '2025-05-28', count: 120, status: 'completed' },
    { id: 3, source: 'Amazon', date: '2025-05-25', count: 5, status: 'completed' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMarketplaceSelector, setShowMarketplaceSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('import');

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavbar />
        <div className="flex h-full flex-col items-center justify-center py-12 text-center mt-16">
          <div className="rounded-full bg-primary-400 bg-opacity-10 p-3">
            <Upload size={28} className="text-primary-400" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">Aucune boutique connectée</h2>
          <p className="mt-1 text-gray-500">Connectez votre boutique pour importer des produits</p>
          <Button className="mt-4" onClick={() => setShowMarketplaceSelector(true)}>
            Connecter une boutique
          </Button>
        </div>
        
        {showMarketplaceSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Connecter une marketplace</h2>
                  <button
                    onClick={() => setShowMarketplaceSelector(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Fermer</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Sélectionnez une marketplace pour connecter votre boutique et importer des produits.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {marketplaces.map((marketplace) => (
                    <div
                      key={marketplace.id}
                      className="border rounded-lg p-4 flex flex-col items-center justify-center hover:border-primary hover:shadow-md cursor-pointer transition-all"
                      onClick={() => {
                        // In a real app, this would open a connection flow
                        console.log(`Connecting to ${marketplace.name}...`);
                        
                        // For now, we'll simulate connecting to Shopify
                        if (marketplace.id === 'shopify') {
                          connectShopify('mystore.myshopify.com', 'fake-access-token')
                            .then(success => {
                              if (success) {
                                toast.success('Successfully connected to Shopify');
                              }
                            })
                            .catch(error => {
                              console.error('Error connecting to Shopify:', error);
                              toast.error('Failed to connect to Shopify');
                            });
                        }
                        
                        setShowMarketplaceSelector(false);
                      }}
                    >
                      <img
                        src={marketplace.logo}
                        alt={marketplace.name}
                        className="h-12 object-contain mb-3"
                      />
                      <span className="text-sm font-medium">{marketplace.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    Vous ne trouvez pas votre marketplace ? Nous pouvons vous aider à créer une intégration personnalisée.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Layers className="h-4 w-4 mr-2" />
                    Demander une intégration personnalisée
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    );
  }

  const filteredMethods = searchTerm 
    ? importMethods.filter(method => 
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : importMethods;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold">Importation de Produits</h1>
              <p className="text-gray-600">
                Importez des produits depuis différentes sources vers votre boutique
              </p>
            </motion.div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowMarketplaceSelector(true)}>
                <Globe className="h-4 w-4 mr-2" />
                Connecter une marketplace
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel import
              </Button>
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
                    placeholder="Rechercher une méthode d'importation..."
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
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'import'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('import')}
                >
                  Importer des produits
                </button>
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'history'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  Historique d'importation
                </button>
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'settings'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  Paramètres d'importation
                </button>
              </nav>
            </div>

            {activeTab === 'import' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Tab.Group>
                      <Tab.List className="flex space-x-2 rounded-lg bg-gray-100 p-1 overflow-x-auto">
                        {filteredMethods.map((method) => (
                          <Tab
                            key={method.id}
                            className={({ selected }) =>
                              `flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                              ${selected 
                                ? 'bg-primary text-white' 
                                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                              }`
                            }
                            onClick={() => setSelectedMethod(method)}
                          >
                            <method.icon size={16} />
                            <span>{method.name}</span>
                          </Tab>
                        ))}
                      </Tab.List>

                      <div className="mt-6">
                        <div className="mb-6">
                          <h2 className="text-lg font-medium">{selectedMethod.name}</h2>
                          <p className="text-gray-600 mt-1">{selectedMethod.description}</p>
                        </div>

                        <Tab.Panels>
                          {filteredMethods.map((method) => (
                            <Tab.Panel key={method.id}>
                              <method.component marketplace={method.id} />
                            </Tab.Panel>
                          ))}
                        </Tab.Panels>
                      </div>
                    </Tab.Group>

                    <div className="mt-8 rounded-lg bg-blue-50 p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Conseils d'importation</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc space-y-1 pl-5">
                              <li>Assurez-vous que vos données sont bien formatées</li>
                              <li>Vérifiez que les images sont de haute qualité (min. 1000x1000px)</li>
                              <li>Incluez des descriptions détaillées pour un meilleur SEO</li>
                              <li>Ajoutez des variantes si nécessaire pour une meilleure expérience client</li>
                              <li>Utilisez notre outil d'optimisation IA pour améliorer vos fiches produits</li>
                            </ul>
                          </div>
                          <div className="mt-3">
                            <a
                              href="/guides/import"
                              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              Voir le guide complet
                              <ArrowRight size={16} className="ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h2 className="text-lg font-medium mb-4">Imports récents</h2>
                      <div className="space-y-4">
                        {recentImports.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div>
                              <h3 className="font-medium">{item.source}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>{item.date}</span>
                                <span className="mx-2">•</span>
                                <span>{item.count} produits</span>
                              </div>
                            </div>
                            <div>
                              {item.status === 'completed' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complété
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  En cours
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Voir tous les imports
                      </Button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-lg shadow-sm text-white">
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Optimisation IA
                      </h2>
                      <p className="mb-4 text-blue-100">
                        Améliorez automatiquement vos fiches produits avec notre technologie d'intelligence artificielle.
                      </p>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center mr-2 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-blue-50">Titres optimisés pour le SEO</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center mr-2 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-blue-50">Descriptions enrichies</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center mr-2 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-blue-50">Génération de mots-clés</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center mr-2 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-blue-50">Traduction multilingue</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                        Activer l'optimisation IA
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium">Historique d'importation</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualiser
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produits
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...recentImports, 
                        { id: 4, source: 'Shopify', date: '2025-05-20', count: 45, status: 'completed' },
                        { id: 5, source: 'WooCommerce', date: '2025-05-15', count: 78, status: 'completed' },
                        { id: 6, source: 'Catalogue Fournisseur', date: '2025-05-10', count: 32, status: 'completed' }
                      ].map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.source}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.count}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.status === 'completed' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complété
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                En cours
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm">
                              Voir détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Paramètres d'importation</h2>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-md font-medium mb-4">Paramètres généraux</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Optimisation IA automatique</p>
                          <p className="text-sm text-gray-500">Optimiser automatiquement les produits importés avec l'IA</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id="toggle-ai"
                            className="sr-only"
                            defaultChecked
                          />
                          <label
                            htmlFor="toggle-ai"
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Traduction automatique</p>
                          <p className="text-sm text-gray-500">Traduire automatiquement les produits dans les langues configurées</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id="toggle-translation"
                            className="sr-only"
                            defaultChecked
                          />
                          <label
                            htmlFor="toggle-translation"
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Publication automatique</p>
                          <p className="text-sm text-gray-500">Publier automatiquement les produits importés</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id="toggle-publish"
                            className="sr-only"
                          />
                          <label
                            htmlFor="toggle-publish"
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-gray-300"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-0"
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Format de date par défaut
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                          <option value="DD-MM-YYYY">JJ-MM-AAAA</option>
                          <option value="MM-DD-YYYY">MM-JJ-AAAA</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Séparateur CSV par défaut
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option value=",">Virgule (,)</option>
                          <option value=";">Point-virgule (;)</option>
                          <option value="\t">Tabulation</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-md font-medium mb-4">Paramètres d'optimisation IA</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Niveau d'optimisation
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option value="light">Léger - Corrections mineures uniquement</option>
                          <option value="medium" selected>Moyen - Équilibre entre original et optimisé</option>
                          <option value="full">Complet - Réécriture complète pour optimisation</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Optimiser les titres</p>
                          <p className="text-sm text-gray-500">Optimiser les titres des produits pour le SEO</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id="toggle-titles"
                            className="sr-only"
                            defaultChecked
                          />
                          <label
                            htmlFor="toggle-titles"
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Optimiser les descriptions</p>
                          <p className="text-sm text-gray-500">Enrichir et optimiser les descriptions des produits</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id="toggle-descriptions"
                            className="sr-only"
                            defaultChecked
                          />
                          <label
                            htmlFor="toggle-descriptions"
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Générer des mots-clés</p>
                          <p className="text-sm text-gray-500">Générer automatiquement des mots-clés pertinents</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id="toggle-keywords"
                            className="sr-only"
                            defaultChecked
                          />
                          <label
                            htmlFor="toggle-keywords"
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" className="mr-2">
                      Annuler
                    </Button>
                    <Button>
                      Enregistrer les paramètres
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showMarketplaceSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Connecter une marketplace</h2>
                    <button
                      onClick={() => setShowMarketplaceSelector(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Fermer</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Sélectionnez une marketplace pour connecter votre boutique et importer des produits.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {marketplaces.map((marketplace) => (
                      <div
                        key={marketplace.id}
                        className="border rounded-lg p-4 flex flex-col items-center justify-center hover:border-primary hover:shadow-md cursor-pointer transition-all"
                        onClick={() => {
                          // In a real app, this would open a connection flow
                          console.log(`Connecting to ${marketplace.name}...`);
                          
                          // For now, we'll simulate connecting to Shopify
                          if (marketplace.id === 'shopify') {
                            connectShopify('mystore.myshopify.com', 'fake-access-token')
                              .then(success => {
                                if (success) {
                                  toast.success('Successfully connected to Shopify');
                                }
                              })
                              .catch(error => {
                                console.error('Error connecting to Shopify:', error);
                                toast.error('Failed to connect to Shopify');
                              });
                          }
                          
                          setShowMarketplaceSelector(false);
                        }}
                      >
                        <img
                          src={marketplace.logo}
                          alt={marketplace.name}
                          className="h-12 object-contain mb-3"
                        />
                        <span className="text-sm font-medium">{marketplace.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">
                      Vous ne trouvez pas votre marketplace ? Nous pouvons vous aider à créer une intégration personnalisée.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Layers className="h-4 w-4 mr-2" />
                      Demander une intégration personnalisée
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ImportProducts;