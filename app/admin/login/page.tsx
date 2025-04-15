"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, User } from "lucide-react"

// Create a separate component that uses useSearchParams
function LoginForm({ defaultFrom = "/admin" }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [csrfToken, setCsrfToken] = useState("")

  const router = useRouter()
  
  // Import useSearchParams dynamically to use in a component wrapped with Suspense
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  const from = searchParams?.get("from") || defaultFrom

  // Fetch CSRF token on component mount
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response = await fetch("/api/auth/csrf", {
          method: "GET",
          credentials: "include", // Important for cookies
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch CSRF token")
        }
        
        const data = await response.json()
        setCsrfToken(data.token)
      } catch (error) {
        console.error("CSRF token error:", error)
        setError("Error initializing security. Please refresh the page.")
      }
    }
    
    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Username and password are required")
      return
    }

    if (!csrfToken) {
      setError("Security token missing. Please refresh the page.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username, 
          password,
          csrf_token: csrfToken 
        }),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Redirect to the original destination or admin dashboard
      router.push(from)
      router.refresh() // Refresh to update server components
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm sm:text-base break-words">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !csrfToken}
            className="w-full flex justify-center items-center py-2 sm:py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-purple-dark hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </>
  )
}

// Create a loading fallback component
function LoginFormLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="animate-pulse bg-gray-200 h-8 sm:h-10 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 h-8 sm:h-10 rounded-md"></div>
      <div className="animate-pulse bg-gray-200 h-8 sm:h-10 rounded-md mt-4"></div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="bg-white p-5 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">DataArch Admin</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Sign in to access the admin dashboard</p>
        </div>

        <Suspense fallback={<LoginFormLoading />}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-xs sm:text-sm text-purple-600 hover:text-purple-500 transition-colors duration-200"
          >
            Return to website
          </Link>
        </div>
      </div>
    </div>
  )
}