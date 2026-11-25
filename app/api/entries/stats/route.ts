import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer toutes les entrées de l'utilisateur
    const { data: entries, error } = await supabase
      .from('progression_entries')
      .select('score, match_result, entry_type')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json({
        total: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
      });
    }

    // Calculer les statistiques
    const matches = entries.filter(e => e.entry_type === 'match');
    const scores = entries.filter(e => e.score != null).map(e => e.score);

    const wins = matches.filter(m => m.match_result === 'win').length;
    const losses = matches.filter(m => m.match_result === 'loss').length;
    const draws = matches.filter(m => m.match_result === 'draw').length;

    const averageScore = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;

    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const worstScore = scores.length > 0 ? Math.min(...scores) : 0;

    const winRate = matches.length > 0 
      ? Math.round((wins / matches.length) * 100) 
      : 0;

    return NextResponse.json({
      total: matches.length,
      wins,
      losses,
      draws,
      winRate,
      averageScore: parseFloat(averageScore.toFixed(1)),
      bestScore,
      worstScore,
    });
  } catch (err) {
    console.error('Erreur:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
