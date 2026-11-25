export type Sport = 'badminton' | 'chess';
import type { SportDetails } from './sportProfile';

export interface ProgressionEntry {
  id: string;
  user_id: string;
  sport: Sport;
  date: string;
  entry_type: 'match' | 'training';
  
  // Journal libre
  notes: string;
  
  // Analyse guidée
  strengths: string[]; // 3 points forts
  weaknesses: string[]; // 3 points faibles
  errors: string[]; // Erreurs principales
  improvement_axes: string[]; // 3 axes de progression
  
  // Scoring (optionnel)
  score?: number; // 0-10
  created_at: string;
  updated_at: string;
}

export interface ProgressionStats {
  total_entries: number;
  average_score: number;
  entries_by_month: Array<{ month: string; count: number; avg_score: number }>;
  most_common_weaknesses: string[];
  most_common_strengths: string[];
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface PlayerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  age?: number;
  sports: Sport[]; // Plusieurs sports possibles
  playing_style?: string; // Ex: Agressif, Défensif, Équilibré
  season_objective?: string; // Ex: Atteindre N1, Améliorer sa moyenne
  current_ranking?: string; // Classement actuel (ex: N2, 1500, etc)
  target_ranking?: string; // Classement visé (ex: R6)
  chess_current_ranking?: string; // Elo actuel aux échecs
  chess_target_ranking?: string; // Elo visé aux échecs
  chess_profile?: SportDetails; // Style, objectif, forces… côté échecs
  key_strengths?: string[]; // Points forts majeurs
  key_weaknesses?: string[]; // Points faibles majeurs
  improvement_focus?: string[]; // Domaines prioritaires pour la progression
  bio?: string; // Biographie courte
  created_at: string;
  updated_at: string;
}
