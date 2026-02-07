import cloudinary from "../cloudinary";
import {
  FILE_UPLOAD,
  CLOUDINARY_CONFIG,
  ERROR_CODES,
  formatFileSize,
  getFileExtension,
} from "../constants";
import type {
  FileMetadata,
  FileValidationResult,
  CloudinaryUploadResult,
} from "../dtos/submission.dto";

/**
 * Validate uploaded file
 * Checks file size, type, and extension
 */
export function validateFile(file: File): FileValidationResult {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: "No file provided",
    };
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${formatFileSize(FILE_UPLOAD.MAX_SIZE)}`,
    };
  }

  // Check file size is not zero
  if (file.size === 0) {
    return {
      valid: false,
      error: "File is empty",
    };
  }

  // Check file type
  if (!(FILE_UPLOAD.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Allowed types: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Check file extension
  const extension = getFileExtension(file.name);
  if (
    !(FILE_UPLOAD.ALLOWED_EXTENSIONS as readonly string[]).includes(extension)
  ) {
    return {
      valid: false,
      error: `File extension "${extension}" is not allowed`,
    };
  }

  // Get file metadata
  const metadata: FileMetadata = {
    name: sanitizeFilename(file.name),
    size: file.size,
    type: file.type,
    extension,
  };

  return {
    valid: true,
    metadata,
  };
}

/**
 * Sanitize filename
 * Removes special characters and keeps only alphanumeric, dashes, underscores, and dots
 */
export function sanitizeFilename(filename: string): string {
  // Get filename without extension
  const lastDotIndex = filename.lastIndexOf(".");
  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex);

  // Replace spaces with dashes
  // Remove special characters except dashes and underscores
  const sanitized = name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .substring(0, 100); // Limit filename length

  return sanitized + extension;
}

/**
 * Upload file to Cloudinary
 * Returns the secure URL of the uploaded file
 */
export async function uploadToCloudinary(
  file: File,
): Promise<CloudinaryUploadResult> {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate folder path based on date
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const folder = `${CLOUDINARY_CONFIG.FOLDER_PREFIX}/${year}/${month}`;

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: CLOUDINARY_CONFIG.RESOURCE_TYPE,
          // Add timestamp to filename to avoid conflicts
          public_id: `${Date.now()}-${sanitizeFilename(file.name).replace(getFileExtension(file.name), "")}`,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(buffer);
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file to cloud storage");
  }
}

/**
 * Get file metadata
 * Extracts metadata from a file
 */
export function getFileMetadata(file: File): FileMetadata {
  return {
    name: sanitizeFilename(file.name),
    size: file.size,
    type: file.type,
    extension: getFileExtension(file.name),
  };
}

/**
 * Validate file on client side before upload
 * Returns user-friendly error message
 */
export function getClientFileValidationError(file: File | null): string | null {
  if (!file) return null;

  const validation = validateFile(file);
  if (!validation.valid) {
    return validation.error || "Invalid file";
  }

  return null;
}
