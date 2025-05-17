import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const SubscriptionGate = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data?.session?.user?.id;
      if (!uid) return;
      supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data?.status) {
            setStatus(data.status);
            if (data.status === 'canceled') {
              navigate("/pricing");
            }
          }
        });
    });
  }, [navigate]);

  return <>{children}</>;
};
