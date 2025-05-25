
import React from 'react';
import { Button } from '@/components/ui/button';

export default function FournisseurCard({ data }: { data: any }) {
  return (
    <div className="border border-border rounded-xl p-4 bg-muted/30 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{data.name}</h2>
        {data.verified && <span className="text-green-600 text-sm">✅ Vérifié</span>}
      </div>
      <p className="text-muted-foreground text-sm">{data.country} · {data.category}</p>
      <p className="text-muted-foreground text-sm">Délai : {data.delivery_delay} jours</p>
      <Button variant="secondary" className="w-full mt-2">
        Ajouter à ma boutique
      </Button>
    </div>
  );
}
