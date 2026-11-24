-- Update player_profiles table to support multiple sports and add current_ranking

-- Step 1: Add current_ranking column if it doesn't exist
ALTER TABLE player_profiles 
ADD COLUMN IF NOT EXISTS current_ranking VARCHAR(100);

-- Step 2: Add new sports column as array (if not exists)
ALTER TABLE player_profiles 
ADD COLUMN IF NOT EXISTS sports TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 3: Migrate data from sport to sports (convert existing single sport to array)
UPDATE player_profiles 
SET sports = ARRAY[sport]::TEXT[] 
WHERE sports = ARRAY[]::TEXT[] AND sport IS NOT NULL;

-- Step 4: Drop the old sport column constraint and column if everything is migrated
-- Note: Only uncomment and run this after verifying all data is migrated
-- ALTER TABLE player_profiles 
-- DROP CONSTRAINT IF EXISTS player_profiles_sport_check;
-- ALTER TABLE player_profiles 
-- DROP COLUMN IF EXISTS sport;
