import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import FournisseurCard from '@/components/FournisseurCard';

export default function MarketplaceB2B() {
  const [search, setSearch] = useState('');
  const [fournisseurs, setFournisseurs] = useState([]);

  useEffect(() => {
    const fetchFournisseurs = async () => {
      const { data, error } = await supabase
        .from('b2b_suppliers')
        .select('*')
        .order('rating', { ascending: false });

      if (!error && data) {
        setFournisseurs(data);
      }
    };

    fetchFournisseurs();
  }, []);

  const filtered = fournisseurs.filter((f: any) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🛍️ Marketplace B2B Privée</h1>
      <Input
        placeholder="Rechercher un fournisseur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fournisseur: any) => (
          <FournisseurCard key={fournisseur.id} data={fournisseur} />
        ))}
      </div>
    </div>
  );
}