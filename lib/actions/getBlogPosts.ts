"use server";

// Import generated posts (created at build time by scripts/generate-posts.js)
import generatedPosts from "@/data/generated-posts.json";

export interface BlogPost {
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

// Type assertion for imported JSON
const posts = generatedPosts as BlogPost[];

/**
 * Get a post by its slug/id
 */
function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.id === slug);
}

/**
 * Get all unique categories
 */
function getCategories(): string[] {
  const categories = new Set<string>();
  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get all blog posts from pre-generated JSON
 */
export async function getBlogPosts(): Promise<{
  data?: BlogPost[];
  error?: { message: string };
}> {
  try {
    // Use the pre-generated posts from JSON file
    const posts = generatedPosts as BlogPost[];
    return { data: posts };
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return { error: { message: "Failed to load blog posts" } };
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(
  slug: string
): Promise<{ data?: BlogPost; error?: { message: string } }> {
  try {
    const post = getPostBySlug(slug);
    if (!post) {
      return { error: { message: "Post not found" } };
    }
    return { data: post };
  } catch (error) {
    console.error("Error getting blog post:", error);
    return { error: { message: "Failed to load blog post" } };
  }
}

/**
 * Get all blog categories
 */
export async function getBlogCategories(): Promise<{
  data?: string[];
  error?: { message: string };
}> {
  try {
    const categories = getCategories();
    return { data: categories };
  } catch (error) {
    console.error("Error getting categories:", error);
    return { error: { message: "Failed to load categories" } };
  }
}
