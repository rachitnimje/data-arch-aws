import { randomBytes } from "crypto"
import { encryptData, decryptData } from "./encryption"

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex")
}

export function createCsrfToken(): { token: string; encrypted: string } {
  const token = generateCsrfToken()
  const expires = Date.now() + 3600 * 1000 // 1 hour expiry
  const data = `${token}|${expires}`
  const encrypted = encryptData(data)

  return { token, encrypted }
}

export function validateCsrfToken(encryptedToken: string, providedToken: string): boolean {
  try {
    const data = decryptData(encryptedToken)
    const [token, expiresStr] = data.split("|")
    const expires = Number.parseInt(expiresStr, 10)

    // Check if token has expired
    if (Date.now() > expires) {
      return false
    }

    // Compare tokens
    return token === providedToken
  } catch (error) {
    return false
  }
}
