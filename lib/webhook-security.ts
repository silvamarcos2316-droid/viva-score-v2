/**
 * Webhook Security Utilities
 *
 * Provides signature verification and API key validation for webhook endpoints
 * Uses Web Crypto API for Edge Runtime compatibility
 */

/**
 * Verify webhook signature from Supabase
 *
 * @param payload - The webhook payload (as string)
 * @param signature - The signature from webhook header
 * @param secret - Webhook secret from environment
 * @returns boolean indicating if signature is valid
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Convert secret to crypto key
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // Generate signature
    const dataBuffer = encoder.encode(payload)
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer)

    // Convert to hex string
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Simple comparison (Web Crypto doesn't have timing-safe comparison)
    return signature === expectedSignature
  } catch (error) {
    console.error('[Webhook Security] Signature verification failed:', error)
    return false
  }
}

/**
 * Verify API key from request headers
 *
 * @param apiKey - API key from request header
 * @returns boolean indicating if API key is valid
 */
export function verifyApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false

  const validApiKeys = [
    process.env.N8N_API_KEY,
    process.env.WEBHOOK_API_KEY,
    process.env.ADMIN_API_KEY,
  ].filter(Boolean)

  return validApiKeys.includes(apiKey)
}

/**
 * Rate limiting token bucket for webhook endpoints
 */
export class RateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>()

  constructor(
    private maxTokens: number = 10,
    private refillRate: number = 1, // tokens per second
  ) {}

  /**
   * Check if request should be allowed
   *
   * @param identifier - Unique identifier (IP, API key, etc.)
   * @returns boolean indicating if request is allowed
   */
  checkLimit(identifier: string): boolean {
    const now = Date.now()
    const bucket = this.buckets.get(identifier) || {
      tokens: this.maxTokens,
      lastRefill: now,
    }

    // Refill tokens based on time passed
    const timePassed = (now - bucket.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now

    // Check if we have tokens available
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1
      this.buckets.set(identifier, bucket)
      return true
    }

    this.buckets.set(identifier, bucket)
    return false
  }

  /**
   * Clean up old buckets to prevent memory leaks
   */
  cleanup() {
    const now = Date.now()
    const maxAge = 3600000 // 1 hour

    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.buckets.delete(key)
      }
    }
  }
}

// Global rate limiter instance
export const webhookRateLimiter = new RateLimiter(20, 2) // 20 requests, refill 2/second

// Clean up every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => webhookRateLimiter.cleanup(), 3600000)
}
