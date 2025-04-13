"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    status: "active",
  })

  useEffect(() => {
    // Fetch job details from the API
    const fetchJob = async () => {
      setIsLoading(true)
      try {
        const jobId = params.id as string
        const response = await fetch(`/api/jobs/${jobId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch job: ${response.status}`)
        }

        const job = await response.json()

        // Convert arrays to strings for textarea fields
        const responsibilitiesText = Array.isArray(job.responsibilities)
          ? job.responsibilities.join("\n")
          : job.responsibilities

        const requirementsText = Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements

        const benefitsText = Array.isArray(job.benefits) ? job.benefits.join("\n") : job.benefits

        setFormData({
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          responsibilities: responsibilitiesText,
          requirements: requirementsText,
          benefits: benefitsText,
          status: job.status || "active",
        })
      } catch (error) {
        console.error("Error fetching job:", error)
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again.",
          variant: "destructive",
        })
        router.push("/admin/jobs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Parse responsibilities, requirements, and benefits as arrays
      const responsibilities = formData.responsibilities
        .split("\n")
        .filter(Boolean)
        .map((item) => item.trim())

      const requirements = formData.requirements
        .split("\n")
        .filter(Boolean)
        .map((item) => item.trim())

      const benefits = formData.benefits
        .split("\n")
        .filter(Boolean)
        .map((item) => item.trim())

      const jobId = params.id as string
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          department: formData.department,
          location: formData.location,
          type: formData.type,
          description: formData.description,
          responsibilities,
          requirements,
          benefits,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      toast({
        title: "Job updated",
        description: "The job post has been successfully updated.",
      })

      router.push("/admin/jobs")
    } catch (error) {
      console.error("Error updating job:", error)
      toast({
        title: "Error",
        description: "There was an error updating the job post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-DEFAULT"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin/jobs">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Job</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., Engineering, Data Science, Marketing"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full min-h-[100px] p-2 border rounded-md"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities *
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Enter each responsibility on a new line"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Enter each responsibility on a new line</p>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Enter each requirement on a new line"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Enter each requirement on a new line</p>
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                Benefits *
              </label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Enter each benefit on a new line"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Enter each benefit on a new line</p>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/jobs">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
