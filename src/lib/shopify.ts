import { supabase } from './supabase';

/**
 * Récupère les identifiants Shopify pour l'utilisateur connecté.
 * @param userId string - ID de l'utilisateur
 * @returns { domain: string, token: string }
 */
export async function getShopifyCredentials(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('shopify_store_domain, shopify_access_token')
    .eq('id', userId)
    .single();

  if (error || !data) throw new Error("Impossible de charger les identifiants Shopify");

  return {
    domain: data.shopify_store_domain,
    token: data.shopify_access_token
  };
}
