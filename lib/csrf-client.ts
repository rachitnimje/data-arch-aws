const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "X-CSRF-Token"
const CSRF_TOKEN_EXPIRY = 3600 * 1000 // 1 hour expiry

let cachedToken: string | null = null
let tokenExpiryTime: number = 0

// Function to get CSRF token from cookie and include it in requests
export async function fetchWithCsrf(url: string, options: RequestInit = {}): Promise<Response> {
  // Get the CSRF token from the cookie
  const csrfToken = getCsrfToken()
  
  // Add CSRF token to headers if it exists
  const headers = {
    ...(options.headers || {}),
    ...(csrfToken && { [CSRF_HEADER_NAME]: csrfToken })
  }
  
  // Make the request with the CSRF token
  return fetch(url, {
    ...options,
    headers,
    credentials: "include" // Always include credentials for CSRF protection
  })
}

// Get CSRF token from cookie with caching
export function getCsrfToken(): string | null {
  // Return cached token if it exists and we're in browser environment
  if (typeof window !== "undefined" && cachedToken && Date.now() < tokenExpiryTime) {
    return cachedToken
  }
  
  // Server-side rendering check
  if (typeof document === "undefined") return null
  
  // Extract token from cookie
  const match = document.cookie.match(new RegExp(`(^| )${CSRF_COOKIE_NAME}=([^;]+)`))
  if (match) {
    cachedToken = match[2]
    // Set expiry for cache to 5 minutes less than the actual token expiry
    tokenExpiryTime = Date.now() + (CSRF_TOKEN_EXPIRY - 300000)
    return cachedToken
  }
  
  return null
}

// Create a new CSRF token by calling the API
export async function refreshCsrfToken(): Promise<string | null> {
  try {
    // Clear cached token
    cachedToken = null
    
    const response = await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
      cache: "no-store" // Prevent caching of this security-critical request
    })
    
    if (!response.ok) {
      throw new Error(`CSRF token refresh failed with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Update cache with new token
    if (data.token) {
      cachedToken = data.token
      tokenExpiryTime = Date.now() + (CSRF_TOKEN_EXPIRY - 300000)
    }
    
    return data.token
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error)
    return null
  }
}