import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  PlusCircle, 
  Filter, 
  SlidersHorizontal, 
  Import, 
  MoreVertical,
  Edit,
  Trash,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopContext } from '../contexts/ShopContext';

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 89.99,
    stock: 32,
    category: 'Electronics',
    status: 'active',
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 199.99,
    stock: 15,
    category: 'Furniture',
    status: 'active',
  },
  {
    id: '3',
    name: 'Smart Watch Series 5',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 249.99,
    stock: 27,
    category: 'Electronics',
    status: 'active',
  },
  {
    id: '4',
    name: 'Leather Messenger Bag',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 79.99,
    stock: 42,
    category: 'Accessories',
    status: 'active',
  },
  {
    id: '5',
    name: 'Digital Drawing Tablet',
    image: 'https://images.pexels.com/photos/1422220/pexels-photo-1422220.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 149.99,
    stock: 8,
    category: 'Electronics',
    status: 'low_stock',
  },
];

const Products: React.FC = () => {
  const { isConnected } = useShopContext();
  const [products] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-3">
          <ShoppingBag size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to manage products</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Products</h1>
          <p className="text-neutral-500">
            Manage your product catalog and optimize listings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            className="btn btn-outline"
            onClick={() => setShowImportModal(true)}
          >
            <Import size={16} className="mr-2" />
            Import Products
          </button>
          <button className="btn btn-primary">
            <PlusCircle size={16} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            <button className="btn btn-outline">
              <SlidersHorizontal size={16} className="mr-2" />
              Sort
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {filteredProducts.map((product) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-neutral-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-neutral-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-neutral-900">{product.category}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-neutral-900">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-neutral-900">
                      {product.stock}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                      ${product.status === 'active'
                        ? 'bg-success-400/10 text-success-400'
                        : product.status === 'low_stock'
                        ? 'bg-warning-400/10 text-warning-400'
                        : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {product.status === 'active' 
                        ? 'Active' 
                        : product.status === 'low_stock' 
                        ? 'Low Stock'
                        : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <button className="text-neutral-600 hover:text-neutral-900">
                        <MoreVertical size={16} />
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-neutral-300" />
                      <h3 className="mt-2 text-sm font-medium text-neutral-900">No products found</h3>
                      <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-neutral-900/75 transition-opacity"
              onClick={() => setShowImportModal(false)}
            ></div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-neutral-900">Import Products</h3>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500">
                        Select a source to import products from.
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {['AliExpress', 'Amazon', 'CSV File', 'API'].map((source) => (
                        <div 
                          key={source}
                          onClick={() => setSelectedSource(source)}
                          className={`rounded-md border p-4 hover:bg-neutral-50 cursor-pointer transition-colors
                            ${selectedSource === source 
                              ? 'border-primary-500 bg-primary-50/50' 
                              : 'border-neutral-200'}`}
                        >
                          <div className="font-medium text-neutral-900">{source}</div>
                          <p className="mt-1 text-xs text-neutral-500">
                            {source === 'AliExpress' && 'Import products from AliExpress'}
                            {source === 'Amazon' && 'Import products from Amazon'}
                            {source === 'CSV File' && 'Upload products via CSV file'}
                            {source === 'API' && 'Connect to a supplier API'}
                          </p>
                        </div>
                      ))}
                    </div>

                    {selectedSource === 'AliExpress' && (
                      <div className="mt-4 rounded-md bg-neutral-50 p-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-neutral-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-neutral-800">One-click import</h3>
                            <div className="mt-2 text-xs text-neutral-700">
                              <p>
                                Paste an AliExpress product URL to import all product details including images, description, variants, and more.
                              </p>
                              <div className="mt-3">
                                <input
                                  type="text"
                                  placeholder="https://aliexpress.com/item/..."
                                  className="input w-full text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="btn btn-primary sm:ml-2"
                  disabled={!selectedSource}
                >
                  Continue Import
                </button>
                <button
                  type="button"
                  className="btn btn-outline mt-3 sm:mt-0"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;