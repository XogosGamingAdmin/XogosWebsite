"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import { NewsletterForm } from "@/components/Newsletter";
import { getBlogPosts } from "@/lib/actions/getBlogPosts";
import styles from "./page.module.css";

// Blog post interface
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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
const staticBlogPosts: BlogPost[] = [
  {
    id: "transforming-education-through-gaming",
    title: "Transforming Education Through Gaming: The Xogos Vision",
    excerpt:
      "Discover how Xogos is revolutionizing the educational landscape by combining engaging gameplay with meaningful learning experiences that reward students for their achievements.",
    content: "",
    author: {
      name: "Xogos Team",
      avatar: "/images/fullLogo.jpeg",
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
    content: "",
    author: {
      name: "Xogos Team",
      avatar: "/images/fullLogo.jpeg",
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
    content: "",
    author: {
      name: "Xogos Team",
      avatar: "/images/fullLogo.jpeg",
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
    content: "",
    author: {
      name: "Xogos Team",
      avatar: "/images/fullLogo.jpeg",
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
    content: "",
    author: {
      name: "Xogos Team",
      avatar: "/images/fullLogo.jpeg",
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
    content: "",
    author: {
      name: "Xogos Team",
      avatar: "/images/fullLogo.jpeg",
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
const BlogCard = ({ post }: { post: BlogPost }) => {
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
const FeaturedBlogCard = ({ post }: { post: BlogPost }) => {
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
  const [allPosts, setAllPosts] = useState<BlogPost[]>(staticBlogPosts);
  const [categories, setCategories] = useState<string[]>(baseCategories);
  const [loading, setLoading] = useState(true);

  // Load posts from markdown files on mount
  useEffect(() => {
    async function loadPosts() {
      try {
        const result = await getBlogPosts();
        if (result.data && result.data.length > 0) {
          // Merge static posts with markdown posts, avoiding duplicates by ID
          const staticIds = new Set(staticBlogPosts.map((p) => p.id));
          const newPosts = result.data.filter((p) => !staticIds.has(p.id));
          const mergedPosts = [...staticBlogPosts, ...newPosts];

          // Sort by date (newest first)
          mergedPosts.sort((a, b) => {
            const dateA = new Date(a.publishedAt);
            const dateB = new Date(b.publishedAt);
            return dateB.getTime() - dateA.getTime();
          });

          setAllPosts(mergedPosts);

          // Update categories based on all posts
          const allCategories = new Set(mergedPosts.map((p) => p.category));
          const sortedCategories = ["All", ...Array.from(allCategories).sort()];
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  // Get featured post
  const featuredPost = allPosts.find((post) => post.featured);

  // Filter posts based on category and search
  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && !post.featured;
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
