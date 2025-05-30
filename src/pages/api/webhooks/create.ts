import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, events } = req.body;
    const { user } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1] || '');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Vérifier le format de l'URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Vérifier que les événements sont valides
    const validEvents = [
      'order.created', 'order.updated', 'order.fulfilled', 'order.cancelled',
      'product.created', 'product.updated', 'product.deleted',
      'customer.created', 'customer.updated'
    ];
    
    const invalidEvents = events.filter(event => !validEvents.includes(event));
    if (invalidEvents.length > 0) {
      return res.status(400).json({ error: `Invalid events: ${invalidEvents.join(', ')}` });
    }

    // Créer le webhook
    const { data, error } = await supabase
      .from('webhooks')
      .insert([
        {
          user_id: user.id,
          url,
          events,
          active: true,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({ webhook: data[0] });
  } catch (error: any) {
    console.error('Error creating webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}