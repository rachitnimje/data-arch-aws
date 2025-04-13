"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Upload, Check, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import type { Job } from "@/lib/supabase"

export default function JobApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentCompany: "",
    yearsExperience: "",
  })

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/jobs/${params.id}`, {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setResumeFile(null)
      return
    }

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      setResumeError("Please upload a PDF file only")
      setResumeFile(null)
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size should be less than 5MB")
      setResumeFile(null)
      return
    }

    setResumeError(null)
    setResumeFile(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!resumeFile) {
      setResumeError("Please upload your resume")
      return
    }

    setIsSubmitting(true)
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      // First, upload the resume file
      const uploadFormData = new FormData()
      uploadFormData.append("file", resumeFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || "Failed to upload resume")
      }

      const { url, uniqueFileName } = await uploadResponse.json()
      console.log(uniqueFileName)

      // Then, submit the application with the resume URL
      const applicationFormData = new FormData()
      applicationFormData.append("job_id", params.id as string)
      applicationFormData.append("first_name", formData.firstName)
      applicationFormData.append("last_name", formData.lastName)
      applicationFormData.append("email", formData.email)
      applicationFormData.append("phone", formData.phone)

      if (formData.yearsExperience) {
        applicationFormData.append("years_experience", formData.yearsExperience)
      }

      if (formData.currentCompany) {
        applicationFormData.append("current_company", formData.currentCompany)
      }

      // Add the resume URL instead of the file
      applicationFormData.append("resume_url", uniqueFileName)

      const applicationResponse = await fetch("/api/applications", {
        method: "POST",
        body: applicationFormData,
      })

      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json()
        throw new Error(errorData.error || "Failed to submit application")
      }

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "Application submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      })

      // Short delay to show 100% progress before redirecting
      setTimeout(() => {
        router.push("/careers/application-success")
      }, 500)
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error in application process:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

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
          <Link href={`/careers/${params.id}`} className="inline-block mb-6">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to job details
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-gradient rounded-lg p-8 shadow-lg max-w-3xl mx-auto"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Apply for <span className="gradient-text">{job.title}</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Company
                  </label>
                  <Input
                    id="currentCompany"
                    name="currentCompany"
                    type="text"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <Input
                    id="yearsExperience"
                    name="yearsExperience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (PDF only) <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${resumeError ? "border-red-300 bg-red-50" : resumeFile ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"}`}
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    id="resume"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />

                  {isUploading ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center text-purple-DEFAULT">
                        <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        <span>Uploading resume...</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-DEFAULT h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600">{uploadProgress}%</div>
                    </div>
                  ) : resumeFile ? (
                    <div className="flex items-center justify-center text-green-600">
                      <Check className="h-6 w-6 mr-2" />
                      <span>{resumeFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p>Click to upload your resume (PDF only, max 5MB)</p>
                    </div>
                  )}
                </div>

                {resumeError && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{resumeError}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link href={`/careers/${params.id}`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-800"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || !!resumeError}
                  className="bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT hover:from-blue-dark hover:to-purple-dark text-white transition-all duration-300 hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}
