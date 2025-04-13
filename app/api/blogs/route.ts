// import { type NextRequest, NextResponse } from "next/server"
// import { revalidatePath } from "next/cache"
// import { verifyToken } from "@/lib/auth"
// import { blogsCache, setCachedData, getCachedData } from "@/lib/cache"
// import prisma from "@/lib/prisma"

// // GET /api/blogs - Get all blogs (public)
// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const status = searchParams.get("status")
//     const category = searchParams.get("category")
//     const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
//     const page = searchParams.get("page") ? Math.max(1, Number.parseInt(searchParams.get("page")!)) : 1
//     const pageSize = limit || 10
//     const offset = (page - 1) * pageSize
//     const countOnly = searchParams.has("count") && searchParams.get("count") === "true"

//     // Create a cache key based on the request parameters
//     const cacheKey = `blogs:${status || "all"}:${category || "all"}:${pageSize}:${page}:${countOnly ? "count" : "full"}`

//     // Try to get data from cache first
//     const cachedData = getCachedData(blogsCache, cacheKey)
//     if (cachedData) {
//       return NextResponse.json(cachedData)
//     }

//     // If count only is requested, return just the count
//     if (countOnly) {
//       const count = await prisma.blogs.count({
//         where: {
//           ...(status ? { status } : {}),
//           ...(category ? { category } : {}),
//         },
//       })

//       const result = { count: count || 0 }
//       setCachedData(blogsCache, cacheKey, result)
//       return NextResponse.json(result)
//     }

//     // Build the query for full data
//     const data = await prisma.blogs.findMany({
//       select: {
//         id: true,
//         title: true,
//         slug: true,
//         excerpt: true,
//         author: true,
//         category: true,
//         tags: true,
//         featured_image: true,
//         status: true,
//         created_at: true,
//         updated_at: true,
//       },
//       where: {
//         ...(status ? { status } : {}),
//         ...(category ? { category } : {}),
//       },
//       orderBy: {
//         created_at: "desc",
//       },
//       skip: offset,
//       take: pageSize,
//     })

//     // Store in cache
//     setCachedData(blogsCache, cacheKey, data || [])

//     return NextResponse.json(data || [])
//   } catch (error) {
//     console.error("Error fetching blogs:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// // POST /api/blogs - Create a new blog (admin only)
// export async function POST(request: NextRequest) {
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

//     const body = await request.json()

//     // Validate required fields
//     const requiredFields = ["title", "content", "category"]
//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json({ error: `${field} is required` }, { status: 400 })
//       }
//     }

//     if (!body.author_id && !body.author) {
//       return NextResponse.json({ error: "Author information is required" }, { status: 400 })
//     }

//     // Sanitize inputs
//     const sanitizedTitle = body.title.trim()
//     const sanitizedExcerpt = body.excerpt ? body.excerpt.trim() : ""
//     const sanitizedContent = body.content
//     const sanitizedCategory = body.category.trim()
//     const sanitizedAuthor = body.author ? body.author.trim() : undefined

//     // Generate slug from title
//     const slug = body.title
//       .toLowerCase()
//       .replace(/[^\w\s]/gi, "")
//       .replace(/\s+/gi, "-")

//     // Parse tags if they come as a string
//     let tags = []
//     if (typeof body.tags === "string") {
//       tags = body.tags
//         .split(",")
//         .map((tag) => tag.trim())
//         .filter(Boolean)
//     } else if (Array.isArray(body.tags)) {
//       tags = body.tags.map((tag) => tag.trim()).filter(Boolean)
//     }

//     const data = await prisma.blogs.create({
//       data: {
//         title: sanitizedTitle,
//         slug,
//         excerpt: sanitizedExcerpt,
//         content: sanitizedContent,
//         category: sanitizedCategory,
//         author: sanitizedAuthor,
//         author_id: body.author_id,
//         tags,
//         featured_image: body.featured_image || null,
//         status: body.status || "draft",
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     })

//     // Revalidate the blogs page to update the cache
//     revalidatePath("/blogs")
//     revalidatePath("/admin/blogs")

//     return NextResponse.json(data, { status: 201 })
//   } catch (error) {
//     console.error("Error creating blog:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/auth"
import { blogsCache, setCachedData, getCachedData } from "@/lib/cache"
import prisma from "@/lib/prisma"

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
      setCachedData(blogsCache, cacheKey, result)
      return NextResponse.json(result)
    }

    // Build the query for full data
    const data = await prisma.blogs.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
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
    })

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

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "content", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    if (!body.author_id && !body.author) {
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
    let tags = []
    if (typeof body.tags === "string") {
      tags = body.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    } else if (Array.isArray(body.tags)) {
      tags = body.tags.map((tag) => tag.trim()).filter(Boolean)
    }

    // Handle author_id properly if provided
    let authorId = undefined;
    if (body.author_id) {
      try {
        authorId = parseInt(body.author_id, 10);
        if (isNaN(authorId)) authorId = undefined;
      } catch (e) {
        console.error("Error parsing author_id:", e);
      }
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
      });

      // Revalidate the blogs page to update the cache
      revalidatePath("/blogs");
      revalidatePath("/admin/blogs");

      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error("Database error creating blog:", error);
      
      // Check for unique constraint violation
      if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
        return NextResponse.json(
          { error: "A blog with this title already exists. Please use a different title." }, 
          { status: 409 }
        );
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}