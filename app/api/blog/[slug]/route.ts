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

const posts = generatedPosts as BlogPost[];

// GET - Get a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = posts.find((p) => p.id === slug);

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
