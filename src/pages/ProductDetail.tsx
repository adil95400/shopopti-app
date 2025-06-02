import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, supplier:supplier_id(name, country)')
      .eq('id', id)
      .single();
    setProduct(data);
  };

  if (!product) {
    return <div className="p-6">Chargement du produit...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img src={product.image_url} alt={product.name} className="w-full h-auto rounded shadow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-2">{new Date(product.created_at).toLocaleDateString()}</p>
          {product.is_featured && (
            <span className="inline-block px-3 py-1 bg-yellow-400 text-white text-xs font-semibold rounded mb-2">Produit en vedette</span>
          )}
          <p className="text-xl text-blue-700 font-semibold mb-4">{product.price} €</p>
          <p className="mb-4">{product.description}</p>
          {product.supplier && (
            <p className="text-sm text-gray-700 mb-4">
              Fournisseur : <strong>{product.supplier.name}</strong> ({product.supplier.country})
            </p>
          )}
          <button className="bg-green-600 text-white px-4 py-2 rounded">📥 Importer ce produit</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;