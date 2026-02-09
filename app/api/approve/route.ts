import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ApprovalRequest } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication middleware
    const body: ApprovalRequest = await request.json();
    const { submissionId, action, university } = body;
    console.log("Approve Request:", { submissionId, action, university });

    if (!submissionId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch the submission
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 },
      );
    }

    // Use the provided university override or fall back to the submission's university
    const mappedUniversity = university || submission.university;

    if (action === "approve") {
      if (!mappedUniversity) {
        return NextResponse.json(
          {
            success: false,
            message: "University is required for approval",
          },
          { status: 400 },
        );
      }

      // Insert into approved_content table
      const { error: approveError } = await supabaseAdmin
        .from("approved_content")
        .insert({
          submission_id: submission.id,
          title: submission.title,
          post_type: submission.post_type,
          topic: submission.topic,
          school: submission.school,
          campus: submission.campus,
          grade_level: submission.grade_level,
          details: submission.details,
          author_name: submission.author_name,
          author_school: submission.author_school,
          university: mappedUniversity,
          tags: submission.tags,
          attachment_type: submission.attachment_type,
          attachment_url: submission.attachment_url,
          attachment_filename: submission.attachment_filename,
          approved_at: new Date().toISOString(),
        });

      if (approveError) {
        console.error("Approval error:", approveError);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to approve submission",
            error: approveError.message,
          },
          { status: 500 },
        );
      }
    }

    // Delete from submissions table (whether approved or rejected)
    const { error: deleteError } = await supabaseAdmin
      .from("submissions")
      .delete()
      .eq("id", submissionId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { success: false, message: "Failed to remove submission" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "Submission approved successfully"
          : "Submission rejected successfully",
    });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
