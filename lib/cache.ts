interface CacheEntry<T> {
  data: T
  expiry: number
}

interface Cache<T> {
  [key: string]: CacheEntry<T>
}

// Create separate caches for different types of data
export const blogsCache: Cache<any[]> = {}
export const jobsCache: Cache<any[]> = {}
export const contactCache: Cache<any[]> = {}

// Default cache duration (5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000

// Set data in the cache
export function setCachedData<T>(
  cache: Cache<T>, 
  key: string, 
  data: T, 
  duration = DEFAULT_CACHE_DURATION
): void {
  // Clean up old entry if it exists (memory optimization)
  if (key in cache) {
    delete cache[key]
  }
  
  cache[key] = {
    data,
    expiry: Date.now() + duration,
  }
}

// Get data from the cache
export function getCachedData<T>(cache: Cache<T>, key: string): T | null {
  const entry = cache[key]
  
  // Return null if no entry
  if (!entry) {
    return null
  }
  
  // Check if expired
  if (entry.expiry < Date.now()) {
    // Clean up expired entry
    delete cache[key]
    return null
  }
  
  return entry.data
}

// Invalidate specific cache entry
export function invalidateCacheEntry(cache: Cache<any>, key: string): boolean {
  if (key in cache) {
    delete cache[key]
    return true
  }
  return false
}

// Invalidate all entries in a cache
export function invalidateCache(cache: Cache<any>): number {
  const keysCount = Object.keys(cache).length
  
  // More efficient than iterating through keys
  for (const key in cache) {
    if (Object.prototype.hasOwnProperty.call(cache, key)) {
      delete cache[key]
    }
  }
  
  return keysCount
}

// Auto-cleanup function to prevent memory leaks
export function cleanupExpiredEntries<T>(cache: Cache<T>): number {
  const now = Date.now()
  let cleanedCount = 0
  
  for (const key in cache) {
    if (Object.prototype.hasOwnProperty.call(cache, key) && cache[key].expiry < now) {
      delete cache[key]
      cleanedCount++
    }
  }
  
  return cleanedCount
}