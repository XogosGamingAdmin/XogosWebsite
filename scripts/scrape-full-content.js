/**
 * Scrape FULL blog post content from XogosGaming.com (Wix site)
 * Gets complete article text with proper HTML formatting
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const SCRAPED_FILE = path.join(process.cwd(), "data/scraped-posts.json");
const OUTPUT_FILE = path.join(process.cwd(), "data/scraped-posts-full.json");
const DELAY_BETWEEN_REQUESTS = 2000;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeFullContent(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

    // Wait for Wix content to fully load
    await sleep(3000);

    // Scroll down to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await sleep(1000);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await sleep(1000);

    const result = await page.evaluate(() => {
      // Helper to clean text
      const cleanText = (text) => {
        return text
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n\n')
          .trim();
      };

      // Wix uses iframes for blog content sometimes
      const iframes = document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const iframeText = iframeDoc.body?.innerText || '';
            if (iframeText.length > 500) {
              return { content: `<p>${cleanText(iframeText)}</p>`, source: 'iframe' };
            }
          }
        } catch (e) {
          // Cross-origin iframe, skip
        }
      }

      // Try multiple strategies to find content
      let bestContent = '';
      let bestLength = 0;

      // Strategy 1: Look for Wix rich text elements
      const wixRichText = document.querySelectorAll('[data-testid="richTextElement"], [class*="rich-text"], [class*="wixui-rich-text"]');
      wixRichText.forEach(el => {
        const text = el.innerText || '';
        if (text.length > bestLength) {
          bestContent = el.innerHTML;
          bestLength = text.length;
        }
      });

      // Strategy 2: Look for post content containers
      const postContainers = document.querySelectorAll('[class*="post-content"], [class*="blog-post"], article, [class*="PostContent"]');
      postContainers.forEach(el => {
        const text = el.innerText || '';
        if (text.length > bestLength) {
          bestContent = el.innerHTML;
          bestLength = text.length;
        }
      });

      // Strategy 3: Find the div with the most paragraph text
      const allDivs = document.querySelectorAll('div, section, article');
      allDivs.forEach(div => {
        const paragraphs = div.querySelectorAll('p, h1, h2, h3, h4, span[class*="font"]');
        let combinedText = '';
        paragraphs.forEach(p => {
          combinedText += (p.innerText || '') + ' ';
        });
        if (combinedText.length > bestLength && paragraphs.length > 3) {
          bestLength = combinedText.length;
          // Build HTML from paragraphs
          let html = '';
          paragraphs.forEach(p => {
            const text = cleanText(p.innerText || '');
            if (!text) return;
            const tagName = p.tagName.toLowerCase();
            if (tagName.match(/^h[1-6]$/)) {
              html += `<${tagName}>${text}</${tagName}>\n\n`;
            } else if (text.length < 80 && !text.includes('.')) {
              // Short text without period is likely a heading
              html += `<h3>${text}</h3>\n\n`;
            } else if (text.length > 20) {
              html += `<p>${text}</p>\n\n`;
            }
          });
          bestContent = html;
        }
      });

      // Strategy 4: Get all visible text and structure it
      if (bestLength < 500) {
        const body = document.body;
        const allText = body.innerText || '';

        // Find where the main content starts (usually after navigation)
        const lines = allText.split('\n').filter(line => line.trim().length > 0);
        let contentStart = 0;
        let contentEnd = lines.length;

        // Skip header/nav content
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].length > 200) {
            contentStart = i;
            break;
          }
        }

        // Skip footer content
        for (let i = lines.length - 1; i > contentStart; i--) {
          if (lines[i].length > 200) {
            contentEnd = i + 1;
            break;
          }
        }

        const contentLines = lines.slice(contentStart, contentEnd);
        let html = '';
        contentLines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed) return;
          if (trimmed.length < 80 && !trimmed.includes('.')) {
            html += `<h3>${trimmed}</h3>\n\n`;
          } else {
            html += `<p>${trimmed}</p>\n\n`;
          }
        });

        if (html.length > bestLength) {
          bestContent = html;
          bestLength = html.length;
        }
      }

      // Clean up the HTML
      if (bestContent) {
        // Remove script tags, style tags, and other non-content
        bestContent = bestContent
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
          .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/<[^>]+class="[^"]*nav[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, '')
          .replace(/<img[^>]*>/gi, '') // Remove images for now
          .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1') // Remove links but keep text
          .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1') // Unwrap spans
          .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1') // Unwrap divs
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      }

      return {
        content: bestContent,
        length: bestLength,
        source: 'dom'
      };
    });

    return result;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return { content: '', error: error.message };
  }
}

async function main() {
  console.log("Loading existing scraped posts...");

  if (!fs.existsSync(SCRAPED_FILE)) {
    console.error("No scraped-posts.json found. Run scrape-posts first.");
    process.exit(1);
  }

  let scrapedPosts = JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf8"));
  console.log(`Found ${scrapedPosts.length} posts to scrape\n`);

  // Check if we have a partial run to resume from
  let existingFull = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    existingFull = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
    console.log(`Found ${existingFull.length} already scraped posts, resuming...\n`);

    // Create a set of already scraped slugs
    const scrapedSlugs = new Set(existingFull.filter(p => p.fullContent).map(p => p.slug));

    // Filter out already scraped posts
    const remaining = scrapedPosts.filter(p => !scrapedSlugs.has(p.slug));
    console.log(`${remaining.length} posts remaining to scrape\n`);

    if (remaining.length === 0) {
      console.log("All posts already scraped!");
      return;
    }

    scrapedPosts = remaining;
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  page.setDefaultNavigationTimeout(90000);

  // Disable images and CSS to speed up loading
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'image' || req.resourceType() === 'font') {
      req.abort();
    } else {
      req.continue();
    }
  });

  const updatedPosts = [...existingFull];
  let processed = 0;
  let success = 0;
  let errors = 0;

  for (let i = 0; i < scrapedPosts.length; i++) {
    const post = scrapedPosts[i];

    if (!post.url) {
      continue;
    }

    console.log(`[${existingFull.length + i + 1}/${existingFull.length + scrapedPosts.length}] Scraping: ${post.slug}`);

    const result = await scrapeFullContent(page, post.url);

    const updatedPost = { ...post };

    if (result.content && result.content.length > 200) {
      updatedPost.fullContent = result.content;
      console.log(`  ✓ Got ${result.content.length} chars (${result.source})`);
      success++;
    } else {
      console.log(`  ✗ Content too short (${result.content?.length || 0} chars)`);
      // Still save the excerpt as fallback content
      updatedPost.fullContent = `<p>${post.excerpt || ''}</p>`;
      errors++;
    }

    updatedPosts.push(updatedPost);
    processed++;

    // Save progress every 10 posts
    if (processed % 10 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedPosts, null, 2));
      console.log(`\n--- Saved progress: ${success} successful, ${errors} failed ---\n`);
    }

    await sleep(DELAY_BETWEEN_REQUESTS);
  }

  await browser.close();

  // Final save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedPosts, null, 2));

  console.log(`\n========================================`);
  console.log(`Scraping complete!`);
  console.log(`Total processed: ${processed}`);
  console.log(`Successful: ${success}`);
  console.log(`Failed (using excerpt): ${errors}`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log(`========================================\n`);
}

main().catch(console.error);
