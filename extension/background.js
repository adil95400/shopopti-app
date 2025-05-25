// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'importProduct') {
    importToShopify(request.product, request.settings)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

async function importToShopify(product, settings) {
  const shopUrl = await chrome.storage.local.get('shopUrl');
  const accessToken = await chrome.storage.local.get('accessToken');

  if (!shopUrl || !accessToken) {
    throw new Error('Store not connected');
  }

  const response = await fetch(`https://${shopUrl}/admin/api/2024-01/products.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: {
        title: product.title,
        body_html: product.description,
        vendor: product.source,
        images: product.images.map(url => ({ src: url })),
        variants: [{
          price: product.price,
          requires_shipping: true,
          inventory_management: 'shopify',
          inventory_quantity: 100
        }]
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to import product');
  }

  return await response.json();
}