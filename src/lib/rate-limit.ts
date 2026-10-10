interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory sliding window rate limiter
const rateLimitStore = new Map<string, RateLimitRecord>()

// Clean up stale rate-limit records periodically
if (typeof setInterval !== "undefined") {
  const cleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, 60_000)

  // Avoid keeping server process alive just for cleanup timer
  if (cleanup && typeof cleanup.unref === "function") {
    cleanup.unref()
  }
}

/**
 * Checks whether an action by the given identifier is within rate limits.
 * Default: 5 requests per 10-minute window.
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.count += 1
  return { allowed: true, remaining: limit - record.count }
}
