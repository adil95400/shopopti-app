import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform, storeUrl, apiKey, apiSecret, scopes } = req.body;
    const { user } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1] || '');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!platform || !storeUrl || !apiKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Vérifier la validité des identifiants en fonction de la plateforme
    let isValid = false;
    let errorMessage = '';

    switch (platform) {
      case 'shopify':
        try {
          // Vérifier l'API Shopify
          const shopifyResponse = await fetch(`https://${storeUrl}/admin/api/2023-10/shop.json`, {
            headers: {
              'X-Shopify-Access-Token': apiKey
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
          const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
          const wooResponse = await fetch(`${storeUrl}/wp-json/wc/v3/products?per_page=1`, {
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
      return res.status(400).json({ error: errorMessage || 'Identifiants invalides' });
    }

    // Enregistrer la connexion dans la base de données
    const { data, error } = await supabase
      .from('store_connections')
      .insert([
        {
          user_id: user.id,
          platform,
          store_url: storeUrl,
          api_key: apiKey,
          api_secret: apiSecret,
          scopes,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true, connection: data[0] });
  } catch (error: any) {
    console.error('Error connecting store:', error);
    return res.status(500).json({ error: error.message });
  }
}