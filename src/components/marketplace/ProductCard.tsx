import React from 'react';
import { B2BProduct } from '@/services/b2bService';
import { Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: B2BProduct;
  onClick: (product: B2BProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="h-40 bg-gray-200 relative">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
        )}
        
        {product.discount_tiers && product.discount_tiers.length > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            Jusqu'à {Math.max(...product.discount_tiers.map(tier => tier.discount_percent))}% de remise
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h4 className="font-medium text-gray-900 line-clamp-2">{product.name}</h4>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign size={14} className="text-gray-400" />
            <span className="font-medium">À partir de {product.price.toFixed(2)}€</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          MOQ: {product.min_quantity} unités
        </p>
        
        <Button className="w-full mt-3" size="sm">
          Voir détails
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;