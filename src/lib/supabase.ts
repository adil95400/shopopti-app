import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cHF6enNramZscWR3emtmZnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzY2MzEsImV4cCI6MjA2MTg1MjYzMX0.pRVL8_yDwok4RB9vL1PpR6KxgWaJnMJtlodXTvYTB7g';

if (!supabaseUrl) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'shopopti'
    }
  }
});