/**
 * Generate Post Templates from Sitemap
 *
 * This script creates markdown template files for all blog posts
 * based on the sitemap URLs. You can then fill in the content manually
 * or use the scraper script.
 *
 * Usage: node scripts/generate-post-templates.js
 */

const fs = require('fs');
const path = require('path');

// All post URLs from the sitemap
const allPosts = [
  // ===== AI EDUCATION (21 posts) =====
  { slug: 'chapter-1-debt-free-millionaire-ai-what-is-ai', title: 'Chapter 1 - What is AI?', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-2-how-ai-works-machine-learning-and-neural-networks', title: 'Chapter 2 - How AI Works: Machine Learning and Neural Networks', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-3-the-ethics-and-laws-of-ai', title: 'Chapter 3 - The Ethics and Laws of AI', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-4-ai-in-everyday-life-and-the-workplace', title: 'Chapter 4 - AI in Everyday Life and the Workplace', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-5-prompt-engineering-101', title: 'Chapter 5 - Prompt Engineering 101', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-6-conversational-design-and-role-assignments', title: 'Chapter 6 - Conversational Design and Role Assignments', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-7-fact-checking-and-critical-thinking-in-the-age-of-ai', title: 'Chapter 7 - Fact-Checking and Critical Thinking in the Age of AI', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-8-ai-collaboration-for-research-and-problem-solving', title: 'Chapter 8 - AI Collaboration for Research and Problem-Solving', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-9-writing-with-ai-essays-articles-and-reports', title: 'Chapter 9 - Writing with AI: Essays, Articles, and Reports', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-10-creating-professional-documents-and-proposals', title: 'Chapter 10 - Creating Professional Documents and Proposals', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-11-ai-in-storytelling-journalism-and-education', title: 'Chapter 11 - AI in Storytelling, Journalism, and Education', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-12-language-translation-accessibility-communication', title: 'Chapter 12 - Language Translation, Accessibility, Communication', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-13-ai-image-generation-and-graphic-design', title: 'Chapter 13 - AI Image Generation and Graphic Design', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-14-ai-audio-creation-and-music-production', title: 'Chapter 14 - AI Audio Creation and Music Production', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-15-ai-video-editing-and-film-production', title: 'Chapter 15 - AI Video Editing and Film Production', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-16-animation-3d-design-and-virtual-worlds', title: 'Chapter 16 - Animation, 3D Design, and Virtual Worlds', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-17-ai-in-marketing-and-advertising', title: 'Chapter 17 - AI in Marketing and Advertising', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-18-ai-and-data-analysis-for-decision-making', title: 'Chapter 18 - AI and Data Analysis for Decision-Making', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-19-ai-in-finance-accounting-and-legal-compliance', title: 'Chapter 19 - AI in Finance, Accounting, and Legal Compliance', category: 'AI Education', folder: 'ai-education' },
  { slug: 'chapter-20-entrepreneurship-and-ai-startups', title: 'Chapter 20 - Entrepreneurship and AI Startups', category: 'AI Education', folder: 'ai-education' },
  // Note: chapter-21 already exists

  // ===== FINANCIAL LITERACY (32 posts) =====
  // Note: chapter-1 already exists
  { slug: 'chapter-2-needs-vs-wants-differentiating-essentials-from-luxuries', title: 'Chapter 2 - Needs vs Wants: Differentiating Essentials from Luxuries', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-3-finding-priorities-setting-goals-and-obtaining-them', title: 'Chapter 3 - Finding Priorities: Setting Goals and Obtaining Them', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-4-the-value-of-work-how-money-is-earned-time-money', title: 'Chapter 4 - The Value of Work: How Money is Earned', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-5-introduction-to-budgeting', title: 'Chapter 5 - Introduction to Budgeting', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-6-income-and-revenue', title: 'Chapter 6 - Income and Revenue', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-7-expenses-and-liabilities', title: 'Chapter 7 - Expenses and Liabilities', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-8-savings-and-goals', title: 'Chapter 8 - Savings and Goals', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-9-what-is-credit', title: 'Chapter 9 - What is Credit?', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-10-good-debt-and-bad-debts', title: 'Chapter 10 - Good Debt and Bad Debts', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-11-toxic-loans', title: 'Chapter 11 - Toxic Loans', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-12-what-are-credit-cards', title: 'Chapter 12 - What are Credit Cards?', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-13-learn-banking-basics', title: 'Chapter 13 - Learn Banking Basics', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-14-bank-accounts-federal-reserve-and-insurance', title: 'Chapter 14 - Bank Accounts, Federal Reserve, and Insurance', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-15-debit-vs-credit-cards', title: 'Chapter 15 - Debit vs Credit Cards', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-16-digital-payments-apple-pay-venmo-and-paypal', title: 'Chapter 16 - Digital Payments: Apple Pay, Venmo, and PayPal', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-17-earning-income-jobs-entrepreneurship-passive-income', title: 'Chapter 17 - Earning Income: Jobs, Entrepreneurship, Passive Income', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-18-paychecks-withholding-understanding-a-pay-stub-taxes', title: 'Chapter 18 - Paychecks, Withholding, Understanding a Pay Stub', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-19-taxes-101-why-taxes-exist-basics-of-filing', title: 'Chapter 19 - Taxes 101: Why Taxes Exist, Basics of Filing', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-20-choosing-a-career-salary-planning-education-skills-negotiating-pay', title: 'Chapter 20 - Choosing a Career: Salary Planning, Education, Skills', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-21-the-power-of-compound-interest-time-and-growth', title: 'Chapter 21 - The Power of Compound Interest: Time and Growth', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-22-introduction-to-investing-stocks-bonds-mutual-funds', title: 'Chapter 22 - Introduction to Investing: Stocks, Bonds, Mutual Funds', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-23-retirement-accounts', title: 'Chapter 23 - Retirement Accounts', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-24-cryptocurrency-what-it-is-and-why-caution-is-critical', title: 'Chapter 24 - Cryptocurrency: What It Is and Why Caution is Critical', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-25-real-estate-basics-renting-vs-owning-mortgages', title: 'Chapter 25 - Real Estate Basics: Renting vs Owning, Mortgages', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-26-planning-for-big-purchases-cars-vacations-weddings', title: 'Chapter 26 - Planning for Big Purchases: Cars, Vacations, Weddings', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-27-insurance-101-auto-health-renters-life', title: 'Chapter 27 - Insurance 101: Auto, Health, Renters, Life', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-28-college-costs-student-loans', title: 'Chapter 28 - College Costs and Student Loans', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-29-the-dangers-of-debt', title: 'Chapter 29 - The Dangers of Debt', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-30-money-relationships-family-relations-and-society', title: 'Chapter 30 - Money, Relationships, Family, and Society', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-31-avoiding-financial-pitfalls-scams-fraud-traps', title: 'Chapter 31 - Avoiding Financial Pitfalls: Scams, Fraud, Traps', category: 'Financial Literacy', folder: 'financial-literacy' },
  { slug: 'chapter-32-path-to-freedom-becoming-a-debt-free-millionaire', title: 'Chapter 32 - Path to Freedom: Becoming a Debt-Free Millionaire', category: 'Financial Literacy', folder: 'financial-literacy' },

  // ===== ANCIENT EGYPT (18 posts) =====
  { slug: '1-heroes-and-villains-of-ancient-egypt-the-period-before-the-first-egyptian-dynasty', title: 'Heroes and Villains of Ancient Egypt: The Period Before the First Dynasty', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '2-heroes-and-villains-of-ancient-egypt-early-dynastic-period-unification-of-upper-and-lower-egypt', title: 'Heroes and Villains of Ancient Egypt: Early Dynastic Period', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '3-heroes-and-villains-of-ancient-egypt-early-dynastic-period-old-kingdom-the-daw-of-egypt-s-gold', title: 'Heroes and Villains of Ancient Egypt: Old Kingdom', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '4-heroes-and-villains-of-ancient-egypt-relgious-beliefs-of-the-egyptian-civilization-3000-2000-bc', title: 'Heroes and Villains of Ancient Egypt: Religious Beliefs', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '5-heroes-and-villains-of-ancient-egypt-the-forgotten-region-of-nubia', title: 'Heroes and Villains of Ancient Egypt: The Forgotten Region of Nubia', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '6-heroes-and-villains-of-ancient-egypt-the-hyksos-invasion-of-the-lower-kingdom-of-egypt', title: 'Heroes and Villains of Ancient Egypt: The Hyksos Invasion', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '7-heroes-and-villains-of-ancient-egypt-the-great-pharaohs-of-queen-ahhotep-i-and-ahmose-i', title: 'Heroes and Villains of Ancient Egypt: Queen Ahhotep I and Ahmose I', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '8-heroes-and-villains-of-ancient-egypt-the-great-pharaohs-hatshepsut-and-thutmose-iii', title: 'Heroes and Villains of Ancient Egypt: Hatshepsut and Thutmose III', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '9-heroes-and-villains-of-ancient-egypt-akhenaten-reign-revolutionary-pharaoh', title: 'Heroes and Villains of Ancient Egypt: Akhenaten', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '10-heroes-and-villains-of-ancient-egypt-the-rise-reign-and-fall-of-king-tutankhamun', title: 'Heroes and Villains of Ancient Egypt: King Tutankhamun', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '11-heroes-and-villains-of-ancient-egypt-egyptians-in-nubia-and-the-rise-of-the-kush', title: 'Heroes and Villains of Ancient Egypt: Egyptians in Nubia', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '12-heroes-and-villains-of-ancient-egypt-bonus-chapter-the-exodus-of-the-hebrews', title: 'Heroes and Villains of Ancient Egypt: The Exodus of the Hebrews', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '13-heroes-and-villains-of-ancient-egypt-the-intermediate-period-of-egypt-1069-664-bc', title: 'Heroes and Villains of Ancient Egypt: The Intermediate Period', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '14-heroes-and-villains-of-ancient-egypt-the-late-period-of-egypt', title: 'Heroes and Villains of Ancient Egypt: The Late Period', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '15-heroes-and-villains-of-ancient-egypt-alexander-s-conquest-of-egypt', title: 'Heroes and Villains of Ancient Egypt: Alexander\'s Conquest', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '16-heroes-and-villains-of-ancient-egypt-ptolemaic-dynasty-greek-rule-of-egypt', title: 'Heroes and Villains of Ancient Egypt: Ptolemaic Dynasty', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '17-heroes-and-villains-of-ancient-egypt-the-relationship-to-save-egypt-marc-antony-and-cleopatra', title: 'Heroes and Villains of Ancient Egypt: Marc Antony and Cleopatra', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
  { slug: '18-heroes-and-villains-of-ancient-egypt-religion-in-egypt-the-spread-of-christianity', title: 'Heroes and Villains of Ancient Egypt: The Spread of Christianity', category: 'Ancient Egypt', folder: 'history/ancient-egypt' },
];

function generateTemplate(post) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', post.folder);

  // Ensure directory exists
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${post.slug}.md`);

  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Skipping (exists): ${post.slug}`);
    return false;
  }

  const markdown = `---
title: "${post.title.replace(/"/g, '\\"')}"
excerpt: ""
category: "${post.category}"
topic: "${post.category}"
publishedAt: "December 2, 2025"
author: "Zack Edwards"
imageUrl: "/images/fullLogo.jpeg"
readTime: "5 min read"
---

# ${post.title}

<!--
  TODO: Add content for this article

  Original URL: https://www.xogosgaming.com/post/${post.slug}

  You can:
  1. Copy content from the Wix site
  2. Use the admin dashboard at /admin/posts to edit
  3. Run the scraper script: node scripts/scrape-posts.js
-->

Content coming soon...
`;

  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`Created: ${post.slug}`);
  return true;
}

function main() {
  console.log('Generating post templates...\n');

  let created = 0;
  let skipped = 0;

  for (const post of allPosts) {
    if (generateTemplate(post)) {
      created++;
    } else {
      skipped++;
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`\nTemplates are in: content/posts/`);
  console.log(`Edit them or use the admin dashboard at /admin/posts`);
}

main();
