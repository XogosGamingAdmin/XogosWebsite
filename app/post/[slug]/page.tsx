import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Xogos Gaming",
    };
  }

  return {
    title: `${post.title} | Xogos Gaming`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

// Convert markdown to HTML
async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);
  const relatedPosts = getRelatedPosts(slug, 2);

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
                    src="/images/fullLogo.jpeg"
                    alt={post.author}
                    width={48}
                    height={48}
                    className={styles.avatarImage}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{post.author}</span>
                  <span className={styles.authorRole}>{post.topic}</span>
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
              dangerouslySetInnerHTML={{ __html: contentHtml }}
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
                    key={relatedPost.slug}
                    href={`/post/${relatedPost.slug}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedImageContainer}>
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className={styles.relatedImage}
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
