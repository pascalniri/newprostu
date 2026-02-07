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

// GET - Fetch all schools
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    let query = supabaseAdmin.from("schools").select("*").order("name");
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

// POST - Create new school
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const { name, abbreviation } = await request.json();
    if (!name)
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 },
      );
    const { data, error } = await supabaseAdmin
      .from("schools")
      .insert({ name, abbreviation })
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

// PUT - Update school
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const { id, name, abbreviation, is_active } = await request.json();
    if (!id)
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (abbreviation !== undefined) updateData.abbreviation = abbreviation;
    if (is_active !== undefined) updateData.is_active = is_active;
    const { data, error } = await supabaseAdmin
      .from("schools")
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

// DELETE - Delete school
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
    const { error } = await supabaseAdmin.from("schools").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "School deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
