import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Job } from "@/lib/schema"

// Interface for job input when creating a new job
interface JobInput {
  title: string;
  location: string;
  department: string;
  type: string;
  description: string;
  responsibilities?: string | string[];
  requirements?: string | string[];
  benefits?: string | string[];
  status?: "active" | "inactive";
  [key: string]: any;
}

// Helper function to parse list fields
function parseListField(field: string | string[] | undefined): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  return field.split("\n").filter(Boolean).map(item => item.trim());
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/gi, "-");
}

// GET /api/jobs - Get all jobs (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as "active" | "inactive" | null
    const department = searchParams.get("department")
    const countOnly = searchParams.has("count") && searchParams.get("count") === "true"

    const where = {
      ...(status ? { status } : {}),
      ...(department ? { department } : {}),
    };

    if (countOnly) {
      const count = await prisma.jobs.count({ where });
      return NextResponse.json({ count: count || 0 });
    }

    const data = await prisma.jobs.findMany({
      where,
      orderBy: { created_at: "desc" },
    }) as unknown as Job[];

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json() as JobInput;

    // Validate required fields
    const requiredFields = ["title", "location", "department", "type", "description"];
    const missingField = requiredFields.find(field => !body[field]);
    
    if (missingField) {
      return NextResponse.json({ 
        error: `${missingField} is required` 
      }, { status: 400 });
    }

    // Generate a URL-friendly slug from the title
    const slug = generateSlug(body.title);

    // Parse list fields
    const responsibilities = parseListField(body.responsibilities);
    const requirements = parseListField(body.requirements);
    const benefits = parseListField(body.benefits);

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
      }) as unknown as Job;

      // Revalidate the careers page to update the cache
      revalidatePath("/careers");
      revalidatePath("/admin/jobs");

      return NextResponse.json(data, { status: 201 });
    } catch (error: unknown) {
      // Check for unique constraint violation on slug
      if (
        error && 
        typeof error === 'object' && 
        'code' in error && 
        error.code === 'P2002' && 
        'meta' in error && 
        error.meta && 
        typeof error.meta === 'object' && 
        'target' in error.meta && 
        Array.isArray(error.meta.target) && 
        error.meta.target.includes('slug')
      ) {
        return NextResponse.json(
          { error: "A job with this title already exists. Please use a different title." }, 
          { status: 409 }
        );
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error: unknown) {
    console.error("Error creating job:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}