-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own entries" ON progression_entries;
DROP POLICY IF EXISTS "Users can read own entries" ON progression_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON progression_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON progression_entries;

-- Enable RLS (make sure it's enabled)
ALTER TABLE progression_entries ENABLE ROW LEVEL SECURITY;

-- Policy for INSERT - users can insert entries for themselves
CREATE POLICY "Users can insert own entries" ON progression_entries
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Policy for SELECT - users can read their own entries
CREATE POLICY "Users can read own entries" ON progression_entries
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Policy for UPDATE - users can update their own entries
CREATE POLICY "Users can update own entries" ON progression_entries
  FOR UPDATE USING (
    auth.uid() = user_id
  ) WITH CHECK (
    auth.uid() = user_id
  );

-- Policy for DELETE - users can delete their own entries
CREATE POLICY "Users can delete own entries" ON progression_entries
  FOR DELETE USING (
    auth.uid() = user_id
  );
