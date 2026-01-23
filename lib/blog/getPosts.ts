import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

const postsDirectory = path.join(process.cwd(), "content/posts");

/**
 * Get all blog posts from markdown files
 */
export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn("Posts directory not found:", postsDirectory);
    return posts;
  }

  // Recursively find all markdown files
  function findMarkdownFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath));
      } else if (entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const markdownFiles = findMarkdownFiles(postsDirectory);

  for (const filePath of markdownFiles) {
    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      // Generate slug from filename
      const fileName = path.basename(filePath, ".md");
      const slug = fileName.toLowerCase().replace(/\s+/g, "-");

      // Parse date to sortable format
      let publishedAt = data.publishedAt || "January 1, 2025";

      // Map category from folder structure if not in frontmatter
      const relativePath = path.relative(postsDirectory, filePath);
      const folderCategory = relativePath.split(path.sep)[0];
      const category = data.category || formatCategory(folderCategory);

      posts.push({
        id: slug,
        title: cleanTitle(data.title || fileName),
        excerpt: data.excerpt || getExcerpt(content),
        content: content,
        author: {
          name: data.author || "Xogos Team",
          avatar: "/images/board/zack.png",
          role: "Content Creator",
        },
        category: category,
        publishedAt: publishedAt,
        readTime: data.readTime || calculateReadTime(content),
        imageUrl: data.imageUrl || getCategoryImage(category),
        featured: data.featured || false,
      });
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  // Sort by date (newest first)
  posts.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  return posts;
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.id === slug);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

// Helper functions

function cleanTitle(title: string): string {
  // Remove duplicate chapter prefixes like "Chapter 1 - Chapter 1:"
  return title.replace(/^Chapter \d+ - Chapter \d+:\s*/i, "").trim();
}

function formatCategory(folder: string): string {
  // Convert folder name to category
  return folder
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getExcerpt(content: string): string {
  // Get first 150 characters of content
  const plainText = content.replace(/[#*_\[\]]/g, "").trim();
  return plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function getCategoryImage(category: string): string {
  const categoryImages: Record<string, string> = {
    "AI Education": "/images/ai-education.jpg",
    "Financial Literacy": "/images/financial-literacy.jpg",
    History: "/images/history.jpg",
    "Lesson Plans": "/images/lesson-plans.jpg",
    Education: "/images/education.jpg",
    Games: "/images/games.jpg",
    Tokenomics: "/images/tokenomics.jpg",
    Scholarships: "/images/scholarships.jpg",
  };

  return categoryImages[category] || "/images/XogosLogo.png";
}
