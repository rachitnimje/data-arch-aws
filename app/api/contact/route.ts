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

    // Check if we only need the count
    const url = new URL(request.url)
    const countOnly = url.searchParams.get("count") === "true"

    if (countOnly) {
      const count = await prisma.contact_submissions.count()
      return NextResponse.json({ count })
    }

    // Get all contact submissions
    const data = await prisma.contact_submissions.findMany({
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in contact submissions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Insert the contact submission
    const data = await prisma.contact_submissions.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        message: body.message,
        status: "new",
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in contact submission API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
