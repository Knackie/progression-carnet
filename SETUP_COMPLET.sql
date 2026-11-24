-- ========================================
-- CARNET DE PROGRESSION - SETUP COMPLET
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ========================================

-- ========================================
-- 1. TABLE: progression_entries
-- ========================================
CREATE TABLE IF NOT EXISTS progression_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sport VARCHAR(50) NOT NULL CHECK (sport IN ('badminton', 'chess')),
  date DATE NOT NULL,
  entry_type VARCHAR(20) NOT NULL CHECK (entry_type IN ('match', 'training')),
  
  -- Journal libre
  notes TEXT,
  
  -- Analyse guidée
  strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
  errors TEXT[] DEFAULT ARRAY[]::TEXT[],
  improvement_axes TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Scoring (optionnel)
  score INTEGER CHECK (score >= 0 AND score <= 10),
  
  -- Match details
  opponent_level VARCHAR(50),
  match_result VARCHAR(20) CHECK (match_result IN ('win', 'loss', 'draw')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Index pour les requêtes courantes
CREATE INDEX IF NOT EXISTS progression_entries_user_id_idx ON progression_entries(user_id);
CREATE INDEX IF NOT EXISTS progression_entries_user_sport_date_idx ON progression_entries(user_id, sport, date DESC);

-- ========================================
-- 2. TABLE: player_profiles
-- ========================================
CREATE TABLE IF NOT EXISTS player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  age INTEGER,
  
  -- Anciennes versions (backward compatibility)
  sport VARCHAR(50) CHECK (sport IN ('badminton', 'chess')),
  
  -- Nouvelle version (supports multiples sports)
  sports TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  playing_style TEXT,
  season_objective TEXT,
  current_ranking VARCHAR(100),
  
  key_strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  key_weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
  improvement_focus TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  bio TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS player_profiles_user_id_idx ON player_profiles(user_id);

-- ========================================
-- 3. ROW LEVEL SECURITY (RLS) - progression_entries
-- ========================================
ALTER TABLE progression_entries ENABLE ROW LEVEL SECURITY;

-- Users can read/write only their own entries
CREATE POLICY "Users can read their own entries" 
  ON progression_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" 
  ON progression_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
  ON progression_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
  ON progression_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 4. ROW LEVEL SECURITY (RLS) - player_profiles
-- ========================================
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile" 
  ON player_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON player_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON player_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
  ON player_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 5. FUNCTION: Mise à jour automatique du updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour progression_entries
DROP TRIGGER IF EXISTS progression_entries_update_updated_at ON progression_entries;
CREATE TRIGGER progression_entries_update_updated_at
  BEFORE UPDATE ON progression_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour player_profiles
DROP TRIGGER IF EXISTS player_profiles_update_updated_at ON player_profiles;
CREATE TRIGGER player_profiles_update_updated_at
  BEFORE UPDATE ON player_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. VUES UTILES (optionnel)
-- ========================================

-- Vue: Statistiques par utilisateur et sport
CREATE OR REPLACE VIEW progression_stats AS
SELECT 
  user_id,
  sport,
  COUNT(*) as total_entries,
  COUNT(CASE WHEN entry_type = 'match' THEN 1 END) as match_count,
  COUNT(CASE WHEN entry_type = 'training' THEN 1 END) as training_count,
  ROUND(AVG(CASE WHEN score IS NOT NULL THEN score ELSE NULL END)::numeric, 2) as avg_score,
  MAX(score) as max_score,
  MIN(score) as min_score,
  COUNT(CASE WHEN match_result = 'win' THEN 1 END) as win_count,
  COUNT(CASE WHEN match_result = 'loss' THEN 1 END) as loss_count,
  COUNT(CASE WHEN match_result = 'draw' THEN 1 END) as draw_count,
  MAX(date) as last_entry_date
FROM progression_entries
GROUP BY user_id, sport;

-- Vue: Stats mensuelles
CREATE OR REPLACE VIEW monthly_stats AS
SELECT 
  user_id,
  sport,
  DATE_TRUNC('month', date)::date as month,
  COUNT(*) as entries,
  ROUND(AVG(CASE WHEN score IS NOT NULL THEN score ELSE NULL END)::numeric, 2) as avg_score
FROM progression_entries
GROUP BY user_id, sport, DATE_TRUNC('month', date);

-- ========================================
-- 7. DONNÉES DE TEST (Optionnel - à commenter si vous ne voulez pas)
-- ========================================
-- Note: Remplacez 'YOUR_USER_ID' par votre vrai user_id de Supabase

/*
-- Créer un profil joueur exemple
INSERT INTO player_profiles (
  user_id, 
  first_name, 
  last_name, 
  age,
  sports,
  playing_style,
  season_objective,
  current_ranking,
  key_strengths,
  key_weaknesses,
  improvement_focus
) VALUES (
  'YOUR_USER_ID',
  'Jean',
  'Dupont',
  25,
  ARRAY['badminton', 'chess'],
  'Agressif',
  'Atteindre N1 en Badminton',
  'N2',
  ARRAY['Smash puissant', 'Déplacements rapides', 'Jeu stratégique'],
  ARRAY['Revers faible', 'Service inconsistant', 'Gestion mentale'],
  ARRAY['Améliorer le revers', 'Régularité du service', 'Préparation mentale']
);

-- Créer quelques entrées d'exemple
INSERT INTO progression_entries (
  user_id,
  sport,
  date,
  entry_type,
  score,
  opponent_level,
  match_result,
  notes,
  strengths,
  weaknesses,
  improvement_axes
) VALUES 
(
  'YOUR_USER_ID',
  'badminton',
  '2026-11-24',
  'match',
  7,
  'R',
  'win',
  'Bon match! Service très régulier.',
  ARRAY['Service excellent', 'Déplacements rapides', 'Jeu au filet'],
  ARRAY['Revers aléatoire', 'Gestion du stress', 'Concentration'],
  ARRAY['Travailler le revers', 'Calme et concentration', 'Meilleur positionnement']
),
(
  'YOUR_USER_ID',
  'chess',
  '2026-11-23',
  'match',
  6,
  'intermediaire',
  'loss',
  'Partie intéressante mais erreur en début.',
  ARRAY['Endgame solide', 'Tactique', 'Prise de risque'],
  ARRAY['Ouverture faible', 'Gestion du temps', 'Panique en mid-game'],
  ARRAY['Approfondir les ouvertures', 'Augmenter le temps', 'Rester calme']
);
*/

-- ========================================
-- FIN DU SETUP
-- ========================================
-- ✅ Toutes les tables sont prêtes!
-- ✅ RLS est activé pour la sécurité
-- ✅ Les vues sont disponibles pour les stats
-- ✅ Les triggers mettent à jour les timestamps automatiquement
