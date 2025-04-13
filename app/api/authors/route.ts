import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/authors - Get all authors
export async function GET(request: NextRequest) {
  try {
    const data = await prisma.authors.findMany({
      orderBy: {
        first_name: "asc",
      },
    })

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching authors:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/authors - Create a new author
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.first_name) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 })
    }

    const data = await prisma.authors.create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name || null,
        created_at: new Date(),
      },
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating author:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
