import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canReviewDocuments } from "@/lib/auth/documents";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic";

const MAX_COMMENT_CHARS = 500;

/**
 * POST /api/highlights/[id]/comments
 *
 * Adds a comment to a highlight, or a reply to an existing comment when
 * parentCommentId is supplied. Any board member with access to the document
 * can reply.
 *
 * Body: { text, parentCommentId? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!canReviewDocuments(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const parentCommentId = body?.parentCommentId || null;

    if (!text) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }
    if (text.length > MAX_COMMENT_CHARS) {
      return NextResponse.json(
        {
          error: `Comments are limited to ${MAX_COMMENT_CHARS} characters (you wrote ${text.length})`,
        },
        { status: 400 }
      );
    }

    const highlight = await query(
      `SELECT id FROM document_highlights WHERE id = $1`,
      [params.id]
    );
    if (highlight.rowCount === 0) {
      return NextResponse.json(
        { error: "Highlight not found" },
        { status: 404 }
      );
    }

    // A reply must belong to the same highlight, so a malformed request cannot
    // graft a reply onto an unrelated thread.
    if (parentCommentId) {
      const parent = await query(
        `SELECT id FROM document_comments WHERE id = $1 AND highlight_id = $2`,
        [parentCommentId, params.id]
      );
      if (parent.rowCount === 0) {
        return NextResponse.json(
          { error: "The comment being replied to was not found" },
          { status: 400 }
        );
      }
    }

    const result = await query(
      `INSERT INTO document_comments
         (highlight_id, parent_comment_id, comment_text, author_email, author_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, highlight_id, parent_comment_id, comment_text,
                 author_email, author_name, created_at`,
      [params.id, parentCommentId, text, email, session?.user?.name || null]
    );

    return NextResponse.json({ comment: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to save comment" },
      { status: 500 }
    );
  }
}
