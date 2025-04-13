"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { JobCard, type JobPosition } from "@/components/careers/job-card"
import { JobFilter } from "@/components/careers/job-filter"
import { PageLayout } from "@/components/page-layout"
import type { Job } from "@/lib/supabase"

export default function CareersPage() {
  const [jobListings, setJobListings] = useState<JobPosition[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobPosition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null) // Clear previous errors
    try {
      const response = await fetch("/api/jobs?status=active", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`Failed to fetch jobs: ${response.status}${errorData?.error ? ` - ${errorData.error}` : ""}`)
      }

      const data: Job[] = await response.json()

      // Check if data is an array before mapping
      if (!Array.isArray(data)) {
        console.error("Unexpected data format:", data)
        throw new Error("Received invalid data format from server")
      }

      // Transform the data to match the JobPosition interface
      const transformedJobs: JobPosition[] = data.map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location,
        department: job.department,
        type: job.type,
        postedAt: new Date(job.created_at).toLocaleDateString(),
        description: job.description,
      }))

      setJobListings(transformedJobs)
      setFilteredJobs(transformedJobs)
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError(`${err instanceof Error ? err.message : "Failed to load job listings. Please try again later."}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Memoize filter handlers to prevent unnecessary re-renders
  const handleFilter = useCallback((filtered: JobPosition[]) => {
    setFilteredJobs(filtered)
  }, [])

  // Hero Section animation variants
  const heroVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }),
    [],
  )

  // Feature card animation variants with staggered delay
  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: 0.1 * i,
        },
      }),
    }),
    [],
  )

  return (
    <PageLayout isLoading={isLoading}>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-purple-light/20 to-blue-light/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Find your next career opportunity at DataArch and help us transform how businesses leverage their data
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {error ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">{error}</p>
              <button
                onClick={fetchJobs}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <JobFilter jobs={jobListings} onFilter={handleFilter} />

              {filteredJobs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">No job openings match your criteria.</p>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters or check back later for new opportunities.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-white/80">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Join <span className="gradient-text">DataArch</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer more than just a job. Join us and be part of a team that's shaping the future of data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovative Work",
                description:
                  "Work on cutting-edge data solutions that solve real-world problems for leading organizations across industries.",
              },
              {
                title: "Growth & Development",
                description:
                  "Continuous learning opportunities, mentorship programs, and a clear path for career advancement.",
              },
              {
                title: "Inclusive Culture",
                description:
                  "A diverse and supportive environment where every voice is heard and all perspectives are valued.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="card-gradient p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
