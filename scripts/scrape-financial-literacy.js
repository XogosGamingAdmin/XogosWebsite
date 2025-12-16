/**
 * Scrape Financial Literacy Articles from Xogos Gaming Wix Site
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const financialPosts = [
  'chapter-1-what-is-money',
  'chapter-2-needs-vs-wants-differentiating-essentials-from-luxuries',
  'chapter-3-finding-priorities-setting-goals-and-obtaining-them',
  'chapter-4-the-value-of-work-how-money-is-earned-time-money',
  'chapter-5-introduction-to-budgeting',
  'chapter-6-income-and-revenue',
  'chapter-7-expenses-and-liabilities',
  'chapter-8-savings-and-goals',
  'chapter-9-what-is-credit',
  'chapter-10-good-debt-and-bad-debts',
  'chapter-11-toxic-loans',
  'chapter-12-what-are-credit-cards',
  'chapter-13-learn-banking-basics',
  'chapter-14-bank-accounts-federal-reserve-and-insurance',
  'chapter-15-debit-vs-credit-cards',
  'chapter-16-digital-payments-apple-pay-venmo-and-paypal',
  'chapter-17-earning-income-jobs-entrepreneurship-passive-income',
  'chapter-18-paychecks-withholding-understanding-a-pay-stub-taxes',
  'chapter-19-taxes-101-why-taxes-exist-basics-of-filing',
  'chapter-20-choosing-a-career-salary-planning-education-skills-negotiating-pay',
  'chapter-21-the-power-of-compound-interest-time-and-growth',
  'chapter-22-introduction-to-investing-stocks-bonds-mutual-funds',
  'chapter-23-retirement-accounts',
  'chapter-24-cryptocurrency-what-it-is-and-why-caution-is-critical',
  'chapter-25-real-estate-basics-renting-vs-owning-mortgages',
  'chapter-26-planning-for-big-purchases-cars-vacations-weddings',
  'chapter-27-insurance-101-auto-health-renters-life',
  'chapter-28-college-costs-student-loans',
  'chapter-29-the-dangers-of-debt',
  'chapter-30-money-relationships-family-relations-and-society',
  'chapter-31-avoiding-financial-pitfalls-scams-fraud-traps',
  'chapter-32-path-to-freedom-becoming-a-debt-free-millionaire',
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
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'financial-literacy');
  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const title = data.title.replace(/^Chapter \d+\s*[-–—]\s*/i, '').trim();
  const chapterMatch = slug.match(/chapter-(\d+)/);
  const chapterNum = chapterMatch ? chapterMatch[1] : '';
  const fullTitle = chapterNum ? `Chapter ${chapterNum} - ${title}` : title;

  const markdown = `---
title: "${fullTitle.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "Financial Literacy"
topic: "Financial Literacy"
publishedAt: "December 2, 2025"
author: "Zack Edwards"
imageUrl: "/images/games/DebtFreeMil.jpg"
readTime: "${readTime}"
---

${content}
`;

  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`  Saved: ${slug} (${wordCount} words)`);
}

async function main() {
  console.log('Starting Financial Literacy scraper...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  let successCount = 0;
  let failCount = 0;

  for (const slug of financialPosts) {
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
