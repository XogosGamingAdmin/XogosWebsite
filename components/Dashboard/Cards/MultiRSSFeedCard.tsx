"use client";

import { useEffect, useState } from "react";
import { RSSFeedItem, getRssFeed } from "@/lib/actions/getRssFeed";
import { removeRssSubscription } from "@/lib/actions/removeRssSubscription";
import styles from "./RSSFeedCard.module.css";

interface Props {
  id: string;
  topic: string;
  displayName: string;
  onRemove?: () => void;
}

export function MultiRSSFeedCard({ id, topic, displayName, onRemove }: Props) {
  const [feedItems, setFeedItems] = useState<RSSFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadRSSFeed();
  }, [topic]);

  async function loadRSSFeed() {
    try {
      setLoading(true);
      setError("");
      const result = await getRssFeed(topic, 5);

      if (result.error) {
        setError(result.error.message);
        setFeedItems([]);
      } else if (result.data) {
        setFeedItems(result.data);
      }
    } catch (err) {
      console.error("Failed to load RSS feed:", err);
      setError("Failed to load news feed");
      setFeedItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    if (!confirm(`Remove "${displayName}" feed?`)) return;

    const result = await removeRssSubscription({ id });
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      if (onRemove) onRemove();
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{displayName}</h2>
        <button
          onClick={handleRemove}
          className={styles.removeButton}
          title="Remove this feed"
          aria-label="Remove this feed"
        >
          ✕
        </button>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : error ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>{error}</p>
            <p className={styles.emptyHint}>Please try again later.</p>
          </div>
        ) : feedItems.length > 0 ? (
          <div className={styles.feedList}>
            {feedItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.feedItem}
              >
                <div className={styles.feedTitle}>{item.title}</div>
                {item.contentSnippet && (
                  <div className={styles.feedSnippet}>
                    {item.contentSnippet}
                  </div>
                )}
                <div className={styles.feedDate}>
                  {new Date(item.pubDate).toLocaleDateString()}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No news articles found for &quot;{topic}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
