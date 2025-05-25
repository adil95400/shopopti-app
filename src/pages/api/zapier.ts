
// src/pages/api/zapier.ts
export async function POST(req: Request) {
  const body = await req.json();
  console.log("📩 Webhook reçu :", body);

  // Simuler traitement
  return new Response(JSON.stringify({
    status: 'ok',
    message: 'Webhook reçu avec succès',
    received: body
  }), { status: 200 });
}
