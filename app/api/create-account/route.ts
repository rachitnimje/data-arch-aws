import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { User } from "@/lib/schema"

// Define an input interface for user creation
interface UserInput {
  username: string
  password: string
  role?: string
  [key: string]: string | undefined 
}

// POST /api/create-account - Create a new admin account (admin only)
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
    // Only allow admin users to create new admin accounts
    if (payload.username !== "admin") {
      return NextResponse.json({ error: "Only the admin can create new admin accounts" }, { status: 403 })
    }
    const body = await request.json() as UserInput
    // Validate required fields
    const requiredFields = ["username", "password"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }
    // Sanitize inputs
    const sanitizedUsername = body.username.trim()
    const sanitizedPassword = body.password.trim()
    const role = body.role || "admin" // Default to admin role
    // Check if the username already exists
    const existingUser = await prisma.users.findUnique({
      where: {
        username: sanitizedUsername
      }
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this username already exists. Please choose a different username." },
        { status: 409 }
      )
    }
    // Create the new user
    try {
      const newUser = await prisma.users.create({
        data: {
          username: sanitizedUsername,
          password: sanitizedPassword,
          role: role,
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
     
      // Convert Date objects to strings to match User interface
      const data = {
        ...newUser,
        created_at: newUser.created_at.toISOString(),
        updated_at: newUser.updated_at.toISOString(),
      } as User;
      // Revalidate any paths that might display user information
      revalidatePath("/admin/accounts");
      return NextResponse.json(data, { status: 201 });
    } catch (error: unknown) {
      console.error("Database error creating user:", error);
     
      // Even though we check explicitly above, still handle the constraint violation as a fallback
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' &&
          'meta' in error && typeof error.meta === 'object' && error.meta !== null &&
          'target' in error.meta && Array.isArray(error.meta.target) &&
          error.meta.target.includes('username')) {
        return NextResponse.json(
          { error: "A user with this username already exists. Please choose a different username." },
          { status: 409 }
        );
      }
     
      throw error; 
    }
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}