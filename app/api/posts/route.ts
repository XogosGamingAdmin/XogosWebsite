import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const postsDirectory = path.join(process.cwd(), "content/posts");

// Category to folder mapping
const categoryFolders: Record<string, string> = {
  "AI Education": "ai-education",
  "Financial Literacy": "financial-literacy",
  "Ancient Egypt": "history/ancient-egypt",
  "Colonial America": "history/colonial-america",
  "Age of Exploration": "history/age-of-exploration",
  "Ancient Africa": "history/ancient-africa",
  "Indus Valley": "history/indus-valley",
  "Ancient America": "history/ancient-america",
  "Industrial Revolution": "history/industrial-revolution",
  "Ancient China": "history/ancient-china",
  "Ancient Rome": "history/ancient-rome",
  "Civil War": "history/civil-war",
  "Lesson Plans": "lesson-plans",
  "Creator's Notes": "creators-notes",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

function walkDir(
  dir: string,
  posts: Array<{
    slug: string;
    title: string;
    category: string;
    publishedAt: string;
  }>
) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath, posts);
    } else if (file.endsWith(".md")) {
      const content = fs.readFileSync(filePath, "utf8");
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const titleMatch = frontmatter.match(/title:\s*"(.*)"/);
        const categoryMatch = frontmatter.match(/category:\s*"(.*)"/);
        const dateMatch = frontmatter.match(/publishedAt:\s*"(.*)"/);

        posts.push({
          slug: file.replace(/\.md$/, ""),
          title: titleMatch ? titleMatch[1] : file,
          category: categoryMatch ? categoryMatch[1] : "General",
          publishedAt: dateMatch ? dateMatch[1] : "",
        });
      }
    }
  }
}

function findAndDelete(dir: string, slug: string): boolean {
  if (!fs.existsSync(dir)) return false;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (findAndDelete(filePath, slug)) return true;
    } else if (file === `${slug}.md`) {
      fs.unlinkSync(filePath);
      return true;
    }
  }
  return false;
}

// GET - List all posts
export async function GET() {
  try {
    const posts: Array<{
      slug: string;
      title: string;
      category: string;
      publishedAt: string;
    }> = [];

    walkDir(postsDirectory, posts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error listing posts:", error);
    return NextResponse.json(
      { error: "Failed to list posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, category, topic, author, imageUrl } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = slugify(title);

    // Determine folder based on category
    const folder = categoryFolders[category] || "creators-notes";
    const folderPath = path.join(postsDirectory, folder);

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Calculate read time (roughly 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    // Create markdown content with frontmatter
    const publishedAt = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const markdown = `---
title: "${title.replace(/"/g, '\\"')}"
excerpt: "${(excerpt || "").replace(/"/g, '\\"')}"
category: "${category}"
topic: "${topic || category}"
publishedAt: "${publishedAt}"
author: "${author || "Xogos Team"}"
imageUrl: "${imageUrl || "/images/fullLogo.jpeg"}"
readTime: "${readTime}"
---

${content}
`;

    const filePath = path.join(folderPath, `${slug}.md`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 409 }
      );
    }

    fs.writeFileSync(filePath, markdown, "utf8");

    return NextResponse.json({
      success: true,
      slug,
      path: `/post/${slug}`,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const deleted = findAndDelete(postsDirectory, slug);

    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
