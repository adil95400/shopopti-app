import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keyId } = req.body;
    const { user } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1] || '');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!keyId) {
      return res.status(400).json({ error: 'Missing keyId parameter' });
    }

    // Vérifier que la clé appartient à l'utilisateur
    const { data: apiKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', keyId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Révoquer la clé API
    const { error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error revoking API key:', error);
    return res.status(500).json({ error: error.message });
  }
}