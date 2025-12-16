/**
 * Blog Post Scraper for Xogos Gaming
 *
 * This script scrapes blog posts from the Wix site and saves them as markdown files.
 *
 * Usage:
 *   1. Install dependencies: npm install puppeteer
 *   2. Run: node scripts/scrape-posts.js
 *
 * The script will:
 *   - Fetch the sitemap to get all post URLs
 *   - Visit each post page and extract the content
 *   - Save as markdown files in the content/posts directory
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Category mappings based on URL patterns
const categoryMappings = {
  'chapter-\\d+-debt-free-millionaire-ai': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-what-is-ai': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-how-ai-works': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-the-ethics': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-in-everyday': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-prompt-engineering': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-conversational-design': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-fact-checking': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-collaboration': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-writing-with-ai': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-creating-professional': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-in-storytelling': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-language-translation': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-image': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-audio': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-video': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-animation': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-in-marketing': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-and-data': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-ai-in-finance': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-entrepreneurship': { category: 'AI Education', folder: 'ai-education' },
  'chapter-\\d+-understanding-coding': { category: 'AI Education', folder: 'ai-education' },

  // Financial Literacy
  'chapter-\\d+-what-is-money': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-needs-vs-wants': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-finding-priorities': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-the-value-of-work': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-introduction-to-budgeting': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-income-and-revenue': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-expenses': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-savings': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-what-is-credit': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-good-debt': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-toxic-loans': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-what-are-credit-cards': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-learn-banking': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-bank-accounts': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-debit-vs-credit': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-digital-payments': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-earning-income': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-paychecks': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-taxes': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-choosing-a-career': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-the-power-of-compound': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-introduction-to-investing': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-retirement': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-cryptocurrency': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-real-estate': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-planning-for-big': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-insurance': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-college-costs': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-the-dangers-of-debt': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-money-relationships': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-avoiding-financial': { category: 'Financial Literacy', folder: 'financial-literacy' },
  'chapter-\\d+-path-to-freedom': { category: 'Financial Literacy', folder: 'financial-literacy' },

  // History topics
  'ancient-egypt': { category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  'colonial-life': { category: 'Colonial America', folder: 'history/colonial-america' },
  'colonial-america': { category: 'Colonial America', folder: 'history/colonial-america' },
  'age-of-exploration': { category: 'Age of Exploration', folder: 'history/age-of-exploration' },
  'ancient-africa': { category: 'Ancient Africa', folder: 'history/ancient-africa' },
  'indus-valley': { category: 'Indus Valley', folder: 'history/indus-valley' },
  'ancient-america': { category: 'Ancient America', folder: 'history/ancient-america' },
  'industrial-revolution': { category: 'Industrial Revolution', folder: 'history/industrial-revolution' },
  'ancient-china': { category: 'Ancient China', folder: 'history/ancient-china' },
  'ancient-rome': { category: 'Ancient Rome', folder: 'history/ancient-rome' },
  'civil-war': { category: 'Civil War', folder: 'history/civil-war' },

  // Lesson plans
  'lesson-plan': { category: 'Lesson Plans', folder: 'lesson-plans' },
};

function getCategory(slug) {
  for (const [pattern, info] of Object.entries(categoryMappings)) {
    if (new RegExp(pattern, 'i').test(slug)) {
      return info;
    }
  }
  return { category: "Creator's Notes", folder: 'creators-notes' };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function scrapePost(browser, url) {
  const page = await browser.newPage();

  try {
    console.log(`Scraping: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 }).catch(() => {});

    // Extract content
    const data = await page.evaluate(() => {
      // Get title
      const titleEl = document.querySelector('h1');
      const title = titleEl ? titleEl.innerText.trim() : '';

      // Get article content - try various selectors
      let content = '';
      const contentSelectors = [
        '[data-hook="post-content"]',
        '.post-content',
        'article',
        '.blog-post-content',
        '[class*="rich-content"]'
      ];

      for (const selector of contentSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          content = el.innerHTML;
          break;
        }
      }

      // Get date
      const dateEl = document.querySelector('[data-hook="post-date"], time, .post-date');
      const date = dateEl ? dateEl.innerText.trim() : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // Get author
      const authorEl = document.querySelector('[data-hook="post-author"], .post-author');
      const author = authorEl ? authorEl.innerText.trim() : 'Zack Edwards';

      // Get excerpt from meta or first paragraph
      const metaDesc = document.querySelector('meta[name="description"]');
      let excerpt = metaDesc ? metaDesc.content : '';
      if (!excerpt) {
        const firstP = document.querySelector('p');
        excerpt = firstP ? firstP.innerText.substring(0, 200) : '';
      }

      return { title, content, date, author, excerpt };
    });

    await page.close();
    return data;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    await page.close();
    return null;
  }
}

function htmlToMarkdown(html) {
  if (!html) return '';

  return html
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    // Bold/italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Remove remaining tags
    .replace(/<[^>]+>/g, '')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function savePost(slug, data, categoryInfo) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', categoryInfo.folder);

  // Ensure directory exists
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const content = htmlToMarkdown(data.content);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const markdown = `---
title: "${data.title.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"')}"
category: "${categoryInfo.category}"
topic: "${categoryInfo.category}"
publishedAt: "${data.date}"
author: "${data.author}"
imageUrl: "/images/fullLogo.jpeg"
readTime: "${readTime}"
---

${content}
`;

  const filePath = path.join(postsDir, `${slug}.md`);
  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`Saved: ${filePath}`);
}

async function main() {
  // List of all post URLs from sitemap (subset for testing)
  const postUrls = [
    // AI Education
    'https://www.xogosgaming.com/post/chapter-1-debt-free-millionaire-ai-what-is-ai',
    'https://www.xogosgaming.com/post/chapter-2-how-ai-works-machine-learning-and-neural-networks',
    'https://www.xogosgaming.com/post/chapter-3-the-ethics-and-laws-of-ai',
    'https://www.xogosgaming.com/post/chapter-4-ai-in-everyday-life-and-the-workplace',
    'https://www.xogosgaming.com/post/chapter-5-prompt-engineering-101',
    // Add more URLs as needed...
  ];

  console.log('Starting blog post scraper...');
  console.log(`Found ${postUrls.length} posts to scrape`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let successCount = 0;
  let failCount = 0;

  for (const url of postUrls) {
    const slug = url.split('/post/')[1];
    const categoryInfo = getCategory(slug);

    const data = await scrapePost(browser, url);

    if (data && data.title && data.content) {
      savePost(slug, data, categoryInfo);
      successCount++;
    } else {
      console.log(`Skipped (no content): ${slug}`);
      failCount++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();

  console.log('\n=== Scraping Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
