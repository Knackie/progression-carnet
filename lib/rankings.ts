// FFBaD rankings, from lowest to highest
export const BADMINTON_RANKING_GROUPS = [
  { label: 'Non classé', ranks: ['NC'] },
  { label: '🟩 Promotion', ranks: ['P12', 'P11', 'P10'] },
  { label: '🟨 Départemental', ranks: ['D9', 'D8', 'D7'] },
  { label: '🟧 Régional', ranks: ['R6', 'R5', 'R4'] },
  { label: '🟥 National', ranks: ['N3', 'N2', 'N1'] },
];

export const CHESS_LEVELS = [
  { value: 'debutant', label: '🟩 Débutant' },
  { value: 'intermediaire', label: '🟨 Intermédiaire' },
  { value: 'avance', label: '🟥 Avancé' },
];

const LEGACY_BADMINTON_LABELS: Record<string, string> = {
  P: 'P (Promotion)',
  D: 'D (Départemental)',
  R: 'R (Régional)',
  N: 'N (National)',
};

export function isKnownLevel(value: string): boolean {
  return (
    BADMINTON_RANKING_GROUPS.some(g => g.ranks.includes(value)) ||
    CHESS_LEVELS.some(l => l.value === value)
  );
}

export function legacyLevelLabel(value: string): string {
  return LEGACY_BADMINTON_LABELS[value] ?? value;
}

export const BADMINTON_RANKS = BADMINTON_RANKING_GROUPS.flatMap(g => g.ranks);

export function nextBadmintonRank(rank: string): string | null {
  const index = BADMINTON_RANKS.indexOf(rank.trim().toUpperCase());
  if (index === -1 || index === BADMINTON_RANKS.length - 1) return null;
  return BADMINTON_RANKS[index + 1];
}
