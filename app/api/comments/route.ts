import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contentId = searchParams.get("content_id");

    if (!contentId) {
      return NextResponse.json(
        { success: false, message: "Content ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .select("*")
      .eq("content_id", contentId)
      .eq("is_active", true)
      .order("created_at", { ascending: true }); // Chronological order

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Database error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, comments: data });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      content_id,
      content,
      attachment_url,
      attachment_name,
      attachment_type,
      author_name,
      author_id,
    } = body;

    // Basic validation
    if (!content_id || !content) {
      return NextResponse.json(
        { success: false, message: "Content ID and content are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert({
        content_id,
        content,
        // Optional fields
        author_id: author_id || null, // If we have an authenticated user ID
        author_name: author_name || "Anonymous", // Fallback if no specific name
        attachment_url: attachment_url || null,
        attachment_name: attachment_name || null,
        attachment_type: attachment_type || null,
        status: "pending", // Default to pending as per schema
      })
      .select()
      .single();

    if (error) {
      console.error("Create comment error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to create comment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment submitted for approval",
      comment: data,
    });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
