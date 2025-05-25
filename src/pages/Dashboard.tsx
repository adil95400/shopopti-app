
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/tracking" className="bg-muted p-4 rounded shadow hover:bg-muted/60">
          <h2 className="text-lg font-semibold">📦 Suivi colis</h2>
          <p className="text-muted-foreground">Suivre vos envois</p>
        </Link>
        <Link to="/generate-invoice" className="bg-muted p-4 rounded shadow hover:bg-muted/60">
          <h2 className="text-lg font-semibold">🧾 Générer facture</h2>
          <p className="text-muted-foreground">PDF automatisé client</p>
        </Link>
        <Link to="/blog-ai" className="bg-muted p-4 rounded shadow hover:bg-muted/60">
          <h2 className="text-lg font-semibold">📝 Blog IA</h2>
          <p className="text-muted-foreground">Créer des articles optimisés</p>
        </Link>
      </div>
    </div>
  );
}
