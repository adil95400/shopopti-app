import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Import = () => {
  const [params] = useSearchParams();
  const supplierId = params.get("supplier");
  const [supplier, setSupplier] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (supplierId) {
      fetchSupplier();
      fetchProducts();
    }
  }, [supplierId]);

  const fetchSupplier = async () => {
    const { data } = await supabase.from('suppliers').select('*').eq('id', supplierId).single();
    setSupplier(data);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('supplier_id', supplierId)
      .limit(100);
    if (data) setProducts(data);
  };

  const importProduct = async (p: any) => {
    alert(`Produit importé : ${p.name}`);
    // Ajoute ici logique d'importation réelle dans ta boutique
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Importation Produits</h1>
      {supplier ? (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Fournisseur : {supplier.name}</h2>
          <p>Catégorie : {supplier.category}</p>
          <p>Pays : {supplier.country}</p>
        </div>
      ) : (
        <p>Chargement fournisseur...</p>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded shadow">
            <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover mb-2 rounded" />
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{p.description}</p>
            <p className="font-semibold text-blue-700 mb-2">{p.price} €</p>
            <button onClick={() => importProduct(p)} className="bg-green-600 text-white px-4 py-2 rounded">📥 Importer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Import;
