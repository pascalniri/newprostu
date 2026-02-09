import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  // Check if user is admin
  const { data: adminData } = await supabaseAdmin
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single();

  return adminData ? user : null;
}

// GET - Fetch all active universities (public) or all universities (admin)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    let query = supabaseAdmin.from("universities").select("*").order("name");

    // If not admin, only show active universities
    if (!user) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching universities:", error);
      return NextResponse.json(
        { success: false, message: "Error fetching universities" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Universities fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new university (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      name,
      abbreviation,
      color_primary,
      color_secondary,
      latitude,
      longitude,
      is_active,
    } = await request.json();

    if (!name || !abbreviation) {
      return NextResponse.json(
        { success: false, message: "Name and abbreviation are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("universities")
      .insert({
        name,
        abbreviation,
        color_primary,
        color_secondary,
        latitude,
        longitude,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating university:", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Error creating university",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("University creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update university (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      id,
      name,
      abbreviation,
      color_primary,
      color_secondary,
      latitude,
      longitude,
      is_active,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (abbreviation !== undefined) updateData.abbreviation = abbreviation;
    if (color_primary !== undefined) updateData.color_primary = color_primary;
    if (color_secondary !== undefined)
      updateData.color_secondary = color_secondary;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from("universities")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating university:", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Error updating university",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("University update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete university (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("universities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting university:", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Error deleting university",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: "University deleted" });
  } catch (error) {
    console.error("University deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
