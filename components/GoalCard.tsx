'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/authFetch';
import { findBadmintonRank, findElo, rankPath, rankSeries } from '@/lib/rankings';
import { SetScore } from '@/lib/badmintonScore';
import { formatPoints } from '@/lib/ffbadPoints';

interface GoalEntry {
  sport: 'badminton' | 'chess';
  entry_type: 'match' | 'training';
  date: string;
  status?: string | null;
  opponent_level?: string | null;
  match_result?: 'win' | 'loss' | 'draw' | null;
  set_scores?: SetScore[] | null;
  weaknesses?: string[];
  points_delta?: number | null;
}

interface Profile {
  sports?: string[];
  current_ranking?: string | null;
  target_ranking?: string | null;
  season_objective?: string | null;
  chess_current_ranking?: string | null;
  chess_target_ranking?: string | null;
}

const SERIES_NAMES: Record<string, string> = { P: 'les P', D: 'les D', R: 'les R', N: 'les N' };

const pct = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0);

const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

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

  const done = entries.filter(e => e.status !== 'planned');
  const today = localDate();
  const monthPrefix = today.slice(0, 7);
  const monthName = new Date().toLocaleDateString('fr-FR', { month: 'long' });

  const badmintonCurrent = findBadmintonRank(profile?.current_ranking);
  const badmintonTarget = findBadmintonRank(profile?.target_ranking) ?? findBadmintonRank(profile?.season_objective);
  const badmintonPath = badmintonCurrent && badmintonTarget ? rankPath(badmintonCurrent, badmintonTarget) : [];

  // Elo was previously typed in the single ranking field
  const eloCurrent = findElo(profile?.chess_current_ranking) ?? (badmintonCurrent ? null : findElo(profile?.current_ranking));
  const eloTarget = findElo(profile?.chess_target_ranking);

  const showBadminton = badmintonPath.length > 0;
  const showChess = eloCurrent != null && eloTarget != null && eloTarget > eloCurrent;

  const todayEntries = done.filter(e => e.date === today);

  if (!showBadminton && !showChess) {
    const reached =
      (badmintonCurrent && badmintonCurrent === badmintonTarget && badmintonTarget) ||
      (eloCurrent != null && eloTarget != null && eloCurrent >= eloTarget && eloTarget);
    return (
      <div className="space-y-4">
        <TodayCard entries={todayEntries} />
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-800">{reached ? `🏆 Objectif ${reached} atteint !` : '🎯 Fixez votre objectif'}</p>
            <p className="text-sm text-gray-500">
              {reached
                ? 'Choisissez un nouvel objectif dans votre profil.'
                : 'Renseignez votre classement actuel et visé (ex : P11 → R6, ou 1500 → 1700 Elo) pour suivre votre progression.'}
            </p>
          </div>
          <Link href="/profile" className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm">
            Profil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TodayCard entries={todayEntries} />
      {showBadminton && badmintonTarget && (
        <BadmintonGoal
          path={badmintonPath}
          target={badmintonTarget}
          month={done.filter(e => e.sport === 'badminton' && e.date.startsWith(monthPrefix))}
          monthName={monthName}
        />
      )}
      {showChess && eloCurrent != null && eloTarget != null && (
        <ChessGoal
          current={eloCurrent}
          target={eloTarget}
          month={done.filter(e => e.sport === 'chess' && e.date.startsWith(monthPrefix))}
          monthName={monthName}
        />
      )}
    </div>
  );
}

function TodayCard({ entries }: { entries: GoalEntry[] }) {
  if (entries.length === 0) return null;
  const matches = entries.filter(e => e.entry_type === 'match');
  const wins = matches.filter(e => e.match_result === 'win').length;
  const losses = matches.filter(e => e.match_result === 'loss').length;
  const draws = matches.filter(e => e.match_result === 'draw').length;
  const trainings = entries.length - matches.length;
  const withPoints = matches.filter(e => e.sport === 'badminton' && e.points_delta != null);
  const points = withPoints.reduce((sum, e) => sum + (e.points_delta ?? 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <p className="text-sm font-semibold text-gray-700 mb-2">📅 Aujourd&apos;hui</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat
          label="Matchs"
          value={matches.length ? String(matches.length) : '–'}
          hint={matches.length ? `${wins} V · ${losses} D${draws ? ` · ${draws} N` : ''}` : 'aucun'}
        />
        <Stat label="Entraînements" value={String(trainings)} hint={trainings ? 'séances' : 'aucun'} />
        {withPoints.length > 0 && <Stat label="Points" value={formatPoints(points)} hint="FFBaD" />}
      </div>
    </div>
  );
}

function weaknessLine(month: GoalEntry[]) {
  const counts = new Map<string, { label: string; count: number }>();
  month.forEach(e =>
    new Set((e.weaknesses ?? []).map(w => w.trim()).filter(Boolean)).forEach(label => {
      const key = label.toLowerCase();
      const item = counts.get(key) ?? { label, count: 0 };
      item.count += 1;
      counts.set(key, item);
    })
  );
  const top = [...counts.values()].sort((a, b) => b.count - a.count)[0];
  if (!top || top.count < 2) return null;
  return (
    <p className="mt-3 text-sm text-gray-700 bg-red-50 rounded-lg p-2.5">
      ⚠️ Point faible qui revient ce mois-ci : <strong>{top.label}</strong> ({top.count} fois)
    </p>
  );
}

function BadmintonGoal({ path, target, month, monthName }: { path: string[]; target: string; month: GoalEntry[]; monthName: string }) {
  const current = path[0];
  const matches = month.filter(e => e.entry_type === 'match');
  const wins = matches.filter(e => e.match_result === 'win').length;
  const targetSeries = rankSeries(target);
  const vsTarget = matches.filter(e => rankSeries(e.opponent_level) === targetSeries);
  const vsTargetWins = vsTarget.filter(e => e.match_result === 'win').length;
  const sets = matches.flatMap(e => e.set_scores ?? []);
  const setsWon = sets.filter(([me, opp]) => me > opp).length;
  const withPoints = matches.filter(e => e.points_delta != null);
  const monthPoints = withPoints.reduce((sum, e) => sum + (e.points_delta ?? 0), 0);

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
          {withPoints.length > 0 ? (
            <Stat label="Points" value={formatPoints(monthPoints)} hint={`sur ${withPoints.length} match${withPoints.length > 1 ? 's' : ''}`} />
          ) : (
            <Stat label="Séances" value={String(month.length)} hint={`${month.length - matches.length} entraînement${month.length - matches.length > 1 ? 's' : ''}`} />
          )}
        </div>
      )}
      {weaknessLine(month)}
    </div>
  );
}

function ChessGoal({ current, target, month, monthName }: { current: number; target: number; month: GoalEntry[]; monthName: string }) {
  const matches = month.filter(e => e.entry_type === 'match');
  const wins = matches.filter(e => e.match_result === 'win').length;
  const draws = matches.filter(e => e.match_result === 'draw').length;
  const losses = matches.filter(e => e.match_result === 'loss').length;
  const trainings = month.length - matches.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">🎯 Objectif {target} Elo</h3>
        <span className="text-sm text-gray-500">+{target - current} Elo à gagner</span>
      </div>

      <p className="text-base font-bold text-purple-600 mb-5">
        ♟️ {current} → {target}
      </p>

      <p className="text-sm font-semibold text-gray-700 mb-2">Bilan de {monthName} (échecs)</p>
      {month.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune séance ce mois-ci. Une partie ou un entraînement, et le bilan se remplit.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label="Parties" value={matches.length ? `${wins}/${matches.length}` : '–'} hint={matches.length ? `${pct(wins, matches.length)}% victoires` : 'gagnées'} />
          <Stat label="Défaites" value={String(losses)} hint="ce mois-ci" />
          <Stat label="Nulles" value={String(draws)} hint="ce mois-ci" />
          <Stat label="Entraînements" value={String(trainings)} hint="séances" />
        </div>
      )}
      {weaknessLine(month)}
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
