import { z } from "zod";
import { TEXT_LIMITS, FILE_UPLOAD, URL_CONFIG, SUBMISSION } from "../constants";

/**
 * Submission DTOs (Data Transfer Objects)
 * Type-safe interfaces for submission requests and responses
 */

// Zod schema for server-side validation
export const createSubmissionSchema = z.object({
  title: z
    .string()
    .min(
      TEXT_LIMITS.TITLE.MIN,
      `Title must be at least ${TEXT_LIMITS.TITLE.MIN} characters`,
    )
    .max(
      TEXT_LIMITS.TITLE.MAX,
      `Title must not exceed ${TEXT_LIMITS.TITLE.MAX} characters`,
    )
    .trim(),

  postType: z.enum(["Question", "Resource"]),

  topic: z.string().min(1, "Topic is required").trim(),

  school: z.string().min(1, "School is required").trim(),

  university: z.string().min(1, "University is required").trim(),

  campus: z.string().min(1, "Campus is required").trim(),

  gradeLevel: z.string().min(1, "Grade level is required").trim(),

  details: z
    .string()
    .min(
      TEXT_LIMITS.DETAILS.MIN,
      `Details must be at least ${TEXT_LIMITS.DETAILS.MIN} characters`,
    )
    .max(
      TEXT_LIMITS.DETAILS.MAX,
      `Details must not exceed ${TEXT_LIMITS.DETAILS.MAX} characters`,
    )
    .trim(),

  yourName: z
    .string()
    .max(
      TEXT_LIMITS.NAME.MAX,
      `Name must not exceed ${TEXT_LIMITS.NAME.MAX} characters`,
    )
    .trim()
    .optional()
    .nullable(),

  yourSchool: z
    .string()
    .max(
      TEXT_LIMITS.SCHOOL_NAME.MAX,
      `School name must not exceed ${TEXT_LIMITS.SCHOOL_NAME.MAX} characters`,
    )
    .trim()
    .optional()
    .nullable(),

  tags: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return [];
      return val
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(
          (tag) => tag.length > 0 && tag.length <= TEXT_LIMITS.TAG.MAX_LENGTH,
        )
        .slice(0, TEXT_LIMITS.TAG.MAX_COUNT);
    }),

  linkUrl: z
    .string()
    .url("Please enter a valid URL")
    .max(
      URL_CONFIG.MAX_LENGTH,
      `URL must not exceed ${URL_CONFIG.MAX_LENGTH} characters`,
    )
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return (URL_CONFIG.ALLOWED_PROTOCOLS as readonly string[]).includes(
            parsed.protocol,
          );
        } catch {
          return false;
        }
      },
      { message: "URL must use HTTP or HTTPS protocol" },
    )
    .optional()
    .nullable(),
});

// TypeScript type inferred from Zod schema
export type CreateSubmissionDTO = z.infer<typeof createSubmissionSchema>;

// File metadata interface
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  extension: string;
}

// File validation result
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  metadata?: FileMetadata;
}

// Submission response DTO
export interface SubmissionResponseDTO {
  success: true;
  message: string;
  data: {
    id: string;
    status: string;
    created_at: string;
  };
}

// Validation error DTO
export interface ValidationErrorDTO {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

// Generic error response DTO
export interface ErrorResponseDTO {
  success: false;
  message: string;
  code: string;
  details?: string;
}

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Cloudinary upload result
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
}
