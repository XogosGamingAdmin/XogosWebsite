/**
 * Scrape AI Education Articles from Xogos Gaming Wix Site
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const aiEducationPosts = [
  'chapter-1-debt-free-millionaire-ai-what-is-ai',
  'chapter-2-how-ai-works-machine-learning-and-neural-networks',
  'chapter-3-the-ethics-and-laws-of-ai',
  'chapter-4-ai-in-everyday-life-and-the-workplace',
  'chapter-5-prompt-engineering-101',
  'chapter-6-conversational-design-and-role-assignments',
  'chapter-7-fact-checking-and-critical-thinking-in-the-age-of-ai',
  'chapter-8-ai-collaboration-for-research-and-problem-solving',
  'chapter-9-writing-with-ai-essays-articles-and-reports',
  'chapter-10-creating-professional-documents-and-proposals',
  'chapter-11-ai-in-storytelling-journalism-and-education',
  'chapter-12-language-translation-accessibility-communication',
  'chapter-13-ai-image-generation-and-graphic-design',
  'chapter-14-ai-audio-creation-and-music-production',
  'chapter-15-ai-video-editing-and-film-production',
  'chapter-16-animation-3d-design-and-virtual-worlds',
  'chapter-17-ai-in-marketing-and-advertising',
  'chapter-18-ai-and-data-analysis-for-decision-making',
  'chapter-19-ai-in-finance-accounting-and-legal-compliance',
  'chapter-20-entrepreneurship-and-ai-startups',
  'chapter-21-understanding-coding-and-apis-in-ai-systems',
];

function htmlToMarkdown(html) {
  if (!html) return '';

  return html
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '#### $1\n\n')
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
    // Bold/italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, '[$2]($1)')
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Divs and spans
    .replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n')
    .replace(/<span[^>]*>(.*?)<\/span>/gis, '$1')
    // Remove remaining tags
    .replace(/<[^>]+>/g, '')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .trim();
}

async function scrapePost(browser, slug) {
  const url = `https://www.xogosgaming.com/post/${slug}`;
  const page = await browser.newPage();

  try {
    console.log(`Scraping: ${slug}`);

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 15000 }).catch(() => {});

    // Additional wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract content
    const data = await page.evaluate(() => {
      // Get title
      const titleEl = document.querySelector('h1');
      const title = titleEl ? titleEl.innerText.trim() : '';

      // Try various content selectors for Wix
      let contentHtml = '';
      const contentSelectors = [
        '[data-hook="post-description"]',
        '[data-hook="post-content"]',
        '.post-content',
        '.blog-post-page-font',
        '[class*="rich-content-viewer"]',
        'article',
        '.wixui-rich-text',
      ];

      for (const selector of contentSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerHTML.length > 100) {
          contentHtml = el.innerHTML;
          break;
        }
      }

      // If still no content, try getting all text
      if (!contentHtml) {
        const main = document.querySelector('main') || document.body;
        contentHtml = main.innerHTML;
      }

      // Get the text content for excerpt
      const firstP = document.querySelector('p');
      const excerpt = firstP ? firstP.innerText.substring(0, 300) : '';

      return { title, contentHtml, excerpt };
    });

    await page.close();
    return data;
  } catch (error) {
    console.error(`Error scraping ${slug}:`, error.message);
    await page.close();
    return null;
  }
}

function savePost(slug, data) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'ai-education');
  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  // Clean up the title
  const title = data.title.replace(/^Chapter \d+\s*[-–—]\s*/i, '').trim();
  const chapterMatch = slug.match(/chapter-(\d+)/);
  const chapterNum = chapterMatch ? chapterMatch[1] : '';
  const fullTitle = chapterNum ? `Chapter ${chapterNum} - ${title}` : title;

  const markdown = `---
title: "${fullTitle.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "AI Education"
topic: "AI Education"
publishedAt: "December 2, 2025"
author: "Zack Edwards"
imageUrl: "/images/fullLogo.jpeg"
readTime: "${readTime}"
---

${content}
`;

  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`  Saved: ${slug} (${wordCount} words)`);
}

async function main() {
  console.log('Starting AI Education scraper...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  let successCount = 0;
  let failCount = 0;

  for (const slug of aiEducationPosts) {
    const data = await scrapePost(browser, slug);

    if (data && data.title && data.contentHtml && data.contentHtml.length > 200) {
      savePost(slug, data);
      successCount++;
    } else {
      console.log(`  Skipped (no/insufficient content): ${slug}`);
      failCount++;
    }

    // Rate limiting - be nice to the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();

  console.log('\n=== Scraping Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
