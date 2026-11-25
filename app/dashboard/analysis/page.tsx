'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { authFetch, SessionExpiredError } from '@/lib/authFetch';
import { SetScore } from '@/lib/badmintonScore';

type Sport = 'badminton' | 'chess';
type SportFilter = 'all' | Sport;

interface Entry {
  id: string;
  sport: Sport;
  entry_type: 'match' | 'training';
  date: string;
  score?: number | null;
  opponent_level?: string | null;
  match_result?: 'win' | 'loss' | 'draw' | null;
  set_scores?: SetScore[] | null;
  strengths: string[];
  weaknesses: string[];
  improvement_axes: string[];
}

interface Ranked {
  label: string;
  count: number;
}

const SERIES = [
  { key: 'NC', label: 'Non classé' },
  { key: 'P', label: 'Promotion (P)' },
  { key: 'D', label: 'Départemental (D)' },
  { key: 'R', label: 'Régional (R)' },
  { key: 'N', label: 'National (N)' },
];

// "R6" -> "R", "NC" -> "NC", legacy "R" -> "R"
function seriesOf(level?: string | null): string | null {
  if (!level) return null;
  const v = level.trim().toUpperCase();
  if (v === 'NC') return 'NC';
  const letter = v[0];
  return ['P', 'D', 'R', 'N'].includes(letter) ? letter : null;
}

// Groups "Revers", "revers " and "REVERS" together; shows the first spelling seen.
function topItems(lists: string[][], limit = 5): Ranked[] {
  const counts = new Map<string, Ranked>();
  for (const list of lists) {
    for (const raw of list ?? []) {
      const label = raw.trim();
      if (!label) continue;
      const key = label.toLowerCase();
      const item = counts.get(key) ?? { label, count: 0 };
      item.count += 1;
      counts.set(key, item);
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

function winRate(wins: number, total: number) {
  return total > 0 ? Math.round((wins / total) * 100) : 0;
}

export default function AnalysisPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sport, setSport] = useState<SportFilter>('all');

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authFetch('/api/entries');
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const result = await response.json();
      setEntries(result.data || []);
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        router.replace('/auth/login');
        return;
      }
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analysis = useMemo(() => {
    const filtered = sport === 'all' ? entries : entries.filter(e => e.sport === sport);
    const scores = filtered.map(e => e.score).filter((s): s is number => s != null);
    const matches = filtered.filter(e => e.entry_type === 'match');
    const wins = matches.filter(e => e.match_result === 'win').length;
    const losses = matches.filter(e => e.match_result === 'loss').length;
    const draws = matches.filter(e => e.match_result === 'draw').length;

    const sets = matches.flatMap(e => e.set_scores ?? []);
    const setsWon = sets.filter(([me, opp]) => me > opp).length;

    const bySeries = SERIES.map(({ key, label }) => {
      const games = matches.filter(e => e.sport === 'badminton' && seriesOf(e.opponent_level) === key);
      const w = games.filter(e => e.match_result === 'win').length;
      return { key, label, played: games.length, wins: w, rate: winRate(w, games.length) };
    }).filter(s => s.played > 0);

    return {
      total: filtered.length,
      trainings: filtered.length - matches.length,
      avgScore: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null,
      matches: matches.length,
      wins,
      losses,
      draws,
      rate: winRate(wins, matches.length),
      setsPlayed: sets.length,
      setsWon,
      bySeries,
      strengths: topItems(filtered.map(e => e.strengths)),
      weaknesses: topItems(filtered.map(e => e.weaknesses)),
      axes: topItems(filtered.map(e => e.improvement_axes)),
    };
  }, [entries, sport]);

  const showBadmintonStats = sport !== 'chess';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-blue-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-300 min-w-0">
            <span>←</span>
            <Logo size={36} showText={false} />
            <span className="truncate">Tableau de bord</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">📊 Analyse</h1>

        <div className="inline-flex rounded-xl bg-white dark:bg-gray-800 shadow p-1 mb-6" role="tablist">
          {([
            ['all', 'Tout'],
            ['badminton', '🏸 Badminton'],
            ['chess', '♟️ Échecs'],
          ] as [SportFilter, string][]).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={sport === value}
              onClick={() => setSport(value)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
                sport === value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-600 py-12 text-center">⌛ Chargement de votre analyse...</p>}

        {!loading && error && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-600 font-semibold">❌ {error}</p>
            <button onClick={loadEntries} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              🔄 Réessayer
            </button>
          </div>
        )}

        {!loading && !error && analysis.total === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Aucune entrée pour l’instant. Ajoutez un match ou un entraînement depuis le tableau de bord.</p>
          </div>
        )}

        {!loading && !error && analysis.total > 0 && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
              <StatCard icon="📝" label="Séances" value={analysis.total} hint={`${analysis.matches} matchs · ${analysis.trainings} entraînements`} />
              <StatCard icon="⭐" label="Note moyenne" value={analysis.avgScore != null ? `${analysis.avgScore}/10` : '–'} />
              <StatCard
                icon="🏆"
                label="Victoires"
                value={analysis.matches ? `${analysis.rate}%` : '–'}
                hint={`${analysis.wins}V · ${analysis.losses}D${analysis.draws ? ` · ${analysis.draws}N` : ''}`}
              />
              {showBadmintonStats ? (
                <StatCard
                  icon="🏸"
                  label="Sets gagnés"
                  value={analysis.setsPlayed ? `${winRate(analysis.setsWon, analysis.setsPlayed)}%` : '–'}
                  hint={`${analysis.setsWon} / ${analysis.setsPlayed} sets`}
                />
              ) : (
                <StatCard icon="♟️" label="Parties" value={analysis.matches} />
              )}
            </div>

            {showBadmintonStats && analysis.bySeries.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">🎯 Victoires selon le classement adverse</h2>
                <p className="text-sm text-gray-500 mb-4">Badminton. Pour viser R6, il faut gagner régulièrement contre les R.</p>
                <div className="space-y-3">
                  {analysis.bySeries.map(s => (
                    <div key={s.key}>
                      <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                        <span>{s.label}</span>
                        <span>
                          {s.rate}% <span className="font-normal text-gray-500">({s.wins}/{s.played})</span>
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.rate >= 50 ? 'bg-green-500' : 'bg-orange-500'}`}
                          style={{ width: `${Math.max(s.rate, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <RankedList title="💪 Points forts récurrents" items={analysis.strengths} total={analysis.total} color="green" empty="Pas de points forts enregistrés" />
              <RankedList title="⚠️ Points faibles récurrents" items={analysis.weaknesses} total={analysis.total} color="red" empty="Pas de points faibles enregistrés" />
              <RankedList title="🎯 Axes prioritaires" items={analysis.axes} total={analysis.total} color="purple" empty="Pas d’axes enregistrés" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: string; label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-gray-600 text-sm font-semibold">{label}</p>
      <p className="text-3xl sm:text-4xl font-bold text-gray-800 mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

const COLORS = {
  green: { border: 'border-green-500', title: 'text-green-700', bar: 'bg-green-500', count: 'text-green-600' },
  red: { border: 'border-red-500', title: 'text-red-700', bar: 'bg-red-500', count: 'text-red-600' },
  purple: { border: 'border-purple-500', title: 'text-purple-700', bar: 'bg-purple-500', count: 'text-purple-600' },
};

function RankedList({
  title,
  items,
  total,
  color,
  empty,
}: {
  title: string;
  items: Ranked[];
  total: number;
  color: keyof typeof COLORS;
  empty: string;
}) {
  const c = COLORS[color];
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 ${c.border}`}>
      <h2 className={`text-lg sm:text-xl font-bold mb-4 ${c.title}`}>{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-6">{empty}</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.label}>
              <div className="flex justify-between gap-2 text-sm">
                <span className="font-semibold text-gray-800">{item.label}</span>
                <span className={`font-bold ${c.count}`}>{item.count}×</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className={`h-full ${c.bar}`} style={{ width: `${(item.count / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
