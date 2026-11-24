'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export async function signInWithEmail(email: string, password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Store session in cookies or return it for client-side storage
  if (data.session) {
    // Return session data - client will store it in localStorage
    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  }

  return { error: 'No session returned' };
}
