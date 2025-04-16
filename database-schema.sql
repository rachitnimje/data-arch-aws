-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  department TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  job_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  years_experience INTEGER,
  current_company TEXT,
  resume_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'new'
);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin'::text,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username)
) TABLESPACE pg_default;

create index IF not exists idx_users_username on public.users using btree (username) TABLESPACE pg_default;

INSERT INTO users (username, password, role) 
  VALUES ('admin', '$2b$12$P/16d19hoeq4tV3AiTbxzum.DZUFc2X.ekAeoFK4xZ68UCq5Am3Wi', 'admin');
