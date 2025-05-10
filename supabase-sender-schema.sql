-- SQL Commands to add sender field to vesak_cards table

-- First, check if the sender column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vesak_cards' 
        AND column_name = 'sender'
    ) THEN
        -- Add the sender column if it doesn't exist
        ALTER TABLE vesak_cards ADD COLUMN sender TEXT DEFAULT 'Anonymous';
        
        -- Add a comment to the column
        COMMENT ON COLUMN vesak_cards.sender IS 'Name of the person who sent the card';
    END IF;
END $$;

-- Update existing records to set a default value for sender if needed
UPDATE vesak_cards 
SET sender = 'Anonymous' 
WHERE sender IS NULL;

-- Full vesak_cards table creation script (for reference or new installations)
/*
CREATE TABLE IF NOT EXISTS vesak_cards (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  card_id TEXT NOT NULL UNIQUE,
  recipient TEXT,
  message TEXT,
  sender TEXT DEFAULT 'Anonymous',
  theme TEXT DEFAULT 'gold'
);

-- Enable Row Level Security
ALTER TABLE vesak_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public select"
  ON vesak_cards
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert"
  ON vesak_cards
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON vesak_cards
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add index to improve query performance on card_id lookups
CREATE INDEX IF NOT EXISTS vesak_cards_card_id_idx ON vesak_cards (card_id);
*/

-- Query to view the updated table structure
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vesak_cards' 
ORDER BY ordinal_position; 