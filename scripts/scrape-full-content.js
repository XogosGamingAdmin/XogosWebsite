/**
 * Scrape FULL blog post content from XogosGaming.com
 * Gets complete article text with proper HTML formatting
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const SCRAPED_FILE = path.join(process.cwd(), "data/scraped-posts.json");
const OUTPUT_FILE = path.join(process.cwd(), "data/scraped-posts-full.json");
const BATCH_SIZE = 5;
const DELAY_BETWEEN_REQUESTS = 1500;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeFullContent(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for content to load
    await sleep(1000);

    const result = await page.evaluate(() => {
      // Find the main content area - Wix sites typically use these selectors
      const contentSelectors = [
        '[data-hook="post-content"]',
        '.post-content',
        '.blog-post-content',
        '[data-testid="richTextElement"]',
        '.rich-text-content',
        'article',
        '.wixui-rich-text',
      ];

      let contentElement = null;
      for (const selector of contentSelectors) {
        contentElement = document.querySelector(selector);
        if (contentElement) break;
      }

      if (!contentElement) {
        // Try to find the main content by looking for the largest text block
        const allDivs = document.querySelectorAll('div');
        let maxText = '';
        let maxElement = null;
        allDivs.forEach(div => {
          const text = div.innerText || '';
          if (text.length > maxText.length && text.length > 500) {
            maxText = text;
            maxElement = div;
          }
        });
        contentElement = maxElement;
      }

      if (!contentElement) {
        return { content: '', error: 'Content element not found' };
      }

      // Extract and format the content as HTML
      let htmlContent = '';

      // Get all child elements and process them
      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) {
            return text;
          }
          return '';
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
          return '';
        }

        const tagName = node.tagName.toLowerCase();
        const innerText = node.innerText?.trim() || '';

        // Skip empty elements
        if (!innerText && !['img', 'br', 'hr'].includes(tagName)) {
          return '';
        }

        // Handle different element types
        switch (tagName) {
          case 'h1':
            return `<h1>${innerText}</h1>\n\n`;
          case 'h2':
            return `<h2>${innerText}</h2>\n\n`;
          case 'h3':
            return `<h3>${innerText}</h3>\n\n`;
          case 'h4':
            return `<h4>${innerText}</h4>\n\n`;
          case 'h5':
            return `<h5>${innerText}</h5>\n\n`;
          case 'h6':
            return `<h6>${innerText}</h6>\n\n`;
          case 'p':
            if (innerText) {
              return `<p>${innerText}</p>\n\n`;
            }
            return '';
          case 'ul':
          case 'ol':
            const items = Array.from(node.querySelectorAll('li'))
              .map(li => `<li>${li.innerText.trim()}</li>`)
              .join('\n');
            return `<${tagName}>\n${items}\n</${tagName}>\n\n`;
          case 'blockquote':
            return `<blockquote>${innerText}</blockquote>\n\n`;
          case 'strong':
          case 'b':
            return `<strong>${innerText}</strong>`;
          case 'em':
          case 'i':
            return `<em>${innerText}</em>`;
          case 'br':
            return '<br/>';
          case 'hr':
            return '<hr/>\n\n';
          case 'div':
          case 'span':
          case 'section':
          case 'article':
            // Process children
            let childContent = '';
            node.childNodes.forEach(child => {
              childContent += processNode(child);
            });
            // If it looks like a paragraph (has significant text and no block children)
            if (innerText && !node.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol')) {
              if (innerText.length > 50) {
                return `<p>${innerText}</p>\n\n`;
              }
            }
            return childContent;
          default:
            return '';
        }
      };

      // Process all direct children of content element
      const children = contentElement.children;
      for (let i = 0; i < children.length; i++) {
        htmlContent += processNode(children[i]);
      }

      // If we didn't get structured content, fall back to parsing text
      if (!htmlContent.trim() || htmlContent.length < 100) {
        const fullText = contentElement.innerText || '';
        // Split by double newlines to get paragraphs
        const paragraphs = fullText.split(/\n\n+/).filter(p => p.trim());
        htmlContent = paragraphs.map(p => {
          const trimmed = p.trim();
          // Check if it looks like a heading (short, possibly bold)
          if (trimmed.length < 100 && (trimmed.startsWith('**') || /^[A-Z][^.!?]*$/.test(trimmed))) {
            return `<h2>${trimmed.replace(/\*\*/g, '')}</h2>\n\n`;
          }
          return `<p>${trimmed}</p>\n\n`;
        }).join('');
      }

      // Clean up the content
      htmlContent = htmlContent
        .replace(/\n{3,}/g, '\n\n')  // Remove excessive newlines
        .replace(/<p>\s*<\/p>/g, '') // Remove empty paragraphs
        .replace(/<h[1-6]>\s*<\/h[1-6]>/g, '') // Remove empty headings
        .trim();

      return { content: htmlContent };
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

  const scrapedPosts = JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf8"));
  console.log(`Found ${scrapedPosts.length} posts to scrape full content for\n`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Set longer timeout
  page.setDefaultNavigationTimeout(60000);

  const updatedPosts = [];
  let processed = 0;
  let errors = 0;

  for (let i = 0; i < scrapedPosts.length; i++) {
    const post = scrapedPosts[i];

    if (!post.url) {
      updatedPosts.push(post);
      continue;
    }

    console.log(`[${i + 1}/${scrapedPosts.length}] Scraping: ${post.slug}`);

    const result = await scrapeFullContent(page, post.url);

    if (result.content && result.content.length > 100) {
      post.fullContent = result.content;
      console.log(`  ✓ Got ${result.content.length} chars of content`);
    } else {
      console.log(`  ✗ Failed to get content: ${result.error || 'Content too short'}`);
      errors++;
    }

    updatedPosts.push(post);
    processed++;

    // Save progress every 25 posts
    if (processed % 25 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedPosts, null, 2));
      console.log(`\n--- Saved progress: ${processed}/${scrapedPosts.length} ---\n`);
    }

    // Delay between requests
    await sleep(DELAY_BETWEEN_REQUESTS);
  }

  await browser.close();

  // Final save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedPosts, null, 2));

  console.log(`\n========================================`);
  console.log(`Scraping complete!`);
  console.log(`Total posts: ${scrapedPosts.length}`);
  console.log(`Successfully scraped: ${processed - errors}`);
  console.log(`Errors: ${errors}`);
  console.log(`Output saved to: ${OUTPUT_FILE}`);
  console.log(`========================================\n`);
}

main().catch(console.error);
