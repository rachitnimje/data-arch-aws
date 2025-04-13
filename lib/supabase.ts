import { createClient } from "@supabase/supabase-js"

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Fallback values for development (not used in production)
const fallbackUrl = "https://rofpoagvuofevaacgidd.supabase.co"
const fallbackAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZnBvYWd2dW9mZXZhYWNnaWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMDE2NjUsImV4cCI6MjA1OTY3NzY2NX0.7UoTkLx_JedLNIQ285QqaFxalVy2MIoWySXI7jeZV3Y"
const fallbackServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZnBvYWd2dW9mZXZhYWNnaWRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDEwMTY2NSwiZXhwIjoyMDU5Njc3NjY1fQ.dihrlF_B2PLNjXQgFeEw1HiBBZ_wacqgxFFt-XvUYsg"

// Use environment variables with fallbacks
const url = supabaseUrl || fallbackUrl
const anonKey = supabaseAnonKey || fallbackAnonKey
const serviceKey = supabaseServiceKey || fallbackServiceKey

// Client for browser usage (limited permissions)
export const supabaseClient = createClient(url, anonKey)

// Admin client for server-side operations (full permissions)
export const supabaseAdmin = createClient(url, serviceKey)

// Function to create a fresh client (useful to avoid singleton issues)
export function createBrowserClient() {
  return createClient(url, anonKey)
}

// Types for our database tables
export type Blog = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  featured_image: string
  status: "published" | "draft"
  created_at: string
  updated_at: string
}

export type JobApplication = {
  id: number
  job_id: string
  job_title?: string // Add this field
  first_name: string
  last_name: string
  email: string
  phone: string
  years_experience: number
  current_company: string
  resume_url: string
  status: "new" | "in_review" | "interviewed" | "hired" | "rejected"
  created_at: string
  notes?: string
}

export type Job = {
  id: number
  slug: string
  title: string
  location: string
  department: string
  type: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export type PageContent = {
  id: string
  page: string
  section: string
  content: Record<string, any>
  updated_at: string
}
