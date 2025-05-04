// Listen for product data on the page
function extractProductData() {
  if (window.location.hostname.includes('aliexpress.com')) {
    return extractAliExpressProduct();
  } else if (window.location.hostname.includes('amazon.com')) {
    return extractAmazonProduct();
  }
  return null;
}

function extractAliExpressProduct() {
  const title = document.querySelector('h1').innerText;
  const price = document.querySelector('.product-price-value').innerText;
  const images = Array.from(document.querySelectorAll('.images-view-item img')).map(img => img.src);
  
  return {
    title,
    price: parseFloat(price.replace(/[^0-9.]/g, '')),
    images,
    source: 'aliexpress',
    url: window.location.href
  };
}

function extractAmazonProduct() {
  const title = document.querySelector('#productTitle').innerText;
  const price = document.querySelector('#priceblock_ourprice').innerText;
  const images = Array.from(document.querySelectorAll('#altImages img')).map(img => img.src);

  return {
    title,
    price: parseFloat(price.replace(/[^0-9.]/g, '')),
    images,
    source: 'amazon',
    url: window.location.href
  };
}

// Send product data to popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProductData') {
    const productData = extractProductData();
    sendResponse(productData);
  }
});