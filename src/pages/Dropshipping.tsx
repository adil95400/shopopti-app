import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProductFinder from '../components/dropshipping/ProductFinder';
import SupplierDirectory from '../components/dropshipping/SupplierDirectory';
import OrderFulfillment from '../components/dropshipping/OrderFulfillment';
import SupplierCatalogImporter from '../components/import/SupplierCatalogImporter';
import { ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';

const Dropshipping: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dropshipping</h1>
        <p className="text-gray-600">
          Find winning products, connect with suppliers, and fulfill orders automatically.
        </p>
      </div>

      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="products" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Suppliers</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Import</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ProductFinder />
        </TabsContent>
        
        <TabsContent value="suppliers">
          <SupplierDirectory />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrderFulfillment />
        </TabsContent>
        
        <TabsContent value="import">
          <SupplierCatalogImporter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dropshipping;