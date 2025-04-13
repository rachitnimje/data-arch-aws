import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database connection not initialized. Check your environment variables." },
        { status: 500 },
      )
    }

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "users-schema.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    const { error } = await supabaseAdmin.rpc("exec_sql", { query: sqlQuery })

    if (error) {
      console.error("Error creating users table:", error)
      return NextResponse.json({ error: `Failed to create users table: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Users table created successfully" })
  } catch (error) {
    console.error("Error setting up users table:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to set up users table" },
      { status: 500 },
    )
  }
}
