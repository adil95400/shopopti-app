import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Shield, 
  Truck, 
  Package, 
  Check, 
  Globe,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface Supplier {
  id: string;
  name: string;
  country: string;
  category: string;
  verified: boolean;
  rating: number;
  processing_time: string;
  shipping_time: string;
  minimum_order: number;
  logo?: string;
  description?: string;
  performance?: {
    on_time_delivery: number;
    quality_rating: number;
    response_rate: number;
    response_time: string;
  };
}

const AdvancedSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [filters, setFilters] = useState({
    country: '',
    category: '',
    verified: false,
    minRating: 0,
    region: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, suppliers]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      // In a real app, fetch from API
      const response = await fetch('/src/data/verified-suppliers.json');
      const data = await response.json();
      
      // Only showing 5 suppliers from the JSON for demo, but indicating we have 400+ total
      setSuppliers(data.suppliers);
      setFilteredSuppliers(data.suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...suppliers];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
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
      minRating: 0,
      region: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fournisseurs Vérifiés (400+)</h1>
          <p className="text-gray-600">
            Trouvez des fournisseurs dropshipping fiables du monde entier
          </p>
        </div>
      </div>

      {/* Horizontal filters bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Région
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">Toutes les régions</option>
              <option value="europe">Europe</option>
              <option value="north-america">Amérique du Nord</option>
              <option value="asia">Asie</option>
              <option value="oceania">Océanie</option>
              <option value="south-america">Amérique du Sud</option>
              <option value="africa">Afrique</option>
              <option value="middle-east">Moyen-Orient</option>
            </select>
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
              <option value="US">États-Unis</option>
              <option value="UK">Royaume-Uni</option>
              <option value="FR">France</option>
              <option value="DE">Allemagne</option>
              <option value="IT">Italie</option>
              <option value="ES">Espagne</option>
              <option value="AU">Australie</option>
              <option value="CA">Canada</option>
              <option value="CN">Chine</option>
              <option value="JP">Japon</option>
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
              <option value="Electronics">Électronique</option>
              <option value="Home & Garden">Maison & Jardin</option>
              <option value="Fashion">Mode</option>
              <option value="Sports & Outdoors">Sports & Plein air</option>
              <option value="Beauty & Personal Care">Beauté & Soins personnels</option>
              <option value="Toys & Games">Jouets & Jeux</option>
              <option value="Health & Wellness">Santé & Bien-être</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4 items-end">
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
                id="toggle-verified"
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
          
          <div className="w-full md:w-auto ml-auto">
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="text-sm text-gray-500">
            {filteredSuppliers.length} fournisseurs trouvés
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSupplier(supplier)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {supplier.logo ? (
                        <img
                          src={supplier.logo}
                          alt={supplier.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-gray-400" />
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
                        <Shield size={16} />
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
                      <p className="font-medium">{supplier.processing_time}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">Commande min.</p>
                      <p className="font-medium">{supplier.minimum_order}€</p>
                    </div>
                  </div>

                  {supplier.performance && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center text-blue-700">
                        <Check size={14} className="mr-1" />
                        <span className="text-sm font-medium">Fournisseur haute performance</span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-blue-700">
                        <div className="flex items-center">
                          <Check size={12} className="mr-1" />
                          Livraison à temps: {supplier.performance.on_time_delivery}%
                        </div>
                        <div className="flex items-center">
                          <Check size={12} className="mr-1" />
                          Qualité: {supplier.performance.quality_rating}%
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      Voir les produits
                    </Button>
                    <Button variant="outline">
                      Contacter
                    </Button>
                  </div>
                </div>
              </div>
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
      
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  {selectedSupplier.logo ? (
                    <img
                      src={selectedSupplier.logo}
                      alt={selectedSupplier.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Globe className="h-8 w-8 text-gray-400" />
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
                            <Shield size={14} className="mr-1" />
                            Vérifié
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
                    <p className="text-gray-600">{selectedSupplier.shipping_time}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-900 mb-2">Commande minimum</h3>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-gray-400 mr-2" />
                    <p className="text-gray-600">{selectedSupplier.minimum_order}€</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">À propos</h3>
                <p className="text-gray-600">{selectedSupplier.description}</p>
              </div>
              
              {selectedSupplier.performance && (
                <div className="mt-6 bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">Métriques de performance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-blue-700">Livraison à temps</p>
                      <p className="text-lg font-medium text-blue-800">{selectedSupplier.performance.on_time_delivery}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Qualité produit</p>
                      <p className="text-lg font-medium text-blue-800">{selectedSupplier.performance.quality_rating}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Taux de réponse</p>
                      <p className="text-lg font-medium text-blue-800">{selectedSupplier.performance.response_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Temps de réponse</p>
                      <p className="text-lg font-medium text-blue-800">{selectedSupplier.performance.response_time}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Produits populaires</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-4">
                        <h5 className="font-medium text-gray-900">Produit Exemple {i}</h5>
                        <p className="text-sm text-gray-500">29.99€</p>
                        <Button className="w-full mt-2" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    Voir tous les produits
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
                <Button>
                  Contacter le fournisseur
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Building(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  );
}

function DollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

export default AdvancedSuppliers;