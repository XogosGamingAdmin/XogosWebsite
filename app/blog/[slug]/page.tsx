"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import { getBlogPosts, BlogPost } from "@/lib/actions/getBlogPosts";
import styles from "./page.module.css";

// Static blog posts with full content (for featured articles)
const staticBlogPosts: BlogPost[] = [
  {
    id: "transforming-education-through-gaming",
    title: "Transforming Education Through Gaming: The Xogos Vision",
    excerpt:
      "Discover how Xogos is revolutionizing the educational landscape by combining engaging gameplay with meaningful learning experiences that reward students for their achievements.",
    content: `
      <p>At Xogos Gaming, we believe that education and entertainment are not mutually exclusive. In fact, when combined thoughtfully, they create powerful learning experiences that engage students in ways traditional methods simply cannot match.</p>

      <h2>The Problem with Traditional Education</h2>
      <p>For too long, education has been treated as a separate endeavor from play. Students are expected to sit still, absorb information passively, and demonstrate their knowledge through standardized tests. This approach fails to account for the natural human desire to explore, compete, and achieve.</p>

      <h2>Our Solution: Play, Learn, Earn</h2>
      <p>Xogos takes a different approach. We've developed a platform where students can:</p>
      <ul>
        <li><strong>Play</strong> - Engage with carefully designed games that are genuinely fun and entertaining</li>
        <li><strong>Learn</strong> - Absorb curriculum-aligned educational content while playing</li>
        <li><strong>Earn</strong> - Receive real rewards that can be converted into scholarship funds</li>
      </ul>

      <h2>The Science Behind Game-Based Learning</h2>
      <p>Research consistently shows that game-based learning improves retention, engagement, and motivation. When students are actively involved in their education through gameplay, they develop critical thinking skills, problem-solving abilities, and a love for learning that extends far beyond the classroom.</p>

      <h2>Our Commitment to Quality</h2>
      <p>Every game in the Xogos platform is developed with input from educators, game designers, and students themselves. We ensure that our content is not only educational but also genuinely engaging and age-appropriate.</p>

      <h2>Looking Forward</h2>
      <p>As we continue to expand our platform, we remain committed to our core mission: making education accessible, engaging, and rewarding for every student. Join us in transforming the future of education.</p>
    `,
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
    content: `
      <p>The Xogos platform is powered by an innovative dual-token economy designed to create sustainable value for students while maintaining a healthy ecosystem. Let's dive deep into how iPlay and iServ tokens work together.</p>

      <h2>iPlay Tokens: Your Educational Rewards</h2>
      <p>iPlay tokens are the primary reward mechanism within the Xogos platform. Students earn iPlay tokens by:</p>
      <ul>
        <li>Completing educational games and achieving high scores</li>
        <li>Reaching learning milestones and achievements</li>
        <li>Participating in daily challenges and events</li>
        <li>Helping other students through peer tutoring</li>
      </ul>

      <h2>The Xogos Bank: Growing Your Rewards</h2>
      <p>When you earn iPlay tokens, you can deposit them in the Xogos Bank where they grow over time. Our multiplier system rewards patience:</p>
      <ul>
        <li>30 days: 1.25x multiplier</li>
        <li>90 days: 1.5x multiplier</li>
        <li>180 days: 2x multiplier</li>
      </ul>

      <h2>iServ Tokens: Governance and Community</h2>
      <p>iServ tokens represent a stake in the Xogos ecosystem. They provide holders with:</p>
      <ul>
        <li>Voting rights on platform decisions</li>
        <li>Access to exclusive community features</li>
        <li>Connection to the broader cryptocurrency market</li>
      </ul>

      <h2>Converting to Scholarships</h2>
      <p>The ultimate goal of our token economy is to help students fund their education. Through our transparent conversion system, accumulated tokens can be converted into real scholarship funds, creating tangible value from educational achievements.</p>

      <h2>Security and Transparency</h2>
      <p>All token transactions are recorded on the blockchain, ensuring complete transparency and security. Our smart contracts have been audited and are designed to protect student earnings.</p>
    `,
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
    content: `
      <p>We're thrilled to announce the official launch of Bug and Seek, our newest educational game that combines the excitement of exploration with the wonders of entomology!</p>

      <h2>The Story</h2>
      <p>Players inherit a rundown insectarium from a quirky relative and must restore it to its former glory. The journey takes them through diverse ecosystems where they'll discover, catch, and learn about real-world insects.</p>

      <h2>220 Real-Life Bugs</h2>
      <p>Every insect in Bug and Seek is based on a real species. Our comprehensive codex includes:</p>
      <ul>
        <li>Scientific names and classifications</li>
        <li>Habitat information and geographic distribution</li>
        <li>Fun facts and behavioral characteristics</li>
        <li>Conservation status and environmental impact</li>
      </ul>

      <h2>Educational Value</h2>
      <p>Bug and Seek aligns with science curriculum standards for grades 3-8, covering topics like:</p>
      <ul>
        <li>Ecosystems and biodiversity</li>
        <li>Life cycles and metamorphosis</li>
        <li>Predator-prey relationships</li>
        <li>Environmental conservation</li>
      </ul>

      <h2>Gameplay Features</h2>
      <p>The game features intuitive controls, beautiful environments, and a progression system that keeps players engaged while learning. Earn iPlay tokens as you complete your collection and restore the insectarium!</p>

      <h2>Available Now</h2>
      <p>Bug and Seek is available now for all Xogos members. Start your entomological adventure today!</p>
    `,
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
    content: `
      <p>One of the most exciting aspects of the Xogos platform is the ability to convert your earned tokens into real scholarship funds. Here's a detailed look at how this process works.</p>

      <h2>Earning Your Tokens</h2>
      <p>The journey begins with playing educational games on the Xogos platform. As you complete challenges, achieve milestones, and master new subjects, you earn iPlay tokens.</p>

      <h2>Growing Your Balance</h2>
      <p>The Xogos Bank allows you to deposit your tokens and watch them grow. Our multiplier system rewards consistent saving, potentially doubling your tokens over 180 days.</p>

      <h2>The Conversion Process</h2>
      <p>When you're ready to convert your tokens to scholarship funds:</p>
      <ol>
        <li>Access your Xogos wallet</li>
        <li>Select the amount you wish to convert</li>
        <li>Choose your scholarship fund destination</li>
        <li>Confirm the transaction</li>
      </ol>

      <h2>Partner Institutions</h2>
      <p>We've partnered with educational institutions and scholarship programs across the country to ensure your converted funds can be used toward your educational goals.</p>

      <h2>Transparency and Security</h2>
      <p>All conversions are recorded on the blockchain, providing complete transparency. You can track every token from the moment you earn it to when it becomes scholarship dollars.</p>

      <h2>Getting Started</h2>
      <p>Ready to start building your educational future? Sign up for Xogos today and begin your journey from gameplay to scholarships!</p>
    `,
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
    content: `
      <p>Financial literacy is one of the most important life skills young people can develop, yet it's rarely taught in schools. That's why we're developing Debt-Free Millionaire, a comprehensive financial education game.</p>

      <h2>Choose Your Career</h2>
      <p>Players start by selecting from dozens of career paths, each with its own salary potential, educational requirements, and growth trajectory. Learn about different industries and the skills they require.</p>

      <h2>Manage Your Budget</h2>
      <p>Every month, players must balance their income against expenses:</p>
      <ul>
        <li>Housing (rent vs. mortgage decisions)</li>
        <li>Transportation (car payments, insurance, maintenance)</li>
        <li>Food and essentials</li>
        <li>Entertainment and lifestyle choices</li>
        <li>Savings and investments</li>
      </ul>

      <h2>Life Events</h2>
      <p>Just like real life, unexpected events occur. Players must navigate:</p>
      <ul>
        <li>Medical emergencies</li>
        <li>Job changes and promotions</li>
        <li>Market fluctuations</li>
        <li>Major life decisions</li>
      </ul>

      <h2>Educational Goals</h2>
      <p>Debt-Free Millionaire teaches critical concepts:</p>
      <ul>
        <li>Compound interest and investing</li>
        <li>Credit scores and debt management</li>
        <li>Tax planning basics</li>
        <li>Retirement planning</li>
      </ul>

      <h2>Coming Soon</h2>
      <p>Debt-Free Millionaire is currently in beta testing. Sign up for our newsletter to be notified when it launches!</p>
    `,
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
    content: `
      <p>While our digital games form the core of the Xogos experience, we believe that learning happens everywhere. That's why we've developed our Active Incentive Programs (AIPs) to reward real-world educational activities.</p>

      <h2>Volunteer Service</h2>
      <p>Community service teaches valuable lessons that can't be learned from a textbook. Students can earn iPlay tokens by logging verified volunteer hours with our partner organizations.</p>

      <h2>Physical Education</h2>
      <p>A healthy body supports a healthy mind. Our physical education AIP rewards students for:</p>
      <ul>
        <li>Participating in school sports</li>
        <li>Completing fitness challenges</li>
        <li>Attending physical education classes</li>
        <li>Tracking daily activity goals</li>
      </ul>

      <h2>Peer Tutoring</h2>
      <p>Teaching others is one of the most effective ways to solidify your own understanding. Students who help their peers through our tutoring program earn additional rewards.</p>

      <h2>Reading Challenges</h2>
      <p>Our reading program rewards students for:</p>
      <ul>
        <li>Completing books from our recommended list</li>
        <li>Writing book reviews</li>
        <li>Participating in book clubs</li>
        <li>Meeting monthly reading goals</li>
      </ul>

      <h2>Verification System</h2>
      <p>All AIP activities are verified through our partner network of schools, community organizations, and parents to ensure the integrity of the reward system.</p>

      <h2>Getting Involved</h2>
      <p>Contact your school or local community center to learn more about participating in Xogos Active Incentive Programs!</p>
    `,
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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function loadPost() {
      // First check static posts (they have full content)
      const staticPost = staticBlogPosts.find((p) => p.id === slug);
      if (staticPost) {
        setPost(staticPost);
        setRelatedPosts(
          staticBlogPosts
            .filter((p) => p.id !== slug && p.category === staticPost.category)
            .slice(0, 2)
        );
        setLoading(false);
        return;
      }

      // Load from generated posts
      try {
        const result = await getBlogPosts();
        if (result.data) {
          setAllPosts(result.data);
          const foundPost = result.data.find((p) => p.id === slug);
          if (foundPost) {
            setPost(foundPost);
            // Get related posts from same category
            const related = result.data
              .filter((p) => p.id !== slug && p.category === foundPost.category)
              .slice(0, 2);
            setRelatedPosts(related);
          }
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <MarketingLayout>
        <main className={styles.main}>
          <section className={styles.notFoundSection}>
            <div className={styles.notFoundContent}>
              <p>Loading article...</p>
            </div>
          </section>
        </main>
      </MarketingLayout>
    );
  }

  if (!post) {
    return (
      <MarketingLayout>
        <main className={styles.main}>
          <section className={styles.notFoundSection}>
            <div className={styles.notFoundContent}>
              <h1>Article Not Found</h1>
              <p>
                The article you&apos;re looking for doesn&apos;t exist or has
                been moved.
              </p>
              <Link href="/blog" className={styles.backButton}>
                Back to Blog
              </Link>
            </div>
          </section>
        </main>
      </MarketingLayout>
    );
  }

  // Format excerpt as content if no content available
  const displayContent = post.content || `<p>${post.excerpt}</p>`;

  return (
    <MarketingLayout>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.heroGrid}></div>
          </div>
          <div className={styles.heroImageContainer}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className={styles.heroImage}
              priority
              unoptimized={post.imageUrl.startsWith("http")}
            />
            <div className={styles.heroOverlay}></div>
          </div>
          <div className={styles.heroContent}>
            <Link href="/blog" className={styles.backLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
            <div className={styles.postCategory}>{post.category}</div>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <div className={styles.postMeta}>
              <div className={styles.authorSection}>
                <div className={styles.authorAvatar}>
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className={styles.avatarImage}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{post.author.name}</span>
                  <span className={styles.authorRole}>{post.author.role}</span>
                </div>
              </div>
              <div className={styles.metaDivider}></div>
              <div className={styles.metaDetails}>
                <span className={styles.postDate}>{post.publishedAt}</span>
                <span className={styles.postReadTime}>{post.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className={styles.articleSection}>
          <div className={styles.articleContainer}>
            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          </div>
        </article>

        {/* Share Section */}
        <section className={styles.shareSection}>
          <div className={styles.shareContainer}>
            <span className={styles.shareLabel}>Share this article:</span>
            <div className={styles.shareButtons}>
              <button className={styles.shareButton} title="Share on Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button className={styles.shareButton} title="Share on LinkedIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button className={styles.shareButton} title="Share on Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className={styles.shareButton} title="Copy link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedContainer}>
              <h2 className={styles.relatedTitle}>Related Articles</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedImageContainer}>
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className={styles.relatedImage}
                        unoptimized={relatedPost.imageUrl.startsWith("http")}
                      />
                    </div>
                    <div className={styles.relatedContent}>
                      <span className={styles.relatedCategory}>
                        {relatedPost.category}
                      </span>
                      <h3 className={styles.relatedPostTitle}>
                        {relatedPost.title}
                      </h3>
                      <span className={styles.relatedDate}>
                        {relatedPost.publishedAt}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>Ready to Start Learning?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of students who are transforming their education
              through gaming. Sign up today and start earning rewards!
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/games" className={styles.primaryButton}>
                Explore Games
              </Link>
              <Link href="/blog" className={styles.secondaryButton}>
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
