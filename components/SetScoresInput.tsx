'use client';

import { SetInput, SetScore, matchWinner, setError } from '@/lib/badmintonScore';

// Result deduced from a finished score, e.g. "🎉 Victoire · 2 sets à 1"
export function DerivedResult({ sets }: { sets: SetScore[] }) {
  const winner = matchWinner(sets);
  if (!winner) return null;
  const won = sets.filter(([me, opp]) => me > opp).length;
  const lost = sets.length - won;
  const isWin = winner === 'win';
  return (
    <div
      className={`w-full px-4 py-3 rounded-lg border-2 font-bold text-center ${
        isWin
          ? 'bg-green-100 border-green-400 text-green-800 dark:bg-green-500/20 dark:text-green-200'
          : 'bg-red-100 border-red-400 text-red-800 dark:bg-red-500/20 dark:text-red-200'
      }`}
    >
      {isWin ? '🎉 Victoire' : '😔 Défaite'} · {isWin ? won : lost} set{(isWin ? won : lost) > 1 ? 's' : ''} à {isWin ? lost : won}
    </div>
  );
}

interface SetScoresInputProps {
  value: SetInput[];
  onChange: (value: SetInput[]) => void;
}

export default function SetScoresInput({ value, onChange }: SetScoresInputProps) {
  const update = (index: number, field: 'me' | 'opp', raw: string) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 2);
    onChange(value.map((set, i) => (i === index ? { ...set, [field]: cleaned } : set)));
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[3.5rem_1fr_1fr] gap-2 text-xs font-bold text-orange-900">
        <span />
        <span className="text-center">Moi</span>
        <span className="text-center">Adversaire</span>
      </div>
      {value.map((set, i) => {
        const complete = set.me !== '' && set.opp !== '';
        const err = complete ? setError(Number(set.me), Number(set.opp)) : null;
        return (
          <div key={i}>
            <div className="grid grid-cols-[3.5rem_1fr_1fr] gap-2 items-center">
              <span className="text-sm font-semibold text-orange-900">
                Set {i + 1}
                {i === 2 && <span className="block text-[10px] font-normal opacity-70">si besoin</span>}
              </span>
              {(['me', 'opp'] as const).map(field => (
                <input
                  key={field}
                  type="text"
                  inputMode="numeric"
                  value={set[field]}
                  onChange={e => update(i, field, e.target.value)}
                  placeholder="0"
                  aria-label={`Set ${i + 1} ${field === 'me' ? 'moi' : 'adversaire'}`}
                  className={`w-full px-3 py-2 rounded-lg border-2 bg-white text-center text-lg font-bold text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    err ? 'border-red-400' : 'border-orange-300'
                  }`}
                />
              ))}
            </div>
            {err && <p className="text-xs text-red-600 mt-1 ml-[4rem]">{err}</p>}
          </div>
        );
      })}
      <p className="text-xs text-orange-800 opacity-80">15 points, 2 points d’écart, 21 maximum. Le résultat est déduit du score.</p>
    </div>
  );
}
