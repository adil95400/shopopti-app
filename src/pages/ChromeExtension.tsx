import React from 'react';

const ChromeExtension = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Extension Chrome</h1>
      <p>Télécharge l’extension officielle pour importer des produits en un clic.</p>
      <a href="#" className="inline-block bg-blue-600 text-white px-4 py-2 mt-4 rounded">📥 Télécharger l’extension</a>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Démonstration</h2>
        <iframe width="100%" height="300" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Demo" allowFullScreen></iframe>
      </div>
    </div>
  );
};

export default ChromeExtension;
