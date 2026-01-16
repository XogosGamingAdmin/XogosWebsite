import { NextRequest, NextResponse } from "next/server";
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
