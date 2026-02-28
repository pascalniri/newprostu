import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { content_id } = await request.json();

    if (!content_id) {
      return NextResponse.json(
        { success: false, message: "Content ID is required" },
        { status: 400 },
      );
    }

    // Call Supabase RPC or just use update if not worrying about concurrency too much.
    // However, an RPC `increment_view_count` would be better for concurrency.
    // For simplicity without declaring an RPC in the DB, we just grab current and update.
    // This is susceptible to race conditions, so for scalable apps, consider a Postgres function.

    // As a more robust solution, we can use Supabase's generated count increment if available,
    // or just fetch and update.
    const { data: content, error: fetchError } = await supabaseAdmin
      .from("approved_content")
      .select("view_count")
      .eq("id", content_id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch content" },
        { status: 500 },
      );
    }

    const newViewCount = (content?.view_count || 0) + 1;

    const { error: updateError } = await supabaseAdmin
      .from("approved_content")
      .update({ view_count: newViewCount })
      .eq("id", content_id);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: "Failed to increment view count" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, view_count: newViewCount });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
