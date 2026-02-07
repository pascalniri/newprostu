import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createSubmissionSchema } from "@/lib/dtos/submission.dto";
import { validateFile, uploadToCloudinary } from "@/lib/utils/file-upload.util";
import {
  sanitizeText,
  sanitizeUrl,
  sanitizeTags,
  sanitizeName,
  sanitizeSchoolName,
  getFormDataString,
} from "@/lib/utils/sanitization.util";
import { ERROR_CODES } from "@/lib/constants";
import type {
  SubmissionResponseDTO,
  ValidationErrorDTO,
  ErrorResponseDTO,
} from "@/lib/dtos/submission.dto";

/**
 * POST /api/submissions
 * Create a new submission (question or resource)
 */
export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<SubmissionResponseDTO | ValidationErrorDTO | ErrorResponseDTO>
> {
  try {
    const formData = await request.formData();

    // Extract and sanitize form fields
    const rawData = {
      title: sanitizeText(getFormDataString(formData, "title") || ""),
      postType: getFormDataString(formData, "postType") || "",
      topic: getFormDataString(formData, "topic") || "",
      school: getFormDataString(formData, "school") || "",
      campus: getFormDataString(formData, "campus") || "",
      gradeLevel: getFormDataString(formData, "gradeLevel") || "",
      details: sanitizeText(getFormDataString(formData, "details") || ""),
      yourName: sanitizeName(getFormDataString(formData, "yourName")),
      yourSchool: sanitizeSchoolName(getFormDataString(formData, "yourSchool")),
      tags: getFormDataString(formData, "tags"),
      linkUrl: sanitizeUrl(getFormDataString(formData, "linkUrl")),
    };

    // Validate using Zod schema
    const validationResult = createSubmissionSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: Record<string, string[]> = {};
      validationResult.error.issues.forEach((err: any) => {
        const field = err.path[0] as string;
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(err.message);
      });

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please check your input.",
          code: ERROR_CODES.VALIDATION_ERROR,
          errors,
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // Validate that at least one attachment is provided
    const hasFile =
      formData.get("file") && (formData.get("file") as File).size > 0;
    const hasLink = validatedData.linkUrl;

    if (!hasFile && !hasLink) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide either a file attachment or a link URL",
          code: ERROR_CODES.VALIDATION_ERROR,
          errors: {
            file: ["Either a file or link is required"],
            linkUrl: ["Either a file or link is required"],
          },
        },
        { status: 400 },
      );
    }

    // Process file upload
    const file = formData.get("file") as File | null;
    let attachmentType: "link" | "file" | null = null;
    let attachmentUrl: string | null = null;
    let attachmentFilename: string | null = null;

    // Handle file upload
    if (file && file.size > 0) {
      // Validate file
      const fileValidation = validateFile(file);
      if (!fileValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            message: fileValidation.error || "Invalid file",
            code: ERROR_CODES.INVALID_FILE_TYPE,
          },
          { status: 400 },
        );
      }

      try {
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(file);

        attachmentType = "file";
        attachmentUrl = uploadResult.secure_url;
        attachmentFilename = fileValidation.metadata?.name || file.name;
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return NextResponse.json(
          {
            success: false,
            message:
              "Failed to upload file. Please try again or contact support if the problem persists.",
            code: ERROR_CODES.UPLOAD_FAILED,
            details:
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown error",
          },
          { status: 500 },
        );
      }
    } else if (validatedData.linkUrl) {
      // Use link if no file provided
      attachmentType = "link";
      attachmentUrl = validatedData.linkUrl;
    }

    // Tags are already processed by Zod schema (transformed to array)
    const tagsArray = Array.isArray(validatedData.tags)
      ? validatedData.tags
      : [];

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        title: validatedData.title,
        post_type: validatedData.postType,
        topic: validatedData.topic,
        school: validatedData.school,
        campus: validatedData.campus,
        grade_level: validatedData.gradeLevel,
        details: validatedData.details,
        author_name: validatedData.yourName || null,
        author_school: validatedData.yourSchool || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        attachment_type: attachmentType,
        attachment_url: attachmentUrl,
        attachment_filename: attachmentFilename,
        status: "pending",
      })
      .select("id, status, created_at")
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save submission. Please try again.",
          code: ERROR_CODES.DATABASE_ERROR,
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Submission successful! Your question/resource will be reviewed and published soon.",
      data: {
        id: data.id,
        status: data.status,
        created_at: data.created_at,
      },
    });
  } catch (error) {
    console.error("Unexpected submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        code: ERROR_CODES.INTERNAL_ERROR,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/submissions
 * Fetch pending submissions (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid authentication" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: adminData } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!adminData) {
      return NextResponse.json(
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Fetch submissions
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch submissions" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, submissions: data });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
