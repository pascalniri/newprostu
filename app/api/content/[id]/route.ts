import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/content/[id]
 * Fetch a single approved content item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Content ID is required" },
        { status: 400 },
      );
    }

    // 1. Fetch the original content
    const { data: contentData, error: contentError } = await supabaseAdmin
      .from("approved_content")
      .select("*")
      .eq("id", id)
      .single();

    if (contentError) {
      console.error("Database error:", contentError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch content" },
        { status: 500 },
      );
    }

    if (!contentData) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 },
      );
    }

    // 2. Fetch comments associated with the content
    const { data: commentsData, error: commentsError } = await supabaseAdmin
      .from("comments")
      .select("*")
      .eq("content_id", id)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Database error fetching comments:", commentsError);
    }

    // 3. Fetch all votes for the content and its comments
    let allVotes: any[] = [];
    const commentIds = commentsData ? commentsData.map((c) => c.id) : [];

    // Construct an OR query to match either the content_id, or any comment_id in the list
    let orQuery = `content_id.eq.${id}`;
    if (commentIds.length > 0) {
      orQuery += `,comment_id.in.(${commentIds.join(",")})`;
    }

    const { data: votesData, error: votesError } = await supabaseAdmin
      .from("votes")
      .select("*")
      .or(orQuery);

    if (votesError) {
      console.error("Database error fetching votes:", votesError);
    } else if (votesData) {
      allVotes = votesData;
    }

    // 4. Aggregate Votes for the content itself
    const contentVotes = allVotes.filter((v) => v.content_id === id);
    const contentTotalVotes = contentVotes.reduce(
      (acc, curr) => acc + curr.vote_type,
      0,
    );
    const contentUserVote = userId
      ? contentVotes.find((v) => v.user_id === userId)?.vote_type || null
      : null;

    // 5. Aggregate Votes for each comment
    const hydratedComments = (commentsData || []).map((comment) => {
      const commentVotes = allVotes.filter((v) => v.comment_id === comment.id);
      const totalVotes = commentVotes.reduce(
        (acc, curr) => acc + curr.vote_type,
        0,
      );
      const userVote = userId
        ? commentVotes.find((v) => v.user_id === userId)?.vote_type || null
        : null;

      return {
        ...comment,
        votes: totalVotes,
        userVote: userVote,
      };
    });

    // 6. Return fully hydrated payload
    const hydratedContent = {
      ...contentData,
      votes: contentTotalVotes,
      userVote: contentUserVote,
      comments: hydratedComments,
    };

    return NextResponse.json({ success: true, content: hydratedContent });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
