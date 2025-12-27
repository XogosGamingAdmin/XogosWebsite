"use server";

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
    // Use rss2json API service to convert Google News RSS to JSON
    // This bypasses CORS issues and parsing problems
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=public&count=${limit}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "RSS feed error");
    }

    // Map the response to our format
    const items: RSSFeedItem[] = data.items.slice(0, limit).map((item: any) => {
      // Clean up the description by removing HTML tags
      const cleanDescription = item.description
        ? item.description.replace(/<[^>]*>/g, "").substring(0, 150)
        : "";

      return {
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || new Date().toISOString(),
        contentSnippet: cleanDescription,
        source: item.source || "Google News",
      };
    });

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
