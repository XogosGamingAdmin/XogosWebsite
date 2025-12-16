/**
 * Scrape Remaining Lesson Plans and Creator's Notes
 * Picks up where the previous scraper left off
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Remaining lesson plans (after the crash at indian-wars)
const remainingLessonPlans = [
  'lesson-plans-for-the-expansion-west-the-indian-wars-of-1860-1890',
  'lesson-plans-for-the-expansion-west-president-andrew-jackson-and-the-indian-removal-act',
  'lesson-plans-for-the-expansion-west-the-oregon-trail-and-oregon-country',
  'lesson-plans-for-the-expansion-west-the-rest-of-the-louisiana-purchase',
  'lesson-plans-for-the-expansion-west-the-mexican-american-war',
  'lesson-plans-for-the-expansion-west-the-settling-of-california-and-nevada',
  'lesson-plans-for-the-expansion-west-texas-independence-and-annexation-1836-1845',
  'lesson-plans-for-the-expansion-west-the-presidents-who-continued-the-expansion-westward',
  'lesson-plans-for-the-expansion-west-louisiana-purchase-and-the-many-expeditions',
  'lesson-plans-for-the-expansion-west-living-on-the-edge-of-the-frontier-1',
  'lesson-plans-for-the-expansion-west-living-on-the-edge-of-the-frontier',
  'lesson-plans-for-the-expansion-west-the-mormon-pioneers-and-other-religious-pioneers',
  'lesson-plans-for-the-expansion-west-cross-curricular-lessons',
  'lesson-plans-for-the-expansion-west-the-gold-rush-and-statehood-of-california',
  'lesson-plans-for-the-expansion-west-the-missouri-compromise-of-1820',
  'lesson-plans-for-the-expansion-west-the-presidents-who-led-to-the-annexation-of-texas',
  'lesson-plans-for-the-expansion-west-president-james-k-polk-and-his-manifest-destiny',
  // French and Indian War Lesson Plans
  'lesson-plans-for-the-french-and-indian-war-battle-of-montreal-and-the-end-of-french-canada',
  'lesson-plans-for-the-french-and-indian-war-the-siege-of-quebec-and-the-battle-of-the-plains-of-abra',
  'lesson-plans-for-the-french-and-indian-war-cross-curricular-math-1',
  'lesson-plans-for-the-french-and-indian-war-global-impact-and-british-dominance',
  'lesson-plans-for-the-french-and-indian-war-the-battle-of-minorca-and-european-stalemate-1',
  'lesson-plans-for-the-french-and-indian-war-consequences-of-the-war-and-start-of-rebellion',
  'lesson-plans-for-the-french-and-indian-war-the-treaty-of-paris-1763',
  // American Revolution Lesson Plans
  'lesson-plans-about-american-revolution-the-battles-of-lexington-and-concord',
  'lesson-plans-for-the-american-revolution-overview',
  'lesson-plans-for-the-american-revolution-the-british-acts-that-lead-to-resistence',
  'lesson-plans-for-the-american-revolution-the-culper-spy-ring',
  'lesson-plans-for-the-american-revolution-the-battles-of-saratoga',
  'lesson-plans-for-the-american-revolution-cross-curricular-science-activities',
  'lesson-plans-for-the-american-revolution-the-battles-of-stony-point-and-newton',
  'lesson-plans-for-the-american-revolution-the-southern-campaign-continues',
  // Birth of a Nation Lesson Plans
  'lesson-plans-for-the-birth-of-a-nation-the-end-of-the-american-revolution',
  'lesson-plans-for-the-birth-of-a-nation-the-creation-of-the-federal-government-and-their-first-elec',
  'lesson-plans-for-the-birth-of-a-nation-the-first-contested-presidential-election-for-the-second-pr',
  'lesson-plans-for-the-birth-of-a-nation-ratification-of-the-states',
  'lesson-plans-for-the-birth-of-a-nation-conflict-in-the-new-nation-the-whiskey-rebellion',
  'lesson-plans-for-the-birth-of-a-nation-cross-curricular-math-and-science',
  'lesson-plans-for-the-birth-of-a-nation-revolution-of-1800-peaceful-transfer-of-power-and-jeffe',
  'lesson-plans-for-the-birth-of-a-nation-focus-on-the-executive-and-judicial-branches-and-the-signin',
  // War of 1812 Lesson Plans
  'lesson-plans-for-the-war-of-1812-the-second-barbary-war-and-us-global-strength',
  'lesson-plans-for-the-war-of-1812-the-declaration-of-war-and-an-unprepared-nation-war-of-1812',
  'lesson-plans-for-the-war-of-1812-british-attempts-to-undermine-the-united-states-and-native-america',
  'lesson-plans-for-the-war-of-1812-free-market-capitalism-vs-government-interventions',
  'lesson-plans-for-the-war-of-1812-the-treaty-of-ghent-and-the-end-of-the-war',
  'lesson-plans-for-the-war-of-1812-the-battle-of-new-orleans',
  'lesson-plans-for-the-war-of-1812-the-birth-of-the-u-s-naval-strategy-in-the-war',
  // Trans-Atlantic Slave Trade Lesson Plans
  'lesson-plans-of-the-trans-atlantic-slave-trade-origins-of-slavery',
  'lesson-plans-of-the-trans-atlantic-slave-trade-the-rise-of-abolitionism',
  'lesson-plans-of-the-trans-atlantic-slave-trade-the-politics-of-slavery',
  // Religious Freedoms Lesson Plans
  'lesson-plans-for-america-s-religious-freedoms-religion-in-the-american-revolution',
  'lesson-plans-for-america-s-religious-freedoms-religious-diversity-and-new-movements',
  'lesson-plans-for-america-s-religious-freedoms-the-first-great-awakening',
  // Immigration Lesson Plans
  'lesson-plans-for-immigration-in-the-united-states-european-immigration',
];

// Creator's Notes
const creatorsNotes = [
  'make-history-fun',
  'empowering-education-through-play-how-xogos-and-the-sgo-program-are-transforming-student-learning',
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
    try { await page.close(); } catch (e) {}
    return null;
  }
}

function saveLessonPlan(slug, data) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'lesson-plans');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const markdown = `---
title: "${data.title.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "Lesson Plans"
topic: "Lesson Plans"
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

function saveCreatorsNote(slug, data) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'creators-notes');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const markdown = `---
title: "${data.title.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "Creator's Notes"
topic: "Creator's Notes"
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
  console.log('Starting remaining content scraper...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  let successCount = 0;
  let failCount = 0;

  // Scrape remaining lesson plans
  console.log(`\n=== Scraping Remaining Lesson Plans (${remainingLessonPlans.length} posts) ===\n`);
  for (const slug of remainingLessonPlans) {
    // Check if already scraped
    const filePath = path.join(process.cwd(), 'content', 'posts', 'lesson-plans', `${slug}.md`);
    if (fs.existsSync(filePath)) {
      console.log(`  Skipping (already exists): ${slug}`);
      continue;
    }

    const data = await scrapePost(browser, slug);

    if (data && data.title && data.contentHtml && data.contentHtml.length > 200) {
      saveLessonPlan(slug, data);
      successCount++;
    } else {
      console.log(`  Skipped (no/insufficient content): ${slug}`);
      failCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Scrape creator's notes
  console.log(`\n=== Scraping Creator's Notes (${creatorsNotes.length} posts) ===\n`);
  for (const slug of creatorsNotes) {
    // Check if already scraped
    const filePath = path.join(process.cwd(), 'content', 'posts', 'creators-notes', `${slug}.md`);
    if (fs.existsSync(filePath)) {
      console.log(`  Skipping (already exists): ${slug}`);
      continue;
    }

    const data = await scrapePost(browser, slug);

    if (data && data.title && data.contentHtml && data.contentHtml.length > 200) {
      saveCreatorsNote(slug, data);
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
