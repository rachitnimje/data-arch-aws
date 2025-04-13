"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, MessageSquare, Briefcase, Settings } from "lucide-react"
import RecentActivityCard from "@/components/admin/recent-activity-card"
import { PasswordChangeModal } from "@/components/admin/password-change-modal"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import useSWR from "swr"

// Create a fetcher function for SWR
const fetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  return res.json()
}

export default function AdminDashboard() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  // Use SWR to fetch all dashboard data in one request
  const { data, error, isLoading, mutate } = useSWR('/api/dashboard/counts', fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true,
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
  })

  // Handle refresh button click
  const handleRefresh = () => {
    mutate() // This will revalidate the data
    toast({
      title: "Refreshing data",
      description: "Dashboard data is being updated..."
    })
  }

  // Show error toast if there's an error
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load dashboard data. Please try again.",
      variant: "destructive",
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : data?.totalApplications || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/applications" className="text-blue-600 hover:underline">
                View all applications
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : data?.totalJobs || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/jobs" className="text-blue-600 hover:underline">
                Manage job listings
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : data?.totalBlogs || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/blogs" className="text-blue-600 hover:underline">
                Manage blog posts
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : data?.totalContacts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/contact" className="text-blue-600 hover:underline">
                View contact submissions
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <RecentActivityCard
          newApplicationsCount={data?.newApplicationsCount || 0}
          newContactsCount={data?.newContactsCount || 0}
          isLoading={isLoading}
        />
      </div>

      <PasswordChangeModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  )
}
