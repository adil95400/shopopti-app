// Stripe product configuration
export const stripeProducts = {
  pro: {
    priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
    name: 'Shopopti+',
    description: 'AI-powered e-commerce optimization platform',
    mode: 'subscription'
  }
};

// Helper function to get product details by price ID
export const getProductByPriceId = (priceId: string) => {
  for (const [key, product] of Object.entries(stripeProducts)) {
    if (product.priceId === priceId) {
      return { ...product, id: key };
    }
  }
  return null;
};