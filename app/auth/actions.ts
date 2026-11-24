'use server';

import { createClient } from '@supabase/supabase-js';

export async function getOrRefreshSession() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get the current user (this reads from cookies if available)
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { error: 'Session expired', user: null };
    }

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { error: 'No session found', user, session: null };
    }

    return {
      success: true,
      user,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      },
    };
  } catch (err) {
    console.error('Get session error:', err);
    return { error: err instanceof Error ? err.message : 'Unknown error', user: null };
  }
}

