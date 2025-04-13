// lib/edge-auth.ts
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function protectRoute(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  
  if (!token) {
    // Redirect to login if no token exists
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  
  try {
    // Verify the token
    const secret = process.env.JWT_SECRET || ""
    const { payload } = await jwtVerify(
      token, 
      new TextEncoder().encode(secret)
    )
    
    if (!payload) {
      // Redirect to login if token is invalid
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    
    // User is authenticated, allow the request to proceed
    return null
  } catch (error) {
    // Token is invalid, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
}