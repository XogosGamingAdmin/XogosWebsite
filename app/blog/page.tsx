"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NewsletterForm } from "@/components/Newsletter";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

// Blog post preview interface (without full content for listing)
interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
}

// Static/featured blog posts (always shown)
const staticBlogPostPreviews: BlogPostPreview[] = [
  {
    id: "transforming-education-through-gaming",
    title: "Transforming Education Through Gaming: The Xogos Vision",
    excerpt:
      "Discover how Xogos is revolutionizing the educational landscape by combining engaging gameplay with meaningful learning experiences that reward students for their achievements.",
    author: {
      name: "Xogos Team",
      avatar: "/images/XogosLogo.png",
      role: "Education Innovation",
    },
    category: "Education",
    publishedAt: "November 20, 2024",
    readTime: "5 min read",
    imageUrl: "/images/games/BugandSeek.jpg",
    featured: true,
  },
  {
    id: "dual-token-economy-explained",
    title: "Understanding the Dual-Token Economy: iPlay and iServ",
    excerpt:
      "Learn about our innovative dual-token system that powers the Xogos ecosystem, enabling students to earn rewards while learning and contributing to governance.",
    author: {
      name: "Xogos Team",
      avatar: "/images/XogosLogo.png",
      role: "Blockchain & Tokenomics",
    },
    category: "Tokenomics",
    publishedAt: "November 15, 2024",
    readTime: "7 min read",
    imageUrl: "/images/games/DebtFreeMil.jpg",
  },
  {
    id: "bug-and-seek-game-launch",
    title: "Bug and Seek: Exploring Nature Through Interactive Gaming",
    excerpt:
      "Our latest science-focused game takes students on an adventure to restore a broken-down insectarium, discovering 220 real-life bugs along the way.",
    author: {
      name: "Xogos Team",
      avatar: "/images/XogosLogo.png",
      role: "Game Development",
    },
    category: "Games",
    publishedAt: "November 10, 2024",
    readTime: "4 min read",
    imageUrl: "/images/games/BugandSeek.jpg",
  },
  {
    id: "scholarship-conversion-system",
    title: "From Gameplay to Scholarships: How Token Conversion Works",
    excerpt:
      "A deep dive into how students can convert their earned tokens into real scholarship funds, creating tangible value from educational achievements.",
    author: {
      name: "Xogos Team",
      avatar: "/images/XogosLogo.png",
      role: "Education & Finance",
    },
    category: "Scholarships",
    publishedAt: "November 5, 2024",
    readTime: "6 min read",
    imageUrl: "/images/games/TotallyMedieval.jpg",
  },
  {
    id: "debt-free-millionaire-preview",
    title: "Debt-Free Millionaire: Teaching Financial Literacy Through Play",
    excerpt:
      "Preview our upcoming financial literacy game that teaches students essential money management skills through engaging career simulation gameplay.",
    author: {
      name: "Xogos Team",
      avatar: "/images/XogosLogo.png",
      role: "Game Development",
    },
    category: "Games",
    publishedAt: "October 30, 2024",
    readTime: "5 min read",
    imageUrl: "/images/games/DebtFreeMil.jpg",
  },
  {
    id: "active-incentive-programs",
    title: "Beyond Digital: Active Incentive Programs for Real-World Learning",
    excerpt:
      "Explore how Xogos extends beyond digital gaming to reward real-world activities like volunteering, physical education, and peer tutoring.",
    author: {
      name: "Xogos Team",
      avatar: "/images/XogosLogo.png",
      role: "Community & Programs",
    },
    category: "Programs",
    publishedAt: "October 25, 2024",
    readTime: "4 min read",
    imageUrl: "/images/games/BattleThrones.jpg",
  },
];

// Base category filter options (more will be added dynamically)
const baseCategories = [
  "All",
  "Education",
  "Games",
  "Tokenomics",
  "Scholarships",
  "Programs",
  "AI Education",
  "Financial Literacy",
  "History",
];

// Blog card component
const BlogCard = ({ post }: { post: BlogPostPreview }) => {
  return (
    <article className={styles.blogCard}>
      <Link href={`/blog/${post.id}`} className={styles.blogCardLink}>
        <div className={styles.blogCardImage}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className={styles.blogImage}
            unoptimized={post.imageUrl.startsWith("http")}
          />
          <div className={styles.blogCategory}>{post.category}</div>
        </div>
        <div className={styles.blogCardContent}>
          <div className={styles.blogMeta}>
            <span className={styles.blogDate}>{post.publishedAt}</span>
            <span className={styles.blogReadTime}>{post.readTime}</span>
          </div>
          <h3 className={styles.blogTitle}>{post.title}</h3>
          <p className={styles.blogExcerpt}>{post.excerpt}</p>
          <div className={styles.blogAuthor}>
            <div className={styles.authorAvatar}>
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={32}
                height={32}
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.author.name}</span>
              <span className={styles.authorRole}>{post.author.role}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

// Featured blog card component
const FeaturedBlogCard = ({ post }: { post: BlogPostPreview }) => {
  return (
    <article className={styles.featuredCard}>
      <Link href={`/blog/${post.id}`} className={styles.featuredCardLink}>
        <div className={styles.featuredImageContainer}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className={styles.featuredImage}
            unoptimized={post.imageUrl.startsWith("http")}
          />
          <div className={styles.featuredOverlay}></div>
          <div className={styles.featuredBadge}>Featured</div>
        </div>
        <div className={styles.featuredContent}>
          <div className={styles.featuredCategory}>{post.category}</div>
          <h2 className={styles.featuredTitle}>{post.title}</h2>
          <p className={styles.featuredExcerpt}>{post.excerpt}</p>
          <div className={styles.featuredMeta}>
            <div className={styles.blogAuthor}>
              <div className={styles.authorAvatar}>
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                />
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{post.author.name}</span>
                <span className={styles.authorRole}>{post.author.role}</span>
              </div>
            </div>
            <div className={styles.featuredMetaRight}>
              <span className={styles.blogDate}>{post.publishedAt}</span>
              <span className={styles.blogReadTime}>{post.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState<BlogPostPreview[]>(
    staticBlogPostPreviews
  );
  const [categories, setCategories] = useState<string[]>(baseCategories);

  // Load posts from API on mount
  useEffect(() => {
    async function loadPosts() {
      try {
        // Add cache-busting to ensure fresh data
        const response = await fetch("/api/blog", {
          cache: "no-store",
        });
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          // Use API data directly - it's already sorted by date (newest first)
          // The API merges DB posts with static posts and sorts them
          setAllPosts(result.data);

          // Update categories based on all posts
          const allCategories = new Set<string>(
            result.data.map((p: BlogPostPreview) => p.category)
          );
          const sortedCategories: string[] = [
            "All",
            ...Array.from(allCategories).sort(),
          ];
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error loading blog posts:", error);
      }
    }
    loadPosts();
  }, []);

  // Featured post is always the newest (first in sorted list)
  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;

  // Filter posts based on category and search (exclude the featured post)
  const filteredPosts = allPosts.filter((post, index) => {
    // Skip the first post (featured)
    if (index === 0) return false;
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              Xogos <span className={styles.heroEmphasis}>Blog</span>
            </h1>
            <p className={styles.heroDescription}>
              Stay updated with the latest news, game releases, educational
              insights, and platform updates from the Xogos Gaming team.
            </p>
          </div>
        </section>

        {/* Featured Post Section */}
        {featuredPost && (
          <section className={styles.featuredSection}>
            <div className={styles.sectionContainer}>
              <FeaturedBlogCard post={featuredPost} />
            </div>
          </section>
        )}

        {/* Filter and Search Section */}
        <section className={styles.filterSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.filterWrapper}>
              <div className={styles.categoryFilters}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.categoryButton} ${
                      activeCategory === category ? styles.active : ""
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search articles..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className={styles.searchIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className={styles.postsSection}>
          <div className={styles.sectionContainer}>
            {filteredPosts.length > 0 ? (
              <div className={styles.postsGrid}>
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No articles found matching your criteria.</p>
                <button
                  className={styles.resetButton}
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className={styles.newsletterSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.newsletterContent}>
              <h2 className={styles.newsletterTitle}>Stay in the Loop</h2>
              <p className={styles.newsletterDescription}>
                Subscribe to our newsletter for the latest game releases,
                educational resources, and platform updates delivered straight
                to your inbox.
              </p>
              <NewsletterForm
                source="blog"
                className={styles.newsletterForm}
                inputClassName={styles.newsletterInput}
                buttonClassName={styles.newsletterButton}
              />
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
