import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

// GET /api/applications/[id] - Get a specific application (admin only)
export async function GET(
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

    const params = await context.params;
    const id = Number.parseInt(params.id, 10)

    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const data = await prisma.job_applications.findUnique({
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

// PUT /api/applications/[id] - Update a specific application (admin only)
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

    const params = await context.params
    const id = Number.parseInt(params.id, 10)

    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const body = await request.json()

    // Validate the request body
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 })
    }

    // Create an update object with only the fields that are allowed to be updated
    const updateData: Record<string, any> = {}

    // Allow updating status
    if (body.status) {
      updateData.status = body.status
    }

    // Allow updating notes
    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }

    const data = await prisma.job_applications.update({
      where: { id },
      data: updateData,
    })

    // Revalidate paths to update the UI
    revalidatePath("/admin/applications")
    revalidatePath(`/admin/applications/${id}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE /api/applications/[id] - Delete a specific application (admin only)
export async function DELETE(
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

    const params = await context.params
    const id = Number.parseInt(params.id, 10)

    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    await prisma.job_applications.delete({
      where: { id },
    })

    // Revalidate paths to update the UI
    revalidatePath("/admin/applications")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}