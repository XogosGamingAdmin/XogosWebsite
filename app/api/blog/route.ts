import { NextResponse } from "next/server";
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

// Helper to fetch admin-created posts from database
async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const { db } = await import("@/lib/database");
    const result = await db.query(
      `SELECT id, title, excerpt, content, author_name, author_avatar, author_role,
              category, published_at, read_time, image_url, featured
       FROM blog_posts
       ORDER BY created_at DESC`
    );
    return result.rows.map((row: {
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
    }) => ({
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
    }));
  } catch (error) {
    console.error("Error fetching DB posts:", error);
    return [];
  }
}

// GET - List all blog posts (without full content for listing)
export async function GET() {
  try {
    // Get admin-created posts from database
    const dbPosts = await getDbPosts();

    // Merge with static posts (DB posts take precedence if same ID)
    const dbPostIds = new Set(dbPosts.map(p => p.id));
    const allPosts = [
      ...dbPosts,
      ...staticPosts.filter(p => !dbPostIds.has(p.id))
    ];

    // Return posts without the full content field to keep response small
    const previews = allPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      imageUrl: post.imageUrl,
      featured: post.featured,
    }));

    return NextResponse.json({ data: previews });
  } catch (error) {
    console.error("Error listing blog posts:", error);
    return NextResponse.json(
      { error: "Failed to list blog posts" },
      { status: 500 }
    );
  }
}
