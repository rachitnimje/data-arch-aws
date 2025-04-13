import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Initialize Prisma client
const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log("Starting migration from Supabase to Prisma...")

    // Migrate blogs
    console.log("Migrating blogs...")
    const { data: blogs, error: blogsError } = await supabase.from("blogs").select("*")
    if (blogsError) {
      throw new Error(`Error fetching blogs: ${blogsError.message}`)
    }

    if (blogs && blogs.length > 0) {
      for (const blog of blogs) {
        await prisma.blogs.create({
          data: {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || null,
            content: blog.content,
            author: blog.author,
            author_id: blog.author_id || null,
            category: blog.category,
            tags: blog.tags || [],
            featured_image: blog.featured_image || null,
            status: blog.status,
            created_at: new Date(blog.created_at),
            updated_at: new Date(blog.updated_at),
          },
        })
      }
      console.log(`Migrated ${blogs.length} blogs`)
    }

    // Migrate jobs
    console.log("Migrating jobs...")
    const { data: jobs, error: jobsError } = await supabase.from("jobs").select("*")
    if (jobsError) {
      throw new Error(`Error fetching jobs: ${jobsError.message}`)
    }

    if (jobs && jobs.length > 0) {
      for (const job of jobs) {
        await prisma.jobs.create({
          data: {
            id: job.id,
            slug: job.slug || null,
            title: job.title,
            location: job.location,
            department: job.department,
            type: job.type,
            description: job.description,
            responsibilities: job.responsibilities || [],
            requirements: job.requirements || [],
            benefits: job.benefits || [],
            status: job.status,
            created_at: new Date(job.created_at),
            updated_at: new Date(job.updated_at),
          },
        })
      }
      console.log(`Migrated ${jobs.length} jobs`)
    }

    // Migrate job applications
    console.log("Migrating job applications...")
    const { data: applications, error: applicationsError } = await supabase.from("job_applications").select("*")
    if (applicationsError) {
      throw new Error(`Error fetching job applications: ${applicationsError.message}`)
    }

    if (applications && applications.length > 0) {
      for (const application of applications) {
        await prisma.job_applications.create({
          data: {
            id: application.id,
            job_id: application.job_id,
            first_name: application.first_name,
            last_name: application.last_name,
            email: application.email,
            phone: application.phone,
            years_experience: application.years_experience || null,
            current_company: application.current_company || null,
            resume_url: application.resume_url,
            status: application.status,
            notes: application.notes || null,
            created_at: new Date(application.created_at),
          },
        })
      }
      console.log(`Migrated ${applications.length} job applications`)
    }

    // Migrate page content
    console.log("Migrating page content...")
    const { data: pageContent, error: pageContentError } = await supabase.from("page_content").select("*")
    if (pageContentError) {
      throw new Error(`Error fetching page content: ${pageContentError.message}`)
    }

    if (pageContent && pageContent.length > 0) {
      for (const content of pageContent) {
        await prisma.page_content.create({
          data: {
            id: content.id,
            page: content.page,
            section: content.section,
            content: content.content,
            updated_at: new Date(content.updated_at),
          },
        })
      }
      console.log(`Migrated ${pageContent.length} page content items`)
    }

    // Migrate authors
    console.log("Migrating authors...")
    const { data: authors, error: authorsError } = await supabase.from("authors").select("*")
    if (authorsError) {
      throw new Error(`Error fetching authors: ${authorsError.message}`)
    }

    if (authors && authors.length > 0) {
      for (const author of authors) {
        await prisma.authors.create({
          data: {
            id: author.id,
            first_name: author.first_name,
            last_name: author.last_name || null,
            created_at: new Date(author.created_at),
          },
        })
      }
      console.log(`Migrated ${authors.length} authors`)
    }

    // Migrate contact submissions
    console.log("Migrating contact submissions...")
    const { data: contacts, error: contactsError } = await supabase.from("contact_submissions").select("*")
    if (contactsError) {
      throw new Error(`Error fetching contact submissions: ${contactsError.message}`)
    }

    if (contacts && contacts.length > 0) {
      for (const contact of contacts) {
        await prisma.contact_submissions.create({
          data: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone || null,
            company: contact.company || null,
            message: contact.message,
            status: contact.status,
            notes: contact.notes || null,
            created_at: new Date(contact.created_at),
          },
        })
      }
      console.log(`Migrated ${contacts.length} contact submissions`)
    }

    // Migrate users
    console.log("Migrating users...")
    const { data: users, error: usersError } = await supabase.from("users").select("*")
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`)
    }

    if (users && users.length > 0) {
      for (const user of users) {
        await prisma.users.create({
          data: {
            id: user.id,
            username: user.username,
            password: user.password,
            email: user.email || null,
            role: user.role,
            created_at: new Date(user.created_at),
            updated_at: new Date(user.updated_at),
          },
        })
      }
      console.log(`Migrated ${users.length} users`)
    }

    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData()
