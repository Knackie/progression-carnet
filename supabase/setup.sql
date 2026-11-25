-- ========================================
-- CARNET DE PROGRESSION - Setup Supabase
-- À exécuter dans Supabase > SQL Editor.
-- Peut être relancé sans risque : crée ce qui manque et met à jour le reste.
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
  notes TEXT,
  strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
  errors TEXT[] DEFAULT ARRAY[]::TEXT[],
  improvement_axes TEXT[] DEFAULT ARRAY[]::TEXT[],
  score INTEGER CHECK (score >= 0 AND score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Colonnes ajoutées après la première version
ALTER TABLE progression_entries ADD COLUMN IF NOT EXISTS opponent_level VARCHAR(50);
ALTER TABLE progression_entries ADD COLUMN IF NOT EXISTS match_result VARCHAR(20)
  CHECK (match_result IN ('win', 'loss', 'draw'));

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
  sport VARCHAR(50) CHECK (sport IN ('badminton', 'chess')), -- ancien format, remplacé par "sports"
  playing_style TEXT,
  season_objective TEXT,
  key_strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  key_weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
  improvement_focus TEXT[] DEFAULT ARRAY[]::TEXT[],
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS sports TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS current_ranking VARCHAR(100);

UPDATE player_profiles
SET sports = ARRAY[sport]::TEXT[]
WHERE sports = ARRAY[]::TEXT[] AND sport IS NOT NULL;

CREATE INDEX IF NOT EXISTS player_profiles_user_id_idx ON player_profiles(user_id);

-- ========================================
-- 3. ROW LEVEL SECURITY - chacun ne voit que ses données
-- ========================================
ALTER TABLE progression_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own entries" ON progression_entries;
CREATE POLICY "Users can read their own entries"
  ON progression_entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own entries" ON progression_entries;
CREATE POLICY "Users can insert their own entries"
  ON progression_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own entries" ON progression_entries;
CREATE POLICY "Users can update their own entries"
  ON progression_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own entries" ON progression_entries;
CREATE POLICY "Users can delete their own entries"
  ON progression_entries FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own profile" ON player_profiles;
CREATE POLICY "Users can read their own profile"
  ON player_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON player_profiles;
CREATE POLICY "Users can insert their own profile"
  ON player_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON player_profiles;
CREATE POLICY "Users can update their own profile"
  ON player_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON player_profiles;
CREATE POLICY "Users can delete their own profile"
  ON player_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 4. updated_at automatique
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS progression_entries_update_updated_at ON progression_entries;
CREATE TRIGGER progression_entries_update_updated_at
  BEFORE UPDATE ON progression_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS player_profiles_update_updated_at ON player_profiles;
CREATE TRIGGER player_profiles_update_updated_at
  BEFORE UPDATE ON player_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. Vues de stats
-- security_invoker = true : la vue applique la RLS de l'utilisateur.
-- Sans ça, une vue lit la table avec les droits de son créateur et
-- expose les stats de TOUS les utilisateurs via l'API publique.
-- ========================================
CREATE OR REPLACE VIEW progression_stats WITH (security_invoker = true) AS
SELECT
  user_id,
  sport,
  COUNT(*) AS total_entries,
  COUNT(CASE WHEN entry_type = 'match' THEN 1 END) AS match_count,
  COUNT(CASE WHEN entry_type = 'training' THEN 1 END) AS training_count,
  ROUND(AVG(score)::numeric, 2) AS avg_score,
  MAX(score) AS max_score,
  MIN(score) AS min_score,
  COUNT(CASE WHEN match_result = 'win' THEN 1 END) AS win_count,
  COUNT(CASE WHEN match_result = 'loss' THEN 1 END) AS loss_count,
  COUNT(CASE WHEN match_result = 'draw' THEN 1 END) AS draw_count,
  MAX(date) AS last_entry_date
FROM progression_entries
GROUP BY user_id, sport;

CREATE OR REPLACE VIEW monthly_stats WITH (security_invoker = true) AS
SELECT
  user_id,
  sport,
  DATE_TRUNC('month', date)::date AS month,
  COUNT(*) AS entries,
  ROUND(AVG(score)::numeric, 2) AS avg_score
FROM progression_entries
GROUP BY user_id, sport, DATE_TRUNC('month', date);
