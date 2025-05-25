export const fetchAliExpressProducts = async () => {
  return [
    {
      name: "AliExpress produit 1",
      source: "AliExpress",
      price: 19.99,
      trend: "↑",
      score: Math.floor(Math.random() * 100)
    },
    {
      name: "AliExpress produit 2",
      source: "AliExpress",
      price: 29.99,
      trend: "→",
      score: Math.floor(Math.random() * 100)
    }
  ];
};
