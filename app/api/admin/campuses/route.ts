import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

// GET - Fetch all campuses
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    let query = supabaseAdmin.from("campuses").select("*").order("name");
    if (!user) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new campus
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const { name, location } = await request.json();
    if (!name)
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 },
      );
    const { data, error } = await supabaseAdmin
      .from("campuses")
      .insert({ name, location })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update campus
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const { id, name, location, is_active } = await request.json();
    if (!id)
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (is_active !== undefined) updateData.is_active = is_active;
    const { data, error } = await supabaseAdmin
      .from("campuses")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete campus
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    const { error } = await supabaseAdmin
      .from("campuses")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Campus deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
