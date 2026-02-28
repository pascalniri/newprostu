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

    // Return success with session data for standard users (no admin check required)
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.first_name
          ? `${authData.user.user_metadata.first_name} ${authData.user.user_metadata.last_name || ""}`.trim()
          : authData.user.email?.split("@")[0],
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
