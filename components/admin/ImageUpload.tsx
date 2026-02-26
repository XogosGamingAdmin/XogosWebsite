"use client";

import React, { useState, useRef } from "react";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  currentImageUrl?: string;
  postId?: string;
  onImageUploaded: (imageUrl: string, imageId: string) => void;
  onImageRemoved?: () => void;
}

export default function ImageUpload({
  currentImageUrl,
  postId,
  onImageUploaded,
  onImageRemoved,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please use JPEG, PNG, WebP, or GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload file
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (postId) formData.append("postId", postId);

      const response = await fetch("/api/blog/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setPreview(data.image.public_url);
      onImageUploaded(data.image.public_url, data.image.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageRemoved?.();
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Featured Image</label>

      {preview ? (
        <div className={styles.previewContainer}>
          <img
            src={preview}
            alt="Featured image preview"
            className={styles.preview}
          />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.changeButton}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Change Image"}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className={styles.removeButton}
              disabled={uploading}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${dragActive ? styles.dragActive : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.dropzoneContent}>
            <span className={styles.icon}>+</span>
            <p>Drag and drop an image here, or click to select</p>
            <p className={styles.hint}>JPEG, PNG, WebP, or GIF (max 5MB)</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className={styles.hiddenInput}
      />

      {uploading && (
        <div className={styles.uploadingIndicator}>
          <span className={styles.spinner}></span>
          <span>Uploading image...</span>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
