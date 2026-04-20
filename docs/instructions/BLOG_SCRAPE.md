# Blog Scrape Instructions

## Overview
This document outlines the process to scrape blog posts from the Histronics/Xogos Gaming blog and migrate them to the XogosBoard blog page.

## Source Information
- **Original Blog URL**: https://www.xogosgaming.com/blog
- **RSS Feed URL**: https://www.xogosgaming.com/blog-feed.xml
- **New Domain** (after transfer): https://www.xogosgaming.com/blog
- **Author**: Zack Edwards

## Scraping Method
The blog is built on Wix, which loads content dynamically via JavaScript. The standard page fetch only returns framework code, not actual content.

**Working Method**: Use the RSS feed at `/blog-feed.xml` to extract post metadata:
```
WebFetch URL: https://www.xogosgaming.com/blog-feed.xml
```

After domain transfer, individual posts should be accessible at:
```
https://www.xogosgaming.com/post/[post-slug]
```

## Blog Posts to Migrate (20 total)

### AI Category (18 posts)
| Title | Date | Slug |
|-------|------|------|
| Chapter 1: Debt Free Millionaire AI - What is AI? | Nov 4, 2025 | chapter-1-debt-free-millionaire-ai-what-is-ai |
| Chapter 2: How AI Works: Machine Learning and Neural Networks | Nov 5, 2025 | chapter-2-how-ai-works-machine-learning-and-neural-networks |
| Chapter 3: The Ethics and Laws of AI | Nov 6, 2025 | chapter-3-the-ethics-and-laws-of-ai |
| Chapter 4: AI in Everyday Life and the Workplace | Nov 7, 2025 | chapter-4-ai-in-everyday-life-and-the-workplace |
| Chapter 5: Prompt Engineering 101 | Nov 8, 2025 | chapter-5-prompt-engineering-101 |
| Chapter 6: Conversational Design and Role Assignments | Nov 10, 2025 | chapter-6-conversational-design-and-role-assignments |
| Chapter 7: Fact-Checking and Critical Thinking in the Age of AI | Nov 11, 2025 | chapter-7-fact-checking-and-critical-thinking-in-the-age-of-ai |
| Chapter 8: AI Collaboration for Research and Problem-Solving | Nov 12, 2025 | chapter-8-ai-collaboration-for-research-and-problem-solving |
| Chapter 9: Writing with AI: Essays, Articles, and Reports | Nov 13, 2025 | chapter-9-writing-with-ai-essays-articles-and-reports |
| Chapter 10: Creating Professional Documents and Proposals | Nov 17, 2025 | chapter-10-creating-professional-documents-and-proposals |
| Chapter 11: AI in Storytelling, Journalism, and Education | Nov 18, 2025 | chapter-11-ai-in-storytelling-journalism-and-education |
| Chapter 12: Language Translation, Accessibility, & Communication | Nov 19, 2025 | chapter-12-language-translation-accessibility-communication |
| Chapter 13: AI Image Generation and Graphic Design | Nov 20, 2025 | chapter-13-ai-image-generation-and-graphic-design |
| Chapter 14: AI Audio Creation and Music Production | Nov 21, 2025 | chapter-14-ai-audio-creation-and-music-production |
| Chapter 15: AI Video Editing and Film Production | Nov 22, 2025 | chapter-15-ai-video-editing-and-film-production |
| Chapter 16: Animation, 3D Design, and Virtual Worlds | Nov 24, 2025 | chapter-16-animation-3d-design-and-virtual-worlds |
| Chapter 17: AI in Marketing and Advertising | Nov 25, 2025 | chapter-17-ai-in-marketing-and-advertising |
| Chapter 18: AI and Data Analysis for Decision Making | Nov 26, 2025 | chapter-18-ai-and-data-analysis-for-decision-making |

### Personal Finance Category (2 posts)
| Title | Date | Slug |
|-------|------|------|
| Chapter 31: Avoiding Financial Pitfalls (scams, fraud, traps) | Oct 24, 2025 | chapter-31-avoiding-financial-pitfalls-scams-fraud-traps |
| Chapter 32: Path to Freedom (becoming a Debt Free Millionaire) | Oct 25, 2025 | chapter-32-path-to-freedom-becoming-a-debt-free-millionaire |

## Category Mapping
Posts should be tagged with one of these categories:
- **AI** - All Chapter 1-18 posts (AI education series)
- **Personal Finance** - Chapter 31-32 posts (Debt Free Millionaire financial literacy)
- **History** - Posts about historical topics/figures (none identified yet)
- **Creator's Thoughts** - Any posts that don't fit the above categories

## Implementation Steps

### Step 1: Verify Domain Transfer
After 48 hours, verify the new domain is active:
```
WebFetch URL: https://www.xogosgaming.com/blog-feed.xml
Prompt: List all blog post URLs and verify they resolve to xogosgaming.com
```

### Step 2: Fetch Full Post Content
For each post, attempt to fetch full content:
```
WebFetch URL: https://www.xogosgaming.com/post/[slug]
Prompt: Extract the full blog post content including: title, publication date, author, and the complete article text/body.
```

If Wix still blocks content, user should copy-paste content manually or export from Wix dashboard.

### Step 3: Update Blog Page
Update `app/blog/page.tsx` with the scraped posts:
- Add each post to the `blogPosts` array
- Use original publication dates
- Assign correct category (AI, Personal Finance, History, Creator's Thoughts)
- Set author as "Zack Edwards"
- Use appropriate images from `/images/` folder

### Step 4: Create Individual Post Pages
The dynamic route at `app/blog/[slug]/page.tsx` already exists. Add full content to each post in the blogPosts data array.

## Excerpt Information (from RSS feed)
These excerpts were extracted and can be used as fallback descriptions:

1. **Chapter 1**: Defines intelligence as "the ability to recognize patterns, learn" and make decisions.
2. **Chapter 2**: John von Neumann's early mathematical abilities and vision of "a hidden order beneath" numerical patterns.
3. **Chapter 3**: Explores that "AI is not evil, nor is it inherently good; it is a reflection of the person who uses it."
4. **Chapter 4**: Marie Curie's early passion for "physics and chemistry—the invisible worlds that governed all life."
5. **Chapter 5**: Carl Jung's awareness of "two worlds — the outer world of people and the inner world of symbols, dreams, and shadows."
6. **Chapter 6**: Grace Hopper's curiosity and mother's teaching that "questions were the beginning of wisdom."
7. **Chapter 7**: René Descartes' philosophical questioning and struggle with "how much of this knowledge was truly certain?"
8. **Chapter 8**: John von Neumann's childhood ability to "divide eight-digit numbers in his head" and view mathematics as universal language.
9. **Chapter 9**: George Orwell's early observations and discomfort with "ideals of empire and class superiority."
10. **Chapter 10**: Florence Nightingale's fascination with "numbers" and "patterns" that guided her pioneering work in nursing.
11. **Chapter 11**: Johann Wolfgang von Goethe's childhood surrounded by books and his pull toward understanding how stories work.
12. **Chapter 12**: Describes traditional translation as "a negotiation between two worlds" requiring patience and cultural understanding.
13. **Chapter 13**: Educational approach using metaphor of "a vast workshop filled with glowing screens, swirling patterns, and canvases that paint themselves."
14. **Chapter 14**: Alexander Graham Bell's background with sound and hearing, driven by family experiences with deafness.
15. **Chapter 15**: Georges Méliès' account of learning magic and theater before becoming a pioneering filmmaker.
16. **Chapter 16**: John Whitney Sr. explores how "movement—how patterns shifted, how shapes danced" fascinated him from childhood.
17. **Chapter 17**: David Ogilvy's story about career transitions and "what stirred desire, what shaped trust, and what caused suspicion" in persuasion.
18. **Chapter 18**: Features John Tukey's perspective on "thinking was not something to fear but something to enjoy" and explores hidden narratives within numerical datasets.
19. **Chapter 31**: Charles Ponzi's ambition for "wealth, recognition, and respect" driving risky financial schemes.
20. **Chapter 32**: Wallace D. Wattles' belief in "a law, a pattern, something that" governed wealth acquisition.

## Files to Modify
- `app/blog/page.tsx` - Main blog listing page (add posts to blogPosts array)
- `app/blog/[slug]/page.tsx` - Individual post page (add posts to blogPosts array)

## Notes
- The AI chapters (1-18) feature biographical narratives of historical figures paired with contemporary AI topics
- Each chapter establishes thematic connections between past innovators and modern AI applications
- The Personal Finance chapters (31-32) are part of a "Debt Free Millionaire" series teaching financial literacy

## Alternative: Manual Export
If scraping continues to fail after domain transfer, user can export posts from Wix:
1. Log into Wix Dashboard
2. Navigate to Blog > Posts
3. Export as CSV or copy content manually
4. Provide content to Claude for integration

---
*Document created: November 26, 2025*
*To be revisited after domain transfer completes (~48 hours)*
