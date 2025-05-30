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

    // Supprimer le webhook
    const { error: deleteError } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', webhookId);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}