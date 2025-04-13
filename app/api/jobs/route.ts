import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/jobs - Get all jobs (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const department = searchParams.get("department")
    const countOnly = searchParams.has("count") && searchParams.get("count") === "true"

    if (countOnly) {
      const count = await prisma.jobs.count({
        where: {
          ...(status ? { status } : {}),
          ...(department ? { department } : {}),
        },
      })

      return NextResponse.json({ count: count || 0 })
    } else {
      const data = await prisma.jobs.findMany({
        where: {
          ...(status ? { status } : {}),
          ...(department ? { department } : {}),
        },
        orderBy: {
          created_at: "desc",
        },
      })

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/jobs - Create a new job (admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "location", "department", "type", "description"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Generate a URL-friendly slug from the title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/gi, "-")

    // Parse array fields if they come as strings
    const responsibilities =
      typeof body.responsibilities === "string"
        ? body.responsibilities
            .split("\n")
            .filter(Boolean)
            .map((item: string) => item.trim())
        : body.responsibilities || []

    const requirements =
      typeof body.requirements === "string"
        ? body.requirements
            .split("\n")
            .filter(Boolean)
            .map((item: string) => item.trim())
        : body.requirements || []

    const benefits =
      typeof body.benefits === "string"
        ? body.benefits
            .split("\n")
            .filter(Boolean)
            .map((item: string) => item.trim())
        : body.benefits || []

    try {
      // Create job with proper data types 
      const data = await prisma.jobs.create({
        data: {
          slug,
          title: body.title,
          location: body.location,
          department: body.department,
          type: body.type,
          description: body.description,
          responsibilities,
          requirements,
          benefits,
          status: body.status || "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      })

      // Revalidate the careers page to update the cache
      revalidatePath("/careers")
      revalidatePath("/admin/jobs")

      return NextResponse.json(data, { status: 201 })
    } catch (error) {
      console.error("Database error creating job:", error);
      
      // Check for unique constraint violation on slug
      if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
        return NextResponse.json(
          { error: "A job with this title already exists. Please use a different title." }, 
          { status: 409 }
        );
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}