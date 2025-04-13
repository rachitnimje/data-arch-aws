// app/api/auth/csrf/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createCsrfToken } from "@/lib/csrf"

export async function GET(request: NextRequest) {
  try {
    // Generate a new CSRF token
    const { token, encrypted } = createCsrfToken()

    // Create the response with the CSRF token
    const response = NextResponse.json({ token })
    
    // Set the encrypted token as a cookie
    response.cookies.set({
      name: "csrf_token",
      value: encrypted,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    })

    return response
  } catch (error) {
    console.error("Error generating CSRF token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}