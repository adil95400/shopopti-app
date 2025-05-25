export const scoreProducts = (products) => {
  return products.map(p => ({
    ...p,
    score: Math.min(100, Math.floor(p.price * Math.random() * 2))
  }));
};
