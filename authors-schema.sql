-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample authors
INSERT INTO authors (first_name, last_name) VALUES 
  ('Alex', 'Johnson'),
  ('Samantha', 'Chen'),
  ('Michael', 'Rodriguez'),
  ('Emily', 'Williams');

-- Modify blogs table to reference authors
ALTER TABLE blogs 
  DROP COLUMN author,
  ADD COLUMN author_id INTEGER REFERENCES authors(id);

-- Update existing blogs to use the first author
UPDATE blogs SET author_id = 1 WHERE author_id IS NULL;
