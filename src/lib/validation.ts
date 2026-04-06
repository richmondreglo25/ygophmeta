/**
 * Validation utilities
 * Common validation functions used across the application
 */

/**
 * Checks if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Checks if a value is a valid File object
 */
export function isValidFile(value: unknown): value is File {
  return value instanceof File && value.size > 0;
}

/**
 * Validates required form fields
 */
export function validateRequiredFields(
  fields: Record<string, unknown>,
  required: string[],
): { valid: boolean; missing?: string[] } {
  const missing = required.filter((field) => {
    const value = fields[field];
    if (value instanceof File) {
      return !isValidFile(value);
    }
    return !isNonEmptyString(value);
  });

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Validates a UUID format
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Sanitizes a filename to be filesystem-safe
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();
}

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
