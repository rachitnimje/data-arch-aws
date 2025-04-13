"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ApplicationFormModalProps {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  jobId: string // Added jobId prop to identify which job is being applied for
}

export function ApplicationFormModal({ isOpen, onClose, jobTitle, jobId }: ApplicationFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

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

    try {
      // Create FormData and append all form fields
      const formData = new FormData()

      // Get form data
      if (formRef.current) {
        const formElements = formRef.current.elements as HTMLFormControlsCollection

        // Append job_id
        formData.append("job_id", jobId)

        // Append form fields
        formData.append("first_name", (formElements.namedItem("firstName") as HTMLInputElement).value)
        formData.append("last_name", (formElements.namedItem("lastName") as HTMLInputElement).value)
        formData.append("email", (formElements.namedItem("email") as HTMLInputElement).value)
        formData.append("phone", (formElements.namedItem("phone") as HTMLInputElement).value)

        // Optional fields
        const yearsExpElement = formElements.namedItem("yearsExperience") as HTMLInputElement
        const currentCompanyElement = formElements.namedItem("currentCompany") as HTMLInputElement

        if (yearsExpElement?.value) {
          formData.append("years_experience", yearsExpElement.value)
        }

        if (currentCompanyElement?.value) {
          formData.append("current_company", currentCompanyElement.value)
        }
      }

      // Append resume file
      formData.append("resume", resumeFile)

      // Submit the form data to the API
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit application")
      }

      toast({
        title: "Application submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      })

      // Reset form
      formRef.current?.reset()
      setResumeFile(null)
      onClose()
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Apply for <span className="gradient-text">{jobTitle}</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-DEFAULT rounded-full p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
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
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
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
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (PDF only) *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${resumeError ? "border-red-300 bg-red-50" : resumeFile ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {resumeFile ? (
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

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-800">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !!resumeError}
                  className="bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT hover:from-blue-dark hover:to-purple-dark text-white transition-all duration-300 hover:shadow-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
