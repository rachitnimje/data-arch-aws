import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"

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

    // Run all queries in parallel using Promise.all
    const [totalApplications, totalJobs, totalBlogs, totalContacts, newApplicationsCount, newContactsCount] =
      await Promise.all([
        // Total applications count
        prisma.job_applications.count(),

        // Total jobs count
        prisma.jobs.count(),

        // Total blogs count
        prisma.blogs.count(),

        // Total contacts count
        prisma.contact_submissions.count(),

        // New applications count
        prisma.job_applications.count({
          where: { status: "new" },
        }),

        // New contacts count
        prisma.contact_submissions.count({
          where: { status: "new" },
        }),
      ])

    return NextResponse.json({
      totalApplications,
      totalJobs,
      totalBlogs,
      totalContacts,
      newApplicationsCount,
      newContactsCount,
    })
  } catch (error) {
    console.error("Error in dashboard counts API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
