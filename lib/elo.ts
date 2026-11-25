// Elo rating change (FIDE / FFE formula): delta = K × (score − expected score).

export const K_FACTORS = [
  { value: 40, label: 'K = 40 (début, moins de 30 parties)' },
  { value: 20, label: 'K = 20 (Elo sous 2400)' },
  { value: 10, label: 'K = 10 (Elo 2400 et plus)' },
];

export type ChessResult = 'win' | 'draw' | 'loss';

const SCORE: Record<ChessResult, number> = { win: 1, draw: 0.5, loss: 0 };

export function expectedScore(myElo: number, opponentElo: number): number {
  return 1 / (1 + 10 ** ((opponentElo - myElo) / 400));
}

export function eloChange(myElo: number, opponentElo: number, k: number, result: ChessResult): number {
  return Math.round(k * (SCORE[result] - expectedScore(myElo, opponentElo)));
}

export interface EloOutcome {
  expected: number; // 0..1
  ifWin: number;
  ifDraw: number;
  ifLoss: number;
}

export function eloOutcome(myElo: number, opponentElo: number, k: number): EloOutcome {
  return {
    expected: expectedScore(myElo, opponentElo),
    ifWin: eloChange(myElo, opponentElo, k, 'win'),
    ifDraw: eloChange(myElo, opponentElo, k, 'draw'),
    ifLoss: eloChange(myElo, opponentElo, k, 'loss'),
  };
}
