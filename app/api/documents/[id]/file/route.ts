import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canReviewDocuments } from "@/lib/auth/documents";
import { query } from "@/lib/database";
import {
  BOARD_DOCUMENTS_BUCKET,
  createSupabaseServerClient,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/documents/[id]/file
 *
 * Streams the PDF bytes to an authorized board member so the in-browser reader
 * can render it. The storage bucket is private, so this route is the only way
 * to reach the file — there is no public URL to share, scrape, or feed to an
 * external service.
 *
 * The response is marked no-store and noindex, and is served inline rather
 * than as an attachment.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!canReviewDocuments(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      `SELECT storage_path, file_name, is_hidden
         FROM board_documents
        WHERE id = $1`,
      [params.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const doc = result.rows[0];

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.storage
      .from(BOARD_DOCUMENTS_BUCKET)
      .download(doc.storage_path);

    if (error || !data) {
      console.error("Storage download failed:", error);
      return NextResponse.json(
        { error: "Could not retrieve the document file" },
        { status: 500 }
      );
    }

    const bytes = Buffer.from(await data.arrayBuffer());

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(bytes.length),
        // inline so it renders in the reader rather than downloading
        "Content-Disposition": `inline; filename="${encodeURIComponent(doc.file_name)}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive, noimageindex",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error streaming document:", error);
    return NextResponse.json(
      { error: "Failed to load document" },
      { status: 500 }
    );
  }
}
