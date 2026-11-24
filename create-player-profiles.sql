-- Create player_profiles table
CREATE TABLE IF NOT EXISTS player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  age INTEGER,
  sport VARCHAR(50) NOT NULL CHECK (sport IN ('badminton', 'chess')),
  playing_style TEXT,
  season_objective TEXT,
  key_strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  key_weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
  improvement_focus TEXT[] DEFAULT ARRAY[]::TEXT[],
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS player_profiles_user_id_idx ON player_profiles(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to read/write their own profile
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
