/**
 * Scrape full content from recent Wix blog posts - V3
 * More aggressive filtering of navigation/footer content
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
    await sleep(6000);

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

    const result = await page.evaluate(() => {
      // Helper to clean text
      const cleanText = (text) => {
        if (!text) return '';
        return text
          .replace(/\u00A0/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      };

      // Texts that indicate we've reached the footer/end of article
      const stopPhrases = [
        'post not marked as liked',
        'write a comment',
        'take a look at our portal',
        'totally medieval',
        'battles and thrones',
        'physical education',
        'debt-free millionaire',
        'personal finance',
        'i accept terms',
        'lightning round',
        'historical conquest',
        'bug and seek',
        'recent posts',
        'all posts',
        'subscribe',
        'sign up',
        'log in',
        'sign in',
        '©2023',
        '©2024',
        '©2025',
        'powered and secured',
        'xogos gaming inc',
        'receive news and updates',
        'exclusive xogos member',
      ];

      const shouldStop = (text) => {
        const lower = text.toLowerCase();
        for (const phrase of stopPhrases) {
          if (lower.includes(phrase)) return true;
        }
        return false;
      };

      // Get all paragraphs from the rich text content area
      const contentBlocks = [];
      const seenTexts = new Set();

      // Try to find the main content area
      const richTextAreas = document.querySelectorAll('[data-testid="richTextElement"]');

      for (const area of richTextAreas) {
        // Get all child elements that contain text
        const elements = area.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');

        for (const el of elements) {
          const text = cleanText(el.innerText);

          // Skip short or duplicate text
          if (!text || text.length < 10) continue;
          if (seenTexts.has(text)) continue;

          // Check if we've hit the footer
          if (shouldStop(text)) break;

          seenTexts.add(text);

          // Determine if heading based on style
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          const fontWeight = parseInt(style.fontWeight);
          const tagName = el.tagName.toLowerCase();

          const isHeading = tagName.match(/^h[1-6]$/) ||
                           fontSize > 18 ||
                           fontWeight >= 600 ||
                           (text.length < 80 && !text.includes('.') && !text.includes(','));

          const rect = el.getBoundingClientRect();

          contentBlocks.push({
            text: text,
            isHeading: isHeading && text.length < 150,
            top: rect.top + window.scrollY
          });
        }
      }

      // If no rich text found, fall back to scanning the page
      if (contentBlocks.length < 10) {
        const allElements = document.querySelectorAll('p, span');

        for (const el of allElements) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') continue;

          // Only get direct text content
          let text = '';
          for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              text += node.textContent;
            }
          }
          text = cleanText(text);

          if (!text || text.length < 20) continue;
          if (seenTexts.has(text)) continue;
          if (shouldStop(text)) continue;

          seenTexts.add(text);

          const fontSize = parseFloat(style.fontSize);
          const fontWeight = parseInt(style.fontWeight);
          const isHeading = fontSize > 18 || fontWeight >= 600;

          const rect = el.getBoundingClientRect();

          contentBlocks.push({
            text: text,
            isHeading: isHeading && text.length < 150,
            top: rect.top + window.scrollY
          });
        }
      }

      // Sort by position
      contentBlocks.sort((a, b) => a.top - b.top);

      // Build HTML, stopping at footer content
      let html = '';
      for (const block of contentBlocks) {
        // Double-check we haven't hit footer
        if (shouldStop(block.text)) break;

        if (block.isHeading) {
          html += `<h3><strong>${block.text}</strong></h3>\n\n`;
        } else {
          html += `<p>${block.text}</p>\n\n`;
        }
      }

      // Clean up the HTML - merge fragmented sentences
      html = html
        .replace(/<\/p>\n\n<p>([,;])/g, '$1</p>\n\n<p>')  // Merge orphaned punctuation
        .replace(/<p>(\d+:\d+\s*[ap]\.?m\.?)<\/p>/gi, '')  // Remove standalone times
        .trim();

      return {
        content: html,
        blockCount: contentBlocks.length,
        length: html.length
      };
    });

    return result;
  } catch (error) {
    console.error(`  Error scraping ${url}:`, error.message);
    return { content: '', error: error.message };
  }
}

// Post-process content to fix common issues
function postProcessContent(html) {
  // Remove footer content that might have slipped through
  const footerPatterns = [
    /<h3><strong>Take a Look at our Portal<\/strong><\/h3>[\s\S]*$/i,
    /<p>Post not marked as liked<\/p>[\s\S]*$/i,
    /<p>Write a comment[\s\S]*$/i,
    /<p>Totally Medieval<\/p>[\s\S]*$/i,
    /<h3><strong>Recent Posts<\/strong><\/h3>[\s\S]*$/i,
  ];

  let cleaned = html;
  for (const pattern of footerPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}

async function main() {
  console.log("Scraping full content for recent blog posts (V3)...\n");

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
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );
  page.setDefaultNavigationTimeout(120000);
  await page.setViewport({ width: 1920, height: 1080 });

  let success = 0;
  let failed = 0;

  for (let i = 0; i < POSTS_TO_SCRAPE.length; i++) {
    const { slug, url } = POSTS_TO_SCRAPE[i];
    console.log(`[${i + 1}/${POSTS_TO_SCRAPE.length}] Scraping: ${slug}`);

    const result = await scrapeFullContent(page, url, slug);

    if (result.content && result.content.length > 1000) {
      // Post-process to remove any remaining footer content
      const cleanedContent = postProcessContent(result.content);

      // Find and update the post in generated posts
      const postIndex = generatedPosts.findIndex(p => p.id === slug);
      if (postIndex !== -1) {
        generatedPosts[postIndex].content = cleanedContent;
        console.log(`  SUCCESS: Got ${cleanedContent.length} chars`);
        success++;
      } else {
        console.log(`  WARNING: Post not found in generated posts`);
      }
    } else {
      console.log(`  FAILED: Content too short (${result.content?.length || 0} chars)`);
      failed++;
    }

    // Save after each post
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
