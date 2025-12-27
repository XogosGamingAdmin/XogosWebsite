"use server";

import Parser from "rss-parser";

export type RSSFeedItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  source?: string;
};

/**
 * Get RSS Feed
 *
 * Fetches RSS feed articles from Google News based on a search topic
 *
 * @param topic - The search topic (e.g., "education technology", "AI", "blockchain")
 * @param limit - Maximum number of articles to return (default: 5)
 */
export async function getRssFeed(
  topic: string,
  limit: number = 5
): Promise<{ data?: RSSFeedItem[]; error?: { message: string } }> {
  if (!topic || topic.trim() === "") {
    return {
      error: {
        message: "No topic provided",
      },
    };
  }

  try {
    const parser = new Parser({
      customFields: {
        item: ["source"],
      },
    });

    // Use Google News RSS feed with search query
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;

    const feed = await parser.parseURL(feedUrl);

    // Map and limit results
    const items: RSSFeedItem[] = feed.items.slice(0, limit).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: item.contentSnippet || item.content?.substring(0, 200),
      source: item.source || "Google News",
    }));

    return { data: items };
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return {
      error: {
        message: "Failed to fetch news feed. Please try again later.",
      },
    };
  }
}
