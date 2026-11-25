'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/authFetch';
import { findBadmintonRank, rankPath, rankSeries } from '@/lib/rankings';
import { SetScore } from '@/lib/badmintonScore';

interface GoalEntry {
  sport: 'badminton' | 'chess';
  entry_type: 'match' | 'training';
  date: string;
  status?: string | null;
  opponent_level?: string | null;
  match_result?: 'win' | 'loss' | 'draw' | null;
  set_scores?: SetScore[] | null;
  weaknesses?: string[];
}

interface Profile {
  current_ranking?: string | null;
  target_ranking?: string | null;
  season_objective?: string | null;
}

const SERIES_NAMES: Record<string, string> = { P: 'les P', D: 'les D', R: 'les R', N: 'les N' };

const pct = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0);

export default function GoalCard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<GoalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, e] = await Promise.all([authFetch('/api/player-profile'), authFetch('/api/entries')]);
        if (p.ok) setProfile((await p.json()).data);
        if (e.ok) setEntries((await e.json()).data ?? []);
      } catch {
        // The rest of the dashboard already reports session problems
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) return null;

  const current = findBadmintonRank(profile?.current_ranking);
  const target = findBadmintonRank(profile?.target_ranking) ?? findBadmintonRank(profile?.season_objective);
  const path = current && target ? rankPath(current, target) : [];

  if (!current || !target || path.length === 0) {
    const reached = current && target && current === target;
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-gray-800">{reached ? `🏆 Objectif ${target} atteint !` : '🎯 Fixez votre objectif de classement'}</p>
          <p className="text-sm text-gray-500">
            {reached
              ? 'Choisissez un nouveau classement visé dans votre profil.'
              : 'Renseignez votre classement actuel et visé (ex : P11 → R6) pour suivre votre progression.'}
          </p>
        </div>
        <Link href="/profile" className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm">
          Profil
        </Link>
      </div>
    );
  }

  const monthPrefix = new Date().toISOString().slice(0, 7);
  const month = entries.filter(
    e => e.sport === 'badminton' && e.status !== 'planned' && e.date.startsWith(monthPrefix)
  );
  const matches = month.filter(e => e.entry_type === 'match');
  const wins = matches.filter(e => e.match_result === 'win').length;
  const targetSeries = rankSeries(target);
  const vsTarget = matches.filter(e => rankSeries(e.opponent_level) === targetSeries);
  const vsTargetWins = vsTarget.filter(e => e.match_result === 'win').length;
  const sets = matches.flatMap(e => e.set_scores ?? []);
  const setsWon = sets.filter(([me, opp]) => me > opp).length;

  const weaknessCounts = new Map<string, { label: string; count: number }>();
  month.forEach(e =>
    new Set((e.weaknesses ?? []).map(w => w.trim()).filter(Boolean)).forEach(label => {
      const key = label.toLowerCase();
      const item = weaknessCounts.get(key) ?? { label, count: 0 };
      item.count += 1;
      weaknessCounts.set(key, item);
    })
  );
  const topWeakness = [...weaknessCounts.values()].sort((a, b) => b.count - a.count)[0];

  const monthName = new Date().toLocaleDateString('fr-FR', { month: 'long' });

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">🎯 Objectif {target}</h3>
        <span className="text-sm text-gray-500">{path.length - 1} palier{path.length > 2 ? 's' : ''} à franchir</span>
      </div>

      <div className="flex items-center gap-1 mb-5" aria-label={`Progression de ${current} vers ${target}`}>
        {path.map((rank, i) => (
          <div key={rank} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div
              className={`h-2 w-full rounded-full ${
                i === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
            <span
              className={`text-[11px] sm:text-xs font-bold ${
                i === 0 ? 'text-purple-600' : i === path.length - 1 ? 'text-gray-800' : 'text-gray-400'
              }`}
            >
              {rank}
            </span>
          </div>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-700 mb-2">Bilan de {monthName} (badminton)</p>
      {month.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune séance ce mois-ci. Un entraînement ou un match, et le bilan se remplit.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label="Matchs" value={matches.length ? `${wins}/${matches.length}` : '–'} hint={matches.length ? `${pct(wins, matches.length)}% victoires` : 'gagnés'} />
          <Stat
            label={`Contre ${SERIES_NAMES[targetSeries ?? ''] ?? targetSeries}`}
            value={vsTarget.length ? `${vsTargetWins}/${vsTarget.length}` : '–'}
            hint={vsTarget.length ? `${pct(vsTargetWins, vsTarget.length)}%` : 'aucun match'}
          />
          <Stat label="Sets gagnés" value={sets.length ? `${pct(setsWon, sets.length)}%` : '–'} hint={`${setsWon}/${sets.length}`} />
          <Stat label="Séances" value={String(month.length)} hint={`${month.length - matches.length} entraînement${month.length - matches.length > 1 ? 's' : ''}`} />
        </div>
      )}
      {topWeakness && topWeakness.count > 1 && (
        <p className="mt-3 text-sm text-gray-700 bg-red-50 rounded-lg p-2.5">
          ⚠️ Point faible qui revient ce mois-ci : <strong>{topWeakness.label}</strong> ({topWeakness.count} fois)
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
      <p className="text-[11px] text-gray-500">{hint}</p>
    </div>
  );
}
