import React, { useState } from 'react';

const BlogGenerator = () => {
  const [blog, setBlog] = useState('');

  const handleGenerate = () => {
    setBlog("Voici un article SEO généré automatiquement pour ton produit...");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Générateur de Blog (IA)</h1>
      <button onClick={handleGenerate} className="bg-green-600 text-white px-4 py-2 mb-4 rounded">Générer le contenu</button>
      {blog && <textarea value={blog} rows={10} className="w-full border p-2 rounded" readOnly />}
    </div>
  );
};

export default BlogGenerator;
