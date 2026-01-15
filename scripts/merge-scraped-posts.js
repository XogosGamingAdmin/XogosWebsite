/**
 * Merge scraped post data with existing markdown posts
 * and generate the final generated-posts.json
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SCRAPED_FILE = path.join(process.cwd(), "data/scraped-posts.json");
const POSTS_DIR = path.join(process.cwd(), "content/posts");
const OUTPUT_FILE = path.join(process.cwd(), "data/generated-posts.json");

function findMarkdownFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

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
  if (!title) return "";
  return title
    .replace(/^Chapter \d+ - Chapter \d+:\s*/i, "")
    .replace(/^Chapter \d+:\s*/i, "")
    .replace(/^Chapter #?\d+\s*[-–:]\s*/i, "")
    .replace(/^\d+\.\s*/i, "")
    .trim();
}

function formatCategory(folder) {
  if (!folder) return "Education";
  return folder
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateStr) {
  if (!dateStr) return null;

  // Handle ISO date format (2025-10-21)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return dateStr;
}

function getExcerpt(content) {
  if (!content) return "";
  const plainText = content.replace(/[#*_\[\]]/g, "").trim();
  return plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
}

function calculateReadTime(content) {
  if (!content) return "5 min read";
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Convert markdown content to HTML with proper formatting
 */
function markdownToHtml(content) {
  if (!content) return "";

  // Split into paragraphs
  const blocks = content.split(/\n\n+/);
  let html = "";

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check for headings
    if (trimmed.startsWith("# ")) {
      html += `<h1>${trimmed.slice(2).trim()}</h1>\n\n`;
    } else if (trimmed.startsWith("## ")) {
      html += `<h2>${trimmed.slice(3).trim()}</h2>\n\n`;
    } else if (trimmed.startsWith("### ")) {
      html += `<h3>${trimmed.slice(4).trim()}</h3>\n\n`;
    } else if (trimmed.startsWith("#### ")) {
      html += `<h4>${trimmed.slice(5).trim()}</h4>\n\n`;
    }
    // Bold text as heading (** text **)
    else if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("**")) {
      const headingText = trimmed.slice(2, -2).trim();
      if (headingText && headingText !== " ") {
        html += `<h3>${headingText}</h3>\n\n`;
      }
    }
    // Empty bold markers (** **)
    else if (trimmed === "** **" || trimmed === "**  **") {
      // Skip empty markers
      continue;
    }
    // List items
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").filter(line => line.trim().startsWith("- ") || line.trim().startsWith("* "));
      html += "<ul>\n";
      for (const item of items) {
        const itemText = item.replace(/^[\s\-\*]+/, "").trim();
        html += `  <li>${formatInlineMarkdown(itemText)}</li>\n`;
      }
      html += "</ul>\n\n";
    }
    // Numbered list
    else if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(line => /^\d+\.\s/.test(line.trim()));
      html += "<ol>\n";
      for (const item of items) {
        const itemText = item.replace(/^\d+\.\s*/, "").trim();
        html += `  <li>${formatInlineMarkdown(itemText)}</li>\n`;
      }
      html += "</ol>\n\n";
    }
    // Regular paragraph
    else {
      const formatted = formatInlineMarkdown(trimmed);
      if (formatted && formatted.trim()) {
        html += `<p>${formatted}</p>\n\n`;
      }
    }
  }

  return html.trim();
}

/**
 * Format inline markdown (bold, italic, links)
 */
function formatInlineMarkdown(text) {
  return text
    // Bold text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    // Italic text
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Clean up newlines within paragraphs
    .replace(/\n/g, " ")
    .trim();
}

async function main() {
  console.log("Merging scraped posts with existing data...\n");

  // Load scraped posts for dates and images
  let scrapedPosts = [];
  if (fs.existsSync(SCRAPED_FILE)) {
    scrapedPosts = JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf8"));
    console.log(`Loaded ${scrapedPosts.length} scraped posts for dates/images`);
  } else {
    console.log("No scraped posts file found.");
  }

  // Create a map of scraped posts by slug for quick lookup
  const scrapedMap = new Map();
  for (const post of scrapedPosts) {
    if (post.slug) {
      scrapedMap.set(post.slug, post);
    }
  }

  // Process existing markdown files
  const markdownFiles = findMarkdownFiles(POSTS_DIR);
  console.log(`Found ${markdownFiles.length} markdown files with full content`);

  const postsFromMarkdown = [];

  for (const filePath of markdownFiles) {
    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      const fileName = path.basename(filePath, ".md");
      const slug = slugify(fileName);

      // Get category from folder structure
      const relativePath = path.relative(POSTS_DIR, filePath);
      const folderCategory = relativePath.split(path.sep)[0];
      const category = data.category || formatCategory(folderCategory);

      // Check if we have scraped data for this post
      const scraped = scrapedMap.get(slug);

      // Determine the best date to use
      let publishedAt = data.publishedAt;
      if (scraped?.lastmod) {
        publishedAt = formatDate(scraped.lastmod);
      } else if (scraped?.publishDate) {
        publishedAt = scraped.publishDate;
      }
      if (!publishedAt || publishedAt === "December 2, 2025") {
        publishedAt = "January 1, 2025";
      }

      // Determine the best image to use
      let imageUrl = data.imageUrl || "/images/fullLogo.jpeg";
      if (scraped?.imageUrl && scraped.imageUrl.startsWith("http")) {
        imageUrl = scraped.imageUrl;
      }

      // Convert markdown content to HTML
      const htmlContent = markdownToHtml(content);

      postsFromMarkdown.push({
        id: slug,
        title: cleanTitle(scraped?.title || data.title || fileName),
        excerpt: scraped?.excerpt || (data.excerpt && data.excerpt !== "Home" ? data.excerpt : getExcerpt(content)),
        content: htmlContent,
        author: {
          name: data.author || "Zack Edwards",
          avatar: "/images/board/zack.png",
          role: "Content Creator",
        },
        category,
        publishedAt,
        readTime: data.readTime || calculateReadTime(content),
        imageUrl,
        featured: data.featured || false,
      });

      // Remove from scraped map to track what's been processed
      scrapedMap.delete(slug);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  // Add any scraped posts that don't have corresponding markdown files
  const newPosts = [];
  for (const [slug, scraped] of scrapedMap) {
    if (!scraped.error && scraped.title) {
      // For posts without markdown, use the excerpt as content
      const excerptContent = scraped.excerpt ? `<p>${scraped.excerpt}</p>` : "";

      newPosts.push({
        id: slug,
        title: cleanTitle(scraped.title),
        excerpt: scraped.excerpt || "",
        content: excerptContent,
        author: {
          name: "Zack Edwards",
          avatar: "/images/board/zack.png",
          role: "Content Creator",
        },
        category: "Education",
        publishedAt: formatDate(scraped.lastmod) || "January 1, 2025",
        readTime: "5 min read",
        imageUrl: scraped.imageUrl || "/images/fullLogo.jpeg",
        featured: false,
        isNew: true,
      });
    }
  }

  console.log(`\nPosts from markdown (with full content): ${postsFromMarkdown.length}`);
  console.log(`New posts from scraping (excerpts only): ${newPosts.length}`);

  // Combine all posts
  const allPosts = [...postsFromMarkdown, ...newPosts];

  // Sort by date (newest first)
  allPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPosts, null, 2));
  console.log(`\nGenerated ${allPosts.length} posts to ${OUTPUT_FILE}`);

  // Print category summary
  const categories = {};
  allPosts.forEach((post) => {
    categories[post.category] = (categories[post.category] || 0) + 1;
  });

  console.log("\nCategory breakdown:");
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

  // Count posts with full content
  const withContent = allPosts.filter(p => p.content && p.content.length > 200).length;
  console.log(`\nPosts with full content: ${withContent}`);
  console.log(`Posts with excerpts only: ${allPosts.length - withContent}`);
}

main().catch(console.error);
