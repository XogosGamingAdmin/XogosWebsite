/**
 * Scrape Ancient Egypt Articles from Xogos Gaming Wix Site
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ancientEgyptPosts = [
  '1-heroes-and-villains-of-ancient-egypt-the-period-before-the-first-egyptian-dynasty',
  '2-heroes-and-villains-of-ancient-egypt-early-dynastic-period-unification-of-upper-and-lower-egypt',
  '3-heroes-and-villains-of-ancient-egypt-early-dynastic-period-old-kingdom-the-daw-of-egypt-s-gold',
  '4-heroes-and-villains-of-ancient-egypt-relgious-beliefs-of-the-egyptian-civilization-3000-2000-bc',
  '5-heroes-and-villains-of-ancient-egypt-the-forgotten-region-of-nubia',
  '6-heroes-and-villains-of-ancient-egypt-the-hyksos-invasion-of-the-lower-kingdom-of-egypt',
  '7-heroes-and-villains-of-ancient-egypt-the-great-pharaohs-of-queen-ahhotep-i-and-ahmose-i',
  '8-heroes-and-villains-of-ancient-egypt-the-great-pharaohs-hatshepsut-and-thutmose-iii',
  '9-heroes-and-villains-of-ancient-egypt-akhenaten-reign-revolutionary-pharaoh',
  '10-heroes-and-villains-of-ancient-egypt-the-rise-reign-and-fall-of-king-tutankhamun',
  '11-heroes-and-villains-of-ancient-egypt-egyptians-in-nubia-and-the-rise-of-the-kush',
  '12-heroes-and-villains-of-ancient-egypt-bonus-chapter-the-exodus-of-the-hebrews',
  '13-heroes-and-villains-of-ancient-egypt-the-intermediate-period-of-egypt-1069-664-bc',
  '14-heroes-and-villains-of-ancient-egypt-the-late-period-of-egypt',
  '15-heroes-and-villains-of-ancient-egypt-alexander-s-conquest-of-egypt',
  '16-heroes-and-villains-of-ancient-egypt-ptolemaic-dynasty-greek-rule-of-egypt',
  '17-heroes-and-villains-of-ancient-egypt-the-relationship-to-save-egypt-marc-antony-and-cleopatra',
  '18-heroes-and-villains-of-ancient-egypt-religion-in-egypt-the-spread-of-christianity',
];

function htmlToMarkdown(html) {
  if (!html) return '';

  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '#### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, '[$2]($1)')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n')
    .replace(/<span[^>]*>(.*?)<\/span>/gis, '$1')
    .replace(/<[^>]+>/g, '')
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

    await page.waitForSelector('h1', { timeout: 15000 }).catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 3000));

    const data = await page.evaluate(() => {
      const titleEl = document.querySelector('h1');
      const title = titleEl ? titleEl.innerText.trim() : '';

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

      if (!contentHtml) {
        const main = document.querySelector('main') || document.body;
        contentHtml = main.innerHTML;
      }

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
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'history', 'ancient-egypt');
  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const title = data.title.replace(/^\d+\s*[-–—]\s*/i, '').trim();
  const chapterMatch = slug.match(/^(\d+)-/);
  const chapterNum = chapterMatch ? chapterMatch[1] : '';
  const fullTitle = chapterNum ? `Chapter ${chapterNum} - ${title}` : title;

  const markdown = `---
title: "${fullTitle.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "History"
topic: "Ancient Egypt"
publishedAt: "December 2, 2025"
author: "Zack Edwards"
imageUrl: "/images/games/GreatPharaohs.jpeg"
readTime: "${readTime}"
---

${content}
`;

  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`  Saved: ${slug} (${wordCount} words)`);
}

async function main() {
  console.log('Starting Ancient Egypt scraper...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  let successCount = 0;
  let failCount = 0;

  for (const slug of ancientEgyptPosts) {
    const data = await scrapePost(browser, slug);

    if (data && data.title && data.contentHtml && data.contentHtml.length > 200) {
      savePost(slug, data);
      successCount++;
    } else {
      console.log(`  Skipped (no/insufficient content): ${slug}`);
      failCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();

  console.log('\n=== Scraping Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
