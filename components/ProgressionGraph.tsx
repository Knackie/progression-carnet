'use client';

import { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/lib/ThemeContext';
import { authFetch } from '@/lib/authFetch';
import type { Sport } from '@/lib/types';

interface Entry {
  sport: Sport;
  date: string;
  entry_type: 'match' | 'training';
  match_result?: 'win' | 'loss' | 'draw' | null;
  points_delta?: number | null;
  status?: string | null;
}

interface DayPoint {
  date: string;
  label: string;
  wins: number;
  losses: number;
  draws: number;
  points: number | null;
}

const EMPTY_CARD = 'bg-white rounded-xl shadow-lg p-8';

const SPORTS: { value: Sport; label: string }[] = [
  { value: 'badminton', label: '🏸 Badminton' },
  { value: 'chess', label: '♟️ Échecs' },
];

function buildDays(matches: Entry[]): DayPoint[] {
  const byDay = new Map<string, { wins: number; losses: number; draws: number; delta: number; hasDelta: boolean }>();
  matches.forEach(e => {
    const day = byDay.get(e.date) ?? { wins: 0, losses: 0, draws: 0, delta: 0, hasDelta: false };
    if (e.match_result === 'win') day.wins += 1;
    else if (e.match_result === 'loss') day.losses += 1;
    else day.draws += 1;
    if (e.points_delta != null) {
      day.delta += e.points_delta;
      day.hasDelta = true;
    }
    byDay.set(e.date, day);
  });

  // Points are cumulative so the line shows the overall trend
  let total = 0;
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => {
      total += d.delta;
      return {
        date,
        label: new Date(`${date}T00:00:00`).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        wins: d.wins,
        losses: d.losses,
        draws: d.draws,
        points: d.hasDelta ? total : null,
      };
    })
    .slice(-30);
}

export default function ProgressionGraph() {
  const { isDark } = useTheme();
  const [matches, setMatches] = useState<Entry[]>([]);
  const [sport, setSport] = useState<Sport>('badminton');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    loadData();
  }, [isHydrated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authFetch('/api/entries');
      if (!response.ok) throw new Error('Erreur lors du chargement');

      const result = await response.json();
      const loaded: Entry[] = (result.data || []).filter(
        (e: Entry) => e.status !== 'planned' && e.entry_type === 'match' && e.match_result
      );
      setMatches(loaded);

      // Open on the sport of the latest match
      const latest = [...loaded].sort((a, b) => b.date.localeCompare(a.date))[0];
      if (latest) setSport(latest.sport);
    } catch (err) {
      console.error('Load data error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const data = buildDays(matches.filter(e => e.sport === sport));
  const hasPoints = sport === 'badminton' && data.some(d => d.points !== null);
  const hasDraws = data.some(d => d.draws > 0);

  if (!isHydrated) return null;

  if (loading) {
    return (
      <div className={EMPTY_CARD}>
        <div className="text-center">
          <div className="inline-block animate-spin text-3xl mb-3">⌛</div>
          <p className="text-gray-600">Chargement du graphique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={EMPTY_CARD}>
        <div className="text-center">
          <p className="text-red-600 font-semibold">❌ {error}</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={EMPTY_CARD}>
        <div className="text-center">
          <p className="text-gray-600">📊 Pas encore de match à afficher</p>
          <p className="text-gray-500 text-sm mt-2">Enregistrez un match avec son résultat pour voir votre progression !</p>
        </div>
      </div>
    );
  }

  const axisColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">📈 Votre Progression</h3>
      <div className="flex gap-2 mb-4 sm:mb-6">
        {SPORTS.map(s => (
          <button
            key={s.value}
            onClick={() => setSport(s.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
              sport === s.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {data.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-12">Aucun match enregistré dans ce sport.</p>
      ) : (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 5, right: hasPoints ? 0 : 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="label" stroke={axisColor} style={{ fontSize: '12px' }} />
          <YAxis yAxisId="matches" allowDecimals={false} stroke={axisColor} style={{ fontSize: '12px' }} />
          {hasPoints && <YAxis yAxisId="points" orientation="right" stroke="#6366f1" style={{ fontSize: '12px' }} width={45} />}
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              color: isDark ? '#f3f4f6' : '#111827',
              border: '2px solid #6366f1',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar yAxisId="matches" dataKey="wins" name="Victoires" stackId="m" fill="#22c55e" />
          {hasDraws && <Bar yAxisId="matches" dataKey="draws" name="Nulles" stackId="m" fill="#9ca3af" />}
          <Bar yAxisId="matches" dataKey="losses" name="Défaites" stackId="m" fill="#ef4444" />
          {hasPoints && (
            <Line
              yAxisId="points"
              type="monotone"
              dataKey="points"
              name="Points (cumul)"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              connectNulls
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
