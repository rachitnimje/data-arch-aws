import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

// Secret key for JWT
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is not set or is too short")
  }
  return secret
}

// Create a JWT token
export async function createToken(payload: any) {
  try {
    const secret = getJwtSecret()
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d") // 1 day expiration
      .sign(new TextEncoder().encode(secret))
    return token
  } catch (error) {
    console.error("Error creating token:", error)
    return null
  }
}

// Verify a JWT token
export async function verifyToken(token: string) {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Compare a password with a hash
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Authenticate a user
export async function authenticateUser(username: string, password: string) {
  try {
    console.log(`Attempting to authenticate user: ${username}`)
    
    // Find the user by username
    const user = await prisma.users.findUnique({
      where: { username }
    })

    if (!user) {
      console.log(`User not found: ${username}`)
      return null
    }

    console.log(`User found: ${user.username} (ID: ${user.id})`)

    // Compare passwords using bcrypt
    const passwordMatch = await comparePasswords(password, user.password)
    console.log(`Password match: ${passwordMatch}`)
    
    if (!passwordMatch) {
      console.log(`Password mismatch for user: ${username}`)
      return null
    }

    // Return user data (excluding password)
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Get the current user from the auth cookie
export async function getCurrentUser() {
  const token = cookies().get("auth_token")?.value
  if (!token) {
    return null
  }
  try {
    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Clear the auth cookie
export function clearAuthCookie() {
  cookies().delete("auth_token")
}

export async function protectRoute(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
 
  if (!token) {
    // Redirect to login if no token exists
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  const payload = await verifyToken(token);
 
  if (!payload) {
    // Redirect to login if token is invalid
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  // User is authenticated, allow the request to proceed
  return null;
}