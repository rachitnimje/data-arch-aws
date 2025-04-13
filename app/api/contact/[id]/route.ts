import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "Contact submission ID is required" }, { status: 400 })
    }

    const data = await prisma.contact_submissions.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!data) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching contact submission:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/contact/:id - Update a contact submission
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const data = await prisma.contact_submissions.update({
      where: { id: Number.parseInt(params.id) },
      data: updateData,
    })

    // Revalidate paths to update the UI
    revalidatePath("/admin/contact")
    revalidatePath(`/admin/contact/${params.id}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating contact submission:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// For compatibility with PATCH requests that might be used
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Redirect to PUT handler
  return PUT(request, { params })
}

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

    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "Contact submission ID is required" }, { status: 400 })
    }

    await prisma.contact_submissions.delete({
      where: { id: Number.parseInt(id) },
    })

    // Revalidate path to update the UI
    revalidatePath("/admin/contact")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact submission:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
