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

// GET - Fetch all grade levels
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    let query = supabaseAdmin
      .from("grade_levels")
      .select("*")
      .order("order_index");
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

// POST - Create new grade level
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const { name, order_index } = await request.json();
    if (!name)
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 },
      );
    const { data, error } = await supabaseAdmin
      .from("grade_levels")
      .insert({ name, order_index })
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

// PUT - Update grade level
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const { id, name, order_index, is_active } = await request.json();
    if (!id)
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (order_index !== undefined) updateData.order_index = order_index;
    if (is_active !== undefined) updateData.is_active = is_active;
    const { data, error } = await supabaseAdmin
      .from("grade_levels")
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

// DELETE - Delete grade level
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
      .from("grade_levels")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Grade level deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
