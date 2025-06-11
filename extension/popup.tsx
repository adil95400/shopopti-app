import React from 'react';
import { createRoot } from 'react-dom/client';

function Popup() {
  return (
    <div className="w-80 p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Shopopti+</h1>
        <div id="status" className="text-sm" />
      </div>

      <div id="login-form" className="hidden">
        <input type="text" id="shop-url" placeholder="your-store.myshopify.com" className="w-full mb-2 p-2 border rounded" />
        <input type="password" id="access-token" placeholder="Access Token" className="w-full mb-2 p-2 border rounded" />
        <button id="login" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Connect Store</button>
      </div>

      <div id="import-panel" className="hidden">
        <div id="product-preview" className="mb-4">
          <img id="product-image" className="w-full h-40 object-cover rounded mb-2" />
          <h2 id="product-title" className="text-sm font-medium mb-1" />
          <p id="product-price" className="text-sm text-gray-600" />
        </div>

        <button id="import" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2">Import to Shopify</button>

        <div id="settings" className="text-sm">
          <label className="flex items-center mb-2">
            <input type="checkbox" id="optimize-title" defaultChecked className="mr-2" />
            Optimize title with AI
          </label>
          <label className="flex items-center">
            <input type="checkbox" id="optimize-description" defaultChecked className="mr-2" />
            Generate optimized description
          </label>
        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<Popup />);
}
