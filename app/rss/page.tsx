"use client";

import Link from "next/link";
import React from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

// Social media RSS feed data
interface SocialFeed {
  name: string;
  platform: string;
  handle: string;
  url: string;
  rssUrl: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Twitter/X Icon
const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Facebook Icon
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// Instagram Icon
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// Pinterest Icon
const PinterestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

// YouTube Icon
const YouTubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// RSS Icon
const RSSIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
  </svg>
);

const socialFeeds: SocialFeed[] = [
  {
    name: "Twitter / X",
    platform: "twitter",
    handle: "@XogosEducation",
    url: "https://x.com/XogosEducation",
    rssUrl: "https://nitter.net/XogosEducation/rss",
    description:
      "Follow us on X (Twitter) for the latest updates on educational games, platform news, and community highlights.",
    icon: <TwitterIcon />,
    color: "#000000",
  },
  {
    name: "Facebook",
    platform: "facebook",
    handle: "xogosgames",
    url: "https://facebook.com/xogosgames",
    rssUrl: "https://www.facebook.com/xogosgames",
    description:
      "Join our Facebook community for educational gaming tips, parent resources, and exclusive content updates.",
    icon: <FacebookIcon />,
    color: "#1877F2",
  },
  {
    name: "Instagram",
    platform: "instagram",
    handle: "@historicalconquest",
    url: "https://www.instagram.com/historicalconquest/",
    rssUrl: "https://www.instagram.com/historicalconquest/",
    description:
      "See behind-the-scenes content, game previews, and educational moments on our Instagram feed.",
    icon: <InstagramIcon />,
    color: "#E4405F",
  },
  {
    name: "Pinterest",
    platform: "pinterest",
    handle: "xogos_education",
    url: "https://www.pinterest.com/xogos_education",
    rssUrl: "https://www.pinterest.com/xogos_education/feed.rss",
    description:
      "Discover educational resources, homeschool ideas, and game-based learning inspiration on Pinterest.",
    icon: <PinterestIcon />,
    color: "#BD081C",
  },
  {
    name: "YouTube",
    platform: "youtube",
    handle: "@historicalconquest1473",
    url: "https://www.youtube.com/@historicalconquest1473",
    rssUrl:
      "https://www.youtube.com/feeds/videos.xml?channel_id=UChistoricalconquest1473",
    description:
      "Watch gameplay tutorials, educational content, and game trailers on our YouTube channel.",
    icon: <YouTubeIcon />,
    color: "#FF0000",
  },
];

export default function RSSFeedsPage() {
  return (
    <MarketingLayout>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.heroGrid}></div>
            <div className={styles.heroAccent}></div>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.rssIconLarge}>
              <RSSIcon />
            </div>
            <h1 className={styles.heroTitle}>
              Social Media <span className={styles.heroEmphasis}>Feeds</span>
            </h1>
            <p className={styles.heroDescription}>
              Stay connected with Xogos Gaming across all our social media
              platforms. Follow us for the latest updates on educational games,
              resources for parents and teachers, and community highlights.
            </p>
          </div>
        </section>

        {/* Social Feeds Grid */}
        <section className={styles.feedsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.feedsGrid}>
              {socialFeeds.map((feed, index) => (
                <div key={index} className={styles.feedCard}>
                  <div
                    className={styles.feedIconContainer}
                    style={{ backgroundColor: feed.color }}
                  >
                    <div className={styles.feedIcon}>{feed.icon}</div>
                  </div>
                  <div className={styles.feedContent}>
                    <h3 className={styles.feedName}>{feed.name}</h3>
                    <p className={styles.feedHandle}>{feed.handle}</p>
                    <p className={styles.feedDescription}>{feed.description}</p>
                    <div className={styles.feedActions}>
                      <Link
                        href={feed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.followButton}
                        style={{ backgroundColor: feed.color }}
                      >
                        Follow Us
                      </Link>
                      <button
                        className={styles.rssButton}
                        onClick={() => {
                          navigator.clipboard.writeText(feed.rssUrl);
                          alert(`RSS URL copied: ${feed.rssUrl}`);
                        }}
                        title="Copy RSS Feed URL"
                      >
                        <RSSIcon />
                        Copy RSS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RSS Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>What is RSS?</h2>
              <p className={styles.infoText}>
                RSS (Really Simple Syndication) allows you to subscribe to our
                content and receive updates directly in your favorite RSS reader
                app. This means you never miss an update from Xogos Gaming
                without having to check each platform individually.
              </p>
              <h3 className={styles.infoSubtitle}>How to Use RSS Feeds:</h3>
              <ol className={styles.infoList}>
                <li>
                  Choose an RSS reader app (such as Feedly, Inoreader, or
                  NewsBlur)
                </li>
                <li>
                  Click the &quot;Copy RSS&quot; button next to any social
                  platform above
                </li>
                <li>Paste the RSS URL into your reader app</li>
                <li>Enjoy automatic updates whenever we post new content!</li>
              </ol>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>Join Our Community</h2>
            <p className={styles.ctaDescription}>
              Follow us on social media and be part of the Xogos Gaming
              community. Get exclusive updates, educational resources, and
              connect with other parents, teachers, and students.
            </p>
            <div className={styles.socialIconsRow}>
              {socialFeeds.map((feed, index) => (
                <Link
                  key={index}
                  href={feed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconLink}
                  style={{ backgroundColor: feed.color }}
                  title={feed.name}
                >
                  {feed.icon}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
