"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, MessageSquare, Briefcase, Settings, LucideIcon } from "lucide-react"
import RecentActivityCard from "@/components/admin/recent-activity-card"
import { PasswordChangeModal } from "@/components/admin/password-change-modal"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import useSWR from "swr"

// Define types for API response data
interface DashboardData {
  totalApplications: number;
  totalJobs: number;
  totalBlogs: number;
  totalContacts: number;
  newApplicationsCount: number;
  newContactsCount: number;
}

// Extended error interface for fetch errors
interface FetchError extends Error {
  info?: any;
  status?: number;
}

// Type for StatCard props
interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  link: string;
  linkText: string;
}

// Create a fetcher function with proper typing for SWR
const fetcher = async (url: string): Promise<DashboardData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as FetchError;
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export default function AdminDashboard() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  // Optimized SWR configuration with proper typing
  const { data, error, isLoading, mutate } = useSWR<DashboardData, FetchError>(
    '/api/dashboard/counts', 
    fetcher, 
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      dedupingInterval: 60000, // Increased to 60 seconds to reduce API calls
      keepPreviousData: true, // Show previous data while fetching new data
      errorRetryCount: 3, // Limit retry attempts
    }
  );

  // Memoize dashboard data to prevent unnecessary renders
  const dashboardData = useMemo(() => ({
    totalApplications: data?.totalApplications || 0,
    totalJobs: data?.totalJobs || 0,
    totalBlogs: data?.totalBlogs || 0,
    totalContacts: data?.totalContacts || 0,
    newApplicationsCount: data?.newApplicationsCount || 0,
    newContactsCount: data?.newContactsCount || 0,
  }), [data]);

  // Memoize error handling
  const handleRefresh = useCallback(() => {
    toast({
      title: "Refreshing data",
      description: "Dashboard data is being updated..."
    });
    mutate();
  }, [mutate]);

  // Handle error with useMemo
  useMemo(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  // Card renderer to reduce repetitive code
  const StatCard = ({ title, icon, value, link, linkText }: StatCardProps) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? 
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
            value
          }
        </div>
        <p className="text-xs text-muted-foreground">
          <Link href={link} className="text-blue-600 hover:underline">
            {linkText}
          </Link>
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Applications"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          value={dashboardData.totalApplications}
          link="/admin/applications"
          linkText="View all applications"
        />
        
        <StatCard
          title="Active Jobs"
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          value={dashboardData.totalJobs}
          link="/admin/jobs"
          linkText="Manage job listings"
        />
        
        <StatCard
          title="Published Blogs"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          value={dashboardData.totalBlogs}
          link="/admin/blogs"
          linkText="Manage blog posts"
        />
        
        <StatCard
          title="Contact Submissions"
          icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
          value={dashboardData.totalContacts}
          link="/admin/contact"
          linkText="View contact submissions"
        />
      </div>

      <div className="grid gap-4">
        <RecentActivityCard
          newApplicationsCount={dashboardData.newApplicationsCount}
          newContactsCount={dashboardData.newContactsCount}
          isLoading={isLoading}
        />
      </div>

      {isPasswordModalOpen && (
        <PasswordChangeModal 
          isOpen={isPasswordModalOpen} 
          onClose={() => setIsPasswordModalOpen(false)} 
        />
      )}
    </div>
  )
}