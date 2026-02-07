import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContentFilters } from "@/types/database";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const university = searchParams.get("university");
    const type = searchParams.get("type");
    const topic = searchParams.get("topic");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("approved_content")
      .select("*")
      .order("approved_at", { ascending: false });

    // Apply filters
    if (university && university !== "All Universities") {
      query = query.eq("university", university);
    }

    if (type) {
      query = query.eq("post_type", type);
    }

    if (topic) {
      query = query.eq("topic", topic);
    }

    if (search) {
      // Search in title, details, and tags
      query = query.or(`title.ilike.%${search}%,details.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Database error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, content: data });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
