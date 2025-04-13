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
export function setCachedData<T>(cache: Cache<T>, key: string, data: T, duration = DEFAULT_CACHE_DURATION): void {
  cache[key] = {
    data,
    expiry: Date.now() + duration,
  }
}

// Get data from the cache
export function getCachedData<T>(cache: Cache<T>, key: string): T | null {
  const entry = cache[key]

  // Return null if no entry or if expired
  if (!entry || entry.expiry < Date.now()) {
    // Clean up expired entry
    if (entry) {
      delete cache[key]
    }
    return null
  }

  return entry.data
}

// Invalidate specific cache entry
export function invalidateCacheEntry(cache: Cache<any>, key: string): void {
  delete cache[key]
}

// Invalidate all entries in a cache
export function invalidateCache(cache: Cache<any>): void {
  Object.keys(cache).forEach((key) => {
    delete cache[key]
  })
}
