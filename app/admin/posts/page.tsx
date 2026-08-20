"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
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

interface LibraryImage {
  id: string;
  public_url: string;
  original_filename: string;
  created_at: string;
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

  // Image/Video insertion modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [selectedLibraryImage, setSelectedLibraryImage] = useState<string>("");
  const [imagePosition, setImagePosition] = useState<
    "left" | "center" | "right"
  >("center");
  const [imageSize, setImageSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [imageAlt, setImageAlt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoError, setVideoError] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

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

  // Load image library
  const loadImageLibrary = useCallback(async () => {
    setLoadingLibrary(true);
    try {
      const res = await fetch("/api/blog/images");
      if (res.ok) {
        const data = await res.json();
        setLibraryImages(data.images || []);
      }
    } catch (error) {
      console.error("Error loading image library:", error);
    } finally {
      setLoadingLibrary(false);
    }
  }, []);

  // Open image modal
  const openImageModal = () => {
    const textarea = contentRef.current;
    if (textarea) {
      setCursorPosition(textarea.selectionStart);
    }
    setSelectedLibraryImage("");
    setImagePosition("center");
    setImageSize("medium");
    setImageAlt("");
    setShowImageModal(true);
    loadImageLibrary();
  };

  // Open video modal
  const openVideoModal = () => {
    const textarea = contentRef.current;
    if (textarea) {
      setCursorPosition(textarea.selectionStart);
    }
    setVideoUrl("");
    setVideoError("");
    setShowVideoModal(true);
  };

  // Extract YouTube video ID from various URL formats
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Insert image at cursor position
  const insertImage = () => {
    if (!selectedLibraryImage) return;

    const sizeMap = {
      small: "300px",
      medium: "500px",
      large: "100%",
    };

    const alignMap = {
      left: "flex-start",
      center: "center",
      right: "flex-end",
    };

    const floatStyle =
      imagePosition === "center"
        ? ""
        : `float: ${imagePosition}; margin-${imagePosition === "left" ? "right" : "left"}: 1.5rem; margin-bottom: 1rem;`;

    const imageHtml =
      imagePosition === "center"
        ? `<div class="blog-image" style="display: flex; justify-content: ${alignMap[imagePosition]}; margin: 2rem 0;">
  <img src="${selectedLibraryImage}" alt="${imageAlt || "Blog image"}" style="max-width: ${sizeMap[imageSize]}; height: auto; border-radius: 8px;" />
</div>`
        : `<img src="${selectedLibraryImage}" alt="${imageAlt || "Blog image"}" class="blog-image" style="max-width: ${sizeMap[imageSize]}; height: auto; border-radius: 8px; ${floatStyle}" />`;

    const newContent =
      content.substring(0, cursorPosition) +
      imageHtml +
      content.substring(cursorPosition);
    setContent(newContent);
    setShowImageModal(false);
  };

  // Insert YouTube video at cursor position
  const insertVideo = () => {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) {
      setVideoError(
        "Invalid YouTube URL. Please enter a valid YouTube video link."
      );
      return;
    }

    const videoHtml = `<div class="blog-video" style="position: relative; margin: 2rem 0; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; background: #000;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&fs=1&disablekb=1&iv_load_policy=3"
    title="Video"
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 12px;"
  ></iframe>
  <div style="position: absolute; top: 0; left: 0; right: 0; height: 70px; background: transparent; z-index: 10; cursor: default;"></div>
  <div style="position: absolute; bottom: 0; right: 0; width: 150px; height: 50px; background: transparent; z-index: 10; cursor: default;"></div>
</div>`;

    const newContent =
      content.substring(0, cursorPosition) +
      videoHtml +
      content.substring(cursorPosition);
    setContent(newContent);
    setShowVideoModal(false);
  };

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
                <span className={styles.toolbarDivider}></span>
                <button
                  type="button"
                  onClick={openImageModal}
                  className={styles.toolbarButton}
                  title="Insert Image"
                >
                  🖼️
                </button>
                <button
                  type="button"
                  onClick={openVideoModal}
                  className={styles.toolbarButton}
                  title="Insert YouTube Video"
                >
                  🎬
                </button>
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

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className={styles.modalOverlay} onClick={() => setShowImageModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Insert Image</h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className={styles.modalClose}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <label>Select from Image Library</label>
                {loadingLibrary ? (
                  <div className={styles.loadingLibrary}>Loading images...</div>
                ) : libraryImages.length === 0 ? (
                  <div className={styles.noImages}>
                    No images in library.{" "}
                    <Link href="/admin/images" target="_blank">
                      Upload images
                    </Link>
                  </div>
                ) : (
                  <div className={styles.imageGrid}>
                    {libraryImages.map((img) => (
                      <div
                        key={img.id}
                        className={`${styles.imageGridItem} ${selectedLibraryImage === img.public_url ? styles.selected : ""}`}
                        onClick={() => setSelectedLibraryImage(img.public_url)}
                      >
                        <img src={img.public_url} alt={img.original_filename} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.modalSection}>
                <label>Or paste image URL</label>
                <input
                  type="text"
                  value={selectedLibraryImage}
                  onChange={(e) => setSelectedLibraryImage(e.target.value)}
                  placeholder="https://..."
                  className={styles.modalInput}
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalSection}>
                  <label>Position</label>
                  <select
                    value={imagePosition}
                    onChange={(e) =>
                      setImagePosition(e.target.value as "left" | "center" | "right")
                    }
                    className={styles.modalSelect}
                  >
                    <option value="left">Float Left</option>
                    <option value="center">Center</option>
                    <option value="right">Float Right</option>
                  </select>
                </div>
                <div className={styles.modalSection}>
                  <label>Size</label>
                  <select
                    value={imageSize}
                    onChange={(e) =>
                      setImageSize(e.target.value as "small" | "medium" | "large")
                    }
                    className={styles.modalSelect}
                  >
                    <option value="small">Small (300px)</option>
                    <option value="medium">Medium (500px)</option>
                    <option value="large">Large (Full Width)</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalSection}>
                <label>Alt Text (optional)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe the image..."
                  className={styles.modalInput}
                />
              </div>

              {selectedLibraryImage && (
                <div className={styles.imagePreview}>
                  <label>Preview</label>
                  <img src={selectedLibraryImage} alt="Preview" />
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className={styles.modalCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                disabled={!selectedLibraryImage}
                className={styles.modalConfirm}
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Insert Modal */}
      {showVideoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowVideoModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Insert YouTube Video</h3>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className={styles.modalClose}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <label>YouTube Video URL</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setVideoError("");
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className={styles.modalInput}
                />
                {videoError && (
                  <span className={styles.videoError}>{videoError}</span>
                )}
              </div>

              <div className={styles.videoInfo}>
                <p>
                  <strong>Supported formats:</strong>
                </p>
                <ul>
                  <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>https://youtu.be/VIDEO_ID</li>
                  <li>https://www.youtube.com/embed/VIDEO_ID</li>
                  <li>Just the VIDEO_ID (11 characters)</li>
                </ul>
                <p className={styles.videoNote}>
                  Videos will be embedded using privacy-enhanced mode and viewers
                  cannot click on external YouTube links.
                </p>
              </div>

              {videoUrl && extractYouTubeId(videoUrl) && (
                <div className={styles.videoPreview}>
                  <label>Preview</label>
                  <div className={styles.videoPreviewContainer}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(videoUrl)}?rel=0&modestbranding=1`}
                      title="Video Preview"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className={styles.modalCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertVideo}
                disabled={!videoUrl}
                className={styles.modalConfirm}
              >
                Insert Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
