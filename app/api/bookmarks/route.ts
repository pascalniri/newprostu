import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const { data: bookmarks, error } = await supabaseAdmin
      .from("bookmarks")
      .select("content_id")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json(
        { success: false, message: "Database error fetching bookmarks" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    console.error("Fetch bookmarks error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content_id, user_id } = await request.json();

    if (!content_id || !user_id) {
      return NextResponse.json(
        { success: false, message: "Content ID and User ID are required" },
        { status: 400 },
      );
    }

    // Check if it exists
    const { data: existingBookmark, error: checkError } = await supabaseAdmin
      .from("bookmarks")
      .select("id")
      .eq("user_id", user_id)
      .eq("content_id", content_id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json(
        { success: false, message: "Database error checking bookmark" },
        { status: 500 },
      );
    }

    if (existingBookmark) {
      // Remove bookmark
      const { error: deleteError } = await supabaseAdmin
        .from("bookmarks")
        .delete()
        .eq("id", existingBookmark.id);

      if (deleteError) {
        return NextResponse.json(
          { success: false, message: "Failed to remove bookmark" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Bookmark removed",
        is_bookmarked: false,
      });
    } else {
      // Add bookmark
      const { error: insertError } = await supabaseAdmin
        .from("bookmarks")
        .insert({ user_id, content_id });

      if (insertError) {
        return NextResponse.json(
          { success: false, message: "Failed to add bookmark" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Bookmark added",
        is_bookmarked: true,
      });
    }
  } catch (error) {
    console.error("Bookmark toggle error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
