import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageDocuments, canReviewDocuments } from "@/lib/auth/documents";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic";

/**
 * GET /api/documents
 *
 * Lists documents for the Document Reviewer.
 * Reviewers see visible documents; admins can pass ?includeHidden=true to also
 * see archived ones.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!canReviewDocuments(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const includeHidden =
      request.nextUrl.searchParams.get("includeHidden") === "true" &&
      canManageDocuments(email);

    const result = await query(
      `SELECT d.id,
              d.title,
              d.description,
              d.file_name,
              d.file_size,
              d.page_count,
              d.uploaded_by_email,
              d.uploaded_by_name,
              d.is_hidden,
              d.hidden_at,
              d.created_at,
              d.retain_until,
              COUNT(DISTINCT h.id)::int AS highlight_count,
              COUNT(DISTINCT c.id)::int AS comment_count
         FROM board_documents d
         LEFT JOIN document_highlights h ON h.document_id = d.id
         LEFT JOIN document_comments c ON c.highlight_id = h.id
        WHERE ($1::boolean OR d.is_hidden = FALSE)
        GROUP BY d.id
        ORDER BY d.created_at DESC`,
      [includeHidden]
    );

    return NextResponse.json(
      { documents: result.rows, canManage: canManageDocuments(email) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error listing documents:", error);
    return NextResponse.json(
      { error: "Failed to load documents" },
      { status: 500 }
    );
  }
}
