import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageBlog } from "@/lib/auth/admin";

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

// Helper to convert plain text with paragraphs to HTML
// Detects if content is plain text (no HTML block tags) and converts paragraph breaks to <p> tags
function convertPlainTextToHtml(content: string): string {
  // Check if content already has HTML block-level tags
  const hasHtmlTags =
    /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|br)\b/i.test(content);

  if (hasHtmlTags) {
    // Content already has HTML, return as-is
    return content;
  }

  // Content is plain text - convert paragraph breaks to <p> tags
  // Split on double newlines (paragraph breaks)
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Wrap each paragraph in <p> tags, preserving single line breaks as <br>
  const htmlParagraphs = paragraphs.map((paragraph) => {
    // Convert single newlines within a paragraph to <br>
    const withBreaks = paragraph.replace(/\n/g, "<br>");
    return `<p>${withBreaks}</p>`;
  });

  return htmlParagraphs.join("\n\n");
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can manage blog
    if (!canManageBlog(session.user.email)) {
      return NextResponse.json(
        { error: "Blog management access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, excerpt, content, category, author, imageUrl, imageId } =
      body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Convert plain text to HTML if needed (preserves paragraphs from pasted text)
    const processedContent = convertPlainTextToHtml(content);

    // Generate slug and other fields
    const id = slugify(title);
    const publishedAt = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const readTime = calculateReadTime(processedContent);

    // Create the new post object
    const newPost = {
      id,
      title,
      excerpt:
        excerpt ||
        processedContent.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
      content: processedContent,
      author: {
        name: author || "Zack Edwards",
        avatar: "/images/board/zack.png",
        role: "Content Creator",
      },
      category: category || "Education",
      publishedAt,
      readTime,
      imageUrl: imageUrl || "/images/XogosLogo.png",
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

      // Link the uploaded image to the post if imageId was provided
      if (imageId) {
        await query(`UPDATE blog_images SET post_id = $1 WHERE id = $2`, [
          newPost.id,
          imageId,
        ]);
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      // If database fails, still return success but note it
      return NextResponse.json({
        id: newPost.id,
        message:
          "Post created (database storage failed - post may not persist)",
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
