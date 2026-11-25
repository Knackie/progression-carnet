import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { translateAuthError } from '@/lib/authErrors';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return NextResponse.json(
        { error: translateAuthError(error.message), details: error.code },
        { status: error.status || 400 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('SignUp API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
