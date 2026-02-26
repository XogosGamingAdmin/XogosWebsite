import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageBlog } from "@/lib/auth/admin";
import { query } from "@/lib/database";
import { createSupabaseServerClient, BLOG_IMAGES_BUCKET } from "@/lib/supabase";

// GET - Get image metadata
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await query(
      `SELECT id, public_url, original_filename, file_size, mime_type, alt_text, post_id, created_at
       FROM blog_images WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Get image error:", error);
    return NextResponse.json(
      { error: "Failed to get image" },
      { status: 500 }
    );
  }
}

// PATCH - Update image metadata (link to post, update alt text)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email || !canManageBlog(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { postId, altText } = body;

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (postId !== undefined) {
      updates.push(`post_id = $${paramIndex}`);
      values.push(postId);
      paramIndex++;
    }

    if (altText !== undefined) {
      updates.push(`alt_text = $${paramIndex}`);
      values.push(altText);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(id);
    const result = await query(
      `UPDATE blog_images
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING id, public_url, post_id, alt_text`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, image: result.rows[0] });
  } catch (error) {
    console.error("Update image error:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an image from storage and database
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email || !canManageBlog(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get image metadata from database
    const imageResult = await query(
      `SELECT id, storage_path FROM blog_images WHERE id = $1`,
      [id]
    );

    if (imageResult.rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const image = imageResult.rows[0];
    const filename = image.storage_path.replace(`${BLOG_IMAGES_BUCKET}/`, "");

    // Delete from Supabase Storage
    const supabase = createSupabaseServerClient();
    const { error: deleteError } = await supabase.storage
      .from(BLOG_IMAGES_BUCKET)
      .remove([filename]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      // Continue to delete from database even if storage delete fails
    }

    // Delete from database
    await query(`DELETE FROM blog_images WHERE id = $1`, [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Image delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
