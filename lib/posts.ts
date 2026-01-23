import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topic: string;
  publishedAt: string;
  author: string;
  imageUrl: string;
  readTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

// Get all post slugs for static generation
export function getAllPostSlugs(): string[] {
  const slugs: string[] = [];

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith(".md")) {
        // The slug is the filename without .md extension
        slugs.push(file.replace(/\.md$/, ""));
      }
    }
  }

  walkDir(postsDirectory);
  return slugs;
}

// Find and read a post by slug
export function getPostBySlug(slug: string): Post | null {
  function findPost(dir: string): Post | null {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        const found = findPost(filePath);
        if (found) return found;
      } else if (file === `${slug}.md`) {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || "",
          excerpt: data.excerpt || "",
          category: data.category || "General",
          topic: data.topic || "General",
          publishedAt: data.publishedAt || "",
          author: data.author || "Xogos Team",
          imageUrl: data.imageUrl || "/images/XogosLogo.png",
          readTime: data.readTime || "5 min read",
          content,
        };
      }
    }
    return null;
  }

  return findPost(postsDirectory);
}

// Get all posts with metadata (for listing pages)
export function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith(".md")) {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const slug = file.replace(/\.md$/, "");

        posts.push({
          slug,
          title: data.title || "",
          excerpt: data.excerpt || "",
          category: data.category || "General",
          topic: data.topic || "General",
          publishedAt: data.publishedAt || "",
          author: data.author || "Xogos Team",
          imageUrl: data.imageUrl || "/images/XogosLogo.png",
          readTime: data.readTime || "5 min read",
        });
      }
    }
  }

  walkDir(postsDirectory);

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}

// Get posts by category
export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

// Get posts by topic
export function getPostsByTopic(topic: string): PostMeta[] {
  return getAllPosts().filter(
    (post) => post.topic.toLowerCase() === topic.toLowerCase()
  );
}

// Get related posts (same category, excluding current)
export function getRelatedPosts(currentSlug: string, limit = 3): PostMeta[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  return getAllPosts()
    .filter(
      (post) =>
        post.slug !== currentSlug && post.category === currentPost.category
    )
    .slice(0, limit);
}
