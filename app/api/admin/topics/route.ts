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

// GET - Fetch all topics (including inactive for admin)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    let query = supabaseAdmin.from("topics").select("*").order("name");

    // If not admin, only show active topics
    if (!user) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching topics:", error);
      return NextResponse.json(
        { success: false, message: "Error fetching topics" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Topics fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new topic (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("topics")
      .insert({ name, description })
      .select()
      .single();

    if (error) {
      console.error("Error creating topic:", error);
      return NextResponse.json(
        { success: false, message: "Error creating topic" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Topic creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update topic (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id, name, description, is_active } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from("topics")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating topic:", error);
      return NextResponse.json(
        { success: false, message: "Error updating topic" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Topic update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete topic (admin only)
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

    const { error } = await supabaseAdmin.from("topics").delete().eq("id", id);

    if (error) {
      console.error("Error deleting topic:", error);
      return NextResponse.json(
        { success: false, message: "Error deleting topic" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: "Topic deleted" });
  } catch (error) {
    console.error("Topic deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
