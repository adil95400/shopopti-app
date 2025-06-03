import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const MySubscription = () => {
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data?.session?.user?.id;
      if (!uid) return;
      supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('customer_id', uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => setSub(data));
    });
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mon abonnement</h1>
      {sub ? (
        <div className="border p-4 rounded bg-white shadow">
          <p><strong>Plan :</strong> {sub.price_id}</p>
          <p><strong>Statut :</strong> {sub.status}</p>
          <p><strong>Date de souscription :</strong> {new Date(sub.created_at).toLocaleDateString()}</p>
          {sub.status === "active" && (
            <a
              href="https://billing.stripe.com/p/login/test_xxxx"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
              target="_blank"
              rel="noreferrer"
            >
              Gérer via Stripe
            </a>
          )}
        </div>
      ) : (
        <p>Chargement de votre abonnement...</p>
      )}
    </div>
  );
};

export default MySubscription;