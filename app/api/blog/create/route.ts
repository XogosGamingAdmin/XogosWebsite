import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";

// Helper to create a slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

// Helper to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { title, excerpt, content, category, author, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate slug and other fields
    const id = slugify(title);
    const publishedAt = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const readTime = calculateReadTime(content);

    // Create the new post object
    const newPost = {
      id,
      title,
      excerpt: excerpt || content.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
      content,
      author: {
        name: author || "Zack Edwards",
        avatar: "/images/board/zack.png",
        role: "Content Creator",
      },
      category: category || "Education",
      publishedAt,
      readTime,
      imageUrl: imageUrl || "/images/fullLogo.jpeg",
      featured: false,
    };

    // Store the post in the database
    try {
      const { query } = await import("@/lib/database");
      await query(
          `INSERT INTO blog_posts (id, title, excerpt, content, author_name, author_avatar, author_role, category, published_at, read_time, image_url, featured, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             excerpt = EXCLUDED.excerpt,
             content = EXCLUDED.content,
             author_name = EXCLUDED.author_name,
             category = EXCLUDED.category,
             image_url = EXCLUDED.image_url`,
          [
            newPost.id,
            newPost.title,
            newPost.excerpt,
            newPost.content,
            newPost.author.name,
            newPost.author.avatar,
            newPost.author.role,
            newPost.category,
            newPost.publishedAt,
            newPost.readTime,
            newPost.imageUrl,
            newPost.featured,
          ]
        );
    } catch (dbError) {
      console.error("Database error:", dbError);
      // If database fails, still return success but note it
      return NextResponse.json({
        id: newPost.id,
        message: "Post created (database storage failed - post may not persist)",
        post: newPost,
      });
    }

    return NextResponse.json({
      id: newPost.id,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
