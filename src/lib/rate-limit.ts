let lastThesisRequestAt = 0;

export type CooldownResult =
  | { ok: true }
  | { ok: false; retryAfter: number };

/**
 * Simple single-user cooldown used during early development.
 */
export function enforceThesisCooldown(windowMs: number): CooldownResult {
  const now = Date.now();
  if (now - lastThesisRequestAt < windowMs) {
    return { ok: false, retryAfter: windowMs - (now - lastThesisRequestAt) };
  }

  lastThesisRequestAt = now;
  return { ok: true };
}

export function resetThesisCooldown() {
  lastThesisRequestAt = 0;
}
