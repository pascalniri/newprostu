import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Create user with explicit email auto-confirm via admin API
    const { data: createdUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (createError) {
      return NextResponse.json(
        { success: false, message: createError.message },
        { status: 400 },
      );
    }

    if (!createdUser.user) {
      return NextResponse.json(
        { success: false, message: "Registration failed" },
        { status: 400 },
      );
    }

    // Immediately sign them in to return a session
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user || !authData.session) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration succeeded but auto-login failed",
        },
        { status: 400 },
      );
    }

    // Return success with session data
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: `${firstName} ${lastName}`.trim(),
      },
      session: authData.session,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
