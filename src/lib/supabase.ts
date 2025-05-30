import { createClient } from '@supabase/supabase-js';

// Utilisation de valeurs par défaut pour le développement local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lyxpzzskjflqdzzkffyz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eHB6enNramZscWR6emtmZnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzY2MzEsImV4cCI6MjA2MTg1MjYzMX0.pRVL8_yDwok4RB9vL1PpR6KxgWaJnMJtlodXTvYTB7g';

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