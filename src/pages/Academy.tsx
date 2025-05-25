import React from 'react';

function Academy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Academy</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600">Learn the fundamentals of dropshipping and e-commerce.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Strategies</h2>
          <p className="text-gray-600">Master advanced techniques for scaling your business.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Marketing Essentials</h2>
          <p className="text-gray-600">Discover effective marketing strategies for your store.</p>
        </div>
      </div>
    </div>
  );
}

export default Academy;