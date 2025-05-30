import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { connectionId } = req.body;
    const { user } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1] || '');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!connectionId) {
      return res.status(400).json({ error: 'Missing connectionId parameter' });
    }

    // Vérifier que la connexion appartient à l'utilisateur
    const { data: connection, error: fetchError } = await supabase
      .from('store_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Mettre à jour le statut de la connexion
    const { error: updateError } = await supabase
      .from('store_connections')
      .update({ status: 'inactive' })
      .eq('id', connectionId);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error disconnecting store:', error);
    return res.status(500).json({ error: error.message });
  }
}