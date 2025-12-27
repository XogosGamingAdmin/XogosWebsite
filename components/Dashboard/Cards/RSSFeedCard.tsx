"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/actions/getProfile";
import { DASHBOARD_PROFILE_URL } from "@/constants";
import styles from "./RSSFeedCard.module.css";

type RSSItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
};

export function RSSFeedCard() {
  const [rssTopic, setRssTopic] = useState<string>("");
  const [feedItems, setFeedItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const result = await getProfile();
      if (result.data) {
        setRssTopic(result.data.rssTopic);
        if (result.data.rssTopic) {
          await loadRSSFeed(result.data.rssTopic);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function loadRSSFeed(topic: string) {
    try {
      // NOTE: In a production environment, this would call a server action
      // that fetches the RSS feed server-side to avoid CORS issues
      // For now, using a placeholder
      setFeedItems([]);
    } catch (error) {
      console.error("Failed to load RSS feed:", error);
      setFeedItems([]);
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
