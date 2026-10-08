"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { canManageBlog } from "@/lib/auth/admin";
import styles from "../page.module.css";

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

interface LibraryImage {
  id: string;
  public_url: string;
  original_filename: string;
  created_at: string;
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
  const [imageUrl, setImageUrl] = useState("/images/XogosLogo.png");
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

  // Reference for the visual editor
  const editorRef = React.useRef<HTMLDivElement>(null);

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

  // Rich text formatting helpers using execCommand
  const formatBold = () => {
    document.execCommand("bold", false);
    editorRef.current?.focus();
  };
  const formatItalic = () => {
    document.execCommand("italic", false);
    editorRef.current?.focus();
  };
  const formatUnderline = () => {
    document.execCommand("underline", false);
    editorRef.current?.focus();
  };
  const formatHeading = () => {
    document.execCommand("formatBlock", false, "h3");
    editorRef.current?.focus();
  };
  const formatParagraph = () => {
    document.execCommand("formatBlock", false, "p");
    editorRef.current?.focus();
  };
  const formatColor = (color: string) => {
    document.execCommand("foreColor", false, color);
    editorRef.current?.focus();
  };
  const formatSize = (size: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = size;
      range.surroundContents(span);
    }
    editorRef.current?.focus();
  };
  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
    editorRef.current?.focus();
  };
  const formatBulletList = () => {
    document.execCommand("insertUnorderedList", false);
    editorRef.current?.focus();
  };
  const formatNumberedList = () => {
    document.execCommand("insertOrderedList", false);
    editorRef.current?.focus();
  };

  // Handle content changes in the editor
  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Handle paste to clean up and preserve formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain");

    if (!e.clipboardData.getData("text/html")) {
      const plainText = e.clipboardData.getData("text/plain");
      const paragraphs = plainText.split(/\n\n+/).filter(p => p.trim());
      const html = paragraphs.map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
      document.execCommand("insertHTML", false, html);
    } else {
      document.execCommand("insertHTML", false, text);
    }
    handleEditorInput();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          formatBold();
          break;
        case "i":
          e.preventDefault();
          formatItalic();
          break;
        case "u":
          e.preventDefault();
          formatUnderline();
          break;
        case "k":
          e.preventDefault();
          insertLink();
          break;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      setTimeout(handleEditorInput, 0);
    }
  };

  // Save and restore selection for modal insertions
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }
  };

  const restoreSelection = () => {
    if (savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
    }
  };

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
    saveSelection();
    setSelectedLibraryImage("");
    setImagePosition("center");
    setImageSize("medium");
    setImageAlt("");
    setShowImageModal(true);
    loadImageLibrary();
  };

  // Open video modal
  const openVideoModal = () => {
    saveSelection();
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

    // Restore selection and insert HTML
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("insertHTML", false, imageHtml);
    handleEditorInput();
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

    // Restore selection and insert HTML
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("insertHTML", false, videoHtml);
    handleEditorInput();
    setShowVideoModal(false);
  };

  // Track if content has been loaded into editor
  const [contentLoaded, setContentLoaded] = useState(false);

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
            setImageUrl(post.imageUrl || "/images/XogosLogo.png");
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

  // Load content into editor when post data is fetched
  useEffect(() => {
    if (editorRef.current && content && !contentLoaded && !loading) {
      editorRef.current.innerHTML = content;
      setContentLoaded(true);
    }
  }, [content, contentLoaded, loading]);

  // Redirect if not authenticated or not authorized
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

            <ImageUpload
              currentImageUrl={
                imageUrl !== "/images/XogosLogo.png" ? imageUrl : undefined
              }
              postId={id as string}
              onImageUploaded={(url) => {
                setImageUrl(url);
              }}
              onImageRemoved={() => {
                setImageUrl("/images/XogosLogo.png");
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
              <div className={styles.editorLabel}>
                <label htmlFor="content">Content *</label>
                <span className={styles.editorHint}>
                  What you see here is how it will appear on the blog
                </span>
              </div>
              <div className={styles.editorToolbar}>
                <button
                  type="button"
                  onClick={formatBold}
                  className={styles.toolbarButton}
                  title="Bold (Ctrl+B)"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={formatItalic}
                  className={styles.toolbarButton}
                  title="Italic (Ctrl+I)"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={formatUnderline}
                  className={styles.toolbarButton}
                  title="Underline (Ctrl+U)"
                >
                  <u>U</u>
                </button>
                <span className={styles.toolbarDivider}></span>
                <button
                  type="button"
                  onClick={formatHeading}
                  className={styles.toolbarButton}
                  title="Heading"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={formatParagraph}
                  className={styles.toolbarButton}
                  title="Paragraph"
                >
                  P
                </button>
                <button
                  type="button"
                  onClick={formatBulletList}
                  className={styles.toolbarButton}
                  title="Bullet List"
                >
                  •
                </button>
                <button
                  type="button"
                  onClick={formatNumberedList}
                  className={styles.toolbarButton}
                  title="Numbered List"
                >
                  1.
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
                  <option value="#1a1a2e">Dark</option>
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
                  onClick={insertLink}
                  className={styles.toolbarButton}
                  title="Insert Link (Ctrl+K)"
                >
                  🔗
                </button>
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
              <div
                id="content"
                ref={editorRef}
                className={styles.visualEditor}
                contentEditable
                onInput={handleEditorInput}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                data-placeholder="Loading content..."
                suppressContentEditableWarning
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
                  textDecoration: "none",
                }}
              >
                Preview Post
              </Link>
            </div>
          </form>
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
