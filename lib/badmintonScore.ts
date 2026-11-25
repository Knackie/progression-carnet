// Badminton set rules: first to 15, must win by 2, capped at 21 (21-20 wins).
export type SetScore = [number, number]; // [me, opponent]
export type SetInput = { me: string; opp: string };

export const EMPTY_SETS: SetInput[] = [
  { me: '', opp: '' },
  { me: '', opp: '' },
  { me: '', opp: '' },
];

export function setError(me: number, opp: number): string | null {
  if (!Number.isInteger(me) || !Number.isInteger(opp) || me < 0 || opp < 0) return 'Score invalide';
  const winner = Math.max(me, opp);
  const loser = Math.min(me, opp);
  if (winner > 21) return '21 points maximum';
  if (winner < 15) return 'Un set se gagne à 15';
  if (winner === 15 && loser <= 13) return null;
  if (winner - loser === 2) return null;
  if (winner === 21 && loser === 20) return null;
  return winner === 15 ? '2 points d’écart requis' : 'Écart de 2 points (ou 21-20)';
}

export function toSetInputs(sets?: SetScore[] | null): SetInput[] {
  const filled = (sets ?? []).map(([me, opp]) => ({ me: String(me), opp: String(opp) }));
  return [...filled, ...EMPTY_SETS].slice(0, 3);
}

// Returns the completed sets, or an error message for the first invalid one.
export function parseSets(inputs: SetInput[]): { sets: SetScore[]; error: string | null } {
  const sets: SetScore[] = [];
  for (let i = 0; i < inputs.length; i++) {
    const { me, opp } = inputs[i];
    if (me === '' && opp === '') continue;
    if (me === '' || opp === '') return { sets, error: `Set ${i + 1} incomplet` };
    const err = setError(Number(me), Number(opp));
    if (err) return { sets, error: `Set ${i + 1} : ${err}` };
    sets.push([Number(me), Number(opp)]);
  }
  return { sets, error: null };
}

// Best of 3: first to win 2 sets.
export function matchWinner(sets: SetScore[]): 'win' | 'loss' | null {
  const won = sets.filter(([me, opp]) => me > opp).length;
  const lost = sets.length - won;
  if (won >= 2) return 'win';
  if (lost >= 2) return 'loss';
  return null;
}

export function formatSets(sets?: SetScore[] | null): string {
  return (sets ?? []).map(([me, opp]) => `${me}-${opp}`).join(' · ');
}

// Server-side check of what the client sent. Returns null for "no sets".
export function validateSetScores(raw: unknown): { sets: SetScore[] | null; error: string | null } {
  if (raw == null) return { sets: null, error: null };
  if (!Array.isArray(raw) || raw.length > 3) return { sets: null, error: 'set_scores invalide' };
  const sets: SetScore[] = [];
  for (const s of raw) {
    if (!Array.isArray(s) || s.length !== 2) return { sets: null, error: 'set_scores invalide' };
    const [me, opp] = s.map(Number);
    const err = setError(me, opp);
    if (err) return { sets: null, error: `Set ${sets.length + 1} : ${err}` };
    sets.push([me, opp]);
  }
  return { sets: sets.length ? sets : null, error: null };
}
