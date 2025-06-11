import React from 'react';
import { createRoot } from 'react-dom/client';
function Popup() {
    return (React.createElement("div", { className: "w-80 p-4 bg-gray-50" },
        React.createElement("div", { className: "flex items-center justify-between mb-4" },
            React.createElement("h1", { className: "text-lg font-semibold" }, "Shopopti+"),
            React.createElement("div", { id: "status", className: "text-sm" })),
        React.createElement("div", { id: "login-form", className: "hidden" },
            React.createElement("input", { type: "text", id: "shop-url", placeholder: "your-store.myshopify.com", className: "w-full mb-2 p-2 border rounded" }),
            React.createElement("input", { type: "password", id: "access-token", placeholder: "Access Token", className: "w-full mb-2 p-2 border rounded" }),
            React.createElement("button", { id: "login", className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" }, "Connect Store")),
        React.createElement("div", { id: "import-panel", className: "hidden" },
            React.createElement("div", { id: "product-preview", className: "mb-4" },
                React.createElement("img", { id: "product-image", className: "w-full h-40 object-cover rounded mb-2" }),
                React.createElement("h2", { id: "product-title", className: "text-sm font-medium mb-1" }),
                React.createElement("p", { id: "product-price", className: "text-sm text-gray-600" })),
            React.createElement("button", { id: "import", className: "w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2" }, "Import to Shopify"),
            React.createElement("div", { id: "settings", className: "text-sm" },
                React.createElement("label", { className: "flex items-center mb-2" },
                    React.createElement("input", { type: "checkbox", id: "optimize-title", defaultChecked: true, className: "mr-2" }),
                    "Optimize title with AI"),
                React.createElement("label", { className: "flex items-center" },
                    React.createElement("input", { type: "checkbox", id: "optimize-description", defaultChecked: true, className: "mr-2" }),
                    "Generate optimized description")))));
}
const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(React.createElement(Popup, null));
}
