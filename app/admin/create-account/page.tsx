"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { SuccessModal, ErrorModal } from "@/components/admin/create-account-success-modal"

export default function NewAccountPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear username error when user starts typing again
    if (name === 'username' && formError) {
      setFormError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Error",
          description: "Passwords do not match.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // First, hash the password
      const hashResponse = await fetch("/api/auth/generate-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
        }),
      })

      if (!hashResponse.ok) {
        const errorData = await hashResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Password hashing error: ${hashResponse.status}`)
      }

      const { hashedPassword } = await hashResponse.json()

      // Then create the account with the hashed password
      const response = await fetch("/api/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: hashedPassword,
          role: formData.role,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle specific error cases
        if (response.status === 409) {
          // Username already exists
          setFormError(errorData.error || "A user with this username already exists.")
          return
        }
        
        // Check if the error is due to not being admin
        if (response.status === 403 || errorData.error?.includes("admin")) {
          setShowErrorModal(true)
          return
        }
        
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      // Show success modal instead of toast
      setShowSuccessModal(true)
      
      // Reset form
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        role: "admin",
      })
    } catch (error) {
      console.error("Error creating account:", error)
      toast({
        title: "Error",
        description: `There was an error creating the admin account: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create Admin Account</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <Input 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  className={formError ? "border-red-500" : ""}
                />
                {formError && (
                  <p className="mt-1 text-sm text-red-600">{formError}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Success and Error Modals */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false)
          router.push("/admin")
        }} 
      />
      
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
      />
    </div>
  )
}