import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    // Create sample blog data
    try {
      await prisma.blogs.createMany({
        data: [
          {
            title: "The Future of Data Lakes in the AI Era",
            slug: "future-of-data-lakes-ai-era",
            excerpt:
              "Explore how modern data lakes are evolving to support advanced AI and machine learning workloads.",
            content: "This is a sample blog post about data lakes in the AI era. Replace with your actual content.",
            author: "Alex Johnson",
            category: "Data Architecture",
            tags: ["AI", "Data Lakes", "Machine Learning"],
            featured_image: "/placeholder.svg?height=400&width=600",
            status: "published",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: "5 Best Practices for Cloud Data Migration",
            slug: "best-practices-cloud-data-migration",
            excerpt:
              "Learn the key strategies for a successful cloud data migration that minimizes disruption and maximizes value.",
            content: "This is a sample blog post about cloud data migration. Replace with your actual content.",
            author: "Samantha Chen",
            category: "Cloud",
            tags: ["Cloud Migration", "Best Practices", "Data Strategy"],
            featured_image: "/placeholder.svg?height=400&width=600",
            status: "published",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        ],
        skipDuplicates: true,
      })
    } catch (error) {
      console.error("Error inserting sample data:", error)
      // Continue even if insert fails
    }

    return NextResponse.json({ success: true, message: "Database tables created successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to set up database" },
      { status: 500 },
    )
  }
}
