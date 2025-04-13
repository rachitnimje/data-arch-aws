import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

// Encryption key should be stored as an environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "a-secure-encryption-key-of-32-chars"

// Buffer the key to ensure it's 32 bytes (256 bits)
const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))

// Encrypt data
export function encryptData(data: string): string {
  try {
    // Generate an initialization vector
    const iv = randomBytes(16)

    // Create cipher
    const cipher = createCipheriv("aes-256-cbc", key, iv)

    // Encrypt the data
    let encrypted = cipher.update(data, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Return IV and encrypted data as a single string
    return `${iv.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

// Decrypt data
export function decryptData(encryptedData: string): string {
  try {
    // Split the string to get IV and encrypted data
    const [ivHex, encryptedText] = encryptedData.split(":")

    // Convert IV from hex to Buffer
    const iv = Buffer.from(ivHex, "hex")

    // Create decipher
    const decipher = createDecipheriv("aes-256-cbc", key, iv)

    // Decrypt the data
    let decrypted = decipher.update(encryptedText, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}
