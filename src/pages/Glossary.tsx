import React from 'react';

const Glossary = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dropshipping Glossary</h1>
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">A</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium">AliExpress</dt>
              <dd className="text-gray-600 mt-1">A popular online retail platform commonly used by dropshippers to source products.</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">D</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium">Dropshipping</dt>
              <dd className="text-gray-600 mt-1">A retail fulfillment method where stores don't keep the products they sell in stock, instead transferring customer orders to suppliers.</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">E</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium">ePacket</dt>
              <dd className="text-gray-600 mt-1">A shipping option for delivering products from China to international customers, known for being cost-effective.</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">S</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium">SKU</dt>
              <dd className="text-gray-600 mt-1">Stock Keeping Unit - A unique identifier for each distinct product and service that can be purchased.</dd>
            </div>
            <div>
              <dt className="font-medium">Supplier</dt>
              <dd className="text-gray-600 mt-1">The manufacturer or wholesaler who ships products directly to customers on behalf of the dropshipping store.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Glossary;