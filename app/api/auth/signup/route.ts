import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase config:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    console.log('Creating Supabase client with:', { supabaseUrl, keyLength: supabaseKey.length });
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Attempting signup for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.VERCEL_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      console.error('Supabase SignUp Error:', {
        message: error.message,
        status: error.status,
        code: error.code,
      });
      return NextResponse.json(
        { error: error.message, details: error.code },
        { status: error.status || 400 }
      );
    }

    console.log('SignUp successful for:', email);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('SignUp API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
