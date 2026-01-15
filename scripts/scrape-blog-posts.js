/**
 * Scrape blog posts from XogosGaming.com
 * Gets publish dates and featured images for all posts
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const SITEMAP_URL = "https://www.xogosgaming.com/blog-posts-sitemap.xml";
const OUTPUT_FILE = path.join(process.cwd(), "data/scraped-posts.json");
const BATCH_SIZE = 10; // Process posts in batches to avoid overwhelming the server
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds between batches

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSitemap(browser) {
  console.log("Fetching sitemap...");
  const page = await browser.newPage();
  await page.goto(SITEMAP_URL, { waitUntil: "networkidle0" });

  const content = await page.content();
  await page.close();

  // Parse URLs and lastmod dates from sitemap XML
  const posts = [];
  const urlRegex = /<loc>(https:\/\/www\.xogosgaming\.com\/post\/[^<]+)<\/loc>/g;
  const lastmodRegex = /<lastmod>([^<]+)<\/lastmod>/g;

  let urlMatch;
  const urls = [];
  while ((urlMatch = urlRegex.exec(content)) !== null) {
    urls.push(urlMatch[1]);
  }

  let lastmodMatch;
  const lastmods = [];
  while ((lastmodMatch = lastmodRegex.exec(content)) !== null) {
    lastmods.push(lastmodMatch[1]);
  }

  // Match URLs with their lastmod dates
  for (let i = 0; i < urls.length; i++) {
    posts.push({
      url: urls[i],
      lastmod: lastmods[i] || null,
    });
  }

  console.log(`Found ${posts.length} posts in sitemap`);
  return posts;
}

async function scrapePost(page, url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Get the slug from URL
    const slug = url.split("/post/")[1];

    // Try to get og:image meta tag
    const ogImage = await page.$eval('meta[property="og:image"]', (el) => el.content).catch(() => null);

    // Try to get the first large image in the article
    const articleImage = await page.$eval(
      'article img, .blog-post img, .post-content img, [data-testid="richTextElement"] img',
      (el) => el.src
    ).catch(() => null);

    // Try to get publish date from various possible locations
    const publishDate = await page.$eval(
      'time, .publish-date, .post-date, [data-hook="post-publish-date"], .blog-post-date',
      (el) => el.textContent || el.getAttribute("datetime")
    ).catch(() => null);

    // Get the title
    const title = await page.$eval(
      'h1, [data-hook="post-title"]',
      (el) => el.textContent.trim()
    ).catch(() => null);

    // Get excerpt from meta description
    const excerpt = await page.$eval(
      'meta[name="description"], meta[property="og:description"]',
      (el) => el.content
    ).catch(() => null);

    return {
      slug,
      url,
      title,
      excerpt,
      imageUrl: ogImage || articleImage,
      publishDate,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      slug: url.split("/post/")[1],
      url,
      error: error.message,
    };
  }
}

async function main() {
  console.log("Starting blog post scraper...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    // Get all post URLs from sitemap
    const sitemapPosts = await fetchSitemap(browser);

    // Open a page for scraping
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    const scrapedPosts = [];
    let processed = 0;

    // Process in batches
    for (let i = 0; i < sitemapPosts.length; i += BATCH_SIZE) {
      const batch = sitemapPosts.slice(i, i + BATCH_SIZE);

      for (const post of batch) {
        const scraped = await scrapePost(page, post.url);
        scraped.lastmod = post.lastmod;
        scrapedPosts.push(scraped);
        processed++;

        if (processed % 50 === 0) {
          console.log(`Processed ${processed}/${sitemapPosts.length} posts...`);
          // Save intermediate results
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedPosts, null, 2));
        }
      }

      // Delay between batches
      if (i + BATCH_SIZE < sitemapPosts.length) {
        await sleep(DELAY_BETWEEN_BATCHES);
      }
    }

    await page.close();

    // Save final results
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedPosts, null, 2));
    console.log(`\nScraping complete! Saved ${scrapedPosts.length} posts to ${OUTPUT_FILE}`);

    // Print summary
    const withImages = scrapedPosts.filter((p) => p.imageUrl).length;
    const withDates = scrapedPosts.filter((p) => p.publishDate || p.lastmod).length;
    const withErrors = scrapedPosts.filter((p) => p.error).length;

    console.log(`\nSummary:`);
    console.log(`  Posts with images: ${withImages}`);
    console.log(`  Posts with dates: ${withDates}`);
    console.log(`  Posts with errors: ${withErrors}`);

  } finally {
    await browser.close();
  }
}

main().catch(console.error);
