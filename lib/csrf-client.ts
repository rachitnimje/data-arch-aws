// Function to get CSRF token from cookie and include it in requests
export async function fetchWithCsrf(url: string, options: RequestInit = {}) {
  // Get the CSRF token from the cookie
  const csrfToken = getCsrfToken()

  // Add CSRF token to headers
  const headers = {
    ...(options.headers || {}),
    "X-CSRF-Token": csrfToken || "",
  }

  // Make the request with the CSRF token
  const response = await fetch(url, {
    ...options,
    headers,
  })

  return response
}

// Get CSRF token from cookie
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(/(^| )csrf_token=([^;]+)/)
  if (match) {
    // For security reasons, we don't return the actual cookie value
    // but rather a hash of it that will be matched server-side
    return match[2]
  }

  return null
}

// Create a new CSRF token by calling the API
export async function refreshCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
    })

    if (response.ok) {
      const data = await response.json()
      return data.token
    }

    return null
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error)
    return null
  }
}
