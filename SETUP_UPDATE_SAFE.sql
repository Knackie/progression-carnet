-- ========================================
-- SETUP SAFE - Mise à jour sans erreurs
-- Ce script ne crée que ce qui manque
-- ========================================

-- ========================================
-- 1. VÉRIFIER ET AJOUTER COLONNES MANQUANTES
-- ========================================

-- Ajouter 'sports' si elle n'existe pas
ALTER TABLE player_profiles 
ADD COLUMN IF NOT EXISTS sports TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Ajouter 'current_ranking' si elle n'existe pas
ALTER TABLE player_profiles 
ADD COLUMN IF NOT EXISTS current_ranking VARCHAR(100);

-- ========================================
-- 2. MIGRER DONNÉES (si ancien format)
-- ========================================

-- Migrer de 'sport' vers 'sports' (une seule fois)
UPDATE player_profiles 
SET sports = ARRAY[sport]::TEXT[] 
WHERE sports = ARRAY[]::TEXT[] 
  AND sport IS NOT NULL;

-- ========================================
-- 3. VÉRIFIER LES INDEX
-- ========================================

-- Index pour progression_entries
CREATE INDEX IF NOT EXISTS progression_entries_user_id_idx 
  ON progression_entries(user_id);

CREATE INDEX IF NOT EXISTS progression_entries_user_sport_date_idx 
  ON progression_entries(user_id, sport, date DESC);

-- Index pour player_profiles
CREATE INDEX IF NOT EXISTS player_profiles_user_id_idx 
  ON player_profiles(user_id);

-- ========================================
-- 4. VÉRIFIER LES TRIGGERS
-- ========================================

-- Créer la fonction si elle n'existe pas
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
-- 5. VÉRIFIER LES VUES
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
-- 6. VÉRIFICATION FINALE
-- ========================================

-- Afficher les colonnes de player_profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'player_profiles'
ORDER BY ordinal_position;

-- Afficher les colonnes de progression_entries
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'progression_entries'
ORDER BY ordinal_position;

-- ========================================
-- ✅ SETUP TERMINÉ!
-- ========================================
-- Les tables sont à jour avec:
-- - Colonne 'sports' (array)
-- - Colonne 'current_ranking'
-- - Indexes optimisés
-- - Triggers pour updated_at
-- - Vues pour les statistiques
