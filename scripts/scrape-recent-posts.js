/**
 * Scrape full content from recent Wix blog posts (Dec 3 onwards)
 * These posts don't have markdown files and only have excerpts
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const GENERATED_FILE = path.join(process.cwd(), "data/generated-posts.json");
const DELAY_BETWEEN_REQUESTS = 3000;

// Posts that need full content scraped
const POSTS_TO_SCRAPE = [
  { slug: "chapter-5-19-years-old-first-big-paycheck", url: "https://www.xogosgaming.com/post/chapter-5-19-years-old-first-big-paycheck" },
  { slug: "chapter-3-age-18-graduation-and-responsibility", url: "https://www.xogosgaming.com/post/chapter-3-age-18-graduation-and-responsibility" },
  { slug: "chapter-4-19-years-old-his-first-property", url: "https://www.xogosgaming.com/post/chapter-4-19-years-old-his-first-property" },
  { slug: "chapter-2-17-years-old-making-time-and-money-work-for-you", url: "https://www.xogosgaming.com/post/chapter-2-17-years-old-making-time-and-money-work-for-you" },
  { slug: "chapter-1-age-16-the-year-the-weight-showed-up", url: "https://www.xogosgaming.com/post/chapter-1-age-16-the-year-the-weight-showed-up" },
  { slug: "chapter-27-becoming-an-ai-empowered-leader", url: "https://www.xogosgaming.com/post/chapter-27-becoming-an-ai-empowered-leader" },
  { slug: "chapter-28-your-ai-portfolio-and-capstone-project", url: "https://www.xogosgaming.com/post/chapter-28-your-ai-portfolio-and-capstone-project" },
  { slug: "chapter-26-ai-in-different-careers", url: "https://www.xogosgaming.com/post/chapter-26-ai-in-different-careers" },
  { slug: "chapter-25-ai-and-the-future-of-work", url: "https://www.xogosgaming.com/post/chapter-25-ai-and-the-future-of-work" },
  { slug: "chapter-24-cybersecurity-and-responsible-ai-use", url: "https://www.xogosgaming.com/post/chapter-24-cybersecurity-and-responsible-ai-use" },
  { slug: "chapter-23-ai-automation-and-productivity-tools", url: "https://www.xogosgaming.com/post/chapter-23-ai-automation-and-productivity-tools" },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeFullContent(page, url) {
  try {
    console.log(`  Loading: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

    // Wait for Wix content to fully load
    await sleep(4000);

    // Scroll to load lazy content
    await page.evaluate(async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      for (let i = 0; i < 5; i++) {
        window.scrollBy(0, window.innerHeight);
        await delay(500);
      }
      window.scrollTo(0, 0);
    });
    await sleep(2000);

    const result = await page.evaluate(() => {
      // Helper to clean text
      const cleanText = (text) => {
        return text
          .replace(/\s+/g, ' ')
          .trim();
      };

      // Find the main content area - Wix uses specific patterns
      let contentElements = [];

      // Strategy 1: Look for rich text elements (Wix standard)
      const richTextElements = document.querySelectorAll('[data-testid="richTextElement"]');
      if (richTextElements.length > 0) {
        richTextElements.forEach(el => contentElements.push(el));
      }

      // Strategy 2: Look for post content containers
      if (contentElements.length === 0) {
        const postContent = document.querySelectorAll('[class*="post-content"], [class*="blog-post-content"], article');
        postContent.forEach(el => contentElements.push(el));
      }

      // Strategy 3: Find divs with substantial text content
      if (contentElements.length === 0) {
        const allDivs = document.querySelectorAll('div, section');
        allDivs.forEach(div => {
          const text = div.innerText || '';
          if (text.length > 1000) {
            contentElements.push(div);
          }
        });
      }

      // Process content and build HTML
      let html = '';
      let seenText = new Set();

      for (const container of contentElements) {
        // Get all text-containing elements
        const elements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');

        for (const el of elements) {
          // Skip if this element has child elements with text (avoid duplicates)
          if (el.children.length > 0 && el.querySelector('p, span')) {
            continue;
          }

          const text = cleanText(el.innerText || '');
          if (!text || text.length < 10 || seenText.has(text)) {
            continue;
          }
          seenText.add(text);

          const tagName = el.tagName.toLowerCase();
          const fontSize = window.getComputedStyle(el).fontSize;
          const fontWeight = window.getComputedStyle(el).fontWeight;
          const fontSizeNum = parseInt(fontSize);

          // Determine if this is a heading
          const isHeading = tagName.match(/^h[1-6]$/) ||
                           fontSizeNum > 20 ||
                           parseInt(fontWeight) >= 600 ||
                           (text.length < 100 && !text.includes('.'));

          if (isHeading && text.length < 200) {
            html += `<h3><strong>${text}</strong></h3>\n\n`;
          } else if (text.length > 50) {
            html += `<p>${text}</p>\n\n`;
          }
        }
      }

      // If we still don't have good content, try getting all visible text
      if (html.length < 500) {
        const body = document.body;
        const walker = document.createTreeWalker(
          body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        let paragraphs = [];
        let currentParagraph = '';

        while (walker.nextNode()) {
          const text = cleanText(walker.currentNode.textContent);
          if (text && text.length > 20) {
            // Check if parent is visible
            const parent = walker.currentNode.parentElement;
            if (parent) {
              const style = window.getComputedStyle(parent);
              if (style.display !== 'none' && style.visibility !== 'hidden') {
                paragraphs.push(text);
              }
            }
          }
        }

        // Filter out navigation/footer content
        const filteredParagraphs = paragraphs.filter(p => {
          const lower = p.toLowerCase();
          return !lower.includes('sign in') &&
                 !lower.includes('subscribe') &&
                 !lower.includes('all posts') &&
                 !lower.includes('recent posts') &&
                 !lower.includes('cookie') &&
                 p.length > 30;
        });

        html = filteredParagraphs.map(p => {
          if (p.length < 100 && !p.includes('.')) {
            return `<h3><strong>${p}</strong></h3>\n\n`;
          }
          return `<p>${p}</p>\n\n`;
        }).join('');
      }

      return {
        content: html.trim(),
        length: html.length
      };
    });

    return result;
  } catch (error) {
    console.error(`  Error scraping ${url}:`, error.message);
    return { content: '', error: error.message };
  }
}

async function main() {
  console.log("Scraping full content for recent blog posts...\n");

  // Load current generated posts
  if (!fs.existsSync(GENERATED_FILE)) {
    console.error("generated-posts.json not found!");
    process.exit(1);
  }

  let generatedPosts = JSON.parse(fs.readFileSync(GENERATED_FILE, "utf8"));
  console.log(`Loaded ${generatedPosts.length} existing posts`);
  console.log(`Need to scrape ${POSTS_TO_SCRAPE.length} posts for full content\n`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  page.setDefaultNavigationTimeout(90000);

  // Set viewport for better content loading
  await page.setViewport({ width: 1920, height: 1080 });

  let success = 0;
  let failed = 0;

  for (let i = 0; i < POSTS_TO_SCRAPE.length; i++) {
    const { slug, url } = POSTS_TO_SCRAPE[i];
    console.log(`[${i + 1}/${POSTS_TO_SCRAPE.length}] Scraping: ${slug}`);

    const result = await scrapeFullContent(page, url);

    if (result.content && result.content.length > 500) {
      // Find and update the post in generated posts
      const postIndex = generatedPosts.findIndex(p => p.id === slug);
      if (postIndex !== -1) {
        generatedPosts[postIndex].content = result.content;
        console.log(`  SUCCESS: Got ${result.content.length} chars`);
        success++;
      } else {
        console.log(`  WARNING: Post not found in generated posts`);
      }
    } else {
      console.log(`  FAILED: Content too short (${result.content?.length || 0} chars)`);
      failed++;
    }

    await sleep(DELAY_BETWEEN_REQUESTS);
  }

  await browser.close();

  // Save updated posts
  fs.writeFileSync(GENERATED_FILE, JSON.stringify(generatedPosts, null, 2));

  console.log(`\n========================================`);
  console.log(`Scraping complete!`);
  console.log(`Successful: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Updated: ${GENERATED_FILE}`);
  console.log(`========================================\n`);
}

main().catch(console.error);
