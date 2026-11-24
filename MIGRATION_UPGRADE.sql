-- ========================================
-- MIGRATION: Mise à jour de player_profiles
-- (Si vous aviez déjà une version avec un seul 'sport')
-- ========================================

-- ⚠️ AVANT DE LANCER: Faites une sauvegarde!

-- Étape 1: Vérifier si la colonne 'sports' existe
-- Si elle existe déjà, vous pouvez sauter les étapes 1-3

-- Étape 1: Ajouter la colonne 'sports' si elle n'existe pas
ALTER TABLE player_profiles 
ADD COLUMN IF NOT EXISTS sports TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Étape 2: Migrer les données de 'sport' vers 'sports'
UPDATE player_profiles 
SET sports = ARRAY[sport]::TEXT[] 
WHERE sports = ARRAY[]::TEXT[] 
  AND sport IS NOT NULL
  AND sport != '';

-- Étape 3: Vérifier que les données sont bien migrées
-- (Optionnel - pour vérifier que ça a marché)
-- SELECT id, sport, sports FROM player_profiles;

-- Étape 4: Ajouter la colonne 'current_ranking' si elle n'existe pas
ALTER TABLE player_profiles 
ADD COLUMN IF NOT EXISTS current_ranking VARCHAR(100);

-- ========================================
-- VÉRIFICATION: Afficher les données migrées
-- ========================================
-- Décommentez pour voir le résultat:
-- SELECT 
--   id,
--   first_name,
--   last_name,
--   sport,
--   sports,
--   current_ranking,
--   created_at
-- FROM player_profiles
-- ORDER BY created_at DESC;

-- ========================================
-- ✅ Migration terminée!
-- ========================================
