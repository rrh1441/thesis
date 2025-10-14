import { createHash } from 'crypto';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_ENTRIES = new Map<string, RateLimitEntry>();

export type RateLimitResult =
  | { ok: true; remaining: number; resetIn: number }
  | { ok: false; retryAfter: number };

export function generateClientKey(request: Request, namespace = 'thesis') {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const realIp = request.headers.get('x-real-ip');
  const referer = request.headers.get('referer') ?? '';
  const userAgent = request.headers.get('user-agent') ?? '';

  const ipCandidate = forwardedFor?.split(',')[0]?.trim() || cfConnectingIp || realIp;

  if (ipCandidate) {
    return `${namespace}:${ipCandidate}`;
  }

  const hash = createHash('sha256').update(`${userAgent}|${referer}`).digest('hex').slice(0, 32);
  return `${namespace}:ua:${hash}`;
}

export function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = WINDOW_ENTRIES.get(key);

  if (!entry || now >= entry.resetAt) {
    WINDOW_ENTRIES.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: Math.max(limit - 1, 0), resetIn: windowMs };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: entry.resetAt - now };
  }

  entry.count += 1;
  return { ok: true, remaining: Math.max(limit - entry.count, 0), resetIn: entry.resetAt - now };
}

export function resetRateLimitStore() {
  WINDOW_ENTRIES.clear();
}
