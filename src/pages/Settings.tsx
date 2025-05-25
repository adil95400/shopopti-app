import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Settings = () => {
  const [connections, setConnections] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [form, setForm] = useState({ store_domain: '', access_token: '' });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data?.session?.user?.id;
      if (uid) {
        setUserId(uid);
        fetchConnections(uid);
        fetchSubscription(uid);
      }
    });
  }, []);

  const fetchConnections = async (uid: string) => {
    const { data } = await supabase.from('users').select('shopify_connections').eq('id', uid).single();
    setConnections(data?.shopify_connections || []);
  };

  const fetchSubscription = async (uid: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    setSubscription(data);
  };

  const saveConnection = async () => {
    if (!form.store_domain || !form.access_token || !userId) return;
    const newConn = { ...form, default: connections.length === 0 };
    const updated = [...connections, newConn];
    await supabase.from('users').update({ shopify_connections: updated }).eq('id', userId);
    setConnections(updated);
    setForm({ store_domain: '', access_token: '' });
  };

  const setDefault = async (index: number) => {
    const updated = connections.map((c, i) => ({ ...c, default: i === index }));
    await supabase.from('users').update({ shopify_connections: updated }).eq('id', userId);
    setConnections(updated);
  };

  const removeConnection = async (index: number) => {
    const updated = connections.filter((_, i) => i !== index);
    await supabase.from('users').update({ shopify_connections: updated }).eq('id', userId);
    setConnections(updated);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paramètres Shopify</h1>
      {subscription && (
        <div className="mb-6 border p-4 rounded bg-green-50">
          <p className="text-sm">Abonnement actif :</p>
          <p className="font-bold text-lg">{subscription.plan} ({subscription.status})</p>
          <p className="text-xs text-gray-500">Souscrit le : {new Date(subscription.created_at).toLocaleDateString()}</p>
        </div>
      )}
      <div className="space-y-3 mb-6">
        {connections.map((conn, i) => (
          <div key={i} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{conn.store_domain}</p>
              {conn.default && <span className="text-xs text-green-600">Par défaut</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDefault(i)} className="text-blue-600 text-sm">⭐</button>
              <button onClick={() => removeConnection(i)} className="text-red-600 text-sm">🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border p-4 rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Ajouter une boutique</h2>
        <input className="border p-2 w-full mb-2" placeholder="Domaine Shopify" value={form.store_domain} onChange={e => setForm({ ...form, store_domain: e.target.value })} />
        <input className="border p-2 w-full mb-2" placeholder="Token Shopify" value={form.access_token} onChange={e => setForm({ ...form, access_token: e.target.value })} />
        <button onClick={saveConnection} className="bg-blue-600 text-white px-4 py-2 rounded">Ajouter</button>
      </div>
    </div>
  );
};

export default Settings;
