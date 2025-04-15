export interface Job {
  id: number;
  slug: string;
  title: string;
  location: string;
  department: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  job_title?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  years_experience?: number | null;
  current_company?: string | null;
  resume_url?: string;
  status: string;
  notes?: string | null;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featured_image: string | null;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  created_at: string;
  status: string;
}
