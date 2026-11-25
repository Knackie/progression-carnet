export interface MatchGoal {
  text: string;
  achieved: boolean | null; // null until reviewed after the match
}

export type EntryStatus = 'planned' | 'done';

const MAX_GOALS = 5;

export function validateGoals(raw: unknown): { goals: MatchGoal[] | null; error: string | null } {
  if (raw == null) return { goals: null, error: null };
  if (!Array.isArray(raw) || raw.length > MAX_GOALS) return { goals: null, error: 'Objectifs invalides' };
  const goals: MatchGoal[] = [];
  for (const g of raw) {
    const text = typeof g?.text === 'string' ? g.text.trim().slice(0, 200) : '';
    if (!text) continue;
    const achieved = g.achieved === true || g.achieved === false ? g.achieved : null;
    goals.push({ text, achieved });
  }
  return { goals: goals.length ? goals : null, error: null };
}

/**
 * Preparation fields sent by the client, validated.
 * `onlyPresent`: for updates, keep only keys the client actually sent, so an
 * update never fails on a database where these columns don't exist yet.
 */
export function prepFields(body: Record<string, unknown>, onlyPresent: boolean) {
  const { goals, error } = validateGoals(body.match_goals);
  if (error) return { fields: {}, error };

  const status: EntryStatus = body.status === 'planned' ? 'planned' : 'done';
  const text = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
  const points = Number(body.points_delta);
  const pointsDelta =
    body.points_delta === '' || body.points_delta == null || !Number.isFinite(points)
      ? null
      : Math.max(-500, Math.min(500, Math.round(points)));

  const all: Record<string, unknown> = {
    status,
    opponent_name: text(body.opponent_name, 100),
    game_plan: text(body.game_plan, 2000),
    match_goals: goals,
    points_delta: pointsDelta,
  };

  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(all)) {
    if (onlyPresent ? key in body : value !== null && !(key === 'status' && value === 'done')) {
      fields[key] = value;
    }
  }
  return { fields, error: null };
}
