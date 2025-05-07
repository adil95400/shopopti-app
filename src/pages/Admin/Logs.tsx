
import React from "react";

const Logs = () => {
  // Cette page affichera tous les logs d'activité
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Historique des Actions</h1>
      <ul className="list-disc ml-6">
        <li>Connexion admin – 10:02</li>
        <li>Suppression produit ID#123 – 10:07</li>
      </ul>
    </div>
  );
};

export default Logs;
