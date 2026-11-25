import { createClient } from '@supabase/supabase-js';
import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';
import { LogoMark } from '@/components/Logo';
import { legacyLevelLabel } from '@/lib/rankings';
import type { SetScore } from '@/lib/badmintonScore';
import type { MatchGoal } from '@/lib/matchPrep';

// Satori (next/og) only supports flexbox: every element with several children needs display: flex.
// No emojis: they would be fetched from a CDN at render time.

const RESULT = {
  win: { label: 'VICTOIRE', color: '#16a34a' },
  loss: { label: 'DÉFAITE', color: '#dc2626' },
  draw: { label: 'NULLE', color: '#ea580c' },
} as const;

function List({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#f8fafc', borderRadius: 20, padding: 24, borderTop: `8px solid ${color}` }}>
      <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color, marginBottom: 12 }}>{title}</div>
      {items.length === 0 ? (
        <div style={{ display: 'flex', fontSize: 24, color: '#94a3b8' }}>–</div>
      ) : (
        items.slice(0, 3).map((item, i) => (
          <div key={i} style={{ display: 'flex', fontSize: 25, color: '#1e293b', marginBottom: 8, lineHeight: 1.25 }}>
            {item.slice(0, 40)}
          </div>
        ))
      )}
    </div>
  );
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
  }
  const token = authHeader.substring(7);
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { data: entry, error } = await supabase
    .from('progression_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (error || !entry) {
    return NextResponse.json({ error: 'Entrée introuvable' }, { status: 404 });
  }

  const isMatch = entry.entry_type === 'match';
  const result = isMatch && entry.match_result ? RESULT[entry.match_result as keyof typeof RESULT] : null;
  const sets: SetScore[] = entry.set_scores ?? [];
  const goals: MatchGoal[] = entry.match_goals ?? [];
  const opponent = [entry.opponent_name, entry.opponent_level && legacyLevelLabel(entry.opponent_level)]
    .filter(Boolean)
    .join(' · ');
  const date = new Date(`${entry.date}T00:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const notes: string = (entry.notes ?? '').trim();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 56,
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          <LogoMark size={96} />
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, color: 'white' }}>Carnet de Progression</div>
            <div style={{ display: 'flex', fontSize: 26, color: '#dbeafe' }}>{date}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: 'white', borderRadius: 36, padding: 44 }}>
          {/* Title + result */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, color: '#0f172a' }}>
                {`${entry.sport === 'badminton' ? 'Badminton' : 'Échecs'} · ${isMatch ? 'Match' : 'Entraînement'}`}
              </div>
              {opponent && <div style={{ display: 'flex', fontSize: 32, color: '#475569', marginTop: 6 }}>{`vs ${opponent}`}</div>}
            </div>
            {result && (
              <div style={{ display: 'flex', background: result.color, color: 'white', fontSize: 34, fontWeight: 800, padding: '14px 26px', borderRadius: 18 }}>
                {result.label}
              </div>
            )}
          </div>

          {/* Sets + rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, marginBottom: 32 }}>
            <div style={{ display: 'flex' }}>
              {sets.map(([me, opp], i) => (
                <div
                  key={i}
                  style={{ display: 'flex', fontSize: 56, fontWeight: 800, marginRight: 28, color: me > opp ? '#16a34a' : '#dc2626' }}
                >
                  {`${me}-${opp}`}
                </div>
              ))}
            </div>
            {entry.score != null && (
              <div style={{ display: 'flex', alignItems: 'baseline', background: '#eff6ff', borderRadius: 20, padding: '12px 24px' }}>
                <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: '#2563eb' }}>{String(entry.score)}</div>
                <div style={{ display: 'flex', fontSize: 30, color: '#64748b', marginLeft: 4 }}>/10</div>
              </div>
            )}
          </div>

          {/* Analysis */}
          <div style={{ display: 'flex', gap: 20 }}>
            <List title="Points forts" items={entry.strengths ?? []} color="#16a34a" />
            <List title="Points faibles" items={entry.weaknesses ?? []} color="#dc2626" />
            <List title="Axes de travail" items={entry.improvement_axes ?? []} color="#7c3aed" />
          </div>

          {/* Goals */}
          {goals.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 28 }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#4338ca', marginBottom: 10 }}>
                {`Objectifs : ${goals.filter(g => g.achieved).length}/${goals.length} atteints`}
              </div>
              {goals.slice(0, 3).map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 25, color: '#1e293b', marginBottom: 6 }}>
                  <div
                    style={{
                      display: 'flex',
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      marginRight: 14,
                      background: g.achieved === true ? '#16a34a' : g.achieved === false ? '#dc2626' : '#cbd5e1',
                    }}
                  />
                  <div style={{ display: 'flex' }}>{g.text.slice(0, 60)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div style={{ display: 'flex', marginTop: 'auto', paddingTop: 24, fontSize: 26, color: '#475569', fontStyle: 'italic', lineHeight: 1.35 }}>
              {`« ${notes.length > 180 ? `${notes.slice(0, 177)}…` : notes} »`}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, fontSize: 24, color: '#dbeafe' }}>
          progression-carnet.vercel.app
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  );
}
