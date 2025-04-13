"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Calendar, Briefcase, Clock } from "lucide-react"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import type { Job } from "@/lib/supabase"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/jobs/${params.id}`, {
          // Add cache control headers
          headers: {
            "Cache-Control": "max-age=300", // Cache for 5 minutes
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Job not found")
          }
          throw new Error(`Failed to fetch job: ${response.status}`)
        }

        const data = await response.json()
        setJob(data)
      } catch (err) {
        console.error("Error fetching job:", err)
        setError(err instanceof Error ? err.message : "Failed to load job details")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id, router])

  if (error || !job) {
    return (
      <PageLayout isLoading={isLoading}>
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">{error === "Job not found" ? "Job Not Found" : "Error"}</h1>
          <p className="text-gray-600 mb-8">
            {error === "Job not found"
              ? "The job you're looking for doesn't exist or has been removed."
              : "There was an error loading this job. Please try again later."}
          </p>
          <Link href="/careers">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers
            </Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout isLoading={isLoading}>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="outline" className="mb-6 flex items-center" onClick={() => router.push("/careers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all jobs
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-gradient rounded-lg p-8 shadow-lg"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{job.title}</h1>

            <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-DEFAULT" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-DEFAULT" />
                <span>{job.department}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-DEFAULT" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-DEFAULT" />
                <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
              <p className="text-gray-700">{job.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.responsibilities && job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements && job.requirements.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Benefits</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.benefits && job.benefits.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div className="mt-8 text-center">
              <Link href={`/careers/${params.id}/apply`}>
                <Button className="bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT hover:from-blue-dark hover:to-purple-dark text-white px-8 py-6 rounded-md text-lg transition-all duration-300 hover:shadow-lg">
                  Apply Now
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                Or email your resume to{" "}
                <a href="mailto:careers@dataarch.co" className="text-purple-DEFAULT hover:underline">
                  careers@dataarch.co
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}
