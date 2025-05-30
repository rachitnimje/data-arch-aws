import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createToken, setAuthCookie } from "@/lib/auth"
import { validateCsrfToken } from "@/lib/csrf"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()

    // Validate CSRF token
    const csrfToken = request.cookies.get("csrf_token")?.value
    if (!csrfToken || !body.csrf_token || !validateCsrfToken(csrfToken, body.csrf_token)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Authenticate the user
    const user = await authenticateUser(body.username, body.password)
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Create a JWT token
    const token = await createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    })

    if (!token) {
      return NextResponse.json({ error: "Failed to create authentication token" }, { status: 500 })
    }

    const response = NextResponse.json({ success: true, user })
    await setAuthCookie(token)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
