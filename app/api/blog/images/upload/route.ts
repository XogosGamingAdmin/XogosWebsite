import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { canManageBlog } from "@/lib/auth/admin";
import { query } from "@/lib/database";
import {
  createSupabaseServerClient,
  getPublicImageUrl,
  BLOG_IMAGES_BUCKET,
} from "@/lib/supabase";

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorization check
    if (!canManageBlog(session.user.email)) {
      return NextResponse.json(
        { error: "Blog management access required" },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string | null;
    const altText = formData.get("altText") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "jpg";
    const uniqueFilename = `${nanoid()}.${fileExtension}`;
    const storagePath = `${BLOG_IMAGES_BUCKET}/${uniqueFilename}`;

    // Upload to Supabase Storage
    const supabase = createSupabaseServerClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BLOG_IMAGES_BUCKET)
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image to storage" },
        { status: 500 }
      );
    }

    // Get public URL
    const publicUrl = getPublicImageUrl(storagePath);

    // Store metadata in database
    const result = await query(
      `INSERT INTO blog_images (storage_path, public_url, original_filename, file_size, mime_type, alt_text, uploaded_by, post_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, public_url, original_filename, created_at`,
      [
        storagePath,
        publicUrl,
        file.name,
        file.size,
        file.type,
        altText,
        session.user.email,
        postId,
      ]
    );

    return NextResponse.json({
      success: true,
      image: result.rows[0],
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
