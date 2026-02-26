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
    } else if (status === "authenticated" && !canManageBlog(session?.user?.email)) {
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
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Post created! View at /blog/${data.id}`,
        });
        // Reset form
        setTitle("");
        setExcerpt("");
        setContent("");
        setImageUrl("/images/XogosLogo.png");
        setUploadedImageId(null);
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
  const allCategories = ["All", ...new Set(posts.map((p) => p.category))].sort();

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
              currentImageUrl={imageUrl !== "/images/XogosLogo.png" ? imageUrl : undefined}
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
              <label htmlFor="content">Content * (HTML supported)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                required
                placeholder="Write your post content here. HTML is supported:

<h3><strong>Section Title</strong></h3>

<p>Your paragraph text goes here.</p>

<p>Another paragraph with more content.</p>

<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>"
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
                Showing 50 of {filteredPosts.length} posts. Use search to find specific posts.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
