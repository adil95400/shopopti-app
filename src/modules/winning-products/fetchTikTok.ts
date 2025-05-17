export const fetchTikTokProducts = async () => {
  return [
    {
      name: "TikTok produit 1",
      source: "TikTok",
      price: 19.99,
      trend: "↑",
      score: Math.floor(Math.random() * 100)
    },
    {
      name: "TikTok produit 2",
      source: "TikTok",
      price: 29.99,
      trend: "→",
      score: Math.floor(Math.random() * 100)
    }
  ];
};
