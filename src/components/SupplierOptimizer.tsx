import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  country: string;
  rating: number;
  processing_time: string;
  shipping_time: string;
  minimum_order: number;
  verified: boolean;
  performance?: {
    on_time_delivery: number;
    quality_rating: number;
    response_rate: number;
    response_time: string;
  };
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

interface SupplierProduct {
  id: string;
  supplier_id: string;
  name: string;
  price: number;
  msrp?: number;
  processing_time?: string;
  base_price?: number;
  retail_price?: number;
  shipping_time?: number;
  origin_country?: string;
}

interface SupplierOptimizerProps {
  productId?: string;
  onSupplierSelected?: (supplierId: string, productId: string) => void;
}

const SupplierOptimizer: React.FC<SupplierOptimizerProps> = ({ productId, onSupplierSelected }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    maxProcessingDays: 0,
    verifiedOnly: false
  });

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
    fetchSuppliers();
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Erreur lors du chargement du produit');
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Erreur lors du chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const compareSuppliers = async () => {
    try {
      setComparing(true);
      
      if (!product) {
        toast.error('Aucun produit sélectionné pour la comparaison');
        return;
      }
      
      // Simulate API call to find similar products from different suppliers
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock supplier products based on the product and available suppliers
      const mockSupplierProducts = suppliers.slice(0, 5).map(supplier => {
        // Generate a price variation based on supplier rating (better rating = better price)
        const priceMultiplier = 1 - (supplier.rating / 10); // 0.5 to 0.9
        const basePrice = product.price * priceMultiplier;
        
        // Add some randomness
        const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
        
        return {
          id: `sp-${supplier.id}`,
          supplier_id: supplier.id,
          name: product.title,
          price: Math.round(basePrice * randomFactor * 100) / 100,
          msrp: product.price,
          processing_time: supplier.processing_time,
          base_price: basePrice,
          retail_price: product.price,
          shipping_time: parseInt(supplier.shipping_time?.split('-')[0] || '5'),
          origin_country: supplier.country
        };
      });
      
      setSupplierProducts(mockSupplierProducts);
      
      // Automatically select the best supplier based on a scoring algorithm
      const bestSupplier = findBestSupplier(mockSupplierProducts, suppliers);
      if (bestSupplier) {
        setSelectedSupplier(bestSupplier);
      }
      
      toast.success('Comparaison des fournisseurs terminée');
    } catch (error) {
      console.error('Error comparing suppliers:', error);
      toast.error('Erreur lors de la comparaison des fournisseurs');
    } finally {
      setComparing(false);
    }
  };

  const findBestSupplier = (products: SupplierProduct[], allSuppliers: Supplier[]): string | null => {
    if (products.length === 0) return null;
    
    // Calculate a score for each supplier based on multiple factors
    const scoredSuppliers = products.map(product => {
      const supplier = allSuppliers.find(s => s.id === product.supplier_id);
      if (!supplier) return { supplierId: product.supplier_id, score: 0 };
      
      // Calculate score based on:
      // 1. Price (lower is better) - 40% weight
      const priceScore = 40 * (1 - (product.price / Math.max(...products.map(p => p.price))));
      
      // 2. Supplier rating - 30% weight
      const ratingScore = 30 * (supplier.rating / 5);
      
      // 3. Processing time (lower is better) - 15% weight
      const processingDays = parseInt(supplier.processing_time?.split('-')[0] || '3');
      const maxProcessingDays = Math.max(...allSuppliers.map(s => parseInt(s.processing_time?.split('-')[0] || '3')));
      const processingScore = 15 * (1 - (processingDays / maxProcessingDays));
      
      // 4. Verified status - 15% weight
      const verifiedScore = supplier.verified ? 15 : 0;
      
      // Total score
      const totalScore = priceScore + ratingScore + processingScore + verifiedScore;
      
      return {
        supplierId: product.supplier_id,
        score: totalScore
      };
    });
    
    // Find the supplier with the highest score
    const bestSupplier = scoredSuppliers.reduce((best, current) => 
      current.score > best.score ? current : best
    , { supplierId: '', score: 0 });
    
    return bestSupplier.supplierId;
  };

  const handleSupplierSelect = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    
    if (onSupplierSelected && productId) {
      onSupplierSelected(supplierId, productId);
    }
  };

  const getSupplierById = (id: string): Supplier | undefined => {
    return suppliers.find(s => s.id === id);
  };

  const getSupplierProductById = (supplierId: string): SupplierProduct | undefined => {
    return supplierProducts.find(p => p.supplier_id === supplierId);
  };

  const filteredSupplierProducts = supplierProducts.filter(product => {
    const supplier = getSupplierById(product.supplier_id);
    if (!supplier) return false;
    
    // Apply search filter
    if (searchTerm && !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply rating filter
    if (filters.minRating > 0 && supplier.rating < filters.minRating) {
      return false;
    }
    
    // Apply processing days filter
    if (filters.maxProcessingDays > 0) {
      const processingDays = parseInt(supplier.processing_time?.split('-')[0] || '999');
      if (processingDays > filters.maxProcessingDays) {
        return false;
      }
    }
    
    // Apply verified filter
    if (filters.verifiedOnly && !supplier.verified) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 rounded-full mr-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium">Optimisation des fournisseurs</h3>
      </div>
      
      {product ? (
        <div className="mb-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden mr-4">
              {product.image ? (
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{product.title}</h4>
              <p className="text-sm text-gray-500 mt-1">Prix actuel: {product.price.toFixed(2)}€</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <p className="text-gray-600">
            Sélectionnez un produit pour comparer les fournisseurs et trouver la meilleure option.
          </p>
        </div>
      )}
      
      {supplierProducts.length === 0 ? (
        <div className="mb-6">
          <Button 
            onClick={compareSuppliers} 
            disabled={comparing || !product}
            className="w-full"
          >
            {comparing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Comparaison en cours...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Comparer les fournisseurs
              </>
            )}
          </Button>
          
          {!product && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Veuillez d'abord sélectionner un produit
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un fournisseur..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseInt(e.target.value) })}
                >
                  <option value="0">Toutes les notes</option>
                  <option value="4">4+ étoiles</option>
                  <option value="4.5">4.5+ étoiles</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            {filteredSupplierProducts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun fournisseur trouvé</h4>
                <p className="text-gray-600">
                  Aucun fournisseur ne correspond à vos critères de recherche.
                </p>
              </div>
            ) : (
              filteredSupplierProducts.map((supplierProduct) => {
                const supplier = getSupplierById(supplierProduct.supplier_id);
                if (!supplier) return null;
                
                const isSelected = selectedSupplier === supplier.id;
                
                return (
                  <div 
                    key={supplier.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {supplier.verified && (
                            <div className="bg-green-100 p-2 rounded-full">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                          {!supplier.verified && (
                            <div className="bg-gray-100 p-2 rounded-full">
                              <Truck className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1 text-sm">{supplier.rating.toFixed(1)}</span>
                            </div>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{supplier.country}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-lg">{supplierProduct.price.toFixed(2)}€</p>
                        {supplierProduct.msrp && (
                          <p className="text-sm text-gray-500 line-through">{supplierProduct.msrp.toFixed(2)}€</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs text-gray-500">Délai traitement</p>
                        <p className="font-medium">{supplier.processing_time}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs text-gray-500">Délai livraison</p>
                        <p className="font-medium">{supplier.shipping_time}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs text-gray-500">Commande min.</p>
                        <p className="font-medium">{supplier.minimum_order}€</p>
                      </div>
                    </div>
                    
                    {supplier.performance && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="text-sm font-medium text-blue-800">Performance</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-blue-600 mr-1" />
                            <span>Livraison à temps: {supplier.performance.on_time_delivery}%</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-blue-600 mr-1" />
                            <span>Qualité: {supplier.performance.quality_rating}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button 
                        onClick={() => handleSupplierSelect(supplier.id)}
                        variant={isSelected ? "default" : "outline"}
                        className="w-full"
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Sélectionné
                          </>
                        ) : (
                          <>
                            Sélectionner ce fournisseur
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {selectedSupplier && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800">Fournisseur recommandé</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {getSupplierById(selectedSupplier)?.name} est le meilleur fournisseur pour ce produit en termes de prix, qualité et délais de livraison.
                  </p>
                  <div className="mt-3">
                    <Button size="sm" onClick={() => {
                      if (onSupplierSelected && productId) {
                        onSupplierSelected(selectedSupplier, productId);
                        toast.success('Fournisseur sélectionné avec succès');
                      }
                    }}>
                      Confirmer la sélection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupplierOptimizer;