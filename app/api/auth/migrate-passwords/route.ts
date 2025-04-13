import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { hashPassword } from "@/lib/password"
import { getCurrentUser } from "@/lib/auth"

// This endpoint will migrate plain text passwords to hashed passwords
export async function POST(request: Request) {
  try {
    // Check if the user is authenticated and is an admin
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all users with plain text passwords
    const { data: users, error } = await supabaseAdmin.from("users").select("id, username, password")

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Process each user
    const results = []
    for (const user of users) {
      try {
        // Check if the password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        if (user.password.startsWith("$2")) {
          results.push({ username: user.username, status: "already_hashed" })
          continue
        }

        // Hash the password
        const hashedPassword = await hashPassword(user.password)

        // Update the user's password
        const { error: updateError } = await supabaseAdmin
          .from("users")
          .update({ password: hashedPassword })
          .eq("id", user.id)

        if (updateError) {
          results.push({ username: user.username, status: "error", message: updateError.message })
        } else {
          results.push({ username: user.username, status: "success" })
        }
      } catch (userError) {
        results.push({
          username: user.username,
          status: "error",
          message: userError instanceof Error ? userError.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Password migration completed",
      results,
    })
  } catch (error) {
    console.error("Password migration error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An error occurred during password migration",
      },
      { status: 500 },
    )
  }
}
