"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";
import { canManageBlog } from "@/lib/auth/admin";
import styles from "./page.module.css";

interface BlogImage {
  id: string;
  public_url: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  alt_text: string | null;
  post_id: string | null;
  created_at: string;
}

export default function ImageLibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "orphaned">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch images
  useEffect(() => {
    fetchImages();
  }, [filter]);

  async function fetchImages() {
    setLoading(true);
    try {
      const url = filter === "orphaned"
        ? "/api/blog/images?orphaned=true"
        : "/api/blog/images";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setImages(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated" && !canManageBlog(session?.user?.email)) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/blog/images/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImages(images.filter((img) => img.id !== id));
        setMessage({ type: "success", text: "Image deleted successfully" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to delete image" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete image" });
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Invalid file type. Please use JPEG, PNG, WebP, or GIF." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File too large. Maximum size is 5MB." });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/blog/images/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Image uploaded successfully" });
        fetchImages();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (status === "loading" || (loading && images.length === 0)) {
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
        <h1>Image Library</h1>
        <Link href="/admin/posts" className={styles.backLink}>
          Back to Posts
        </Link>
      </header>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            All Images ({filter === "all" ? images.length : "..."})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "orphaned" ? styles.active : ""}`}
            onClick={() => setFilter("orphaned")}
          >
            Unused Images
          </button>
        </div>

        <div className={styles.actions}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            className={styles.hiddenInput}
          />
          <button
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "+ Upload Image"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading images...</div>
      ) : images.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No images found.</p>
          <p>Upload images when creating blog posts, or use the upload button above.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {images.map((image) => (
            <div key={image.id} className={styles.imageCard}>
              <div className={styles.imagePreview}>
                <img src={image.public_url} alt={image.alt_text || image.original_filename} />
              </div>
              <div className={styles.imageInfo}>
                <div className={styles.filename} title={image.original_filename}>
                  {image.original_filename}
                </div>
                <div className={styles.meta}>
                  <span>{formatFileSize(image.file_size)}</span>
                  <span>{formatDate(image.created_at)}</span>
                </div>
                {image.post_id && (
                  <div className={styles.linkedPost}>
                    <Link href={`/blog/${image.post_id}`} target="_blank">
                      Linked to post
                    </Link>
                  </div>
                )}
              </div>
              <div className={styles.imageActions}>
                <button
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(image.public_url, image.id)}
                  title="Copy URL"
                >
                  {copiedId === image.id ? "Copied!" : "Copy URL"}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  title="Delete image"
                >
                  {deletingId === image.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
