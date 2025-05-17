import React from 'react';

const MultichannelPublish = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Publication Multicanal</h1>
      <p>Connecte tes plateformes pour publier tes produits en un clic.</p>
      <div className="space-y-4 mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Connecter Google Shopping</button>
        <button className="bg-pink-500 text-white px-4 py-2 rounded">Connecter TikTok Shop</button>
        <button className="bg-blue-700 text-white px-4 py-2 rounded">Connecter Facebook Shop</button>
      </div>
    </div>
  );
};

export default MultichannelPublish;
