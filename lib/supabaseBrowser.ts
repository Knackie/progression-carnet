import { createClient } from '@supabase/supabase-js';

// Only used for the OAuth redirect: the app keeps its own session in localStorage ('sb-session')
export const supabaseOAuth = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { flowType: 'implicit', persistSession: false, autoRefreshToken: false },
  });
