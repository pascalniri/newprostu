import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Public endpoint to fetch all active topics
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("topics")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching topics:", error);
      return NextResponse.json(
        { success: false, message: "Error fetching topics" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Topics fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
