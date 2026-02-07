import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Public endpoint to fetch all active grade levels
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("grade_levels")
      .select("*")
      .eq("is_active", true)
      .order("order_index");

    if (error) {
      console.error("Error fetching grade levels:", error);
      return NextResponse.json(
        { success: false, message: "Error fetching grade levels" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Grade levels fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
