'use server';

import { createClient } from '@supabase/supabase-js';
import { translateAuthError } from '@/lib/authErrors';

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  // The client stores the session in localStorage
  if (data.session) {
    return { success: true, session: data.session, user: data.user };
  }

  return { error: 'Aucune session retournée' };
}
