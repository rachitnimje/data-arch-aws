export interface RateLimitConfig {
  interval: number
  limit: number
  uniqueTokenPerInterval: number
}

interface RateLimitStore {
  [key: string]: {
    tokens: string[]
    createdAt: number
  }
}

// Use a more efficient store with automatic cleanup
const rateLimitStore: RateLimitStore = {}

// Cleanup function to prevent memory leaks
const cleanupRateLimitStore = () => {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach((key) => {
    if (now - rateLimitStore[key].createdAt > rateLimitStore[key].createdAt + 60000) {
      delete rateLimitStore[key]
    }
  })
}

// Run cleanup every 5 minutes
if (typeof window === "undefined") {
  // Only run on server
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (res: Response, token = "GLOBAL"): Promise<void> => {
      const now = Date.now()
      const storeKey = token

      // Initialize token store
      if (!rateLimitStore[storeKey]) {
        rateLimitStore[storeKey] = {
          tokens: [],
          createdAt: now,
        }
      }

      // Clear expired tokens
      const tokenStore = rateLimitStore[storeKey]
      if (now - tokenStore.createdAt > config.interval) {
        tokenStore.tokens = []
        tokenStore.createdAt = now
      }

      // Check if limit is reached
      if (tokenStore.tokens.length >= config.limit) {
        throw new Error("Rate limit exceeded")
      }

      // Add current token and clean up if needed
      tokenStore.tokens.push(token)
      if (tokenStore.tokens.length > config.uniqueTokenPerInterval) {
        tokenStore.tokens.shift()
      }
    },
  }
}
