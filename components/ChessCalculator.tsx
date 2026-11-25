'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChessResult, K_FACTORS, eloChange, eloOutcome } from '@/lib/elo';
import { formatPoints } from '@/lib/ffbadPoints';

interface Game {
  id: string;
  opponent: number;
  result: ChessResult;
  delta: number;
}

const STORAGE = { elo: 'calc-chess-elo', k: 'calc-chess-k', day: 'calc-chess-day' };

const inputClass =
  'w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

const digitsOnly = (v: string) => v.replace(/\D/g, '').slice(0, 4);
const toNumber = (v: string) => (v.trim() === '' ? null : Number(v));

const RESULT_STYLE: Record<ChessResult, { label: string; title: string; box: string; text: string; button: string }> = {
  win: { label: 'Gagné', title: '🎉 Si je gagne', box: 'bg-green-50 border-green-300', text: 'text-green-600', button: 'bg-green-600' },
  draw: { label: 'Nulle', title: '🤝 Si nulle', box: 'bg-gray-50 border-gray-300', text: 'text-gray-600', button: 'bg-gray-600' },
  loss: { label: 'Perdu', title: '😔 Si je perds', box: 'bg-red-50 border-red-300', text: 'text-red-600', button: 'bg-red-600' },
};

const EMOJI: Record<ChessResult, string> = { win: '🎉', draw: '🤝', loss: '😔' };

export default function ChessCalculator() {
  const router = useRouter();
  const [myElo, setMyElo] = useState('');
  const [opponent, setOpponent] = useState('');
  const [k, setK] = useState(20);
  const [day, setDay] = useState<Game[]>([]);

  useEffect(() => {
    setMyElo(localStorage.getItem(STORAGE.elo) ?? '');
    setK(Number(localStorage.getItem(STORAGE.k)) || 20);
    try {
      setDay(JSON.parse(localStorage.getItem(STORAGE.day) ?? '[]'));
    } catch {
      setDay([]);
    }
  }, []);

  const me = toNumber(myElo);
  const opp = toNumber(opponent);

  const updateMyElo = (value: string) => {
    setMyElo(value);
    localStorage.setItem(STORAGE.elo, value);
  };

  const updateK = (value: number) => {
    setK(value);
    localStorage.setItem(STORAGE.k, String(value));
  };

  const saveDay = (next: Game[]) => {
    setDay(next);
    localStorage.setItem(STORAGE.day, JSON.stringify(next));
  };

  // Each game is computed from the Elo reached after the previous ones
  const currentElo = me != null ? me + day.reduce((sum, g) => sum + g.delta, 0) : null;
  const dayTotal = day.reduce((sum, g) => sum + g.delta, 0);

  const addGame = (result: ChessResult) => {
    if (currentElo == null || opp == null) return;
    saveDay([...day, { id: crypto.randomUUID(), opponent: opp, result, delta: eloChange(currentElo, opp, k, result) }]);
  };

  const createEntry = (result: ChessResult, delta: number, opponentElo: number) => {
    const params = new URLSearchParams({
      sport: 'chess',
      result,
      points: String(delta),
      note: `Adversaire : ${opponentElo} Elo`,
    });
    router.push(`/dashboard?${params}`);
  };

  const base = currentElo;
  const shown = useMemo(() => (base != null && opp != null ? eloOutcome(base, opp, k) : null), [base, opp, k]);

  return (
    <>
      <p className="text-sm text-gray-500 mb-5">
        Formule Elo FIDE / FFE : variation = K × (résultat − résultat attendu). Votre Elo officiel est sur le site de la FFE ou de la FIDE.
      </p>

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mon Elo</label>
            <input inputMode="numeric" value={myElo} onChange={e => updateMyElo(digitsOnly(e.target.value))} placeholder="ex : 1500" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Elo adverse</label>
            <input inputMode="numeric" value={opponent} onChange={e => setOpponent(digitsOnly(e.target.value))} placeholder="ex : 1620" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Coefficient K</label>
          <select value={k} onChange={e => updateK(Number(e.target.value))} className={inputClass}>
            {K_FACTORS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {shown && base != null ? (
        <>
          <p className="text-center text-sm text-gray-600 mb-3">
            Chances de gain estimées : <strong>{Math.round(shown.expected * 100)}%</strong>
            {day.length > 0 && <> · depuis {base} Elo</>}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            {(['win', 'draw', 'loss'] as ChessResult[]).map(r => {
              const s = RESULT_STYLE[r];
              const delta = r === 'win' ? shown.ifWin : r === 'draw' ? shown.ifDraw : shown.ifLoss;
              return (
                <div key={r} className={`rounded-2xl p-3 sm:p-4 text-center border-2 ${s.box}`}>
                  <p className="text-xs sm:text-sm font-bold text-gray-700">{s.title}</p>
                  <p className={`text-3xl sm:text-5xl font-black my-1 ${s.text}`}>{formatPoints(delta)}</p>
                  <p className="text-xs text-gray-600 mb-3">Elo : {base + delta}</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => addGame(r)} className={`py-2 rounded-lg text-white text-xs sm:text-sm font-semibold ${s.button}`}>
                      {s.label} : ajouter
                    </button>
                    <button
                      onClick={() => createEntry(r, delta, opp!)}
                      className="py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold"
                    >
                      📝 Entrée
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 py-6">Renseignez les deux Elo pour voir les points en jeu.</p>
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
            Ajoutez vos parties du tournoi pour suivre l’Elo estimé. Chaque partie est calculée à partir de l’Elo atteint après la précédente : c’est une estimation, le classement officiel est recalculé par période.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {day.map(g => (
                <li key={g.id} className="py-2 flex items-center gap-2">
                  <span className="text-lg">{EMOJI[g.result]}</span>
                  <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">vs {g.opponent} Elo</span>
                  <span className={`font-black ${g.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPoints(g.delta)}</span>
                  <button
                    onClick={() => createEntry(g.result, g.delta, g.opponent)}
                    className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                    title="Créer l'entrée de cette partie"
                  >
                    📝 Entrée
                  </button>
                  <button onClick={() => saveDay(day.filter(d => d.id !== g.id))} className="px-2 text-gray-400 hover:text-red-600" aria-label="Retirer">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-gray-200">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-right">
                <span className={`text-2xl font-black ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPoints(dayTotal)}</span>
                {currentElo != null && <span className="block text-xs text-gray-500">Elo estimé : {currentElo}</span>}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
