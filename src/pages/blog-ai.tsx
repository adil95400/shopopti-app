
// src/pages/blog-ai.tsx
import React, { useState } from 'react';
import { askChatGPT } from '@/lib/openai';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function BlogAIPage() {
  const [productName, setProductName] = useState('');
  const [blogContent, setBlogContent] = useState('');

  const generateBlog = async () => {
    const prompt = `Rédige un article de blog optimisé SEO pour le produit suivant : ${productName}`;
    const content = await askChatGPT(prompt);
    setBlogContent(content);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Génération Blog IA</h1>
      <Input
        placeholder="Nom du produit"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <Button onClick={generateBlog}>Générer l'article</Button>
      <Textarea rows={15} value={blogContent} className="w-full" readOnly />
    </div>
  );
}
