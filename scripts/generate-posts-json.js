const fs = require('fs');
const path = require('path');

// Configuration
const postsDir = path.join(__dirname, '..', 'content', 'posts');
const outputFile = path.join(__dirname, '..', 'data', 'generated-posts.json');

// Helper function to recursively find all .md files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Helper function to parse YAML front matter
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontMatterRegex);

  if (!match) return { data: {}, content: content };

  const frontMatter = match[1];
  const bodyContent = content.slice(match[0].length).trim();

  const data = {};
  const lines = frontMatter.split('\n');

  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      data[key] = value;
    }
  });

  return { data, content: bodyContent };
}

// Helper function to format category from folder name
function formatCategory(folderName) {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to generate slug from filename
function generateSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

// Helper function to clean title (remove "Chapter X - Chapter X:" prefix patterns)
function cleanTitle(title) {
  if (!title) return '';

  // Remove patterns like "Chapter 1 - Chapter 1:", "Chapter 1 - Chapter #1:", etc.
  let cleaned = title.replace(/^Chapter\s*\d+\s*[-–]\s*Chapter\s*[#]?\d+\s*:\s*/i, '');

  // Remove patterns like "Chapter 1 - 1." at the beginning
  cleaned = cleaned.replace(/^Chapter\s*\d+\s*[-–]\s*\d+\.\s*/i, '');

  // Remove leading numbers like "1. " or "12-" if they're part of the title
  cleaned = cleaned.replace(/^\d+[-.\s]+\s*/, '');

  return cleaned.trim();
}

// Helper function to get excerpt from content
function getExcerpt(content, maxLength = 200) {
  // Remove markdown formatting
  let text = content
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + '...';
}

// Helper function to parse date string to Date object for sorting
function parseDate(dateStr) {
  if (!dateStr) return new Date('2025-01-01');

  // Try parsing various date formats
  const months = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3,
    'may': 4, 'june': 5, 'july': 6, 'august': 7,
    'september': 8, 'october': 9, 'november': 10, 'december': 11
  };

  // Format: "December 2, 2025"
  const match = dateStr.match(/(\w+)\s+(\d+),?\s+(\d{4})/i);
  if (match) {
    const month = months[match[1].toLowerCase()];
    const day = parseInt(match[2]);
    const year = parseInt(match[3]);
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  // Try standard date parsing
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return new Date('2025-01-01');
}

// Get category from file path
function getCategoryFromPath(filePath, postsDir) {
  const relativePath = path.relative(postsDir, filePath);
  const parts = relativePath.split(path.sep);

  // If the file is in a subdirectory, use the first folder as category
  if (parts.length > 1) {
    // For nested folders like history/ancient-egypt, combine them
    if (parts.length > 2) {
      return formatCategory(parts[0]) + ' - ' + formatCategory(parts[1]);
    }
    return formatCategory(parts[0]);
  }

  return 'General';
}

// Main function
function generatePostsJson() {
  console.log('Finding markdown files...');
  const markdownFiles = findMarkdownFiles(postsDir);
  console.log(`Found ${markdownFiles.length} markdown files`);

  const posts = [];

  markdownFiles.forEach((filePath, index) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data: frontMatter, content: bodyContent } = parseFrontMatter(content);

      const filename = path.basename(filePath);
      const slug = generateSlug(filename);

      // Get category from front matter or folder
      let category = frontMatter.category || getCategoryFromPath(filePath, postsDir);

      // Clean up the title
      let title = cleanTitle(frontMatter.title) || slug.replace(/-/g, ' ');

      // Get excerpt
      let excerpt = frontMatter.excerpt;
      if (!excerpt || excerpt === 'Home' || excerpt.length < 20) {
        excerpt = getExcerpt(bodyContent);
      }

      // Build the post object
      const post = {
        id: slug,
        title: title,
        excerpt: excerpt,
        content: "",
        author: {
          name: frontMatter.author || "Zack Edwards",
          avatar: "/images/board/zack.png",
          role: "Content Creator"
        },
        category: category,
        publishedAt: frontMatter.publishedAt || "January 1, 2025",
        readTime: frontMatter.readTime || "5 min read",
        imageUrl: frontMatter.imageUrl || "/images/fullLogo.jpeg",
        featured: frontMatter.featured === 'true' || frontMatter.featured === true || false
      };

      posts.push(post);

      if ((index + 1) % 50 === 0) {
        console.log(`Processed ${index + 1}/${markdownFiles.length} files...`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });

  // Sort by publishedAt date (newest first)
  posts.sort((a, b) => {
    const dateA = parseDate(a.publishedAt);
    const dateB = parseDate(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Ensure data directory exists
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2), 'utf-8');

  console.log(`\nSuccessfully generated ${posts.length} posts to ${outputFile}`);

  // Print category summary
  const categories = {};
  posts.forEach(post => {
    categories[post.category] = (categories[post.category] || 0) + 1;
  });

  console.log('\nCategory breakdown:');
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} posts`);
  });
}

// Run the script
generatePostsJson();
