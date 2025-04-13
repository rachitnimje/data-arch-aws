import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/jobs/[id] - Get a specific job (public)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Convert string ID from URL to integer
    const id = parseInt(params.id, 10)
    
    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const data = await prisma.jobs.findUnique({
      where: { id },
    })

    if (!data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PUT /api/jobs/[id] - Update a job (admin only)
export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
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

    // Await the params object before accessing the id
    const params = await context.params
    const id = parseInt(params.id, 10)
    
    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }
    
    const body = await request.json()
    
    // First, get the existing job data
    const existingJob = await prisma.jobs.findUnique({
      where: { id },
    })
    
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    
    // Prepare update data with only fields that are provided
    const updateData: any = {
      ...body,
      updated_at: new Date(),
    }
    
    // Process array fields only if they're provided
    if (body.responsibilities !== undefined) {
      updateData.responsibilities = typeof body.responsibilities === "string"
        ? body.responsibilities
            .split("\n")
            .filter(Boolean)
            .map((item: string) => item.trim())
        : body.responsibilities || []
    }
    
    if (body.requirements !== undefined) {
      updateData.requirements = typeof body.requirements === "string"
        ? body.requirements
            .split("\n")
            .filter(Boolean)
            .map((item: string) => item.trim())
        : body.requirements || []
    }
    
    if (body.benefits !== undefined) {
      updateData.benefits = typeof body.benefits === "string"
        ? body.benefits
            .split("\n")
            .filter(Boolean)
            .map((item: string) => item.trim())
        : body.benefits || []
    }

    const data = await prisma.jobs.update({
      where: { id },
      data: updateData,
    })

    // Revalidate the careers page to update the cache
    revalidatePath("/careers")
    revalidatePath(`/careers/${id}`)
    revalidatePath("/admin/jobs")

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Delete a job (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Convert string ID from URL to integer
    const id = parseInt(params.id, 10)
    
    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    await prisma.jobs.delete({
      where: { id },
    })

    // Revalidate the careers page to update the cache
    revalidatePath("/careers")
    revalidatePath("/admin/jobs")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}