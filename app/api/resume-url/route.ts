import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getSignedUrl } from "@/lib/s3"
import { validateUrl } from "@/lib/validation"

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

    // Get the key from the query string
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json({ error: "Key parameter is required" }, { status: 400 })
    }

    // Validate the key format
    if (key.includes("..") || key.includes("://")) {
      return NextResponse.json({ error: "Invalid key format" }, { status: 400 })
    }

    // Get a signed URL for the file
    const url = await getSignedUrl(key, 300) // 5 minutes expiry

    if (!validateUrl(url)) {
      return NextResponse.json({ error: "Failed to generate valid URL" }, { status: 500 })
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 })
  }
}
