"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { canManageBlog } from "@/lib/auth/admin";
import styles from "./page.module.css";

const categories = [
  "AI Education",
  "Debt Free Millionaire",
  "Education",
  "Financial Literacy",
  "Historical Conquest",
  "History",
  "Lesson Plans",
  "Creator's Notes",
];

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  publishedAt: string;
  readTime?: string;
  imageUrl?: string;
  author?: {
    name: string;
    avatar: string;
    role: string;
  };
}

export default function AdminPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Education");
  const [author, setAuthor] = useState("Zack Edwards");
  const [imageUrl, setImageUrl] = useState("/images/XogosLogo.png");
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");

  // Reference for the content textarea
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  // Rich text formatting helpers
  const wrapSelection = (before: string, after: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);
    setContent(newContent);

    // Restore cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatBold = () => wrapSelection("<strong>", "</strong>");
  const formatItalic = () => wrapSelection("<em>", "</em>");
  const formatUnderline = () => wrapSelection("<u>", "</u>");
  const formatHeading = () => wrapSelection("<h3>", "</h3>");
  const formatColor = (color: string) =>
    wrapSelection(`<span style="color: ${color}">`, "</span>");
  const formatSize = (size: string) =>
    wrapSelection(`<span style="font-size: ${size}">`, "</span>");

  // Fetch existing posts from blog API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setPosts(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Redirect if not authenticated or not authorized for blog management
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (
      status === "authenticated" &&
      !canManageBlog(session?.user?.email)
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          author,
          imageUrl,
          imageId: uploadedImageId,
          scheduledDate: scheduledDate || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const isScheduled =
          scheduledDate && new Date(scheduledDate) > new Date();
        setMessage({
          type: "success",
          text: isScheduled
            ? `Post scheduled for ${new Date(scheduledDate).toLocaleDateString()}! View at /blog/${data.id}`
            : `Post created! View at /blog/${data.id}`,
        });
        // Reset form
        setTitle("");
        setExcerpt("");
        setContent("");
        setImageUrl("/images/XogosLogo.png");
        setUploadedImageId(null);
        setScheduledDate("");
        // Refresh posts list
        const postsRes = await fetch("/api/blog");
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          if (postsData.data) {
            setPosts(postsData.data);
          }
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create post",
        });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from posts
  const allCategories = [
    "All",
    ...new Set(posts.map((p) => p.category)),
  ].sort();

  if (status === "loading" || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!session || !canManageBlog(session?.user?.email)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Blog Post Manager</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/images" className={styles.backLink}>
            Image Library
          </Link>
          <Link href="/dashboard" className={styles.backLink}>
            Back to Dashboard
          </Link>
        </div>
      </header>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.content}>
        {/* Create New Post Form */}
        <section className={styles.formSection}>
          <h2>Create New Post</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter post title"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="author">Author</label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Zack Edwards"
                />
              </div>
            </div>

            <ImageUpload
              currentImageUrl={
                imageUrl !== "/images/XogosLogo.png" ? imageUrl : undefined
              }
              onImageUploaded={(url, id) => {
                setImageUrl(url);
                setUploadedImageId(id);
              }}
              onImageRemoved={() => {
                setImageUrl("/images/XogosLogo.png");
                setUploadedImageId(null);
              }}
            />

            <div className={styles.formGroup}>
              <label htmlFor="excerpt">Excerpt (Summary)</label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Brief summary of the post (shown on blog listing)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="scheduledDate">
                Schedule Post (leave empty to publish now)
              </label>
              <input
                id="scheduledDate"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className={styles.dateInput}
              />
              {scheduledDate && (
                <span className={styles.scheduledInfo}>
                  Will be published on{" "}
                  {new Date(scheduledDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Content *</label>
              <div className={styles.editorToolbar}>
                <button
                  type="button"
                  onClick={formatBold}
                  className={styles.toolbarButton}
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={formatItalic}
                  className={styles.toolbarButton}
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={formatUnderline}
                  className={styles.toolbarButton}
                  title="Underline"
                >
                  <u>U</u>
                </button>
                <button
                  type="button"
                  onClick={formatHeading}
                  className={styles.toolbarButton}
                  title="Heading"
                >
                  H3
                </button>
                <span className={styles.toolbarDivider}></span>
                <select
                  onChange={(e) => {
                    if (e.target.value) formatColor(e.target.value);
                    e.target.value = "";
                  }}
                  className={styles.toolbarSelect}
                  title="Text Color"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Color
                  </option>
                  <option value="#e62739">Red</option>
                  <option value="#7928ca">Purple</option>
                  <option value="#e6bb84">Gold</option>
                  <option value="#22c55e">Green</option>
                  <option value="#3b82f6">Blue</option>
                  <option value="#ffffff">White</option>
                </select>
                <select
                  onChange={(e) => {
                    if (e.target.value) formatSize(e.target.value);
                    e.target.value = "";
                  }}
                  className={styles.toolbarSelect}
                  title="Font Size"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Size
                  </option>
                  <option value="0.875rem">Small</option>
                  <option value="1rem">Normal</option>
                  <option value="1.25rem">Large</option>
                  <option value="1.5rem">X-Large</option>
                  <option value="2rem">Huge</option>
                </select>
              </div>
              <textarea
                id="content"
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                required
                placeholder="Write your post content here. Select text and use the toolbar above to format.

You can also paste plain text with paragraphs - they will be preserved automatically.

Or use HTML directly:
<h3>Section Title</h3>
<p>Your paragraph text goes here.</p>"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className={styles.submitButton}
            >
              {saving ? "Creating Post..." : "Create Post"}
            </button>
          </form>
        </section>

        {/* Existing Posts List */}
        <section className={styles.postsSection}>
          <h2>Existing Posts ({posts.length})</h2>

          {/* Search and Filter */}
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.postsList}>
            {filteredPosts.length === 0 ? (
              <p className={styles.noPosts}>
                {posts.length === 0
                  ? "No posts yet. Create your first one above!"
                  : "No posts match your search."}
              </p>
            ) : (
              filteredPosts.slice(0, 50).map((post) => (
                <div key={post.id} className={styles.postItem}>
                  <div className={styles.postInfo}>
                    <h3>{post.title}</h3>
                    <div className={styles.postMeta}>
                      <span className={styles.category}>{post.category}</span>
                      <span className={styles.date}>{post.publishedAt}</span>
                    </div>
                  </div>
                  <div className={styles.postActions}>
                    <Link
                      href={`/blog/${post.id}`}
                      target="_blank"
                      className={styles.viewButton}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className={styles.editButton}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
            {filteredPosts.length > 50 && (
              <p className={styles.moreResults}>
                Showing 50 of {filteredPosts.length} posts. Use search to find
                specific posts.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
