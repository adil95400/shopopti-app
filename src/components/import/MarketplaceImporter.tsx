import React, { useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';

interface MarketplaceImporterProps {
  marketplace?: string;
}

const MarketplaceImporter: React.FC<MarketplaceImporterProps> = ({ marketplace }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
          <ShoppingBag className="h-4 w-4 text-primary-400" />
        </div>
        <h3 className="text-lg font-medium text-white">
          Rechercher sur {marketplace === 'aliexpress' ? 'AliExpress' : 'Amazon'}
        </h3>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher des produits..."
          className="w-full bg-secondary-400 rounded-lg pl-10 pr-4 py-2 text-white placeholder-accent-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-accent-200" />
      </div>
      <button
        className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
        onClick={() => {
          // Handle marketplace search
          console.log(searchTerm);
        }}
      >
        Rechercher
      </button>
    </div>
  );
};

export default MarketplaceImporter;