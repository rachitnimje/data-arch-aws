// import { type NextRequest, NextResponse } from "next/server"
// import { verifyToken } from "@/lib/auth"
// import prisma from "@/lib/prisma"

// // GET /api/applications - Get all job applications (admin only)
// export async function GET(request: NextRequest) {
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

//     // Get query parameters for filtering and pagination
//     const { searchParams } = new URL(request.url)
//     const status = searchParams.get("status")
//     const jobId = searchParams.get("job_id")
//     const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 100
//     const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset") as string) : 0
//     const countOnly = searchParams.get("count") === "true"

//     // If count parameter is true, return only the count
//     if (countOnly) {
//       const count = await prisma.job_applications.count({
//         where: {
//           ...(status ? { status } : {}),
//           ...(jobId ? { job_id: jobId } : {}),
//         },
//       })

//       return NextResponse.json({ count })
//     }

//     // Build the query for data retrieval
//     const data = await prisma.job_applications.findMany({
//       where: {
//         ...(status ? { status } : {}),
//         ...(jobId ? { job_id: jobId } : {}),
//       },
//       orderBy: {
//         created_at: "desc",
//       },
//       skip: offset,
//       take: limit,
//     })

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error("Error fetching applications:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// // POST /api/applications - Submit a job application
// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()

//     // Validate required fields
//     const requiredFields = ["job_id", "first_name", "last_name", "email", "phone", "resume_url"]
//     for (const field of requiredFields) {
//       if (!formData.get(field)) {
//         return NextResponse.json({ error: `${field} is required` }, { status: 400 })
//       }
//     }

//     // Get the resume URL directly from the form data
//     const resumeUrl = formData.get("resume_url") as string

//     // Create the job application record
//     const data = await prisma.job_applications.create({
//       data: {
//         job_id: formData.get("job_id") as string,
//         first_name: formData.get("first_name") as string,
//         last_name: formData.get("last_name") as string,
//         email: formData.get("email") as string,
//         phone: formData.get("phone") as string,
//         years_experience: formData.get("years_experience")
//           ? Number.parseInt(formData.get("years_experience") as string)
//           : null,
//         current_company: (formData.get("current_company") as string) || null,
//         resume_url: resumeUrl,
//         status: "new",
//         created_at: new Date(),
//       },
//     })

//     return NextResponse.json(data, { status: 201 })
//   } catch (error) {
//     console.error("Error submitting application:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/applications - Get all job applications (admin only)
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

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const jobId = searchParams.get("job_id")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 100
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset") as string) : 0
    const countOnly = searchParams.get("count") === "true"

    // If count parameter is true, return only the count
    if (countOnly) {
      const count = await prisma.job_applications.count({
        where: {
          ...(status ? { status } : {}),
          ...(jobId ? { job_id: parseInt(jobId, 10) } : {}),
        },
      })

      return NextResponse.json({ count })
    }

    // Build the query for data retrieval
    const data = await prisma.job_applications.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(jobId ? { job_id: parseInt(jobId, 10) } : {}),
      },
      orderBy: {
        created_at: "desc",
      },
      skip: offset,
      take: limit,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/applications - Submit a job application
export async function POST(request: NextRequest) {
  try {
    // Log the content type to debug
    console.log("Content-Type:", request.headers.get("content-type"));
    
    let applicationData = {};
    
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      // Handle FormData submission
      const formData = await request.formData();
      
      // Log all form fields for debugging
      console.log("Form data fields:", Array.from(formData.entries()).map(([key]) => key));
      
      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        applicationData[key] = value;
      }
    } else {
      // Handle JSON submission
      applicationData = await request.json();
    }
    
    console.log("Application data:", applicationData);

    // Validate required fields
    const requiredFields = ["job_id", "first_name", "last_name", "email", "phone", "resume_url"];
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Parse numeric fields - CRITICAL FIX: job_id must be an integer
    let jobId;
    try {
      jobId = parseInt(applicationData.job_id.toString(), 10);
      if (isNaN(jobId)) {
        return NextResponse.json({ error: "job_id must be a valid number" }, { status: 400 });
      }
    } catch (e) {
      console.error("Error parsing job_id:", e);
      return NextResponse.json({ error: "job_id must be a valid number" }, { status: 400 });
    }

    // Parse years_experience if provided
    let yearsExperience = null;
    if (applicationData.years_experience) {
      try {
        yearsExperience = parseInt(applicationData.years_experience.toString(), 10);
        if (isNaN(yearsExperience)) yearsExperience = null;
      } catch (e) {
        console.error("Error parsing years_experience:", e);
        yearsExperience = null;
      }
    }

    // Create the job application record
    const data = await prisma.job_applications.create({
      data: {
        job_id: jobId, // Now correctly passed as a number
        first_name: applicationData.first_name.toString(),
        last_name: applicationData.last_name.toString(),
        email: applicationData.email.toString(),
        phone: applicationData.phone.toString(),
        years_experience: yearsExperience,
        current_company: applicationData.current_company ? applicationData.current_company.toString() : null,
        resume_url: applicationData.resume_url.toString(),
        status: "new",
        created_at: new Date(),
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error submitting application:", error);
    
    // Provide more detailed error information
    if (error.code) {
      console.error("Database error code:", error.code);
    }
    
    if (error.meta) {
      console.error("Database error metadata:", error.meta);
    }
    
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}