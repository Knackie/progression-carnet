// FFBaD ranking points, 2025-2026 system (ELO-like, "cotes").
// Source: Guide du Badminton, annexe GUI03.06A01 "Coefficients utilisés pour le calcul du classement".

export type Discipline = 'simple' | 'double';

interface Band {
  min: number; // rating gap lower bound (inclusive)
  favWin: number; // better-rated wins: points it earns
  underdogLoss: number; // ...and the underdog loses (negative or 0)
  underdogWin: number; // lower-rated wins: points it earns
  favLoss: number; // ...and the favourite loses (negative)
  estimated?: boolean;
}

// Singles. Doubles use the same scale x2, on each pair's average rating.
const SIMPLE_BANDS: Band[] = [
  { min: 0, favWin: 20, underdogLoss: -14, underdogWin: 20, favLoss: -14 },
  { min: 50, favWin: 17, underdogLoss: -13, underdogWin: 23, favLoss: -15 },
  { min: 100, favWin: 14, underdogLoss: -12, underdogWin: 26, favLoss: -16 },
  { min: 200, favWin: 11, underdogLoss: -10, underdogWin: 32, favLoss: -18 },
  { min: 300, favWin: 9, underdogLoss: -7, underdogWin: 38, favLoss: -20 },
  { min: 400, favWin: 7, underdogLoss: -4, underdogWin: 43, favLoss: -22 },
  { min: 600, favWin: 5, underdogLoss: -1, underdogWin: 53, favLoss: -24 },
  // favLoss not in the published excerpts: taken between the 600-799 (-24) and 1000+ (-28) values
  { min: 800, favWin: 4, underdogLoss: 0, underdogWin: 61, favLoss: -26, estimated: true },
  { min: 1000, favWin: 3, underdogLoss: 0, underdogWin: 70, favLoss: -28 },
];

// Share of a pair's points for the lower-rated partner when the pair wins
// (the higher-rated one gets the rest; reversed on a loss).
const SPLIT_BANDS: { min: number; weakShare: number; estimated?: boolean }[] = [
  { min: 0, weakShare: 0.5 },
  { min: 400, weakShare: 0.54 },
  { min: 500, weakShare: 0.57 },
  { min: 600, weakShare: 0.61 },
  // 700-999 not in the published excerpts: interpolated between 61% and 75%
  { min: 700, weakShare: 0.64, estimated: true },
  { min: 800, weakShare: 0.68, estimated: true },
  { min: 900, weakShare: 0.71, estimated: true },
  { min: 1000, weakShare: 0.75 },
];

export const COMPETITION_COEFFICIENTS = [
  { value: 1, label: 'Tournoi (×1)' },
  { value: 1.1, label: 'Circuit départ. (×1,1)' },
  { value: 1.2, label: 'Circuit régional (×1,2)' },
  { value: 1.3, label: 'Champ. départ. / élite (×1,3)' },
  { value: 1.4, label: 'Champ. régional (×1,4)' },
  { value: 1.5, label: 'Champ. de France (×1,5)' },
  { value: 0.2, label: 'Promobad (×0,2)' },
];

export const MIN_RATING = 400;

function band(gap: number) {
  return [...SIMPLE_BANDS].reverse().find(b => gap >= b.min)!;
}

export interface Outcome {
  ifWin: number;
  ifLoss: number;
  estimated: boolean;
}

/** Points for `me` (singles rating, or my pair's average rating in doubles) against `opponent`. */
export function pairOutcome(me: number, opponent: number, discipline: Discipline, coefficient = 1): Outcome {
  const gap = Math.abs(me - opponent);
  const b = band(gap);
  const iAmFavourite = me >= opponent;
  const factor = (discipline === 'double' ? 2 : 1) * coefficient;
  const ifWin = (iAmFavourite ? b.favWin : b.underdogWin) * factor;
  const ifLoss = (iAmFavourite ? b.favLoss : b.underdogLoss) * factor;
  return { ifWin: Math.round(ifWin), ifLoss: Math.round(ifLoss), estimated: !!b.estimated };
}

/** My share of my pair's points in doubles. */
export function myShare(me: number, partner: number, pairPoints: number, won: boolean) {
  const gap = Math.abs(me - partner);
  const split = [...SPLIT_BANDS].reverse().find(s => gap >= s.min)!;
  const iAmWeaker = me < partner;
  // Weaker partner gets the bigger share of a win and the smaller share of a loss
  const share = won === iAmWeaker ? split.weakShare : 1 - split.weakShare;
  return { points: Math.round(pairPoints * share), estimated: !!split.estimated };
}

export interface MatchInput {
  discipline: Discipline;
  myRating: number;
  opponentRating: number; // singles
  partnerRating?: number; // doubles
  opponent2Rating?: number; // doubles
  coefficient: number;
}

/** What I win or lose for this match, in points. */
export function matchOutcome(input: MatchInput): Outcome {
  if (input.discipline === 'simple') {
    return pairOutcome(input.myRating, input.opponentRating, 'simple', input.coefficient);
  }
  const partner = input.partnerRating ?? input.myRating;
  const myPair = (input.myRating + partner) / 2;
  const theirPair = (input.opponentRating + (input.opponent2Rating ?? input.opponentRating)) / 2;
  const pair = pairOutcome(myPair, theirPair, 'double', input.coefficient);
  const win = myShare(input.myRating, partner, pair.ifWin, true);
  const loss = myShare(input.myRating, partner, pair.ifLoss, false);
  return { ifWin: win.points, ifLoss: loss.points, estimated: pair.estimated || win.estimated || loss.estimated };
}

export const formatPoints = (n: number) => (n > 0 ? `+${n}` : String(n));
