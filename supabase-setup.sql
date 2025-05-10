-- Create the vesak_cards table if it doesn't exist
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public select" ON vesak_cards;
DROP POLICY IF EXISTS "Allow public insert" ON vesak_cards;
DROP POLICY IF EXISTS "Allow public update" ON vesak_cards;

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

-- Create a function to retrieve a shared card
CREATE OR REPLACE FUNCTION get_shared_card(p_card_id TEXT)
RETURNS TABLE (
  card_id TEXT,
  recipient TEXT,
  message TEXT,
  sender TEXT,
  theme TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vc.card_id,
    vc.recipient,
    vc.message,
    vc.sender,
    vc.theme,
    vc.created_at
  FROM 
    vesak_cards vc
  WHERE 
    vc.card_id = p_card_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set a comment to help identify the table's purpose
COMMENT ON TABLE vesak_cards IS 'Stores shared Vesak card data for the digital card application'; 