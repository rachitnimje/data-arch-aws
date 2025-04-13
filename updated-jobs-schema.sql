-- Update the jobs table to use a bigint ID and add a slug column
ALTER TABLE jobs 
  ALTER COLUMN id TYPE bigint,
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Update existing records to have a slug based on title
UPDATE jobs
SET slug = LOWER(REGEXP_REPLACE(title, '[^\w\s]', '', 'g'))
WHERE slug IS NULL;

-- Add a unique constraint on the slug
ALTER TABLE jobs
  ADD CONSTRAINT jobs_slug_unique UNIQUE (slug);

-- Make sure the id column is set to auto-increment if it's not already
-- This depends on your database system, for PostgreSQL:
-- If you're using a sequence for the id column:
-- ALTER SEQUENCE jobs_id_seq OWNED BY jobs.id;
-- ALTER TABLE jobs ALTER COLUMN id SET DEFAULT nextval('jobs_id_seq');
