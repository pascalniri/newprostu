import { TEXT_LIMITS, URL_CONFIG } from "../constants";

/**
 * Sanitization Utilities
 * Functions to clean and validate user input
 */

/**
 * Sanitize text input
 * Removes potentially harmful characters and trims whitespace
 */
export function sanitizeText(text: string, maxLength?: number): string {
  if (!text) return "";

  let sanitized = text
    .trim()
    // Remove null bytes
    .replace(/\0/g, "")
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ");

  // Apply max length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize and validate URL
 * Returns cleaned URL or null if invalid
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const trimmed = url.trim();

    // Check length
    if (trimmed.length > URL_CONFIG.MAX_LENGTH) {
      return null;
    }

    // Parse URL
    const parsed = new URL(trimmed);

    // Check protocol
    if (
      !(URL_CONFIG.ALLOWED_PROTOCOLS as readonly string[]).includes(
        parsed.protocol,
      )
    ) {
      return null;
    }

    // Return the cleaned URL
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize and process tags
 * Returns cleaned, deduplicated array of tags
 */
export function sanitizeTags(tagsInput: string | null | undefined): string[] {
  if (!tagsInput) return [];

  return (
    tagsInput
      .split(",")
      .map((tag) =>
        tag
          .trim()
          .toLowerCase()
          // Remove special characters except dashes and underscores
          .replace(/[^a-z0-9-_\s]/g, "")
          // Replace multiple spaces with single space
          .replace(/\s+/g, " "),
      )
      .filter((tag) => {
        // Filter out empty tags and tags that are too long
        return tag.length > 0 && tag.length <= TEXT_LIMITS.TAG.MAX_LENGTH;
      })
      // Remove duplicates
      .filter((tag, index, self) => self.indexOf(tag) === index)
      // Limit to max count
      .slice(0, TEXT_LIMITS.TAG.MAX_COUNT)
  );
}

/**
 * Sanitize name input
 * Removes special characters but keeps accented characters
 */
export function sanitizeName(name: string | null | undefined): string | null {
  if (!name) return null;

  const sanitized = name
    .trim()
    // Remove null bytes
    .replace(/\0/g, "")
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, "")
    // Remove potentially harmful characters but keep letters, spaces, hyphens, apostrophes
    .replace(/[^a-zA-Z\u00C0-\u017F\s'-]/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .substring(0, TEXT_LIMITS.NAME.MAX);

  return sanitized || null;
}

/**
 * Sanitize school name input
 */
export function sanitizeSchoolName(
  schoolName: string | null | undefined,
): string | null {
  if (!schoolName) return null;

  const sanitized = sanitizeText(schoolName, TEXT_LIMITS.SCHOOL_NAME.MAX);
  return sanitized || null;
}

/**
 * Escape HTML characters
 * Prevents XSS attacks by escaping HTML entities
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate and sanitize FormData field
 * Returns null for invalid or empty values
 */
export function getFormDataString(
  formData: FormData,
  fieldName: string,
): string | null {
  const value = formData.get(fieldName);

  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}
