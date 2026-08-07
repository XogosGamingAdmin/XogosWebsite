import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageDocuments } from "@/lib/auth/documents";
import { query } from "@/lib/database";
import {
  BOARD_DOCUMENTS_BUCKET,
  createSupabaseServerClient,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

/**
 * POST /api/documents/upload
 *
 * Admin-only. Accepts a PDF, stores it in the private board-documents bucket,
 * and records its metadata. The file is never made public — it is served back
 * through /api/documents/[id]/file behind an auth check.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!canManageDocuments(email)) {
      return NextResponse.json(
        { error: "Only board admins can upload documents" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    const description =
      (formData.get("description") as string | null)?.trim() || null;
    const pageCountRaw = formData.get("pageCount") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json(
        { error: "A title is required" },
        { status: 400 }
      );
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files can be uploaded" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is larger than the 50 MB limit" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${Date.now()}-${safeName}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BOARD_DOCUMENTS_BUCKET)
      .upload(storagePath, bytes, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage error:", uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const pageCount = pageCountRaw ? parseInt(pageCountRaw, 10) : null;

    try {
      const result = await query(
        `INSERT INTO board_documents
           (title, description, storage_path, file_name, file_size,
            page_count, uploaded_by_email, uploaded_by_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, title, description, file_name, file_size, page_count,
                   uploaded_by_email, uploaded_by_name, is_hidden, created_at,
                   retain_until`,
        [
          title,
          description,
          storagePath,
          file.name,
          file.size,
          Number.isFinite(pageCount) ? pageCount : null,
          email,
          session?.user?.name || null,
        ]
      );

      return NextResponse.json({ document: result.rows[0] }, { status: 201 });
    } catch (dbError) {
      // Do not leave an orphaned file behind if the metadata insert fails
      await supabase.storage.from(BOARD_DOCUMENTS_BUCKET).remove([storagePath]);
      throw dbError;
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
