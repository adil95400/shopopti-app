export const fetchMetaAdsProducts = async () => {
  return [
    {
      name: "MetaAds produit 1",
      source: "MetaAds",
      price: 19.99,
      trend: "↑",
      score: Math.floor(Math.random() * 100)
    },
    {
      name: "MetaAds produit 2",
      source: "MetaAds",
      price: 29.99,
      trend: "→",
      score: Math.floor(Math.random() * 100)
    }
  ];
};
