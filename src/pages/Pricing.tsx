import React from 'react';
import { supabase } from '../lib/supabase';

const plans = [
  {
    name: "Freemium",
    price: "0€",
    description: "Idéal pour découvrir Shopopti+",
    features: ["10 produits max", "Accès limité IA", "Pas d'import Shopify"],
    priceId: null
  },
  {
    name: "Pro",
    price: "29€/mois",
    description: "Pour les boutiques en croissance",
    features: ["1000 produits", "SEO + IA", "Import Shopify"],
    priceId: import.meta.env.VITE_STRIPE_PRICE_PRO
  },
  {
    name: "Agence",
    price: "99€/mois",
    description: "Multi-boutique, IA illimitée",
    features: ["Produits illimités", "Multi-boutique", "Support avancé"],
    priceId: import.meta.env.VITE_STRIPE_PRICE_AGENCY
  }
];

const Pricing = () => {
  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      alert("Vous utilisez déjà l’offre Freemium gratuite.");
      return;
    }
    const session = await supabase.auth.getSession();
    const user_id = session.data?.session?.user?.id;

    const res = await fetch("/api/stripe/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_id: priceId, user_id })
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur Stripe: " + data.error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">Nos offres d’abonnement</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.name} className="border p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-gray-600 mb-2">{plan.description}</p>
            <p className="text-2xl font-bold text-blue-700 mb-4">{plan.price}</p>
            <ul className="mb-4 space-y-1 text-sm">
              {plan.features.map(f => <li key={f}>✅ {f}</li>)}
            </ul>
            <button onClick={() => handleSubscribe(plan.priceId)} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              S’abonner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
