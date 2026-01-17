"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { canManageBlog } from "@/lib/auth/admin";
import styles from "../page.module.css";

const categories = [
  "AI Education",
  "Financial Literacy",
  "History",
  "Lesson Plans",
  "Education",
  "Creator's Notes",
];

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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

export default function EditPostPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
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
  const [category, setCategory] = useState("Education");
  const [author, setAuthor] = useState("Zack Edwards");
  const [imageUrl, setImageUrl] = useState("/images/fullLogo.jpeg");
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

  // Fetch existing post data
  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const res = await fetch(`/api/blog/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            const post = data.data;
            setOriginalPost(post);
            setTitle(post.title);
            setExcerpt(post.excerpt || "");
            setContent(post.content || "");
            setCategory(post.category || "Education");
            setAuthor(post.author?.name || "Zack Edwards");
            setImageUrl(post.imageUrl || "/images/fullLogo.jpeg");
          }
        } else {
          setMessage({ type: "error", text: "Post not found" });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setMessage({ type: "error", text: "Failed to load post" });
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  // Redirect if not authenticated or not authorized
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
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          author,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Post updated successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update post",
        });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

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
        <h1>Edit Blog Post</h1>
        <Link href="/admin/posts" className={styles.backLink}>
          Back to Posts
        </Link>
      </header>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.content} style={{ gridTemplateColumns: "1fr" }}>
        {/* Edit Post Form */}
        <section className={styles.formSection}>
          <h2>Edit Existing Post: {originalPost?.title}</h2>
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

            <div className={styles.formGroup}>
              <label htmlFor="imageUrl">Featured Image URL</label>
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/fullLogo.jpeg or https://..."
              />
            </div>

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
                rows={20}
                required
                placeholder="Write your post content here. HTML is supported."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                disabled={saving}
                className={styles.submitButton}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
              <Link
                href={`/blog/${id}`}
                target="_blank"
                className={styles.submitButton}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  textAlign: "center",
                  textDecoration: "none"
                }}
              >
                Preview Post
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
