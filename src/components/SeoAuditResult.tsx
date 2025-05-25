export default function SeoAuditResult({ data }: { data: any }) {
  return (
    <div className="bg-muted/30 border rounded p-4 space-y-3 text-sm mt-4">
      <p><strong>Score SEO :</strong> {data.score}/100</p>
      <p><strong>Balise title :</strong> {data.title}</p>
      <p><strong>Meta description :</strong> {data.meta_description}</p>
      <p><strong>Rich Snippet JSON-LD :</strong></p>
      <pre className="bg-black text-white text-xs p-2 rounded overflow-auto">{data.rich_snippet}</pre>
      <div>
        <p className="font-semibold">Recommandations IA :</p>
        <ul className="list-disc pl-4 space-y-1">
          {data.recommendations.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}