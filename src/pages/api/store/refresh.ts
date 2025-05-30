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

    // Vérifier la validité des identifiants en fonction de la plateforme
    let isValid = false;
    let errorMessage = '';

    switch (connection.platform) {
      case 'shopify':
        try {
          // Vérifier l'API Shopify
          const shopifyResponse = await fetch(`https://${connection.store_url}/admin/api/2023-10/shop.json`, {
            headers: {
              'X-Shopify-Access-Token': connection.api_key
            }
          });

          if (shopifyResponse.ok) {
            isValid = true;
          } else {
            errorMessage = 'Identifiants Shopify invalides';
          }
        } catch (error) {
          errorMessage = 'Erreur lors de la connexion à Shopify';
        }
        break;

      case 'woocommerce':
        try {
          // Vérifier l'API WooCommerce
          const auth = Buffer.from(`${connection.api_key}:${connection.api_secret}`).toString('base64');
          const wooResponse = await fetch(`${connection.store_url}/wp-json/wc/v3/products?per_page=1`, {
            headers: {
              'Authorization': `Basic ${auth}`
            }
          });

          if (wooResponse.ok) {
            isValid = true;
          } else {
            errorMessage = 'Identifiants WooCommerce invalides';
          }
        } catch (error) {
          errorMessage = 'Erreur lors de la connexion à WooCommerce';
        }
        break;

      // Autres plateformes...
      default:
        errorMessage = 'Plateforme non supportée';
    }

    if (!isValid) {
      // Mettre à jour le statut de la connexion en cas d'échec
      await supabase
        .from('store_connections')
        .update({ status: 'error' })
        .eq('id', connectionId);

      return res.status(400).json({ error: errorMessage || 'Identifiants invalides' });
    }

    // Mettre à jour la date de dernière synchronisation
    const { error: updateError } = await supabase
      .from('store_connections')
      .update({ 
        last_sync: new Date().toISOString(),
        status: 'active'
      })
      .eq('id', connectionId);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error refreshing store connection:', error);
    return res.status(500).json({ error: error.message });
  }
}