"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

// Forum category interface
interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  topicCount: number;
  postCount: number;
  color: string;
  subcategories?: string[];
}

// Forum topic interface
interface ForumTopic {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
}

// Icons
const GamepadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

const CoinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const HelpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  </svg>
);

const AnnouncementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
  </svg>
);

const PinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
  >
    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
  >
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
  >
    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

// Sample forum categories
const forumCategories: ForumCategory[] = [
  {
    id: "announcements",
    name: "Announcements",
    description:
      "Official news, updates, and important information from the Xogos Gaming team.",
    icon: <AnnouncementIcon />,
    topicCount: 12,
    postCount: 48,
    color: "#e62739",
    subcategories: [
      "Platform Updates",
      "New Game Releases",
      "Community Events",
    ],
  },
  {
    id: "games",
    name: "Games Discussion",
    description:
      "Discuss strategies, tips, and experiences from our educational games.",
    icon: <GamepadIcon />,
    topicCount: 156,
    postCount: 1243,
    color: "#7928ca",
    subcategories: [
      "Historical Conquest",
      "Debt-Free Millionaire",
      "Bug and Seek",
      "Time Quest",
    ],
  },
  {
    id: "education",
    name: "Education & Learning",
    description:
      "Share learning resources, study tips, and educational discussions for K-12 students.",
    icon: <BookIcon />,
    topicCount: 89,
    postCount: 567,
    color: "#0070f3",
    subcategories: [
      "Homeschool Resources",
      "Teacher Corner",
      "Study Tips",
      "Curriculum Discussion",
    ],
  },
  {
    id: "tokenomics",
    name: "Tokens & Rewards",
    description:
      "Everything about iPlay coins, scholarships, and the reward system.",
    icon: <CoinIcon />,
    topicCount: 67,
    postCount: 423,
    color: "#f5a623",
    subcategories: [
      "iPlay Coins",
      "Scholarship Conversion",
      "Banking System",
      "Reward Strategies",
    ],
  },
  {
    id: "community",
    name: "Community Hub",
    description:
      "Connect with other members, share your stories, and participate in community events.",
    icon: <UsersIcon />,
    topicCount: 203,
    postCount: 1876,
    color: "#50e3c2",
    subcategories: [
      "Introductions",
      "Off-Topic",
      "Success Stories",
      "Community Projects",
    ],
  },
  {
    id: "support",
    name: "Help & Support",
    description:
      "Get help with technical issues, account questions, and platform guidance.",
    icon: <HelpIcon />,
    topicCount: 145,
    postCount: 892,
    color: "#ff6b6b",
    subcategories: [
      "Technical Support",
      "Account Help",
      "Bug Reports",
      "Feature Requests",
    ],
  },
];

// Sample recent topics
const recentTopics: ForumTopic[] = [
  {
    id: "1",
    title: "Welcome to the Xogos Gaming Community Forum!",
    author: { name: "Xogos Team", avatar: "/images/fullLogo.jpeg" },
    category: "Announcements",
    replies: 24,
    views: 1523,
    lastActivity: "2 hours ago",
    isPinned: true,
    tags: ["welcome", "rules", "guidelines"],
  },
  {
    id: "2",
    title: "New Game Coming Soon: Totally Medieval - Math Adventure",
    author: { name: "Xogos Team", avatar: "/images/fullLogo.jpeg" },
    category: "Announcements",
    replies: 67,
    views: 2341,
    lastActivity: "4 hours ago",
    isPinned: true,
    tags: ["new-game", "math", "medieval"],
  },
  {
    id: "3",
    title: "Best strategies for Historical Conquest tournament play?",
    author: { name: "HistoryBuff2024", avatar: "/images/fullLogo.jpeg" },
    category: "Games Discussion",
    replies: 45,
    views: 892,
    lastActivity: "1 hour ago",
    tags: ["strategy", "tournament", "historical-conquest"],
  },
  {
    id: "4",
    title: "How I earned 500 iPlay coins in one month - My strategy",
    author: { name: "CoinMaster", avatar: "/images/fullLogo.jpeg" },
    category: "Tokens & Rewards",
    replies: 89,
    views: 3421,
    lastActivity: "30 minutes ago",
    tags: ["iplay", "strategy", "tips"],
  },
  {
    id: "5",
    title: "Homeschool curriculum integration ideas for Bug and Seek",
    author: { name: "HomeschoolMom", avatar: "/images/fullLogo.jpeg" },
    category: "Education & Learning",
    replies: 32,
    views: 567,
    lastActivity: "3 hours ago",
    tags: ["homeschool", "bug-and-seek", "curriculum"],
  },
  {
    id: "6",
    title: "Can't login after password reset - need help!",
    author: { name: "NewPlayer123", avatar: "/images/fullLogo.jpeg" },
    category: "Help & Support",
    replies: 8,
    views: 124,
    lastActivity: "45 minutes ago",
    tags: ["login", "password", "help"],
  },
  {
    id: "7",
    title: "Introduce yourself! Where are you from?",
    author: { name: "CommunityManager", avatar: "/images/fullLogo.jpeg" },
    category: "Community Hub",
    replies: 234,
    views: 4521,
    lastActivity: "15 minutes ago",
    isPinned: true,
    tags: ["introductions", "community"],
  },
  {
    id: "8",
    title:
      "Teaching financial literacy to middle schoolers with Debt-Free Millionaire",
    author: { name: "TeacherMike", avatar: "/images/fullLogo.jpeg" },
    category: "Education & Learning",
    replies: 28,
    views: 412,
    lastActivity: "5 hours ago",
    tags: ["financial-literacy", "teaching", "middle-school"],
  },
];

// Forum stats
const forumStats = {
  totalMembers: 12453,
  totalTopics: 672,
  totalPosts: 5049,
  onlineNow: 89,
};

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState<
    "categories" | "recent" | "popular"
  >("categories");
  const [searchQuery, setSearchQuery] = useState("");

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
            <h1 className={styles.heroTitle}>
              Community <span className={styles.heroEmphasis}>Forum</span>
            </h1>
            <p className={styles.heroDescription}>
              Connect with fellow students, parents, and educators. Share
              strategies, ask questions, and be part of the Xogos Gaming
              community.
            </p>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search the forum..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.searchButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Forum Stats Bar */}
        <section className={styles.statsBar}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {forumStats.totalMembers.toLocaleString()}
              </span>
              <span className={styles.statLabel}>Members</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {forumStats.totalTopics.toLocaleString()}
              </span>
              <span className={styles.statLabel}>Topics</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {forumStats.totalPosts.toLocaleString()}
              </span>
              <span className={styles.statLabel}>Posts</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{forumStats.onlineNow}</span>
              <span className={styles.statLabel}>Online Now</span>
            </div>
          </div>
        </section>

        {/* Main Forum Content */}
        <section className={styles.forumSection}>
          <div className={styles.forumContainer}>
            {/* Tab Navigation */}
            <div className={styles.tabNav}>
              <button
                className={`${styles.tabButton} ${activeTab === "categories" ? styles.active : ""}`}
                onClick={() => setActiveTab("categories")}
              >
                Categories
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "recent" ? styles.active : ""}`}
                onClick={() => setActiveTab("recent")}
              >
                Recent Topics
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "popular" ? styles.active : ""}`}
                onClick={() => setActiveTab("popular")}
              >
                Popular
              </button>
              <div className={styles.tabActions}>
                <button className={styles.newTopicButton}>+ New Topic</button>
              </div>
            </div>

            {/* Categories View */}
            {activeTab === "categories" && (
              <div className={styles.categoriesGrid}>
                {forumCategories.map((category) => (
                  <div key={category.id} className={styles.categoryCard}>
                    <div
                      className={styles.categoryIcon}
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div className={styles.categoryContent}>
                      <h3 className={styles.categoryName}>{category.name}</h3>
                      <p className={styles.categoryDescription}>
                        {category.description}
                      </p>
                      {category.subcategories && (
                        <div className={styles.subcategories}>
                          {category.subcategories.map((sub, idx) => (
                            <span key={idx} className={styles.subcategoryTag}>
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={styles.categoryStats}>
                      <div className={styles.categoryStat}>
                        <span className={styles.categoryStatValue}>
                          {category.topicCount}
                        </span>
                        <span className={styles.categoryStatLabel}>Topics</span>
                      </div>
                      <div className={styles.categoryStat}>
                        <span className={styles.categoryStatValue}>
                          {category.postCount}
                        </span>
                        <span className={styles.categoryStatLabel}>Posts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent/Popular Topics View */}
            {(activeTab === "recent" || activeTab === "popular") && (
              <div className={styles.topicsList}>
                {recentTopics
                  .sort((a, b) => {
                    if (activeTab === "popular") {
                      return b.views - a.views;
                    }
                    return 0;
                  })
                  .map((topic) => (
                    <div key={topic.id} className={styles.topicRow}>
                      <div className={styles.topicMain}>
                        <div className={styles.topicMeta}>
                          {topic.isPinned && (
                            <span className={styles.pinnedBadge}>
                              <PinIcon /> Pinned
                            </span>
                          )}
                          {topic.isLocked && (
                            <span className={styles.lockedBadge}>
                              <LockIcon /> Locked
                            </span>
                          )}
                          <span className={styles.topicCategory}>
                            {topic.category}
                          </span>
                        </div>
                        <h4 className={styles.topicTitle}>{topic.title}</h4>
                        <div className={styles.topicInfo}>
                          <div className={styles.topicAuthor}>
                            <Image
                              src={topic.author.avatar}
                              alt={topic.author.name}
                              width={24}
                              height={24}
                              className={styles.authorAvatar}
                            />
                            <span>{topic.author.name}</span>
                          </div>
                          {topic.tags && (
                            <div className={styles.topicTags}>
                              {topic.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className={styles.topicTag}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.topicStats}>
                        <div className={styles.topicStat}>
                          <CommentIcon />
                          <span>{topic.replies}</span>
                        </div>
                        <div className={styles.topicStat}>
                          <EyeIcon />
                          <span>{topic.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={styles.topicActivity}>
                        <span className={styles.lastActivity}>
                          {topic.lastActivity}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>Join the Conversation</h2>
            <p className={styles.ctaDescription}>
              Sign up or log in to participate in discussions, ask questions,
              and connect with the Xogos Gaming community.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/signin" className={styles.primaryButton}>
                Sign In
              </Link>
              <Link href="/membership" className={styles.secondaryButton}>
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Forum Guidelines */}
        <section className={styles.guidelinesSection}>
          <div className={styles.guidelinesContainer}>
            <h3 className={styles.guidelinesTitle}>Community Guidelines</h3>
            <div className={styles.guidelinesGrid}>
              <div className={styles.guidelineItem}>
                <div className={styles.guidelineNumber}>1</div>
                <div className={styles.guidelineContent}>
                  <h4>Be Respectful</h4>
                  <p>
                    Treat all community members with kindness and respect. No
                    harassment, bullying, or hate speech.
                  </p>
                </div>
              </div>
              <div className={styles.guidelineItem}>
                <div className={styles.guidelineNumber}>2</div>
                <div className={styles.guidelineContent}>
                  <h4>Stay On Topic</h4>
                  <p>
                    Keep discussions relevant to the category and topic.
                    Off-topic posts may be moved or removed.
                  </p>
                </div>
              </div>
              <div className={styles.guidelineItem}>
                <div className={styles.guidelineNumber}>3</div>
                <div className={styles.guidelineContent}>
                  <h4>No Spam</h4>
                  <p>
                    Avoid posting promotional content, repetitive messages, or
                    irrelevant links.
                  </p>
                </div>
              </div>
              <div className={styles.guidelineItem}>
                <div className={styles.guidelineNumber}>4</div>
                <div className={styles.guidelineContent}>
                  <h4>Protect Privacy</h4>
                  <p>
                    Never share personal information about yourself or others.
                    Stay safe online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
