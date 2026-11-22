/**
 * High-concurrency client resilience helpers.
 * - retryWithBackoff: smooth exponential backoff with random jitter to prevent
 *   thundering-herd retry spikes when thousands of visitors are active at once.
 * - checkSubmitCooldown: prevents accidental double/burst form submissions.
 */

const RETRYABLE_ERROR_CODES = new Set([
  'unavailable',
  'deadline-exceeded',
  'resource-exhausted',
  'aborted',
  'internal',
  'auth/network-request-failed'
]);

function isRetryableError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = String((err as { code?: unknown }).code || '').toLowerCase();
  const message = String((err as { message?: unknown }).message || '').toLowerCase();
  if (RETRYABLE_ERROR_CODES.has(code)) return true;
  if (
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('unavailable') ||
    message.includes('timeout') ||
    message.includes('failed to fetch')
  ) {
    return true;
  }
  return false;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number; maxDelayMs?: number } = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 350;
  const maxDelayMs = options.maxDelayMs ?? 3000;

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt >= maxAttempts || !isRetryableError(err)) {
        throw err;
      }
      const expDelay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
      const jitter = Math.round(Math.random() * 180);
      await new Promise((resolve) => setTimeout(resolve, expDelay + jitter));
    }
  }
  throw lastError;
}

const lastSubmissionByKey = new Map<string, number>();

/**
 * Returns remaining cooldown milliseconds (> 0) if the action is still within
 * its cooldown window, or 0 if allowed.
 */
export function getSubmitCooldownRemaining(key: string, cooldownMs = 12_000): number {
  const now = Date.now();
  const prev = lastSubmissionByKey.get(key) ?? 0;
  const elapsed = now - prev;
  if (elapsed < cooldownMs) {
    return cooldownMs - elapsed;
  }
  return 0;
}

export function markSubmitCompleted(key: string): void {
  lastSubmissionByKey.set(key, Date.now());
  // Keep map strictly bounded
  if (lastSubmissionByKey.size > 32) {
    const oldestKey = lastSubmissionByKey.keys().next().value;
    if (oldestKey) lastSubmissionByKey.delete(oldestKey);
  }
}
