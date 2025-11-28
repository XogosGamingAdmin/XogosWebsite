// app/components/RSS/RSSFeedSection.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import styles from "./RSSFeedSection.module.css";

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  categories?: string[];
  creator?: string;
  guid: string;
}

interface Commentary {
  id: string;
  author: string;
  role: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  createdAt: string;
}

interface FeedWithCommentary {
  item: RSSItem;
  commentary?: Commentary;
}

interface RSSFeedSectionProps {
  category: "crypto" | "education" | "regulation" | "gaming";
  title: string;
  description?: string;
  showCommentaryForm?: boolean;
}

export function RSSFeedSection({
  category,
  title,
  description,
  showCommentaryForm = false,
}: RSSFeedSectionProps) {
  const [feeds, setFeeds] = useState<FeedWithCommentary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedFeed] = useState<string | null>(null);

  const fetchFeeds = async () => {
    try {
      const response = await fetch(`/api/rss-feeds?category=${category}`);
      if (!response.ok) throw new Error("Failed to fetch feeds");
      const data = await response.json();
      setFeeds(data);
      setError(null);
    } catch (err) {
      setError("Unable to load feeds. Please try again later.");
      console.error("Feed error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
    // Refresh every 5 minutes
    const interval = setInterval(fetchFeeds, 300000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "📈";
      case "negative":
        return "📉";
      default:
        return "📊";
    }
  };

  const getSentimentClass = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return styles.positive;
      case "negative":
        return styles.negative;
      default:
        return styles.neutral;
    }
  };

  if (loading) {
    return (
      <div className={styles.feedSection}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading market insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feedSection}>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={fetchFeeds} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.feedSection}>
      <div className={styles.feedHeader}>
        <h2 className={styles.feedTitle}>{title}</h2>
        {description && <p className={styles.feedDescription}>{description}</p>}
      </div>

      <div className={styles.feedGrid}>
        {feeds.map((feed) => (
          <article
            key={feed.item.guid}
            className={`${styles.feedCard} ${
              feed.commentary ? styles.hasCommentary : ""
            }`}
          >
            <div className={styles.feedContent}>
              <div className={styles.feedMeta}>
                <span className={styles.feedSource}>{feed.item.creator}</span>
                <span className={styles.feedDate}>
                  {feed.item.pubDate
                    ? formatDistanceToNow(new Date(feed.item.pubDate), {
                        addSuffix: true,
                      })
                    : "Recently"}
                </span>
              </div>

              <h3 className={styles.feedItemTitle}>
                <a
                  href={feed.item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.feedLink}
                >
                  {feed.item.title}
                </a>
              </h3>

              <p className={styles.feedSnippet}>{feed.item.contentSnippet}</p>

              {feed.item.categories && feed.item.categories.length > 0 && (
                <div className={styles.feedTags}>
                  {feed.item.categories.slice(0, 3).map((cat, idx) => (
                    <span key={idx} className={styles.feedTag}>
                      {typeof cat === "string" ? cat : JSON.stringify(cat)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {feed.commentary && (
              <div
                className={`${styles.commentary} ${getSentimentClass(
                  feed.commentary.sentiment
                )}`}
              >
                <div className={styles.commentaryHeader}>
                  <span className={styles.commentaryIcon}>
                    {getSentimentIcon(feed.commentary.sentiment)}
                  </span>
                  <span className={styles.commentaryAuthor}>
                    {feed.commentary.author}
                  </span>
                  <span className={styles.commentaryRole}>
                    {feed.commentary.role}
                  </span>
                </div>
                <p className={styles.commentaryContent}>
                  {feed.commentary.content}
                </p>
              </div>
            )}

            {showCommentaryForm && !feed.commentary && (
              <button
                className={styles.addCommentaryBtn}
                onClick={() => setSelectedFeed(feed.item.guid)}
              >
                Add Board Commentary
              </button>
            )}
          </article>
        ))}
      </div>

      {feeds.length === 0 && (
        <div className={styles.emptyState}>
          <p>No feeds available at the moment.</p>
        </div>
      )}
    </section>
  );
}
