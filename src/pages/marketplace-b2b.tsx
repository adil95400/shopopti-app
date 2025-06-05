import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { b2bService, B2BSupplier } from '@/services/b2bService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Building, 
  Package, 
  MapPin, 
  Star, 
  Truck, 
  DollarSign, 
  CheckCircle, 
  Loader2,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';

export default function MarketplaceB2B() {
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState<B2BSupplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<B2BSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suppliers');
  const [selectedSupplier, setSelectedSupplier] = useState<B2BSupplier | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    quantity: 1,
    message: ''
  });
  
  // Filters
  const [filters, setFilters] = useState({
    country: '',
    category: '',
    verified: false,
    minRating: 0
  });
  
  // Filter options
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchSuppliers();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filters, suppliers]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch from your API
      // For now, we'll use mock data based on the image
      const mockSuppliers: B2BSupplier[] = [
        {
          id: '1',
          name: 'Shopcom Dropshipping',
          country: 'Switzerland',
          category: 'General',
          delivery_delay: '7-14 days',
          min_order: 100,
          verified: true,
          rating: 4.8,
          description: 'Swiss dropshipping provider with a wide range of products.',
          contact_email: 'info@shopcom.ch',
          website: 'https://shopcom.ch',
          logo_url: 'https://i.ibb.co/Qj1bBfL/shopcom-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'InnoCigs',
          country: 'Germany',
          category: 'Vape & E-cigarettes',
          delivery_delay: '3-5 days',
          min_order: 50,
          verified: true,
          rating: 4.7,
          description: 'Specialized in vape products and e-cigarettes.',
          contact_email: 'info@innocigs.de',
          website: 'https://innocigs.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/innocigs-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Syntrox Germany',
          country: 'Germany',
          category: 'Electronics',
          delivery_delay: '5-7 days',
          min_order: 200,
          verified: true,
          rating: 4.5,
          description: 'German electronics supplier with high-quality products.',
          contact_email: 'info@syntrox.de',
          website: 'https://syntrox.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/syntrox-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Kaysser',
          country: 'Germany',
          category: 'Home & Garden',
          delivery_delay: '4-8 days',
          min_order: 150,
          verified: true,
          rating: 4.6,
          description: 'Specialized in home and garden products.',
          contact_email: 'info@kaysser.de',
          website: 'https://kaysser.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/kaysser-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Trends4Cents',
          country: 'Germany',
          category: 'Fashion',
          delivery_delay: '3-6 days',
          min_order: 100,
          verified: true,
          rating: 4.4,
          description: 'Trendy fashion items at competitive prices.',
          contact_email: 'info@trends4cents.de',
          website: 'https://trends4cents.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/trends4cents-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Vidaxl Dropshipping',
          country: 'Netherlands',
          category: 'General',
          delivery_delay: '5-10 days',
          min_order: 50,
          verified: true,
          rating: 4.7,
          description: 'Large catalog of products across multiple categories.',
          contact_email: 'info@vidaxl.com',
          website: 'https://vidaxl.com',
          logo_url: 'https://i.ibb.co/Qj1bBfL/vidaxl-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '7',
          name: 'BigBuy',
          country: 'Spain',
          category: 'General',
          delivery_delay: '5-12 days',
          min_order: 0,
          verified: true,
          rating: 4.9,
          description: 'One of Europe\'s largest dropshipping suppliers with thousands of products.',
          contact_email: 'info@bigbuy.eu',
          website: 'https://bigbuy.eu',
          logo_url: 'https://i.ibb.co/Qj1bBfL/bigbuy-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '8',
          name: 'Kosatec Computer',
          country: 'Germany',
          category: 'Electronics & Computers',
          delivery_delay: '2-5 days',
          min_order: 200,
          verified: true,
          rating: 4.8,
          description: 'Specialized in computers, electronics and IT equipment.',
          contact_email: 'info@kosatec.de',
          website: 'https://kosatec.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/kosatec-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '9',
          name: 'Atixc',
          country: 'Germany',
          category: 'Electronics',
          delivery_delay: '3-7 days',
          min_order: 100,
          verified: true,
          rating: 4.5,
          description: 'Electronics supplier with competitive prices.',
          contact_email: 'info@atixc.de',
          website: 'https://atixc.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/atixc-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '10',
          name: 'ILA Uhren GmbH',
          country: 'Germany',
          category: 'Watches & Accessories',
          delivery_delay: '3-5 days',
          min_order: 300,
          verified: true,
          rating: 4.6,
          description: 'Specialized in watches and accessories.',
          contact_email: 'info@ila-uhren.de',
          website: 'https://ila-uhren.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/ila-uhren-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '11',
          name: 'Matterhorn',
          country: 'Switzerland',
          category: 'Office & School Supplies',
          delivery_delay: '5-8 days',
          min_order: 150,
          verified: true,
          rating: 4.7,
          description: 'Office and school supplies with high quality standards.',
          contact_email: 'info@matterhorn.ch',
          website: 'https://matterhorn.ch',
          logo_url: 'https://i.ibb.co/Qj1bBfL/matterhorn-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '12',
          name: 'MiniHeld',
          country: 'Germany',
          category: 'Kids & Baby',
          delivery_delay: '4-7 days',
          min_order: 100,
          verified: true,
          rating: 4.8,
          description: 'Specialized in children\'s products and baby items.',
          contact_email: 'info@miniheld.de',
          website: 'https://miniheld.de',
          logo_url: 'https://i.ibb.co/Qj1bBfL/miniheld-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '13',
          name: 'Shop.it',
          country: 'Italy',
          category: 'General',
          delivery_delay: '4-8 days',
          min_order: 100,
          verified: true,
          rating: 4.6,
          description: 'Italian general merchandise supplier.',
          contact_email: 'info@shop.it',
          website: 'https://shop.it',
          logo_url: 'https://i.ibb.co/Qj1bBfL/shop-it-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '14',
          name: 'Abaco International',
          country: 'Italy',
          category: 'Fashion & Accessories',
          delivery_delay: '5-9 days',
          min_order: 150,
          verified: true,
          rating: 4.5,
          description: 'Italian fashion and accessories supplier.',
          contact_email: 'info@abaco-international.it',
          website: 'https://abaco-international.it',
          logo_url: 'https://i.ibb.co/Qj1bBfL/abaco-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '15',
          name: 'Ariete',
          country: 'Italy',
          category: 'Home Appliances',
          delivery_delay: '4-8 days',
          min_order: 200,
          verified: true,
          rating: 4.7,
          description: 'Italian home appliances manufacturer.',
          contact_email: 'info@ariete.it',
          website: 'https://ariete.it',
          logo_url: 'https://i.ibb.co/Qj1bBfL/ariete-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '16',
          name: 'Griffati',
          country: 'Italy',
          category: 'Fashion',
          delivery_delay: '5-10 days',
          min_order: 120,
          verified: true,
          rating: 4.5,
          description: 'Italian fashion brand.',
          contact_email: 'info@griffati.it',
          website: 'https://griffati.it',
          logo_url: 'https://i.ibb.co/Qj1bBfL/griffati-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '17',
          name: 'BestIT',
          country: 'Italy',
          category: 'Electronics',
          delivery_delay: '3-7 days',
          min_order: 100,
          verified: true,
          rating: 4.6,
          description: 'Italian electronics supplier.',
          contact_email: 'info@bestit.it',
          website: 'https://bestit.it',
          logo_url: 'https://i.ibb.co/Qj1bBfL/bestit-logo.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setSuppliers(mockSuppliers);
      setFilteredSuppliers(mockSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Erreur lors du chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      // Extract unique countries and categories from suppliers
      const uniqueCountries = [...new Set(suppliers.map(s => s.country))];
      const uniqueCategories = [...new Set(suppliers.map(s => s.category))];
      
      setCountries(uniqueCountries);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...suppliers];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.description?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply country filter
    if (filters.country) {
      filtered = filtered.filter(supplier => 
        supplier.country === filters.country
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(supplier => 
        supplier.category === filters.category
      );
    }
    
    // Apply verified filter
    if (filters.verified) {
      filtered = filtered.filter(supplier => 
        supplier.verified === true
      );
    }
    
    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(supplier => 
        supplier.rating >= filters.minRating
      );
    }
    
    setFilteredSuppliers(filtered);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      country: '',
      category: '',
      verified: false,
      minRating: 0
    });
    setSearch('');
  };

  const handleQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier) return;
    
    try {
      // In a real app, you would send this to your backend
      console.log('Quote request:', {
        supplier: selectedSupplier.name,
        ...quoteForm
      });
      
      toast.success('Demande de devis envoyée avec succès');
      setShowQuoteForm(false);
      setQuoteForm({
        name: '',
        email: '',
        quantity: 1,
        message: ''
      });
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Erreur lors de l\'envoi de la demande de devis');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">🛍️ Marketplace B2B Privée</h1>
            <p className="text-gray-600 mt-1">
              Connectez-vous directement avec des fournisseurs vérifiés et négociez des prix de gros
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters}>
              <X className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button>
              <Building className="h-4 w-4 mr-2" />
              Devenir fournisseur
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Horizontal filters bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-auto flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recherche
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un fournisseur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-auto md:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="">Tous les pays</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto md:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note minimale
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('minRating', filters.minRating === rating ? 0 : rating)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors ${
                        filters.minRating === rating
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Star size={14} className={filters.minRating === rating ? 'text-white' : ''} />
                      <span>{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-auto flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${
                    filters.verified ? 'bg-primary' : 'bg-gray-300'
                  } rounded-full h-6`}>
                    <span className={`absolute h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in transform ${
                      filters.verified ? 'translate-x-4' : 'translate-x-0'
                    }`}></span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Fournisseurs vérifiés uniquement</span>
                </label>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredSuppliers.length} fournisseurs trouvés
              </span>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="suppliers" className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span>Fournisseurs</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  <span>Produits</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="suppliers">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <motion.div
                          key={supplier.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setActiveTab('products');
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                {supplier.logo_url ? (
                                  <img
                                    src={supplier.logo_url}
                                    alt={supplier.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <Building className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                                <div className="ml-3">
                                  <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                                  <div className="flex items-center mt-1">
                                    <MapPin size={14} className="text-gray-400 mr-1" />
                                    <span className="text-sm text-gray-500">{supplier.country}</span>
                                  </div>
                                </div>
                              </div>
                              {supplier.verified && (
                                <div className="bg-green-100 text-green-800 p-1.5 rounded-md">
                                  <CheckCircle size={16} />
                                </div>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {supplier.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-gray-50 p-2 rounded-md">
                                <p className="text-xs text-gray-500">Catégorie</p>
                                <p className="font-medium">{supplier.category}</p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-md">
                                <p className="text-xs text-gray-500">Note</p>
                                <div className="flex items-center">
                                  <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                                  <span className="font-medium">{supplier.rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-md">
                                <p className="text-xs text-gray-500">Délai</p>
                                <p className="font-medium">{supplier.delivery_delay}</p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-md">
                                <p className="text-xs text-gray-500">Commande min.</p>
                                <p className="font-medium">{supplier.min_order}€</p>
                              </div>
                            </div>

                            <Button className="w-full">
                              Voir les produits
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full bg-white p-12 rounded-lg shadow-sm text-center">
                        <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fournisseur trouvé</h3>
                        <p className="text-gray-500 mb-4">
                          Essayez d'ajuster vos filtres ou votre recherche
                        </p>
                        <Button onClick={resetFilters}>
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="products">
                {selectedSupplier ? (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center">
                          {selectedSupplier.logo_url ? (
                            <img
                              src={selectedSupplier.logo_url}
                              alt={selectedSupplier.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Building className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <h2 className="text-xl font-bold text-gray-900">{selectedSupplier.name}</h2>
                            <div className="flex items-center mt-1">
                              <MapPin size={14} className="text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">{selectedSupplier.country}</span>
                              {selectedSupplier.verified && (
                                <>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="flex items-center text-green-600">
                                    <CheckCircle size={14} className="mr-1" />
                                    Vérifié
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button onClick={() => setShowQuoteForm(true)}>
                          Demander un devis
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h3 className="font-medium text-gray-900 mb-2">Catégorie</h3>
                          <p className="text-gray-600">{selectedSupplier.category}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h3 className="font-medium text-gray-900 mb-2">Délai de livraison</h3>
                          <div className="flex items-center">
                            <Truck size={16} className="text-gray-400 mr-2" />
                            <p className="text-gray-600">{selectedSupplier.delivery_delay}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h3 className="font-medium text-gray-900 mb-2">Commande minimum</h3>
                          <div className="flex items-center">
                            <DollarSign size={16} className="text-gray-400 mr-2" />
                            <p className="text-gray-600">{selectedSupplier.min_order}€</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">À propos</h3>
                        <p className="text-gray-600">{selectedSupplier.description}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-4">Produits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* This would be populated with actual products in a real app */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="border rounded-lg overflow-hidden">
                            <div className="h-40 bg-gray-200"></div>
                            <div className="p-4">
                              <h4 className="font-medium text-gray-900">Produit exemple {i}</h4>
                              <p className="text-sm text-gray-500 mt-1">À partir de {29.99 * i}€</p>
                              <p className="text-xs text-gray-400 mt-1">MOQ: {i * 50} unités</p>
                              <Button className="w-full mt-3" size="sm">
                                Voir détails
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => {
                        setSelectedSupplier(null);
                        setActiveTab('suppliers');
                      }}>
                        Retour aux fournisseurs
                      </Button>
                      <Button onClick={() => setShowQuoteForm(true)}>
                        Demander un devis
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fournisseur sélectionné</h3>
                    <p className="text-gray-500 mb-4">
                      Sélectionnez un fournisseur pour voir ses produits
                    </p>
                    <Button onClick={() => setActiveTab('suppliers')}>
                      Parcourir les fournisseurs
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Quote request modal */}
        {showQuoteForm && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Demande de devis</h3>
                  <button
                    onClick={() => setShowQuoteForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleQuoteRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <Input
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email professionnel
                    </label>
                    <Input
                      type="email"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité estimée
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm({ ...quoteForm, quantity: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (spécifications, besoins spécifiques, etc.)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      Envoyer la demande
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      En soumettant ce formulaire, vous acceptez d'être contacté par le fournisseur.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}