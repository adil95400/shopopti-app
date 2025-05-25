document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('login-form');
  const importPanel = document.getElementById('import-panel');
  const status = document.getElementById('status');

  // Check if store is connected
  const { shopUrl, accessToken } = await chrome.storage.local.get(['shopUrl', 'accessToken']);
  if (shopUrl && accessToken) {
    showImportPanel();
  } else {
    showLoginForm();
  }

  // Handle login
  document.getElementById('login')?.addEventListener('click', async () => {
    const shopUrl = document.getElementById('shop-url').value;
    const accessToken = document.getElementById('access-token').value;

    try {
      // Validate credentials
      const response = await fetch(`https://${shopUrl}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken
        }
      });

      if (response.ok) {
        await chrome.storage.local.set({ shopUrl, accessToken });
        showImportPanel();
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      status.textContent = 'Connection failed';
      status.className = 'text-sm text-red-600';
    }
  });

  // Handle import
  document.getElementById('import')?.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
      status.textContent = 'Importing...';
      status.className = 'text-sm text-blue-600';

      const settings = {
        optimizeTitle: document.getElementById('optimize-title').checked,
        optimizeDescription: document.getElementById('optimize-description').checked
      };

      const response = await chrome.runtime.sendMessage({
        action: 'importProduct',
        product: window.productData,
        settings
      });

      if (response.success) {
        status.textContent = 'Import successful!';
        status.className = 'text-sm text-green-600';
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      status.textContent = 'Import failed';
      status.className = 'text-sm text-red-600';
    }
  });

  // Get product data from current page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'getProductData' }, (response) => {
    if (response) {
      window.productData = response;
      document.getElementById('product-image').src = response.images[0];
      document.getElementById('product-title').textContent = response.title;
      document.getElementById('product-price').textContent = `$${response.price}`;
    }
  });
});

function showLoginForm() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('import-panel').classList.add('hidden');
}

function showImportPanel() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('import-panel').classList.remove('hidden');
}