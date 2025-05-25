
// src/pages/tracking.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    const response = await fetch(`https://api.17track.net/api/track?number=${trackingNumber}`);
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Suivi de livraison</h1>
      <Input
        placeholder="Numéro de suivi"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <Button onClick={handleSearch}>Rechercher</Button>

      {result && (
        <div className="mt-4 bg-muted p-4 rounded">
          <p><strong>Statut :</strong> {result.status}</p>
          <p><strong>Transporteur :</strong> {result.carrier}</p>
          <ul className="mt-2 list-disc pl-4">
            {result.history?.map((step: any, i: number) => (
              <li key={i}>{step.date} – {step.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
