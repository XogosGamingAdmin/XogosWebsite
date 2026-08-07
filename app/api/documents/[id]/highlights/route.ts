import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canReviewDocuments } from "@/lib/auth/documents";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic";

const MAX_HIGHLIGHT_CHARS = 100;

/**
 * GET /api/documents/[id]/highlights
 *
 * Returns every highlight on the document with its comment thread. Comments
 * come back flat with parent_comment_id so the client can nest replies.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!canReviewDocuments(session?.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [highlights, comments] = await Promise.all([
      query(
        `SELECT id, document_id, page_number, highlighted_text, position,
                created_by_email, created_by_name, created_at
           FROM document_highlights
          WHERE document_id = $1
          ORDER BY page_number ASC, created_at ASC`,
        [params.id]
      ),
      query(
        `SELECT c.id, c.highlight_id, c.parent_comment_id, c.comment_text,
                c.author_email, c.author_name, c.created_at
           FROM document_comments c
           JOIN document_highlights h ON h.id = c.highlight_id
          WHERE h.document_id = $1
          ORDER BY c.created_at ASC`,
        [params.id]
      ),
    ]);

    return NextResponse.json(
      { highlights: highlights.rows, comments: comments.rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error loading highlights:", error);
    return NextResponse.json(
      { error: "Failed to load highlights" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents/[id]/highlights
 *
 * Creates a highlight. The 100-character cap is enforced here and again by a
 * CHECK constraint in the database.
 *
 * Body: { pageNumber, text, position, comment? }
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
    const pageNumber = parseInt(body?.pageNumber, 10);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const comment =
      typeof body?.comment === "string" ? body.comment.trim() : "";

    if (!Number.isFinite(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { error: "A valid page number is required" },
        { status: 400 }
      );
    }
    if (!text) {
      return NextResponse.json(
        { error: "Select some text to highlight" },
        { status: 400 }
      );
    }
    if (text.length > MAX_HIGHLIGHT_CHARS) {
      return NextResponse.json(
        {
          error: `Highlights are limited to ${MAX_HIGHLIGHT_CHARS} characters (you selected ${text.length})`,
        },
        { status: 400 }
      );
    }
    if (comment.length > 500) {
      return NextResponse.json(
        { error: "Comments are limited to 500 characters" },
        { status: 400 }
      );
    }

    // Confirm the document exists before attaching anything to it
    const doc = await query(`SELECT id FROM board_documents WHERE id = $1`, [
      params.id,
    ]);
    if (doc.rowCount === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const highlight = await query(
      `INSERT INTO document_highlights
         (document_id, page_number, highlighted_text, position,
          created_by_email, created_by_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, document_id, page_number, highlighted_text, position,
                 created_by_email, created_by_name, created_at`,
      [
        params.id,
        pageNumber,
        text,
        body?.position ? JSON.stringify(body.position) : null,
        email,
        session?.user?.name || null,
      ]
    );

    let firstComment = null;
    if (comment) {
      const inserted = await query(
        `INSERT INTO document_comments
           (highlight_id, parent_comment_id, comment_text, author_email, author_name)
         VALUES ($1, NULL, $2, $3, $4)
         RETURNING id, highlight_id, parent_comment_id, comment_text,
                   author_email, author_name, created_at`,
        [highlight.rows[0].id, comment, email, session?.user?.name || null]
      );
      firstComment = inserted.rows[0];
    }

    return NextResponse.json(
      { highlight: highlight.rows[0], comment: firstComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating highlight:", error);
    return NextResponse.json(
      { error: "Failed to save highlight" },
      { status: 500 }
    );
  }
}
