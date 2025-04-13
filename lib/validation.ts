import DOMPurify from "isomorphic-dompurify"

// Validate required fields in a form or request body
export function validateRequiredFields(data: any, requiredFields: string[]): string[] {
  const missingFields = []

  for (const field of requiredFields) {
    if (!data[field]) {
      missingFields.push(field)
    }
  }

  return missingFields
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // First trim the input
  let sanitized = input.trim()

  // Use DOMPurify to sanitize HTML content
  sanitized = DOMPurify.sanitize(sanitized, {
    USE_PROFILES: { html: true },
    // Allow some specific HTML elements and attributes for rich text
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  })

  return sanitized
}

// Validate email format
export function validateEmail(email: string): boolean {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format
export function validatePhone(phone: string): boolean {
  // Basic phone validation (numbers, spaces, +, -, and parentheses)
  const phoneRegex = /^[0-9\s$$$$+-]{7,20}$/
  return phoneRegex.test(phone)
}

// Validate URL format
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
