-- Add match result column to progression_entries table
ALTER TABLE progression_entries ADD COLUMN match_result VARCHAR(20);

-- Add constraint to ensure valid match results
ALTER TABLE progression_entries ADD CONSTRAINT valid_match_result 
CHECK (match_result IS NULL OR match_result IN ('win', 'loss', 'draw'));
