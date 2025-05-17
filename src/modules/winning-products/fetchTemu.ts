export const fetchTemuProducts = async () => {
  return [
    {
      name: "Temu produit 1",
      source: "Temu",
      price: 19.99,
      trend: "↑",
      score: Math.floor(Math.random() * 100)
    },
    {
      name: "Temu produit 2",
      source: "Temu",
      price: 29.99,
      trend: "→",
      score: Math.floor(Math.random() * 100)
    }
  ];
};
