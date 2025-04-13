"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RecentActivityProps {
  newApplicationsCount?: number
  newContactsCount?: number
  isLoading?: boolean
}

export default function RecentActivityCard({ 
  newApplicationsCount = 0, 
  newContactsCount = 0,
  isLoading = false 
}: RecentActivityProps) {
  const router = useRouter()

  const hasNewItems = newApplicationsCount > 0 || newContactsCount > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>New items requiring your attention</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-DEFAULT"></div>
          </div>
        ) : hasNewItems ? (
          <div className="space-y-4">
            {newApplicationsCount > 0 && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-200 text-blue-700">
                <div className="flex items-start">
                  <Bell className="h-5 w-5 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">New Job Applications</p>
                    <p className="text-sm">
                      You have {newApplicationsCount} new job application{newApplicationsCount !== 1 ? "s" : ""} to
                      review.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 bg-white"
                    onClick={() => router.push("/admin/applications?status=new")}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}

            {newContactsCount > 0 && (
              <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700">
                <div className="flex items-start">
                  <Inbox className="h-5 w-5 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">New Contact Submissions</p>
                    <p className="text-sm">
                      You have {newContactsCount} new contact submission{newContactsCount !== 1 ? "s" : ""} to review.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 bg-white"
                    onClick={() => router.push("/admin/contact?status=new")}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-md bg-gray-50 border border-gray-200 text-gray-500">
            <p className="text-center">Nothing new to show</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
