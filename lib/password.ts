import bcrypt from "bcryptjs"

// Hash a password with bcrypt (12 salt rounds)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Compare a plain text password with a hashed password
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Generate a hashed password for initial setup
export async function generateHashedPassword(password: string): Promise<string> {
  const hashedPassword = await hashPassword(password)
  console.log(`Hashed password: ${hashedPassword}`)
  return hashedPassword
}

// Verify a plain text password with a hashed password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}
