import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { webhookId } = req.body;
    const { user } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1] || '');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!webhookId) {
      return res.status(400).json({ error: 'Missing webhookId parameter' });
    }

    // Vérifier que le webhook appartient à l'utilisateur
    const { data: webhook, error: fetchError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    // Envoyer une requête de test au webhook
    try {
      const testPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook from Shopopti+'
        }
      };

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopopti-Webhook-Test': 'true'
        },
        body: JSON.stringify(testPayload)
      });

      if (!response.ok) {
        return res.status(400).json({ 
          error: 'Webhook test failed', 
          status: response.status,
          statusText: response.statusText
        });
      }

      // Mettre à jour la date de dernière exécution
      await supabase
        .from('webhooks')
        .update({ last_triggered: new Date().toISOString() })
        .eq('id', webhookId);

      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ 
        error: 'Webhook test failed', 
        message: error.message
      });
    }
  } catch (error: any) {
    console.error('Error testing webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}