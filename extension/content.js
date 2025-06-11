function scrapeProduct() {
  const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
  const priceEl = document.querySelector('[itemprop="price"],[data-price],.price');
  const price = priceEl?.getAttribute('content') || priceEl?.dataset.price || priceEl?.textContent || '';
  const image = document.querySelector('meta[property="og:image"]')?.content || document.querySelector('img')?.src || '';
  return {
    title: title.trim(),
    price: price.trim(),
    image,
    url: window.location.href
  };
}

try {
  const data = scrapeProduct();
  chrome.runtime.sendMessage({ type: 'SCRAPED_PRODUCT', data });
} catch (e) {
  console.error('Scrape error', e);
}
