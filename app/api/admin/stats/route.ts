import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  const { data: adminData } = await supabaseAdmin
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single();
  return adminData ? user : null;
}

// GET - Fetch statistics for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch statistics in parallel
    const [
      pendingSubmissions,
      approvedContent,
      submissionsByType,
      contentByUniversity,
    ] = await Promise.all([
      supabaseAdmin
        .from("submissions")
        .select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("approved_content")
        .select("id", { count: "exact", head: true }),
      supabaseAdmin.from("submissions").select("post_type"),
      supabaseAdmin.from("approved_content").select("university"),
    ]);

    // Count by type
    const questionCount =
      submissionsByType.data?.filter((s) => s.post_type === "Question")
        .length || 0;
    const resourceCount =
      submissionsByType.data?.filter((s) => s.post_type === "Resource")
        .length || 0;

    // Count by university
    const universityStats =
      contentByUniversity.data?.reduce((acc: any, item: any) => {
        acc[item.university] = (acc[item.university] || 0) + 1;
        return acc;
      }, {}) || {};

    return NextResponse.json({
      success: true,
      data: {
        pendingSubmissions: pendingSubmissions.count || 0,
        approvedContent: approvedContent.count || 0,
        submissionsByType: {
          questions: questionCount,
          resources: resourceCount,
        },
        contentByUniversity: universityStats,
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
