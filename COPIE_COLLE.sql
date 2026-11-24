-- ========================================
-- COPIE-COLLE DIRECTEMENT DANS SUPABASE
-- ========================================

-- ÉTAPE 1: Ajouter les colonnes manquantes
ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS sports TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS current_ranking VARCHAR(100);

-- ÉTAPE 2: Migrer les données
UPDATE player_profiles SET sports = ARRAY[sport]::TEXT[] WHERE sports = ARRAY[]::TEXT[] AND sport IS NOT NULL;

-- ÉTAPE 3: Créer les indexes
CREATE INDEX IF NOT EXISTS progression_entries_user_id_idx ON progression_entries(user_id);
CREATE INDEX IF NOT EXISTS progression_entries_user_sport_date_idx ON progression_entries(user_id, sport, date DESC);
CREATE INDEX IF NOT EXISTS player_profiles_user_id_idx ON player_profiles(user_id);

-- ÉTAPE 4: Créer la fonction pour les timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc'::TEXT, NOW()); RETURN NEW; END; $$ LANGUAGE plpgsql;

-- ÉTAPE 5: Créer les triggers
DROP TRIGGER IF EXISTS progression_entries_update_updated_at ON progression_entries;
CREATE TRIGGER progression_entries_update_updated_at BEFORE UPDATE ON progression_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS player_profiles_update_updated_at ON player_profiles;
CREATE TRIGGER player_profiles_update_updated_at BEFORE UPDATE ON player_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ÉTAPE 6: Créer les vues
CREATE OR REPLACE VIEW progression_stats AS SELECT user_id, sport, COUNT(*) as total_entries, COUNT(CASE WHEN entry_type = 'match' THEN 1 END) as match_count, COUNT(CASE WHEN entry_type = 'training' THEN 1 END) as training_count, ROUND(AVG(CASE WHEN score IS NOT NULL THEN score ELSE NULL END)::numeric, 2) as avg_score, MAX(score) as max_score, MIN(score) as min_score, COUNT(CASE WHEN match_result = 'win' THEN 1 END) as win_count, COUNT(CASE WHEN match_result = 'loss' THEN 1 END) as loss_count, COUNT(CASE WHEN match_result = 'draw' THEN 1 END) as draw_count, MAX(date) as last_entry_date FROM progression_entries GROUP BY user_id, sport;

CREATE OR REPLACE VIEW monthly_stats AS SELECT user_id, sport, DATE_TRUNC('month', date)::date as month, COUNT(*) as entries, ROUND(AVG(CASE WHEN score IS NOT NULL THEN score ELSE NULL END)::numeric, 2) as avg_score FROM progression_entries GROUP BY user_id, sport, DATE_TRUNC('month', date);

-- ✅ TERMINÉ!
