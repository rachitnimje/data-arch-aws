import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { JobApplication } from "@/lib/schema";

interface JobApplicationInput {
  job_id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_url: string;
  years_experience?: string | number | null;
  current_company?: string | null;
  [key: string]: string | number | null | undefined; // Allow additional string-indexed properties
}

// GET /api/applications - Get all job applications (admin only)
export async function GET(request: NextRequest) {
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

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const jobId = searchParams.get("job_id");
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit") as string)
      : 100;
    const offset = searchParams.get("offset")
      ? Number.parseInt(searchParams.get("offset") as string)
      : 0;
    const countOnly = searchParams.get("count") === "true";

    // If count parameter is true, return only the count
    if (countOnly) {
      const count = await prisma.job_applications.count({
        where: {
          ...(status ? { status } : {}),
          ...(jobId ? { job_id: parseInt(jobId, 10) } : {}),
        },
      });

      return NextResponse.json({ count });
    }

    // Build the query for data retrieval
    const data = (await prisma.job_applications.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(jobId ? { job_id: parseInt(jobId, 10) } : {}),
      },
      orderBy: {
        created_at: "desc",
      },
      skip: offset,
      take: limit,
    })) as JobApplication[];

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/applications - Submit a job application
export async function POST(request: NextRequest) {
  try {
    let applicationData: JobApplicationInput = {} as JobApplicationInput;

    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      // Handle FormData submission
      const formData = await request.formData();

      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        applicationData[key] = value.toString();
      }
    } else {
      // Handle JSON submission
      applicationData = (await request.json()) as JobApplicationInput;
    }

    // Validate required fields
    const requiredFields = [
      "job_id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "resume_url",
    ];
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    let jobId: number;
    try {
      jobId = parseInt(applicationData.job_id.toString(), 10);
      if (isNaN(jobId)) {
        return NextResponse.json(
          { error: "job_id must be a valid number" },
          { status: 400 }
        );
      }
    } catch (e) {
      console.error("Error parsing job_id:", e);
      return NextResponse.json(
        { error: "job_id must be a valid number" },
        { status: 400 }
      );
    }

    let yearsExperience: number | null = null;
    if (applicationData.years_experience) {
      try {
        yearsExperience = parseInt(
          applicationData.years_experience.toString(),
          10
        );
        if (isNaN(yearsExperience)) yearsExperience = null;
      } catch (e) {
        console.error("Error parsing years_experience:", e);
        yearsExperience = null;
      }
    }

    const data = (await prisma.job_applications.create({
      data: {
        job_id: jobId, // Now correctly passed as a number
        first_name: applicationData.first_name.toString(),
        last_name: applicationData.last_name.toString(),
        email: applicationData.email.toString(),
        phone: applicationData.phone.toString(),
        years_experience: yearsExperience,
        current_company: applicationData.current_company
          ? applicationData.current_company.toString()
          : null,
        resume_url: applicationData.resume_url.toString(),
        status: "new",
        created_at: new Date(),
      },
    })) as unknown as JobApplication;

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error("Error submitting application:", error);

    // Provide more detailed error information
    if (error && typeof error === "object" && "code" in error) {
      console.error("Database error code:", (error as { code: unknown }).code);
    }

    if (error && typeof error === "object" && "meta" in error) {
      console.error(
        "Database error metadata:",
        (error as { meta: unknown }).meta
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
