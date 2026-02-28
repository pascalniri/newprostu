import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { content_id, comment_id, vote_type, user_id } = await request.json();

    if (!user_id || (!content_id && !comment_id) || !vote_type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Determine the constraint and match conditions
    const matchObj = content_id
      ? { user_id, content_id }
      : { user_id, comment_id };

    // Check if vote already exists
    const { data: existingVote, error: fetchError } = await supabaseAdmin
      .from("votes")
      .select("id, vote_type")
      .match(matchObj)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch Error:", fetchError);
      return NextResponse.json(
        {
          success: false,
          message: "Database error checking vote",
          error: fetchError,
        },
        { status: 500 },
      );
    }

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // User clicked the same vote again, remove it
        const { error: deleteError } = await supabaseAdmin
          .from("votes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) throw deleteError;

        return NextResponse.json({
          success: true,
          message: "Vote removed",
          action: "removed",
        });
      } else {
        // User changed their vote
        const { error: updateError } = await supabaseAdmin
          .from("votes")
          .update({ vote_type })
          .eq("id", existingVote.id);

        if (updateError) throw updateError;

        return NextResponse.json({
          success: true,
          message: "Vote updated",
          action: "updated",
        });
      }
    } else {
      // New vote
      const { error: insertError } = await supabaseAdmin.from("votes").insert({
        user_id,
        content_id: content_id || null,
        comment_id: comment_id || null,
        vote_type,
      });

      if (insertError) throw insertError;

      return NextResponse.json({
        success: true,
        message: "Vote cast",
        action: "inserted",
      });
    }
  } catch (error) {
    console.error("Vote operation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
