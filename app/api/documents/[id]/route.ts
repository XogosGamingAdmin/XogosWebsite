import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageDocuments } from "@/lib/auth/documents";
import { query } from "@/lib/database";
import {
  BOARD_DOCUMENTS_BUCKET,
  createSupabaseServerClient,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/documents/[id]
 *
 * Admin-only. Hides (archives) or restores a document. Nothing is destroyed —
 * highlights and comments are left intact so a hidden document can be brought
 * back with one click.
 *
 * Body: { isHidden: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!canManageDocuments(email)) {
      return NextResponse.json(
        { error: "Only board admins can hide or restore documents" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const isHidden = Boolean(body?.isHidden);

    const result = await query(
      `UPDATE board_documents
          SET is_hidden = $1,
              hidden_at = CASE WHEN $1 THEN NOW() ELSE NULL END,
              hidden_by = CASE WHEN $1 THEN $2 ELSE NULL END,
              updated_at = NOW()
        WHERE id = $3
        RETURNING id, title, is_hidden, hidden_at`,
      [isHidden, email, params.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ document: result.rows[0] });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/documents/[id]
 *
 * Admin-only, permanent. Destroys the stored PDF and — via ON DELETE CASCADE —
 * every highlight, comment, and reply attached to it.
 *
 * Before deleting we count what will be lost and write a row to
 * document_deletion_log, so a record that the document existed survives even
 * though the document does not. If the 7-year retention date has not passed,
 * the log flags that too.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!canManageDocuments(email)) {
      return NextResponse.json(
        { error: "Only board admins can delete documents" },
        { status: 403 }
      );
    }

    const existing = await query(
      `SELECT d.id, d.title, d.file_name, d.storage_path, d.uploaded_by_email,
              d.created_at, d.retain_until,
              COUNT(DISTINCT h.id)::int AS highlight_count,
              COUNT(DISTINCT c.id)::int AS comment_count
         FROM board_documents d
         LEFT JOIN document_highlights h ON h.document_id = d.id
         LEFT JOIN document_comments c ON c.highlight_id = h.id
        WHERE d.id = $1
        GROUP BY d.id`,
      [params.id]
    );

    if (existing.rowCount === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const doc = existing.rows[0];
    const beforeRetention = new Date(doc.retain_until) > new Date();

    // Record the deletion first so the audit trail survives even if the
    // storage removal or the cascade fails partway through.
    await query(
      `INSERT INTO document_deletion_log
         (document_id, title, file_name, uploaded_by_email,
          document_created_at, retain_until, highlight_count, comment_count,
          deleted_by_email, deleted_by_name, deleted_before_retention)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        doc.id,
        doc.title,
        doc.file_name,
        doc.uploaded_by_email,
        doc.created_at,
        doc.retain_until,
        doc.highlight_count,
        doc.comment_count,
        email,
        session?.user?.name || null,
        beforeRetention,
      ]
    );

    const supabase = createSupabaseServerClient();
    const { error: storageError } = await supabase.storage
      .from(BOARD_DOCUMENTS_BUCKET)
      .remove([doc.storage_path]);

    if (storageError) {
      // Log and continue: the metadata row should still go, and the audit
      // entry already records the deletion.
      console.error("Storage removal failed:", storageError);
    }

    await query(`DELETE FROM board_documents WHERE id = $1`, [params.id]);

    return NextResponse.json({
      deleted: true,
      highlightsRemoved: doc.highlight_count,
      commentsRemoved: doc.comment_count,
      deletedBeforeRetention: beforeRetention,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
