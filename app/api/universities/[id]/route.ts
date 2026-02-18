import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ERROR_CODES } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "University ID is required",
          code: ERROR_CODES.VALIDATION_ERROR,
        },
        { status: 400 },
      );
    }

    const { data: university, error } = await supabaseAdmin
      .from("universities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch university",
          code: ERROR_CODES.DATABASE_ERROR,
          details: error.message,
        },
        { status: 500 },
      );
    }

    if (!university) {
      return NextResponse.json(
        {
          success: false,
          message: "University not found",
          code: ERROR_CODES.NOT_FOUND,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: university,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        code: ERROR_CODES.INTERNAL_ERROR,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
