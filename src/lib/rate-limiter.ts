/**
 * Enterprise-Grade Certificate Verification System
 * Rate Limiting for Shivkara Digital & Tech Lab
 * 
 * Features:
 * - In-memory rate limiting (upgradeable to Redis)
 * - Configurable windows and limits
 * - IP-based tracking with privacy hashing
 * - Automatic cleanup of expired entries
 */

import { hashIpAddress } from './certificate-crypto';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface RateLimitConfig {
    windowMs: number;      // Time window in milliseconds
    maxRequests: number;   // Max requests per window
    blockDurationMs: number; // How long to block after violation
}

export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
    windowMs: 60 * 1000,        // 1 minute window
    maxRequests: 30,            // 30 requests per minute
    blockDurationMs: 5 * 60 * 1000  // 5 minute block
};

export const STRICT_RATE_LIMIT: RateLimitConfig = {
    windowMs: 60 * 1000,        // 1 minute window
    maxRequests: 10,            // 10 requests per minute
    blockDurationMs: 15 * 60 * 1000 // 15 minute block
};

// ============================================================================
// RATE LIMITER STORAGE
// ============================================================================

interface RateLimitEntry {
    count: number;
    windowStart: number;
    blockedUntil?: number;
}

// In-memory storage (consider Redis for production with multiple instances)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup(): void {
    if (cleanupTimer) return;

    cleanupTimer = setInterval(() => {
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 minutes

        for (const [key, entry] of rateLimitStore.entries()) {
            if (now - entry.windowStart > maxAge && (!entry.blockedUntil || now > entry.blockedUntil)) {
                rateLimitStore.delete(key);
            }
        }
    }, CLEANUP_INTERVAL);

    // Don't prevent process exit
    cleanupTimer.unref();
}

// Start cleanup on module load
startCleanup();

// ============================================================================
// RATE LIMITER FUNCTIONS
// ============================================================================

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    retryAfter?: number; // Seconds until retry allowed
}

/**
 * Checks if a request should be rate limited.
 * 
 * @param identifier - Unique identifier (usually hashed IP)
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining requests
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_RATE_LIMIT
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // Check if blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
        const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            resetAt: new Date(entry.blockedUntil),
            retryAfter
        };
    }

    // New window or expired window
    if (!entry || now - entry.windowStart >= config.windowMs) {
        rateLimitStore.set(identifier, {
            count: 1,
            windowStart: now
        });

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt: new Date(now + config.windowMs)
        };
    }

    // Within existing window
    const newCount = entry.count + 1;

    if (newCount > config.maxRequests) {
        // Block the identifier
        const blockedUntil = now + config.blockDurationMs;
        rateLimitStore.set(identifier, {
            ...entry,
            count: newCount,
            blockedUntil
        });

        return {
            allowed: false,
            remaining: 0,
            resetAt: new Date(blockedUntil),
            retryAfter: Math.ceil(config.blockDurationMs / 1000)
        };
    }

    // Update count
    rateLimitStore.set(identifier, {
        ...entry,
        count: newCount
    });

    return {
        allowed: true,
        remaining: config.maxRequests - newCount,
        resetAt: new Date(entry.windowStart + config.windowMs)
    };
}

/**
 * Rate limit check using IP address with privacy hashing.
 * 
 * @param ipAddress - Raw IP address
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimitByIP(
    ipAddress: string,
    config: RateLimitConfig = DEFAULT_RATE_LIMIT
): RateLimitResult {
    // Use a consistent hash that doesn't change within the rate limit window
    // (different from audit log hash which uses daily salt)
    const identifier = `ip:${hashIpForRateLimit(ipAddress)}`;
    return checkRateLimit(identifier, config);
}

/**
 * Hash IP for rate limiting (different from audit log hash).
 * Uses a static salt for consistency within the same process.
 */
function hashIpForRateLimit(ipAddress: string): string {
    const crypto = require('crypto');
    const salt = process.env.CERTIFICATE_ID_SECRET || 'default-rate-limit-salt';

    return crypto
        .createHash('sha256')
        .update(`ratelimit:${ipAddress}:${salt}`)
        .digest('hex')
        .substring(0, 16);
}

/**
 * Manually reset rate limit for an identifier.
 * Useful for admin operations.
 */
export function resetRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * Get current rate limit stats (for debugging/monitoring).
 */
export function getRateLimitStats(): {
    totalEntries: number;
    blockedEntries: number;
} {
    const now = Date.now();
    let blockedCount = 0;

    for (const entry of rateLimitStore.values()) {
        if (entry.blockedUntil && now < entry.blockedUntil) {
            blockedCount++;
        }
    }

    return {
        totalEntries: rateLimitStore.size,
        blockedEntries: blockedCount
    };
}

// ============================================================================
// NEXT.JS API ROUTE HELPER
// ============================================================================

/**
 * Extracts IP address from Next.js request headers.
 */
export function getIPFromRequest(request: Request): string {
    // Try various headers in order of preference
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        // Take the first IP if multiple are present
        return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback for local development
    return '127.0.0.1';
}

/**
 * Creates rate limit response headers.
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    const headers: Record<string, string> = {
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetAt.toISOString()
    };

    if (result.retryAfter) {
        headers['Retry-After'] = result.retryAfter.toString();
    }

    return headers;
}
