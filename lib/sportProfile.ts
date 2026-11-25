import type { PlayerProfile, Sport } from './types';

export interface SportDetails {
  playing_style?: string;
  season_objective?: string;
  key_strengths?: string[];
  key_weaknesses?: string[];
  improvement_focus?: string[];
}

export const SPORT_LABELS: Record<Sport, string> = {
  badminton: '🏸 Badminton',
  chess: '♟️ Échecs',
};

// Badminton details live in the historical top-level columns, chess ones in chess_profile.
export function sportDetails(profile: Partial<PlayerProfile> | null | undefined, sport: Sport): SportDetails {
  if (!profile) return {};
  if (sport === 'chess') return profile.chess_profile ?? {};
  return {
    playing_style: profile.playing_style,
    season_objective: profile.season_objective,
    key_strengths: profile.key_strengths,
    key_weaknesses: profile.key_weaknesses,
    improvement_focus: profile.improvement_focus,
  };
}
