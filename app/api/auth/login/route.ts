import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    // Debug logging
    console.log("Admin check - User ID:", authData.user.id);
    console.log("Admin check - Data:", adminData);
    console.log("Admin check - Error:", adminError);

    if (adminError || !adminData) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied - admin privileges required",
          debug: {
            userId: authData.user.id,
            error: adminError?.message || "No admin record found",
          },
        },
        { status: 403 },
      );
    }

    // Return success with session data
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      session: authData.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
