"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/actions/getProfile";
import { getRssFeed, RSSFeedItem } from "@/lib/actions/getRssFeed";
import { DASHBOARD_PROFILE_URL } from "@/constants";
import styles from "./RSSFeedCard.module.css";

export function RSSFeedCard() {
  const [rssTopic, setRssTopic] = useState<string>("");
  const [feedItems, setFeedItems] = useState<RSSFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadProfile() {
      const result = await getProfile();
      if (result.data) {
        setRssTopic(result.data.rssTopic);
        if (result.data.rssTopic) {
          await loadRSSFeed(result.data.rssTopic);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function loadRSSFeed(topic: string) {
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>News Feed</h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : error ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>{error}</p>
            <p className={styles.emptyHint}>Please try again later.</p>
          </div>
        ) : !rssTopic ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No RSS topic configured yet.
            </p>
            <Link href={DASHBOARD_PROFILE_URL} className={styles.configureLink}>
              Configure in Profile
            </Link>
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
                  <div className={styles.feedSnippet}>{item.contentSnippet}</div>
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
              No news articles found for &quot;{rssTopic}&quot;
            </p>
            <p className={styles.emptyHint}>
              Try configuring a different topic in your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
