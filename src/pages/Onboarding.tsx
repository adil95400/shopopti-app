import React from 'react';

const Onboarding = () => {
  const steps = ['Connexion', 'Importer des produits', 'Publier sur les marketplaces', 'Optimiser avec IA'];
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur Shopopti+</h1>
      <ol className="list-decimal ml-6 space-y-2">
        {steps.map((step, idx) => <li key={idx}>{step}</li>)}
      </ol>
      <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">Commencer</button>
    </div>
  );
};

export default Onboarding;
