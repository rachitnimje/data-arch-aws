// import { type NextRequest, NextResponse } from "next/server"
// import { revalidatePath } from "next/cache"
// import { verifyToken } from "@/lib/auth"
// import prisma from "@/lib/prisma"

// // GET /api/jobs/[id] - Get a specific job (public)
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     const data = await prisma.jobs.findUnique({
//       where: { id },
//     })

//     if (!data) {
//       return NextResponse.json({ error: "Job not found" }, { status: 404 })
//     }

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error("Error fetching job:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// // PUT /api/jobs/[id] - Update a job (admin only)
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // Check authentication
//     const token = request.cookies.get("auth_token")?.value
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const payload = await verifyToken(token)
//     if (!payload) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//     }

//     const id = params.id
//     const body = await request.json()

//     // Parse array fields if they come as strings
//     const responsibilities =
//       typeof body.responsibilities === "string"
//         ? body.responsibilities
//             .split("\n")
//             .filter(Boolean)
//             .map((item: string) => item.trim())
//         : body.responsibilities || []

//     const requirements =
//       typeof body.requirements === "string"
//         ? body.requirements
//             .split("\n")
//             .filter(Boolean)
//             .map((item: string) => item.trim())
//         : body.requirements || []

//     const benefits =
//       typeof body.benefits === "string"
//         ? body.benefits
//             .split("\n")
//             .filter(Boolean)
//             .map((item: string) => item.trim())
//         : body.benefits || []

//     const data = await prisma.jobs.update({
//       where: { id },
//       data: {
//         title: body.title,
//         location: body.location,
//         department: body.department,
//         type: body.type,
//         description: body.description,
//         responsibilities,
//         requirements,
//         benefits,
//         status: body.status,
//         updated_at: new Date(),
//       },
//     })

//     // Revalidate the careers page to update the cache
//     revalidatePath("/careers")
//     revalidatePath(`/careers/${id}`)
//     revalidatePath("/admin/jobs")

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error("Error updating job:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// // DELETE /api/jobs/[id] - Delete a job (admin only)
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // Check authentication
//     const token = request.cookies.get("auth_token")?.value
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const payload = await verifyToken(token)
//     if (!payload) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//     }

//     const id = params.id

//     await prisma.jobs.delete({
//       where: { id },
//     })

//     // Revalidate the careers page to update the cache
//     revalidatePath("/careers")
//     revalidatePath("/admin/jobs")

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting job:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }


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

    // Convert string ID from URL to integer
    const id = parseInt(params.id, 10)
    
    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }
    
    const body = await request.json()

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

    const data = await prisma.jobs.update({
      where: { id },
      data: {
        title: body.title,
        location: body.location,
        department: body.department,
        type: body.type,
        description: body.description,
        responsibilities,
        requirements,
        benefits,
        status: body.status,
        updated_at: new Date(),
      },
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