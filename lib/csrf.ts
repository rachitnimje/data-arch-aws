import { randomBytes } from "crypto"
import { encryptData, decryptData } from "./encryption"

const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "X-CSRF-Token"
const CSRF_TOKEN_EXPIRY = 3600 * 1000 // 1 hour expiry

// Generate a cryptographically secure random token
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex")
}

// Create a new CSRF token with encryption
export function createCsrfToken(): { token: string; encrypted: string } {
  const token = generateCsrfToken()
  const expires = Date.now() + CSRF_TOKEN_EXPIRY
  const data = `${token}|${expires}`
  const encrypted = encryptData(data)
  
  return { token, encrypted }
}

// Validate a CSRF token
export function validateCsrfToken(encryptedToken: string, providedToken: string): boolean {
  try {
    if (!encryptedToken || !providedToken) {
      return false
    }
    
    const data = decryptData(encryptedToken)
    const parts = data.split("|")
    
    if (parts.length !== 2) {
      return false
    }
    
    const [token, expiresStr] = parts
    const expires = parseInt(expiresStr, 10)
    
    // Check if token has expired
    if (isNaN(expires) || Date.now() > expires) {
      return false
    }
    
    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(token, providedToken)
  } catch (error) {
    console.error("CSRF validation error:", error)
    return false
  }
}

// Simple timing-safe comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}