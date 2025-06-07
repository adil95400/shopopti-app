import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const availableCurrencies = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY'
];

type CurrencyContextType = {
  currency: string;
  setCurrency: (code: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState('USD');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase
        .from('user_settings')
        .select('currency')
        .eq('user_id', session.user.id)
        .single();
      if (data?.currency) {
        setCurrencyState(data.currency);
      }
    };

    fetchSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_ev, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('user_settings')
          .select('currency')
          .eq('user_id', session.user.id)
          .single();
        if (data?.currency) {
          setCurrencyState(data.currency);
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setCurrency = async (code: string) => {
    setCurrencyState(code);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('user_settings')
        .upsert({ user_id: session.user.id, currency: code }, { onConflict: 'user_id' });
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
