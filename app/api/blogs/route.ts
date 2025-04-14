import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/auth"
import { blogsCache, setCachedData, getCachedData } from "@/lib/cache"
import prisma from "@/lib/prisma"
import { Blog } from "@/lib/schema"

// Define an input interface for blog creation
interface BlogInput {
  title: string
  excerpt?: string
  content: string
  author?: string
  category: string
  tags?: string[] | string
  featured_image?: string | null
  status?: "published" | "draft"
  [key: string]: string | string[] | number | null | undefined
}

// GET /api/blogs - Get all blogs (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const page = searchParams.get("page") ? Math.max(1, Number.parseInt(searchParams.get("page")!)) : 1
    const pageSize = limit || 10
    const offset = (page - 1) * pageSize
    const countOnly = searchParams.has("count") && searchParams.get("count") === "true"

    // Create a cache key based on the request parameters
    const cacheKey = `blogs:${status || "all"}:${category || "all"}:${pageSize}:${page}:${countOnly ? "count" : "full"}`

    // Try to get data from cache first
    const cachedData = getCachedData(blogsCache, cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // If count only is requested, return just the count
    if (countOnly) {
      const count = await prisma.blogs.count({
        where: {
          ...(status ? { status } : {}),
          ...(category ? { category } : {}),
        },
      })

      const result = { count: count || 0 }
      setCachedData(blogsCache, cacheKey, result as any)
      return NextResponse.json(result)
    }

    // Build the query for full data
    const data = await prisma.blogs.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,  // Added content to match Blog interface
        author: true,
        category: true,
        tags: true,
        featured_image: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
      where: {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: {
        created_at: "desc",
      },
      skip: offset,
      take: pageSize,
    }) as Blog[];  // Cast the result to Blog[]

    // Store in cache
    setCachedData(blogsCache, cacheKey, data || [])

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/blogs - Create a new blog (admin only)
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

    const body = await request.json() as BlogInput

    // Validate required fields
    const requiredFields = ["title", "content", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    if (!body.author) {
      return NextResponse.json({ error: "Author information is required" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedTitle = body.title.trim()
    const sanitizedExcerpt = body.excerpt ? body.excerpt.trim() : ""
    const sanitizedContent = body.content
    const sanitizedCategory = body.category.trim()
    const sanitizedAuthor = body.author ? body.author.trim() : undefined

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/gi, "-")

    // Parse tags if they come as a string
    let tags: string[] = []
    if (typeof body.tags === "string") {
      tags = body.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean)
    } else if (Array.isArray(body.tags)) {
      tags = body.tags.map((tag: string) => tag.trim()).filter(Boolean)
    }

    try {
      const data = await prisma.blogs.create({
        data: {
          title: sanitizedTitle,
          slug,
          excerpt: sanitizedExcerpt,
          content: sanitizedContent,
          category: sanitizedCategory,
          author: sanitizedAuthor,
          tags,
          featured_image: body.featured_image || null,
          status: body.status || "draft",
          created_at: new Date(),
          updated_at: new Date(),
        },
      }) as unknown as Blog;  // Cast to Blog type

      // Revalidate the blogs page to update the cache
      revalidatePath("/blogs");
      revalidatePath("/admin/blogs");

      return NextResponse.json(data, { status: 201 });
    } catch (error: unknown) {
      console.error("Database error creating blog:", error);
      
      // Check for unique constraint violation
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' && 
          'meta' in error && typeof error.meta === 'object' && error.meta !== null && 
          'target' in error.meta && Array.isArray(error.meta.target) && 
          error.meta.target.includes('slug')) {
        return NextResponse.json(
          { error: "A blog with this title already exists. Please use a different title." }, 
          { status: 409 }
        );
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error: unknown) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}