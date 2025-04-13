"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Briefcase } from "lucide-react"
import { memo } from "react"

export interface JobPosition {
  id: string
  title: string
  location: string
  department: string
  type: string
  postedAt: string
  description: string
}

interface JobCardProps {
  job: JobPosition
  index: number
}

// Memoize the component to prevent unnecessary re-renders
export const JobCard = memo(function JobCard({ job, index }: JobCardProps) {
  // Format description to safely display HTML content
  const renderDescription = () => {
    if (!job.description) return null

    // For plain text, just return the first 150 characters
    if (!job.description.includes("<")) {
      return job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description
    }

    // For HTML content, use dangerouslySetInnerHTML with a substring
    // Note: The content should already be sanitized by the server
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: job.description.length > 300 ? `${job.description.substring(0, 300)}...` : job.description,
        }}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-gradient rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{job.title}</h3>

        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-purple-DEFAULT" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-1 text-blue-DEFAULT" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-purple-DEFAULT" />
            <span>{job.postedAt}</span>
          </div>
        </div>

        <div className="text-gray-600 mb-6 line-clamp-3">{renderDescription()}</div>

        <div className="flex justify-between items-center">
          <span className="inline-block bg-purple-light/20 text-purple-dark text-xs px-3 py-1 rounded-full">
            {job.type}
          </span>
          <Link href={`/careers/${job.id}`} prefetch={false} aria-label={`View details for ${job.title} position`}>
            <Button
              variant="default"
              className="bg-purple-dark text-white hover:bg-purple-dark transition-transform hover:scale-105 duration-300"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
})
