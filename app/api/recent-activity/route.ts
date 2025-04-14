import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { JobApplication, ContactSubmission } from "@/lib/schema"

// Define an interface for the Prisma result that includes the job relation
interface JobApplicationWithJob extends JobApplication {
  job?: {
    title: string
  } | null
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    // Get recent job applications
    const recentApplications = await prisma.job_applications.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
      include: {
        job: {
          select: {
            title: true,
          },
        },
      },
    })
    // Get recent contact submissions
    const recentContacts = await prisma.contact_submissions.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
    })
    // Format the data for the frontend
    const applications = recentApplications.map((app: JobApplicationWithJob) => ({
      id: app.id,
      type: "application",
      title: `${app.first_name} ${app.last_name} applied for ${app.job?.title || app.job_title || "a position"}`,
      status: app.status,
      date: app.created_at,
    }))
    const contacts = recentContacts.map((contact: ContactSubmission) => ({
      id: contact.id,
      type: "contact",
      title: `${contact.name} sent a message`,
      status: contact.status,
      date: contact.created_at,
    }))
    // Combine and sort by date
    const allActivity = [...applications, ...contacts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
    return NextResponse.json(allActivity)
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}