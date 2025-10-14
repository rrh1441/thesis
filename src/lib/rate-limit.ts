const WINDOW_STORE = new Map<string, number>();

/**
 * Enforces a simple fixed-window rate limit per key.
 */
export function enforceRateLimit(key: string, windowMs: number) {
  const now = Date.now();
  const lastRequest = WINDOW_STORE.get(key);

  if (lastRequest && now - lastRequest < windowMs) {
    return false;
  }

  WINDOW_STORE.set(key, now);
  return true;
}

export function resetRateLimitForTesting() {
  WINDOW_STORE.clear();
}
