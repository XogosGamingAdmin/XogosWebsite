import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageBlog } from "@/lib/auth/admin";
import generatedPosts from "@/data/generated-posts.json";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
}

const staticPosts = generatedPosts as BlogPost[];

// Helper to fetch a post from database by ID
async function getDbPost(id: string): Promise<BlogPost | null> {
  try {
    const { query } = await import("@/lib/database");
    const result = await query(
      `SELECT id, title, excerpt, content, author_name, author_avatar, author_role,
              category, published_at, read_time, image_url, featured
       FROM blog_posts
       WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0] as {
      id: string;
      title: string;
      excerpt: string;
      content: string;
      author_name: string;
      author_avatar: string;
      author_role: string;
      category: string;
      published_at: string;
      read_time: string;
      image_url: string;
      featured: boolean;
    };
    return {
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      author: {
        name: row.author_name,
        avatar: row.author_avatar,
        role: row.author_role,
      },
      category: row.category,
      publishedAt: row.published_at,
      readTime: row.read_time,
      imageUrl: row.image_url,
      featured: row.featured,
    };
  } catch (error) {
    console.error("Error fetching DB post:", error);
    return null;
  }
}

// GET - Get a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First check database for admin-created posts
    const dbPost = await getDbPost(slug);
    if (dbPost) {
      return NextResponse.json({ data: dbPost });
    }

    // Fall back to static posts
    const post = staticPosts.find((p) => p.id === slug);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Error getting blog post:", error);
    return NextResponse.json(
      { error: "Failed to get blog post" },
      { status: 500 }
    );
  }
}

// Helper to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

// PUT - Update an existing blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can manage blog
    if (!canManageBlog(session.user.email)) {
      return NextResponse.json({ error: "Blog management access required" }, { status: 403 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, content, category, author, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const readTime = calculateReadTime(content);
    const publishedAt = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Update or insert the post in the database
    try {
      const { query } = await import("@/lib/database");
      await query(
        `INSERT INTO blog_posts (id, title, excerpt, content, author_name, author_avatar, author_role, category, published_at, read_time, image_url, featured, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false, NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           excerpt = EXCLUDED.excerpt,
           content = EXCLUDED.content,
           author_name = EXCLUDED.author_name,
           category = EXCLUDED.category,
           read_time = EXCLUDED.read_time,
           image_url = EXCLUDED.image_url`,
        [
          slug,
          title,
          excerpt || content.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
          content,
          author || "Zack Edwards",
          "/images/board/zack.png",
          "Content Creator",
          category || "Education",
          publishedAt,
          readTime,
          imageUrl || "/images/fullLogo.jpeg",
        ]
      );

      return NextResponse.json({
        id: slug,
        message: "Post updated successfully",
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to update post in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}
