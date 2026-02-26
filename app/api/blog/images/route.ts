import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageBlog } from "@/lib/auth/admin";
import { query } from "@/lib/database";

// GET - List all images (for image picker/management)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !canManageBlog(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orphanedOnly = searchParams.get("orphaned") === "true";
    const limit = parseInt(searchParams.get("limit") || "100");

    let queryText = `
      SELECT id, public_url, original_filename, file_size, mime_type, alt_text, post_id, created_at
      FROM blog_images
    `;

    if (orphanedOnly) {
      queryText += ` WHERE post_id IS NULL`;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $1`;

    const result = await query(queryText, [limit]);

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 }
    );
  }
}
