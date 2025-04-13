import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/password"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Check if the user is authenticated and is an admin
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the password from the request body
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    return NextResponse.json({
      success: true,
      hashedPassword,
    })
  } catch (error) {
    console.error("Password generation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An error occurred during password generation",
      },
      { status: 500 },
    )
  }
}
