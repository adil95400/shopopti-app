import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSubscription() {
  const [plan, setPlan] = useState<string>("freemium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data?.session?.user?.id;
      if (!uid) return;
      supabase
        .from('stripe_subscriptions')
        .select('price_id')
        .eq('customer_id', uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data?.price_id) setPlan(data.price_id);
          setLoading(false);
        });
    });
  }, []);

  return { plan, loading };
}