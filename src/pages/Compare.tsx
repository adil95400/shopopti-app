import React from 'react';

function Compare() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Compare Products
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Compare different products and their features side by side
          </p>
        </div>
        
        <div className="mt-12">
          {/* Comparison content will be added here based on selected products */}
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">
              Select products to compare their features, prices, and specifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compare;