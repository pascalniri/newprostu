import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Public endpoint to fetch all dropdown data
export async function GET(request: NextRequest) {
  try {
    // Fetch all dropdown data in parallel
    const [topics, schools, campuses, gradeLevels, universities] =
      await Promise.all([
        supabaseAdmin
          .from("topics")
          .select("*")
          .eq("is_active", true)
          .order("name"),
        supabaseAdmin
          .from("schools")
          .select("*")
          .eq("is_active", true)
          .order("name"),
        supabaseAdmin
          .from("campuses")
          .select("*")
          .eq("is_active", true)
          .order("name"),
        supabaseAdmin
          .from("grade_levels")
          .select("*")
          .eq("is_active", true)
          .order("order_index"),
        supabaseAdmin
          .from("universities")
          .select("*")
          .eq("is_active", true)
          .order("name"),
      ]);

    // Check for errors
    if (
      topics.error ||
      schools.error ||
      campuses.error ||
      gradeLevels.error ||
      universities.error
    ) {
      console.error("Error fetching dropdowns:", {
        topics: topics.error,
        schools: schools.error,
        campuses: campuses.error,
        gradeLevels: gradeLevels.error,
        universities: universities.error,
      });
      return NextResponse.json(
        { success: false, message: "Error fetching dropdown data" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        topics: topics.data || [],
        schools: schools.data || [],
        campuses: campuses.data || [],
        gradeLevels: gradeLevels.data || [],
        universities: universities.data || [],
      },
    });
  } catch (error) {
    console.error("Dropdowns fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
