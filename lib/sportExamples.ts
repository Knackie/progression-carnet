import type { Sport } from './types';

export type ExampleKind = 'strengths' | 'weaknesses' | 'improvements';

const EXAMPLES: Record<Sport, Record<ExampleKind, string[]>> = {
  badminton: {
    strengths: ['Smash puissant', 'Déplacements rapides', 'Jeu au filet'],
    weaknesses: ['Revers faible', 'Service irrégulier', 'Gestion du stress'],
    improvements: ['Travailler le revers', 'Régularité du service', 'Rester patient en défense'],
  },
  chess: {
    strengths: ['Vision tactique', 'Finales maîtrisées', 'Bon calcul'],
    weaknesses: ['Ouvertures approximatives', 'Gestion de la pendule', 'Défense passive'],
    improvements: ['Réviser mes ouvertures', 'Garder du temps pour la finale', 'Faire des exercices tactiques'],
  },
};

const FALLBACK: Record<ExampleKind, string> = {
  strengths: 'Point fort',
  weaknesses: 'Point faible',
  improvements: 'Axe de progression',
};

export function exampleFor(sport: Sport, kind: ExampleKind, index: number): string {
  return EXAMPLES[sport]?.[kind][index] ?? `${FALLBACK[kind]} ${index + 1}`;
}

// For a profile with several sports, alternate the examples between them.
export function exampleForSports(sports: Sport[] | undefined, kind: ExampleKind, index: number): string {
  const list = sports && sports.length ? sports : (['badminton'] as Sport[]);
  return exampleFor(list[index % list.length], kind, index);
}

export const SEASON_GOAL_EXAMPLE: Record<Sport, string> = {
  badminton: 'Ex : passer R6 en simple, jouer 15 tournois',
  chess: 'Ex : atteindre 1600 Elo, jouer un open par mois',
};

export function seasonGoalExample(sports: Sport[] | undefined): string {
  if (sports?.length === 1) return SEASON_GOAL_EXAMPLE[sports[0]];
  if (sports?.length === 2) return 'Ex : passer R6 au badminton, 1600 Elo aux échecs';
  return SEASON_GOAL_EXAMPLE.badminton;
}

export function playStyleExample(sports: Sport[] | undefined): string {
  const has = (s: Sport) => sports?.includes(s);
  if (has('chess') && !has('badminton')) return 'Ex : positionnel, tactique, joueur de finales';
  if (has('chess') && has('badminton')) return 'Ex : attaquant au bad, positionnel aux échecs';
  return 'Ex : attaquant, défenseur, joueur de filet';
}
