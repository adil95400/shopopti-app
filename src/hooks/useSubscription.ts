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
        .from('subscriptions')
        .select('plan')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data?.plan) setPlan(data.plan);
          setLoading(false);
        });
    });
  }, []);

  return { plan, loading };
}
