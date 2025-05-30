import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1] || '');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Générer une nouvelle clé API et un secret
    const apiKey = `shpt_${crypto.randomBytes(16).toString('hex')}`;
    const apiSecret = `shpts_${crypto.randomBytes(32).toString('hex')}`;
    
    // Hacher le secret pour le stockage
    const hashedSecret = crypto.createHash('sha256').update(apiSecret).digest('hex');

    // Enregistrer la clé API dans la base de données
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          user_id: user.id,
          key: apiKey,
          secret_hash: hashedSecret,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an
          last_used: null,
          scopes: ['read', 'write']
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    // Retourner la clé et le secret (le secret ne sera plus jamais accessible après)
    return res.status(200).json({ 
      key: apiKey, 
      secret: apiSecret,
      expires_at: data[0].expires_at
    });
  } catch (error: any) {
    console.error('Error generating API key:', error);
    return res.status(500).json({ error: error.message });
  }
}