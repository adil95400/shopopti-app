const API_URL = 'https://app.shopopti.com/api/import-extension';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCRAPED_PRODUCT') {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.data)
    })
      .then(res => res.json())
      .then(res => console.log('Import response', res))
      .catch(err => console.error('Import error', err));
  }
});
