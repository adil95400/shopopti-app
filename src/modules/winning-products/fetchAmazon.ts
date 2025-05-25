export const fetchAmazonProducts = async () => {
  return [
    {
      name: "Amazon produit 1",
      source: "Amazon",
      price: 19.99,
      trend: "↑",
      score: Math.floor(Math.random() * 100)
    },
    {
      name: "Amazon produit 2",
      source: "Amazon",
      price: 29.99,
      trend: "→",
      score: Math.floor(Math.random() * 100)
    }
  ];
};
