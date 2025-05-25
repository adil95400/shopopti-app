import React from 'react';

const Help = () => {
  const faqs = [
    { q: "Comment importer un produit ?", a: "Utilise la section Importation pour choisir ta source." },
    { q: "Comment publier sur TikTok Shop ?", a: "Va dans Multicanal et connecte ton compte TikTok." },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Aide & FAQ</h1>
      {faqs.map((f, idx) => (
        <div key={idx} className="mb-4">
          <h3 className="font-semibold">{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  );
};

export default Help;
