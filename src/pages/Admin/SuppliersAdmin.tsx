import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const SuppliersAdmin = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ id: null, name: '', country: '', category: '', delivery: '', website: '', logo_url: '', is_verified: false });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const { data } = await supabase.from('suppliers').select('*').order('id', { ascending: false });
    setSuppliers(data || []);
  };

  const saveSupplier = async () => {
    if (!form.name || !form.country) return;

    if (form.id) {
      await supabase.from('suppliers').update(form).eq('id', form.id);
    } else {
      await supabase.from('suppliers').insert([form]);
    }

    setForm({ id: null, name: '', country: '', category: '', delivery: '', website: '', logo_url: '', is_verified: false });
    fetchSuppliers();
  };

  const editSupplier = (s: any) => setForm(s);
  const deleteSupplier = async (id: number) => {
    await supabase.from('suppliers').delete().eq('id', id);
    fetchSuppliers();
  };

  const importProducts = (supplier: any) => {
    alert(`Simuler l'importation des produits depuis ${supplier.name}`);
    // Redirection possible : window.location.href = `/import?supplier=${supplier.id}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Fournisseurs (Supabase)</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">{form.id ? 'Modifier' : 'Ajouter'} un fournisseur</h2>
          <input className="border p-2 w-full mb-2" placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="border p-2 w-full mb-2" placeholder="Pays" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          <input className="border p-2 w-full mb-2" placeholder="Catégorie" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className="border p-2 w-full mb-2" placeholder="Délai livraison" value={form.delivery} onChange={e => setForm({ ...form, delivery: e.target.value })} />
          <input className="border p-2 w-full mb-2" placeholder="Site web" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
          <input className="border p-2 w-full mb-2" placeholder="Logo URL" value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} />
          <label className="block mb-2">
            <input type="checkbox" checked={form.is_verified} onChange={e => setForm({ ...form, is_verified: e.target.checked })} className="mr-2" />
            Vérifié
          </label>
          <button onClick={saveSupplier} className="bg-blue-600 text-white px-4 py-2 rounded">{form.id ? 'Modifier' : 'Ajouter'}</button>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Fournisseurs</h2>
          {suppliers.map(s => (
            <div key={s.id} className="border p-3 mb-2 rounded flex justify-between items-center">
              <div>
                <strong>{s.name}</strong> – {s.country} ({s.category})
              </div>
              <div className="flex gap-2">
                <button onClick={() => importProducts(s)} className="text-green-600">📥</button>
                <button onClick={() => editSupplier(s)} className="text-blue-600">✏️</button>
                <button onClick={() => deleteSupplier(s.id)} className="text-red-600">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuppliersAdmin;
