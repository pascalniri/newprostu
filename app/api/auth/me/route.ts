import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Fetch admin profile
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("id", user.id)
      .single();

    if (adminError) {
      console.error("Error fetching admin profile:", adminError);
      // If no admin profile exists, we still might want to return basic user info or 404
      // But for this app, users MUST be admins.
      return NextResponse.json(
        { success: false, message: "Admin profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...adminData,
        email: user.email, // Ensure email is from auth
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Prevent updating sensitive fields via this endpoint
    // We assume the body contains fields for the 'admins' table
    // Id and created_at should not be updated.
    // Email is handled by auth, not admins table usually, but we'll exclude it from admins update to be safe
    const { id, created_at, email, ...updateData } = body;

    // Update admin profile
    const { data: updatedAdmin, error: updateError } = await supabaseAdmin
      .from("admins")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update profile",
          details: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedAdmin,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
