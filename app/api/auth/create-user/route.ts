import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { hashPassword } from "@/lib/password"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Check if the user is authenticated and is an admin
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user data from the request body
    const { username, password, role = "admin" } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([{ username, password: hashedPassword, role }])
      .select()

    if (error) {
      return NextResponse.json({ error: `Failed to create user: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: { id: data[0].id, username: data[0].username, role: data[0].role },
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An error occurred during user creation",
      },
      { status: 500 },
    )
  }
}
