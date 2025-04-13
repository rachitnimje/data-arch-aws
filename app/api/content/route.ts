import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

// GET /api/content - Get all page content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get("page")

    let data
    if (page) {
      data = await prisma.page_content.findMany({
        where: { page },
      })
    } else {
      data = await prisma.page_content.findMany()
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/content - Create or update page content (admin only)
export async function POST(request: NextRequest) {
  try {
    // In a real app, you would check for admin authentication here

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["page", "section", "content"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if the content already exists
    const existingContent = await prisma.page_content.findFirst({
      where: {
        page: body.page,
        section: body.section,
      },
    })

    let result
    if (existingContent) {
      // Update existing content
      result = await prisma.page_content.update({
        where: { id: existingContent.id },
        data: {
          content: body.content,
          updated_at: new Date(),
        },
      })
    } else {
      // Create new content
      result = await prisma.page_content.create({
        data: {
          page: body.page,
          section: body.section,
          content: body.content,
          updated_at: new Date(),
        },
      })
    }

    // Revalidate the page to update the cache
    revalidatePath(`/${body.page}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
