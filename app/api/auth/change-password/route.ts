// import { type NextRequest, NextResponse } from "next/server"
// import { verifyToken } from "@/lib/auth"
// import { verifyPassword, hashPassword } from "@/lib/password"

// export async function POST(request: NextRequest) {
//   try {
//     // Check authentication
//     const token = request.cookies.get("auth_token")?.value
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     let payload
//     try {
//       payload = await verifyToken(token)
//       if (!payload || !payload.id) {
//         return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//       }
//     } catch (tokenError) {
//       console.error("Token verification error:", tokenError)
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//     }

//     const { currentPassword, newPassword } = await request.json()

//     // Validate input
//     if (!currentPassword || !newPassword) {
//       return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
//     }

//     if (newPassword.length < 8) {
//       return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 })
//     }

//     // Get user from database
//     const { supabaseAdmin } = await import("@/lib/supabase")
//     const { data: user, error: userError } = await supabaseAdmin
//       .from("users")
//       .select("id, password")
//       .eq("id", payload.id)
//       .single()

//     if (userError || !user) {
//       console.error("Error fetching user:", userError)
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Verify current password
//     const isPasswordValid = await verifyPassword(currentPassword, user.password)
//     if (!isPasswordValid) {
//       return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
//     }

//     // Hash new password
//     const hashedPassword = await hashPassword(newPassword)

//     // Update password in database
//     const { error: updateError } = await supabaseAdmin
//       .from("users")
//       .update({ password: hashedPassword, updated_at: new Date().toISOString() })
//       .eq("id", payload.id)

//     if (updateError) {
//       console.error("Error updating password:", updateError)
//       return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error changing password:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { verifyPassword, hashPassword } from "@/lib/password"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const payload = await verifyToken(token)
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    const { currentPassword, newPassword } = await request.json()
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }
    
    // if (newPassword.length < 8) {
    //   return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 })
    // }
    
    // Get user from database using Prisma
    const user = await prisma.users.findUnique({
      where: {
        id: payload.id as number
      },
      select: {
        id: true,
        password: true
      }
    })
    
    if (!user) {
      console.error("User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword)
    
    // Update password in database using Prisma
    await prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedPassword,
        updated_at: new Date()
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}