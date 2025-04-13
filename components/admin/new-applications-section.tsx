"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Bell, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewApplicationsSection({ applications }) {
  const router = useRouter()

  const handleDownloadResume = async (resumeUrl) => {
    if (!resumeUrl) {
      toast({
        title: "No resume available",
        description: "This application doesn't have a resume attached.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`/api/resume-url?key=${encodeURIComponent(resumeUrl)}`)

      if (!res.ok) {
        throw new Error(`Failed to get resume URL: ${res.status}`)
      }

      const { url } = await res.json()
      window.open(url, "_blank")
    } catch (err) {
      console.error("Error downloading resume:", err)
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-blue-700">
          <Bell className="mr-2 h-5 w-5" />
          New Applications
        </CardTitle>
        <CardDescription>These applications have not been reviewed yet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-200">
                <th className="text-left py-3 px-4 font-medium text-blue-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-blue-700">Position</th>
                <th className="text-left py-3 px-4 font-medium text-blue-700">Date</th>
                <th className="text-right py-3 px-4 font-medium text-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-blue-100 hover:bg-blue-100/50">
                  <td className="py-3 px-4">{`${app.first_name} ${app.last_name}`}</td>
                  <td className="py-3 px-4">{app.job_title || "Unknown Position"}</td>
                  <td className="py-3 px-4">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/applications/${app.id}`)}
                        className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadResume(app.resume_url)}
                        disabled={!app.resume_url}
                        className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link href="/admin/applications?status=new">
            <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-100">
              View All New Applications
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
