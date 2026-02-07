/**
 * Application Constants
 * Centralized configuration for validation rules and limits
 */

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_TYPES: [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    // Text
    "text/plain",
  ],
  ALLOWED_EXTENSIONS: [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".txt",
  ],
} as const;

// Text Field Limits
export const TEXT_LIMITS = {
  TITLE: {
    MIN: 5,
    MAX: 200,
  },
  DETAILS: {
    MIN: 20,
    MAX: 5000,
  },
  NAME: {
    MAX: 100,
  },
  SCHOOL_NAME: {
    MAX: 200,
  },
  TAG: {
    MAX_LENGTH: 30,
    MAX_COUNT: 10,
  },
} as const;

// URL Validation
export const URL_CONFIG = {
  MAX_LENGTH: 2000,
  ALLOWED_PROTOCOLS: ["http:", "https:"],
} as const;

// Submission Configuration
export const SUBMISSION = {
  POST_TYPES: ["Question", "Resource"] as const,
  STATUSES: ["pending", "reviewing", "approved", "rejected"] as const,
  ATTACHMENT_TYPES: ["link", "file"] as const,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Validation Errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_URL: "INVALID_URL",
  TOO_MANY_TAGS: "TOO_MANY_TAGS",

  // Upload Errors
  UPLOAD_FAILED: "UPLOAD_FAILED",
  FILE_PROCESSING_ERROR: "FILE_PROCESSING_ERROR",

  // Database Errors
  DATABASE_ERROR: "DATABASE_ERROR",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",

  // Server Errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
} as const;

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  FOLDER_PREFIX: "umich-qa",
  RESOURCE_TYPE: "auto" as const,
} as const;

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Helper function to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf(".")).toLowerCase();
}
