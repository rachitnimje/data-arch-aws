"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, Eye, Download, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import type { JobApplication } from "@/lib/schema"
import { useRouter } from "next/navigation"

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof JobApplication>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({})
  const [isDownloading, setIsDownloading] = useState<Record<number, boolean>>({})
  const router = useRouter()

  // Use useCallback to memoize the fetch function
  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Use Promise.all to fetch jobs and applications in parallel
      const [jobsResponse, applicationsResponse] = await Promise.all([
        fetch("/api/jobs", {
          headers: {
            "Cache-Control": "max-age=300", // Cache for 5 minutes
          },
        }),
        fetch("/api/applications")
      ]);

      if (!applicationsResponse.ok) {
        throw new Error(`Failed to fetch applications: ${applicationsResponse.status}`)
      }

      const titles: Record<string, string> = {}
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json()
        jobsData.forEach((job: any) => {
          titles[job.id] = job.title
        })
        setJobTitles(titles)
      }

      const data = await applicationsResponse.json()

      // Add job titles to applications data to avoid separate API calls later
      const enhancedData = data.map((app: JobApplication) => ({
        ...app,
        job_title: titles[app.job_id] || "Unknown Position",
      }))

      setApplications(enhancedData)
    } catch (err) {
      console.error("Error fetching applications:", err)
      setError("Failed to load job applications")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleSort = useCallback((field: keyof JobApplication) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
        return prev
      }
      setSortDirection("asc")
      return field
    })
  }, [])

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete application: ${response.status}`)
      }

      setApplications((prev) => prev.filter((app) => app.id !== id))

      toast({
        title: "Application deleted",
        description: "The application has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting application:", error)
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  const handleStatusChange = useCallback(async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update application status: ${response.status}`)
      }

      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))

      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus.replace("_", " ")}.`,
      })
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  const handleDownloadResume = useCallback(async (id: number, resumeUrl: string | undefined) => {
    if (!resumeUrl) {
      toast({
        title: "No resume available",
        description: "This application doesn't have a resume attached.",
        variant: "destructive",
      })
      return
    }

    setIsDownloading((prev) => ({ ...prev, [id]: true }))

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
    } finally {
      setIsDownloading((prev) => ({ ...prev, [id]: false }))
    }
  }, [])

  // Memoize filtered applications to prevent unnecessary recalculations
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const fullName = `${app.first_name} ${app.last_name}`.toLowerCase()
        const matchesSearch =
          fullName.includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.job_title && app.job_title.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus = filterStatus ? app.status === filterStatus : true

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        // Fix for potentially undefined values
        const fieldA = a[sortField];
        const fieldB = b[sortField];
        
        // Handle cases where the fields might be undefined
        if (fieldA === undefined && fieldB === undefined) return 0;
        if (fieldA === undefined) return sortDirection === "asc" ? -1 : 1;
        if (fieldB === undefined) return sortDirection === "asc" ? 1 : -1;
        
        // Normal comparison when both values exist
        if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
  }, [applications, searchTerm, filterStatus, sortField, sortDirection])

  const statusOptions = ["new", "in_review", "interviewed", "hired", "rejected"]

  // Helper function to get status class
  const getStatusClass = useCallback((status: string) => {
    switch (status) {
      case "hired":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "in_review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "interviewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
      </div>

      <Card className="mb-8">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search applications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={filterStatus === null ? "default" : "outline"}
                onClick={() => setFilterStatus(null)}
                className="whitespace-nowrap"
              >
                All
              </Button>
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className={`whitespace-nowrap ${
                    status === "hired" ? "hover:bg-green-600" : status === "rejected" ? "hover:bg-red-600" : ""
                  }`}
                >
                  {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-DEFAULT"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">{error}</p>
              <Button className="mt-4" onClick={() => fetchApplications()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        ID
                        {sortField === "id" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("job_id")}
                    >
                      <div className="flex items-center">
                        Position
                        {sortField === "job_id" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("last_name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === "last_name" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        Applied Date
                        {sortField === "created_at" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === "status" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{app.id}</td>
                        <td className="py-3 px-4">{app.job_title || "Unknown Position"}</td>
                        <td className="py-3 px-4">{`${app.first_name} ${app.last_name}`}</td>
                        <td className="py-3 px-4">{new Date(app.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className={`px-2 py-1 rounded text-sm border ${getStatusClass(app.status)}`}
                            aria-label="Change application status"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/applications/${app.id}`)}
                              aria-label="View application details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadResume(app.id, app.resume_url)}
                              disabled={!app.resume_url || isDownloading[app.id]}
                              aria-label="Download resume"
                            >
                              <Download className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(app.id)}
                              aria-label="Delete application"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500">
                        No applications found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}