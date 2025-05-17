import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [verified, setVerified] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (!error) setSuppliers(data);
  };

  const filtered = suppliers.filter(s =>
    (!country || s.country.toLowerCase().includes(country.toLowerCase())) &&
    (!category || s.category.toLowerCase().includes(category.toLowerCase())) &&
    (!verified || (verified === 'yes' ? s.is_verified : !s.is_verified))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Marketplace Fournisseurs</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <input placeholder="Pays" value={country} onChange={e => setCountry(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Catégorie" value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded" />
        <select value={verified} onChange={e => setVerified(e.target.value)} className="border p-2 rounded">
          <option value="">Tous</option>
          <option value="yes">Vérifiés</option>
          <option value="no">Non vérifiés</option>
        </select>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((s: any) => (
          <div key={s.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold">{s.name}</h2>
            <p>🌍 {s.country}</p>
            <p>📦 {s.category}</p>
            <p>🚚 {s.delivery}</p>
            <a href={s.website} target="_blank" rel="noreferrer" className="text-blue-600 underline mt-2 inline-block">Voir site</a>
            {s.is_verified && <p className="text-green-600 mt-1">✔ Fournisseur vérifié</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suppliers;
