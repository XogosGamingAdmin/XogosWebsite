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
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      customFields: {
        item: [
          ["media:content", "media"],
          ["content:encoded", "contentEncoded"],
        ],
      },
    });

    // Use Google News RSS feed with search query
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;

    console.log("Fetching RSS feed for topic:", topic);
    const feed = await parser.parseURL(feedUrl);
    console.log("RSS feed fetched successfully, items:", feed.items.length);

    if (!feed.items || feed.items.length === 0) {
      return {
        data: [],
      };
    }

    // Map and limit results
    const items: RSSFeedItem[] = feed.items.slice(0, limit).map((item) => {
      // Extract clean description
      let description = "";
      if (item.contentSnippet) {
        description = item.contentSnippet.substring(0, 150);
      } else if (item.content) {
        description = item.content.replace(/<[^>]*>/g, "").substring(0, 150);
      }

      return {
        title: item.title || "No title",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        contentSnippet: description,
        source: "Google News",
      };
    });

    console.log("Returning", items.length, "RSS items");
    return { data: items };
  } catch (error: any) {
    console.error("Error fetching RSS feed:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      topic,
    });

    return {
      error: {
        message: `Failed to load news for "${topic}". Try a different topic.`,
      },
    };
  }
}
