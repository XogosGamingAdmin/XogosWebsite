"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

const categories = [
  "AI Education",
  "Financial Literacy",
  "Ancient Egypt",
  "Colonial America",
  "Age of Exploration",
  "Ancient Africa",
  "Indus Valley",
  "Ancient America",
  "Industrial Revolution",
  "Ancient China",
  "Ancient Rome",
  "Civil War",
  "Lesson Plans",
  "Creator's Notes",
];

interface Post {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
}

export default function AdminPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("AI Education");
  const [topic, setTopic] = useState("");
  const [author, setAuthor] = useState("Xogos Team");
  const [imageUrl, setImageUrl] = useState("/images/fullLogo.jpeg");

  // Fetch existing posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          topic: topic || category,
          author,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Post created! View at ${data.path}`,
        });
        // Reset form
        setTitle("");
        setExcerpt("");
        setContent("");
        setTopic("");
        // Refresh posts list
        const postsRes = await fetch("/api/posts");
        if (postsRes.ok) {
          setPosts(await postsRes.json());
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

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
        setMessage({ type: "success", text: "Post deleted successfully" });
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.error || "Failed to delete post",
        });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Blog Post Manager</h1>
        <Link href="/dashboard" className={styles.backLink}>
          Back to Dashboard
        </Link>
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
                <label htmlFor="topic">Topic</label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Machine Learning"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="author">Author</label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Xogos Team"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/fullLogo.jpeg"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Brief summary of the post (optional)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Content * (Markdown supported)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                required
                placeholder="Write your post content here. You can use Markdown formatting:

# Heading 1
## Heading 2

**bold text**
*italic text*

- bullet point
- another point

1. numbered list
2. second item

> blockquote

[link text](https://example.com)

![image alt](image-url)"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className={styles.submitButton}
            >
              {saving ? "Saving..." : "Create Post"}
            </button>
          </form>
        </section>

        {/* Existing Posts List */}
        <section className={styles.postsSection}>
          <h2>Existing Posts ({posts.length})</h2>
          <div className={styles.postsList}>
            {posts.length === 0 ? (
              <p className={styles.noPosts}>
                No posts yet. Create your first one above!
              </p>
            ) : (
              posts.map((post) => (
                <div key={post.slug} className={styles.postItem}>
                  <div className={styles.postInfo}>
                    <h3>{post.title}</h3>
                    <div className={styles.postMeta}>
                      <span className={styles.category}>{post.category}</span>
                      <span className={styles.date}>{post.publishedAt}</span>
                    </div>
                  </div>
                  <div className={styles.postActions}>
                    <Link
                      href={`/post/${post.slug}`}
                      target="_blank"
                      className={styles.viewButton}
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
