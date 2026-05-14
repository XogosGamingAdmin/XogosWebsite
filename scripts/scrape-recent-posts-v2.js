/**
 * Scrape full content from recent Wix blog posts (Dec 3 onwards) - V2
 * Improved scraping to get complete article content
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const GENERATED_FILE = path.join(process.cwd(), "data/generated-posts.json");
const DELAY_BETWEEN_REQUESTS = 4000;

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

async function scrapeFullContent(page, url, slug) {
  try {
    console.log(`  Loading: ${url}`);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });

    // Wait longer for Wix content to fully render
    await sleep(5000);

    // Scroll through the entire page to trigger lazy loading
    await page.evaluate(async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const totalHeight = document.body.scrollHeight;
      let currentPosition = 0;
      const step = 300;

      while (currentPosition < totalHeight) {
        window.scrollTo(0, currentPosition);
        currentPosition += step;
        await delay(100);
      }

      // Scroll back to top
      window.scrollTo(0, 0);
      await delay(1000);
    });

    await sleep(3000);

    const result = await page.evaluate((postSlug) => {
      // Helper to clean text
      const cleanText = (text) => {
        if (!text) return '';
        return text
          .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
          .replace(/\s+/g, ' ')
          .trim();
      };

      // Texts to filter out (navigation, footer, etc.)
      const filterPatterns = [
        /^all posts$/i,
        /^recent posts$/i,
        /^subscribe$/i,
        /^sign in$/i,
        /^log in$/i,
        /^cookie/i,
        /^©\d{4}/i,
        /powered and secured by/i,
        /xogos gaming inc/i,
        /receive news and updates/i,
        /be an exclusive xogos member/i,
        /^chapter \d+.*first property$/i,
        /^chapter \d+.*paycheck$/i,
        /^chapter \d+.*graduation$/i,
        /^chapter \d+.*money work/i,
        /^chapter \d+.*weight showed/i,
        /^home$/i,
        /^blog$/i,
        /^contact$/i,
        /^about$/i,
        /^games$/i,
      ];

      const shouldFilter = (text) => {
        const lower = text.toLowerCase().trim();
        // Filter out very short texts
        if (lower.length < 15) return true;
        // Filter out navigation/footer items
        for (const pattern of filterPatterns) {
          if (pattern.test(lower)) return true;
        }
        // Filter if it looks like a link to another chapter (but not the current article's title)
        if (/^chapter \d+/i.test(lower) && lower.length < 100) {
          return true;
        }
        return false;
      };

      // Find all text content in the page
      const contentBlocks = [];

      // Strategy: Get all paragraphs and spans with substantial text
      const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div');

      for (const el of textElements) {
        // Skip elements that are hidden
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          continue;
        }

        // Get direct text content (not from children)
        let text = '';
        for (const node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
          }
        }
        text = cleanText(text);

        // If no direct text, try innerText for leaf elements
        if (!text && el.children.length === 0) {
          text = cleanText(el.innerText);
        }

        if (!text || text.length < 15) continue;
        if (shouldFilter(text)) continue;

        // Check if this text is already captured (avoid duplicates)
        const isDuplicate = contentBlocks.some(block =>
          block.text === text ||
          block.text.includes(text) ||
          text.includes(block.text)
        );
        if (isDuplicate) continue;

        // Determine if this is a heading
        const tagName = el.tagName.toLowerCase();
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight);
        const isHeading = tagName.match(/^h[1-6]$/) ||
                         fontSize > 18 ||
                         fontWeight >= 600;

        // Get position for ordering
        const rect = el.getBoundingClientRect();

        contentBlocks.push({
          text: text,
          isHeading: isHeading && text.length < 200,
          top: rect.top + window.scrollY,
          tagName: tagName
        });
      }

      // Sort by position on page
      contentBlocks.sort((a, b) => a.top - b.top);

      // Remove duplicates and near-duplicates more aggressively
      const uniqueBlocks = [];
      for (const block of contentBlocks) {
        const isDup = uniqueBlocks.some(existing => {
          // Check for substring match
          if (existing.text.includes(block.text) || block.text.includes(existing.text)) {
            return true;
          }
          // Check for high similarity (first 50 chars match)
          if (existing.text.substring(0, 50) === block.text.substring(0, 50)) {
            return true;
          }
          return false;
        });
        if (!isDup) {
          uniqueBlocks.push(block);
        }
      }

      // Build HTML
      let html = '';
      for (const block of uniqueBlocks) {
        if (block.isHeading) {
          html += `<h3><strong>${block.text}</strong></h3>\n\n`;
        } else {
          html += `<p>${block.text}</p>\n\n`;
        }
      }

      return {
        content: html.trim(),
        blockCount: uniqueBlocks.length,
        length: html.length
      };
    }, slug);

    return result;
  } catch (error) {
    console.error(`  Error scraping ${url}:`, error.message);
    return { content: '', error: error.message };
  }
}

async function main() {
  console.log("Scraping full content for recent blog posts (V2)...\n");

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
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu"
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );
  page.setDefaultNavigationTimeout(120000);

  // Set large viewport
  await page.setViewport({ width: 1920, height: 1080 });

  let success = 0;
  let failed = 0;

  for (let i = 0; i < POSTS_TO_SCRAPE.length; i++) {
    const { slug, url } = POSTS_TO_SCRAPE[i];
    console.log(`[${i + 1}/${POSTS_TO_SCRAPE.length}] Scraping: ${slug}`);

    const result = await scrapeFullContent(page, url, slug);

    if (result.content && result.content.length > 1000) {
      // Find and update the post in generated posts
      const postIndex = generatedPosts.findIndex(p => p.id === slug);
      if (postIndex !== -1) {
        generatedPosts[postIndex].content = result.content;
        console.log(`  SUCCESS: Got ${result.length} chars (${result.blockCount} blocks)`);
        success++;
      } else {
        console.log(`  WARNING: Post not found in generated posts`);
      }
    } else {
      console.log(`  FAILED: Content too short (${result.content?.length || 0} chars)`);
      failed++;
    }

    // Save after each post in case of crash
    fs.writeFileSync(GENERATED_FILE, JSON.stringify(generatedPosts, null, 2));

    await sleep(DELAY_BETWEEN_REQUESTS);
  }

  await browser.close();

  console.log(`\n========================================`);
  console.log(`Scraping complete!`);
  console.log(`Successful: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Updated: ${GENERATED_FILE}`);
  console.log(`========================================\n`);
}

main().catch(console.error);
