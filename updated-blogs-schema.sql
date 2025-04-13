-- Modify the blogs table to replace author_id with author text field
ALTER TABLE blogs
  DROP CONSTRAINT IF EXISTS blogs_author_id_fkey,
  DROP COLUMN IF EXISTS author_id,
  ADD COLUMN author TEXT;

-- Update any existing records to have a default author value
UPDATE blogs
SET author = 'Unknown Author'
WHERE author IS NULL;

-- Make author required
ALTER TABLE blogs
  ALTER COLUMN author SET NOT NULL;

-- If you want to drop the authors table (only if it's no longer needed)
-- DROP TABLE IF EXISTS authors;
