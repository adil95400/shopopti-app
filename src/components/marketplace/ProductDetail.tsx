import React, { useState } from 'react';
import { B2BProduct, B2BSupplier } from '@/services/b2bService';
import { Package, DollarSign, Truck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductDetailProps {
  product: B2BProduct;
  supplier: B2BSupplier;
  onBack: () => void;
  onRequestQuote: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  supplier, 
  onBack, 
  onRequestQuote 
}) => {
  const [quantity, setQuantity] = useState(product.min_quantity);
  
  // Calculate price based on quantity and discount tiers
  const calculatePrice = (basePrice: number, quantity: number) => {
    if (!product.discount_tiers || product.discount_tiers.length === 0) {
      return basePrice;
    }
    
    // Find the applicable discount tier
    const applicableTier = [...product.discount_tiers]
      .sort((a, b) => b.quantity - a.quantity)
      .find(tier => quantity >= tier.quantity);
    
    if (!applicableTier) {
      return basePrice;
    }
    
    // Apply discount
    return basePrice * (1 - applicableTier.discount_percent / 100);
  };
  
  const price = calculatePrice(product.price, quantity);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.images && product.images.length > 0 ? (
            <div className="space-y-4">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-80 object-cover rounded-lg"
              />
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <img 
                      key={index} 
                      src={image} 
                      alt={`${product.name} ${index + 2}`} 
                      className="w-full h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">Fournisseur:</span>
              <span className="ml-2 text-sm font-medium">{supplier.name}</span>
              {supplier.verified && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Vérifié
                </span>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Prix unitaire</p>
                <p className="text-2xl font-bold text-gray-900">{price.toFixed(2)}€</p>
                {product.discount_tiers && product.discount_tiers.length > 0 && price < product.price && (
                  <p className="text-sm text-green-600">
                    Économisez {((product.price - price) / product.price * 100).toFixed(0)}%
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantité minimum</p>
                <p className="text-lg font-medium text-gray-900">{product.min_quantity} unités</p>
              </div>
            </div>
            
            {product.discount_tiers && product.discount_tiers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Remises par quantité</p>
                <div className="grid grid-cols-3 gap-2">
                  {[...product.discount_tiers]
                    .sort((a, b) => a.quantity - b.quantity)
                    .map((tier, index) => (
                      <div 
                        key={index} 
                        className={`p-2 text-center rounded ${
                          quantity >= tier.quantity ? 'bg-primary-50 border border-primary-200' : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-xs text-gray-500">≥ {tier.quantity} unités</p>
                        <p className="font-medium">{tier.discount_percent}% off</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100"
                  onClick={() => setQuantity(Math.max(product.min_quantity, quantity - 10))}
                >
                  -
                </button>
                <input
                  type="number"
                  min={product.min_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.min_quantity, parseInt(e.target.value) || product.min_quantity))}
                  className="w-20 text-center py-1 border-t border-b border-gray-300"
                />
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100"
                  onClick={() => setQuantity(quantity + 10)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Total estimé:</span>
                <span>{(price * quantity).toFixed(2)}€</span>
              </div>
              <Button className="w-full" onClick={onRequestQuote}>
                Demander un devis
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Les prix peuvent varier en fonction des options et de la personnalisation
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Délai de livraison</h3>
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-gray-400 mr-2" />
              <span>{supplier.delivery_delay}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Description du produit</h3>
        <p className="text-gray-600">{product.description}</p>
      </div>
      
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Spécifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-500">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onRequestQuote}>
          Demander un devis
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;