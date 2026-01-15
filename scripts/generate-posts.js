/**
 * Build script to generate posts.json from markdown files
 * Run this before build: node scripts/generate-posts.js
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "content/posts");
const outputFile = path.join(process.cwd(), "data/generated-posts.json");

function findMarkdownFiles(dir) {
  const files = [];
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

function cleanTitle(title) {
  return title.replace(/^Chapter \d+ - Chapter \d+:\s*/i, "").trim();
}

function formatCategory(folder) {
  return folder
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getExcerpt(content) {
  const plainText = content.replace(/[#*_\[\]]/g, "").trim();
  return plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
}

function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function getCategoryImage(category) {
  const categoryImages = {
    "Ai Education": "/images/fullLogo.jpeg",
    "Financial Literacy": "/images/fullLogo.jpeg",
    History: "/images/fullLogo.jpeg",
    "Lesson Plans": "/images/fullLogo.jpeg",
    "Creators Notes": "/images/fullLogo.jpeg",
    Education: "/images/fullLogo.jpeg",
    Games: "/images/fullLogo.jpeg",
  };

  return categoryImages[category] || "/images/fullLogo.jpeg";
}

function generatePosts() {
  console.log("Generating posts from markdown files...");

  if (!fs.existsSync(postsDirectory)) {
    console.error("Posts directory not found:", postsDirectory);
    process.exit(1);
  }

  const markdownFiles = findMarkdownFiles(postsDirectory);
  console.log(`Found ${markdownFiles.length} markdown files`);

  const posts = [];

  for (const filePath of markdownFiles) {
    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      // Generate slug from filename
      const fileName = path.basename(filePath, ".md");
      const slug = fileName.toLowerCase().replace(/\s+/g, "-");

      // Parse date
      let publishedAt = data.publishedAt || "January 1, 2025";

      // Map category from folder structure
      const relativePath = path.relative(postsDirectory, filePath);
      const folderCategory = relativePath.split(path.sep)[0];
      const category = data.category || formatCategory(folderCategory);

      posts.push({
        id: slug,
        title: cleanTitle(data.title || fileName),
        excerpt: data.excerpt && data.excerpt !== "Home" ? data.excerpt : getExcerpt(content),
        content: "", // Don't include full content in JSON to reduce size
        author: {
          name: data.author || "Zack Edwards",
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
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  // Sort by date (newest first)
  posts.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Ensure data directory exists
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
  console.log(`Generated ${posts.length} posts to ${outputFile}`);

  // Print category summary
  const categories = {};
  posts.forEach((post) => {
    categories[post.category] = (categories[post.category] || 0) + 1;
  });
  console.log("\nCategory breakdown:");
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
}

generatePosts();
