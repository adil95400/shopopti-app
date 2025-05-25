
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function AutomationsPage() {
  const [payload, setPayload] = useState('{\n  "event": "product_added",\n  "name": "Chaussure AI",\n  "price": 49.99\n}');
  const [result, setResult] = useState('');

  const sendWebhook = async () => {
    const res = await fetch('/api/zapier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    const text = await res.text();
    setResult(text);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🔗 Tester webhook CRM / Zapier</h1>
      <Textarea value={payload} onChange={e => setPayload(e.target.value)} rows={10} />
      <Button onClick={sendWebhook}>Envoyer vers Webhook</Button>
      {result && (
        <div className="mt-4 p-4 bg-muted rounded">
          <strong>Réponse :</strong>
          <pre className="text-sm mt-2">{result}</pre>
        </div>
      )}
    </div>
  );
}
