"use client"

import { FileText, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ContentManagementPage() {
  const pages = [
    {
      id: "home",
      title: "Home Page",
      description: "Main landing page with hero section, services, testimonials, and more.",
      lastUpdated: "2023-05-15",
    },
    {
      id: "about",
      title: "About Us",
      description: "Company information, mission, vision, values, and team members.",
      lastUpdated: "2023-05-10",
    },
    {
      id: "services",
      title: "Services",
      description: "Details about the services offered by DataArch.",
      lastUpdated: "2023-05-12",
    },
    {
      id: "careers",
      title: "Careers",
      description: "Job listings and company culture information.",
      lastUpdated: "2023-05-08",
    },
    {
      id: "contact",
      title: "Contact",
      description: "Contact information and form.",
      lastUpdated: "2023-05-05",
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-DEFAULT" />
                {page.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{page.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
                </span>
                <Link href={`/admin/content/${page.id}`}>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
