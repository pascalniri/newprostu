import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import cloudinary from "@/lib/cloudinary";
import type { SubmissionFormData } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const postType = formData.get("postType") as string;
    const topic = formData.get("topic") as string;
    const school = formData.get("school") as string;
    const campus = formData.get("campus") as string;
    const gradeLevel = formData.get("gradeLevel") as string;
    const details = formData.get("details") as string;
    const yourName = formData.get("yourName") as string | null;
    const yourSchool = formData.get("yourSchool") as string | null;
    const tags = formData.get("tags") as string;
    const linkUrl = formData.get("linkUrl") as string | null;
    const file = formData.get("file") as File | null;

    // Validate required fields
    if (
      !title ||
      !postType ||
      !topic ||
      !school ||
      !campus ||
      !gradeLevel ||
      !details
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Process tags
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    let attachmentType: "link" | "file" | null = null;
    let attachmentUrl: string | null = null;
    let attachmentFilename: string | null = null;

    // Handle file upload to Cloudinary
    if (file) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `umich-qa/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );

          uploadStream.end(buffer);
        });

        attachmentType = "file";
        attachmentUrl = uploadResult.secure_url;
        attachmentFilename = file.name;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json(
          { success: false, message: "File upload failed" },
          { status: 500 },
        );
      }
    } else if (linkUrl) {
      attachmentType = "link";
      attachmentUrl = linkUrl;
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        title,
        post_type: postType,
        topic,
        school,
        campus,
        grade_level: gradeLevel,
        details,
        author_name: yourName || null,
        author_school: yourSchool || null,
        tags: tagsArray,
        attachment_type: attachmentType,
        attachment_url: attachmentUrl,
        attachment_filename: attachmentFilename,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Database error" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Submission successful! Your question/resource will be reviewed by our team.",
      submissionId: data.id,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET endpoint to fetch pending submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Database error" },
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
