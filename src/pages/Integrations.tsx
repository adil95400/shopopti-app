import React from 'react';

function Integrations() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Integration cards will be added here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-gray-600">Integration options will be available here.</p>
        </div>
      </div>
    </div>
  );
}

export default Integrations;