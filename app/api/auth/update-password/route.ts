import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify user via token
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
    const { password, confirmPassword, currentPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is required" },
        { status: 400 },
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Verify current password
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email!, // Email is guaranteed from getUser
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { success: false, message: "Invalid current password" },
        { status: 400 },
      );
    }

    // Update password using admin client
    // Since we are using the service role key, we have admin privileges
    const { data: updateData, error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: password,
      });

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update password",
          details: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
