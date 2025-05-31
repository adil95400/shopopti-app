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
      const data = await b2bService.getSuppliers();
      setSuppliers(data);
      setFilteredSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Erreur lors du chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [countriesData, categoriesData] = await Promise.all([
        b2bService.getCountries(),
        b2bService.getCategories()
      ]);
      
      setCountries(countriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...suppliers];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        supplier => 
          supplier.name.toLowerCase().includes(search.toLowerCase()) ||
          supplier.description.toLowerCase().includes(search.toLowerCase()) ||
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

  const handleSupplierClick = (supplier: B2BSupplier) => {
    setSelectedSupplier(supplier);
    setActiveTab('products');
  };

  const handleQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier) return;
    
    try {
      await b2bService.requestQuote({
        supplier_id: selectedSupplier.id,
        product_ids: [],
        quantity: quoteForm.quantity,
        message: quoteForm.message,
        contact_email: quoteForm.email,
        contact_name: quoteForm.name
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h2 className="font-medium text-lg mb-4">Filtres</h2>
            
            <div className="space-y-4">
              <div>
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
              
              <div>
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
              
              <div>
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
              
              <div>
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
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Fournisseurs vérifiés uniquement
                </label>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-verified"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-verified"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      filters.verified ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        filters.verified ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {filteredSuppliers.length} fournisseurs trouvés
                </span>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => (
                      <motion.div
                        key={supplier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSupplierClick(supplier)}
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
                            <p className="text-sm text-gray-500 mt-1">À partir de 29.99€</p>
                            <p className="text-xs text-gray-400 mt-1">MOQ: 100 unités</p>
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
  );
}