/**
 * Merge scraped post data with existing markdown posts
 * and generate the final generated-posts.json
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SCRAPED_FILE = path.join(process.cwd(), "data/scraped-posts.json");
const SCRAPED_FULL_FILE = path.join(process.cwd(), "data/scraped-posts-full.json");
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
    .replace(/^\d+\s*[-–]\s*/i, "")
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

  // Already formatted date
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

async function main() {
  console.log("Merging scraped posts with existing data...\n");

  // Load scraped posts - prefer full content version if available
  let scrapedPosts = [];
  if (fs.existsSync(SCRAPED_FULL_FILE)) {
    scrapedPosts = JSON.parse(fs.readFileSync(SCRAPED_FULL_FILE, "utf8"));
    console.log(`Loaded ${scrapedPosts.length} scraped posts (with full content)`);
  } else if (fs.existsSync(SCRAPED_FILE)) {
    scrapedPosts = JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf8"));
    console.log(`Loaded ${scrapedPosts.length} scraped posts (excerpts only)`);
  } else {
    console.log("No scraped posts file found. Will use existing markdown files only.");
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
  console.log(`Found ${markdownFiles.length} markdown files`);

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
        publishedAt = "January 1, 2025"; // Default fallback
      }

      // Determine the best image to use
      let imageUrl = data.imageUrl || "/images/fullLogo.jpeg";
      if (scraped?.imageUrl && scraped.imageUrl.startsWith("http")) {
        imageUrl = scraped.imageUrl;
      }

      // Use full content from scraping if available, otherwise use markdown content
      let postContent = "";
      if (scraped?.fullContent) {
        postContent = scraped.fullContent;
      } else if (content) {
        // Convert markdown content to basic HTML
        postContent = content
          .split('\n\n')
          .filter(p => p.trim())
          .map(p => {
            const trimmed = p.trim();
            if (trimmed.startsWith('# ')) return `<h1>${trimmed.slice(2)}</h1>`;
            if (trimmed.startsWith('## ')) return `<h2>${trimmed.slice(3)}</h2>`;
            if (trimmed.startsWith('### ')) return `<h3>${trimmed.slice(4)}</h3>`;
            if (trimmed.startsWith('**') && trimmed.endsWith('**')) return `<h3>${trimmed.slice(2, -2)}</h3>`;
            return `<p>${trimmed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>`;
          })
          .join('\n\n');
      }

      postsFromMarkdown.push({
        id: slug,
        title: cleanTitle(scraped?.title || data.title || fileName),
        excerpt: scraped?.excerpt || (data.excerpt && data.excerpt !== "Home" ? data.excerpt : getExcerpt(content)),
        content: postContent,
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
  // These are the "new" posts that need to be added
  const newPosts = [];
  for (const [slug, scraped] of scrapedMap) {
    if (!scraped.error && scraped.title) {
      newPosts.push({
        id: slug,
        title: cleanTitle(scraped.title),
        excerpt: scraped.excerpt || "",
        content: scraped.fullContent || `<p>${scraped.excerpt || ""}</p>`,
        author: {
          name: "Zack Edwards",
          avatar: "/images/board/zack.png",
          role: "Content Creator",
        },
        category: "Education", // Default category for new posts
        publishedAt: formatDate(scraped.lastmod) || "January 1, 2025",
        readTime: scraped.fullContent ? `${Math.ceil(scraped.fullContent.split(/\s+/).length / 200)} min read` : "5 min read",
        imageUrl: scraped.imageUrl || "/images/fullLogo.jpeg",
        featured: false,
        isNew: true, // Mark as new for reference
      });
    }
  }

  console.log(`\nNew posts from scraping: ${newPosts.length}`);

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

  // Print date range
  const dates = allPosts
    .map((p) => new Date(p.publishedAt))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a - b);

  if (dates.length > 0) {
    console.log(`\nDate range: ${dates[0].toDateString()} - ${dates[dates.length - 1].toDateString()}`);
  }
}

main().catch(console.error);
