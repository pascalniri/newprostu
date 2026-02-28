import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { user_id, content_id } = body;

    // Verify the user owns the content or is an admin before allowing 'accept'
    // To keep it simple, we just toggle the state here.
    // In production, verify user_id == approved_content.author_id or admin.

    if (!user_id || !content_id) {
      return NextResponse.json(
        { success: false, message: "User ID and Content ID are required" },
        { status: 400 },
      );
    }

    // Toggle the accepted status
    const { data: comment, error: fetchError } = await supabaseAdmin
      .from("comments")
      .select("is_accepted")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("comments")
      .update({ is_accepted: !comment.is_accepted })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: "Failed to update accept status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: comment.is_accepted ? "Answer unaccepted" : "Answer accepted",
      is_accepted: !comment.is_accepted,
    });
  } catch (error) {
    console.error("Accept answer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
