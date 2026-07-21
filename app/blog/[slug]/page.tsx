import { Metadata } from "next";
import generatedPosts from "@/data/generated-posts.json";
import BlogPostClient from "./BlogPostClient";

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

// Fetch post from database
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

// Get post by slug (checks DB first, then static posts)
async function getPost(slug: string): Promise<BlogPost | null> {
  // First check database
  const dbPost = await getDbPost(slug);
  if (dbPost) return dbPost;

  // Fall back to static posts
  return staticPosts.find((p) => p.id === slug) || null;
}

// Generate metadata for the blog post (enables OG images for link previews)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | Xogos Blog",
      description: "The requested article could not be found.",
    };
  }

  // Convert relative image URLs to absolute URLs for OG
  const baseUrl = "https://www.xogosgaming.com";
  const imageUrl = post.imageUrl.startsWith("http")
    ? post.imageUrl
    : `${baseUrl}${post.imageUrl}`;

  return {
    title: `${post.title} | Xogos Blog`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: "Xogos Gaming",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return <BlogPostClient slug={slug} initialPost={post} />;
}
