export const fetchEbayProducts = async () => {
  return [
    {
      name: "Ebay produit 1",
      source: "Ebay",
      price: 19.99,
      trend: "↑",
      score: Math.floor(Math.random() * 100)
    },
    {
      name: "Ebay produit 2",
      source: "Ebay",
      price: 29.99,
      trend: "→",
      score: Math.floor(Math.random() * 100)
    }
  ];
};
