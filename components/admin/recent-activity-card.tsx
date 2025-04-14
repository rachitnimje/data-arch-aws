"use client"

import { memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Inbox, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LoadingAnimation } from "../loading-animation"

interface RecentActivityProps {
  newApplicationsCount: number
  newContactsCount: number
  isLoading: boolean
}

interface NotificationItemProps {
  count: number
  type: string
  icon: React.ElementType // Type for dynamic Lucide icons
  bgColor: string
  borderColor: string
  textColor: string
  redirectPath: string
}

// Memoize the component to prevent unnecessary re-renders
const RecentActivityCard = memo(({
  newApplicationsCount = 0,
  newContactsCount = 0,
  isLoading = false
}: RecentActivityProps) => {
  const router = useRouter()
  const hasNewItems = newApplicationsCount > 0 || newContactsCount > 0
  
  // Extracted notification card to separate component for better readability
  const NotificationItem = ({ 
    count, 
    type, 
    icon: Icon, 
    bgColor, 
    borderColor, 
    textColor, 
    redirectPath 
  }: NotificationItemProps) => (
    <div className={`p-4 rounded-md ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-2 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">{type}</p>
          <p className="text-sm">
            You have {count} new {type.toLowerCase()}{count !== 1 ? "s" : ""} to review.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 bg-white"
          onClick={() => router.push(redirectPath)}
        >
          View
        </Button>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>New items requiring your attention</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingAnimation />
        ) : hasNewItems ? (
          <div className="space-y-4">
            {newApplicationsCount > 0 && (
              <NotificationItem
                count={newApplicationsCount}
                type="Job Application"
                icon={Bell}
                bgColor="bg-blue-50"
                borderColor="border border-blue-200"
                textColor="text-blue-700"
                redirectPath="/admin/applications?status=new"
              />
            )}
            {newContactsCount > 0 && (
              <NotificationItem
                count={newContactsCount}
                type="Contact Submission"
                icon={Inbox}
                bgColor="bg-yellow-50"
                borderColor="border border-yellow-200"
                textColor="text-yellow-700"
                redirectPath="/admin/contact?status=new"
              />
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
})

RecentActivityCard.displayName = "RecentActivityCard"

export default RecentActivityCard