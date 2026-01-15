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

const posts = generatedPosts as BlogPost[];

// GET - List all blog posts (without full content for listing)
export async function GET() {
  try {
    // Return posts without the full content field to keep response small
    const previews = posts.map((post) => ({
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
