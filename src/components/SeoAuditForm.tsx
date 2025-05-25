import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SeoAuditResult from "./SeoAuditResult";
import { auditSEOWithAI } from "@/lib/seoAI";

export default function SeoAuditForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await auditSEOWithAI({ title, description, tags });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre produit" />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description produit" />
      <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (séparés par des virgules)" />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyse en cours..." : "Lancer l'audit SEO"}
      </Button>
      {result && <SeoAuditResult data={result} />}
    </div>
  );
}