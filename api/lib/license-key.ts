import { randomBytes } from "crypto";

// Alphabet excludes visually ambiguous characters: 0, O, I, 1
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function segment(length: number): string {
  const bytes = randomBytes(length * 2); // oversample to avoid bias
  let result = "";
  for (let i = 0; i < bytes.length && result.length < length; i++) {
    const idx = bytes[i] % CHARS.length;
    // Reject if index falls outside even-distribution range to eliminate bias
    if (bytes[i] < Math.floor(256 / CHARS.length) * CHARS.length) {
      result += CHARS[idx];
    }
  }
  // Fallback: if we couldn't fill without bias (extremely rare), recurse
  return result.length === length ? result : segment(length);
}

/**
 * Generates a cryptographically random Trinity license key.
 * Format: TRIN-XXXX-XXXX-XXXX  (e.g. TRIN-K7MQ-9PBH-Y3ND)
 * Character set excludes 0/O/I/1 to prevent misreading.
 */
export function generateLicenseKey(): string {
  return `TRIN-${segment(4)}-${segment(4)}-${segment(4)}`;
}
