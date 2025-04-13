import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { protectRoute } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const redirectResponse = await protectRoute(request)
    if (redirectResponse) {
      return redirectResponse
    }
  }

  // API routes protection
  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/auth/login") &&
    !request.nextUrl.pathname.startsWith("/api/auth/csrf") &&
    !request.nextUrl.pathname.startsWith("/api/contact") &&
    !request.nextUrl.pathname.startsWith("/api/blogs") &&
    !request.nextUrl.pathname.startsWith("/api/jobs") &&
    !request.nextUrl.pathname.startsWith("/api/applications") &&
    !request.nextUrl.pathname.startsWith("/api/upload") &&
    !request.nextUrl.pathname.startsWith("/api/resume-url") &&
    !request.nextUrl.pathname.startsWith("/api/setup")
  ) {
    const redirectResponse = await protectRoute(request)
    if (redirectResponse) {
      return redirectResponse
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
