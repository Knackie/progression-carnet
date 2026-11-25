'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ChessCalculator from '@/components/ChessCalculator';
import type { Sport } from '@/lib/types';
import {
  COMPETITION_COEFFICIENTS,
  Discipline,
  MIN_RATING,
  formatPoints,
  matchOutcome,
} from '@/lib/ffbadPoints';

interface DayMatch {
  id: string;
  discipline: Discipline;
  label: string;
  won: boolean;
  points: number;
}

const STORAGE = { rating: 'calc-rating-', day: 'calc-day' };

const inputClass =
  'w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

const toNumber = (v: string) => (v.trim() === '' ? null : Number(v));
const digitsOnly = (v: string) => v.replace(/\D/g, '').slice(0, 4);

export default function CalculatorPage() {
  const router = useRouter();
  const [discipline, setDiscipline] = useState<Discipline>('simple');
  const [sport, setSport] = useState<Sport>('badminton');
  const [myRating, setMyRating] = useState('');
  const [partner, setPartner] = useState('');
  const [opponent, setOpponent] = useState('');
  const [opponent2, setOpponent2] = useState('');
  const [coefficient, setCoefficient] = useState(1);
  const [day, setDay] = useState<DayMatch[]>([]);

  // Restore my rating (per discipline) and today's matches from this device
  useEffect(() => {
    setMyRating(localStorage.getItem(STORAGE.rating + discipline) ?? '');
  }, [discipline]);

  useEffect(() => {
    try {
      setDay(JSON.parse(localStorage.getItem(STORAGE.day) ?? '[]'));
    } catch {
      setDay([]);
    }
  }, []);

  const updateMyRating = (value: string) => {
    setMyRating(value);
    localStorage.setItem(STORAGE.rating + discipline, value);
  };

  const saveDay = (next: DayMatch[]) => {
    setDay(next);
    localStorage.setItem(STORAGE.day, JSON.stringify(next));
  };

  const me = toNumber(myRating);
  const opp = toNumber(opponent);
  const isDouble = discipline === 'double';
  const ready = me != null && opp != null && (!isDouble || (toNumber(partner) != null && toNumber(opponent2) != null));

  const outcome = useMemo(() => {
    if (!ready) return null;
    return matchOutcome({
      discipline,
      myRating: me!,
      partnerRating: toNumber(partner) ?? undefined,
      opponentRating: opp!,
      opponent2Rating: toNumber(opponent2) ?? undefined,
      coefficient,
    });
  }, [ready, discipline, me, opp, partner, opponent2, coefficient]);

  const opponentLabel = isDouble ? `${opponent} + ${opponent2} pts` : `${opponent} pts`;

  const addToDay = (won: boolean) => {
    if (!outcome) return;
    saveDay([
      ...day,
      {
        id: crypto.randomUUID(),
        discipline,
        label: `vs ${opponentLabel}`,
        won,
        points: won ? outcome.ifWin : outcome.ifLoss,
      },
    ]);
  };

  const createEntry = (won: boolean, points: number, label: string) => {
    const params = new URLSearchParams({ result: won ? 'win' : 'loss', points: String(points), note: label });
    router.push(`/dashboard?${params}`);
  };

  const dayTotal = day.reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-blue-950 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-300 mb-6">
          <span>←</span>
          <Logo size={36} showText={false} />
          <span>Tableau de bord</span>
        </Link>

        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3">🧮 Calcul des points</h1>

        <div className="flex gap-2 mb-5">
          {([
            ['badminton', '🏸 Badminton'],
            ['chess', '♟️ Échecs'],
          ] as [Sport, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setSport(value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                sport === value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 shadow hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {sport === 'chess' ? (
          <ChessCalculator />
        ) : (
        <>
        <p className="text-sm text-gray-500 mb-5">
          Barème FFBaD 2025-2026. Votre cote est sur MyFFBaD (Poona), dans chaque discipline.
        </p>

        <div className="inline-flex rounded-xl bg-white dark:bg-gray-800 shadow p-1 mb-5" role="tablist">
          {([
            ['simple', 'Simple'],
            ['double', 'Double / Mixte'],
          ] as [Discipline, string][]).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={discipline === value}
              onClick={() => setDiscipline(value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                discipline === value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Ma cote</label>
              <input inputMode="numeric" value={myRating} onChange={e => updateMyRating(digitsOnly(e.target.value))} placeholder="ex : 1050" className={inputClass} />
            </div>
            {isDouble ? (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mon partenaire</label>
                <input inputMode="numeric" value={partner} onChange={e => setPartner(digitsOnly(e.target.value))} placeholder="cote" className={inputClass} />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adversaire</label>
                <input inputMode="numeric" value={opponent} onChange={e => setOpponent(digitsOnly(e.target.value))} placeholder="cote" className={inputClass} />
              </div>
            )}
            {isDouble && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Adversaire 1</label>
                  <input inputMode="numeric" value={opponent} onChange={e => setOpponent(digitsOnly(e.target.value))} placeholder="cote" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Adversaire 2</label>
                  <input inputMode="numeric" value={opponent2} onChange={e => setOpponent2(digitsOnly(e.target.value))} placeholder="cote" className={inputClass} />
                </div>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Compétition</label>
            <select value={coefficient} onChange={e => setCoefficient(Number(e.target.value))} className={inputClass}>
              {COMPETITION_COEFFICIENTS.map(c => (
                <option key={c.label} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {outcome && me != null ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
              <ResultBox won points={outcome.ifWin} newRating={Math.max(MIN_RATING, me + outcome.ifWin)} onAdd={() => addToDay(true)} onEntry={() => createEntry(true, outcome.ifWin, `Adversaire : ${opponentLabel}`)} />
              <ResultBox won={false} points={outcome.ifLoss} newRating={Math.max(MIN_RATING, me + outcome.ifLoss)} onAdd={() => addToDay(false)} onEntry={() => createEntry(false, outcome.ifLoss, `Adversaire : ${opponentLabel}`)} />
            </div>
            {outcome.estimated && (
              <p className="text-xs text-gray-500 mb-6">
                ≈ Estimation : pour cet écart, une valeur du barème n’est pas publiée et a été déduite des valeurs voisines.
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-6">Renseignez les cotes pour voir les points en jeu.</p>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mt-4">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">📅 Ma journée</h2>
            {day.length > 0 && (
              <button onClick={() => saveDay([])} className="text-sm text-gray-500 hover:text-red-600">
                Tout effacer
              </button>
            )}
          </div>
          {day.length === 0 ? (
            <p className="text-sm text-gray-500">
              Ajoutez vos matchs du tournoi avec « J’ai gagné / perdu » pour voir le total. Les points d’une même semaine
              se calculent tous à partir de votre cote de début de semaine.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {day.map(m => (
                  <li key={m.id} className="py-2 flex items-center gap-2">
                    <span className="text-lg">{m.won ? '🎉' : '😔'}</span>
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">
                      {m.discipline === 'double' ? 'Double · ' : ''}{m.label}
                    </span>
                    <span className={`font-black ${m.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPoints(m.points)}</span>
                    <button
                      onClick={() => createEntry(m.won, m.points, `Adversaire : ${m.label.replace(/^vs /, '')}`)}
                      className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                      title="Créer l'entrée de ce match"
                    >
                      📝 Entrée
                    </button>
                    <button onClick={() => saveDay(day.filter(d => d.id !== m.id))} className="px-2 text-gray-400 hover:text-red-600" aria-label="Retirer">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-right">
                  <span className={`text-2xl font-black ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPoints(dayTotal)}</span>
                  {me != null && discipline === 'simple' && day.every(m => m.discipline === 'simple') && (
                    <span className="block text-xs text-gray-500">cote estimée : {Math.max(MIN_RATING, me + dayTotal)}</span>
                  )}
                </span>
              </div>
            </>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function ResultBox({
  won,
  points,
  newRating,
  onAdd,
  onEntry,
}: {
  won: boolean;
  points: number;
  newRating: number;
  onAdd: () => void;
  onEntry: () => void;
}) {
  return (
    <div
      className={`rounded-2xl p-4 text-center border-2 ${
        won ? 'bg-green-50 border-green-300 dark:bg-green-500/10' : 'bg-red-50 border-red-300 dark:bg-red-500/10'
      }`}
    >
      <p className={`text-sm font-bold ${won ? 'text-green-800' : 'text-red-800'}`}>{won ? '🎉 Si je gagne' : '😔 Si je perds'}</p>
      <p className={`text-4xl sm:text-5xl font-black my-1 ${won ? 'text-green-600' : 'text-red-600'}`}>{formatPoints(points)}</p>
      <p className="text-xs text-gray-600 mb-3">nouvelle cote : {newRating}</p>
      <div className="flex flex-col gap-2">
        <button onClick={onAdd} className={`py-2 rounded-lg text-white text-sm font-semibold ${won ? 'bg-green-600' : 'bg-red-600'}`}>
          {won ? 'J’ai gagné' : 'J’ai perdu'} : ajouter à ma journée
        </button>
        <button onClick={onEntry} className="py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 text-sm font-semibold">
          📝 Créer l’entrée
        </button>
      </div>
    </div>
  );
}
