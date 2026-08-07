"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

// react-pdf touches browser-only APIs, so it must never render on the server.
const BookReader = dynamic(() => import("./BookReader"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading reader…</div>,
});

interface BoardDocument {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_size: number;
  page_count: number | null;
  uploaded_by_email: string;
  uploaded_by_name: string | null;
  is_hidden: boolean;
  hidden_at: string | null;
  created_at: string;
  retain_until: string;
  highlight_count: number;
  comment_count: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function DocumentReviewerPage() {
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const [openDoc, setOpenDoc] = useState<BoardDocument | null>(null);

  // Upload form
  const [uploadOpen, setUploadOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<BoardDocument | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/documents${showHidden ? "?includeHidden=true" : ""}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not load documents");
      }
      const data = await res.json();
      setDocuments(data.documents || []);
      setCanManage(Boolean(data.canManage));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load documents");
    } finally {
      setLoading(false);
    }
  }, [showHidden]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || uploading) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setTitle("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadOpen(false);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const toggleHidden = async (doc: BoardDocument) => {
    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !doc.is_hidden }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not update the document");
      }
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteConfirmText !== "DELETE" || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      setDeleteTarget(null);
      setDeleteConfirmText("");
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (openDoc) {
    return (
      <BookReader
        documentId={openDoc.id}
        documentTitle={openDoc.title}
        onClose={() => {
          setOpenDoc(null);
          loadDocuments();
        }}
      />
    );
  }

  const retentionActive = (doc: BoardDocument): boolean =>
    new Date(doc.retain_until) > new Date();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/boardroom" className={styles.backLink}>
          ← Board Room
        </Link>
        <h1 className={styles.title}>Document Reviewer</h1>
        <p className={styles.subtitle}>
          Read board documents in a two-page reader, highlight passages, and
          discuss them in thread. Highlights and comments are retained for seven
          years.
        </p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {canManage && (
        <div className={styles.adminBar}>
          <div className={styles.adminBarLeft}>
            <span className={styles.adminTag}>ADMIN</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
              />
              Show hidden documents
            </label>
          </div>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setUploadOpen((v) => !v)}
          >
            {uploadOpen ? "Cancel" : "＋ Upload Document"}
          </button>
        </div>
      )}

      {canManage && uploadOpen && (
        <form className={styles.uploadForm} onSubmit={handleUpload}>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Title
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Q3 Board Packet"
                required
              />
            </label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Description (optional)
              <input
                className={styles.input}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="For review ahead of the October meeting"
              />
            </label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>
              PDF file (max 50 MB)
              <input
                ref={fileInputRef}
                className={styles.input}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={uploading || !file || !title.trim()}
          >
            {uploading ? "Uploading…" : "Upload to Reviewer"}
          </button>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}>Loading documents…</div>
      ) : documents.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📖</span>
          <h2>No documents yet</h2>
          <p>
            {canManage
              ? "Upload a PDF to make it available for board review."
              : "An admin has not published any documents for review yet."}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {documents.map((doc) => (
            <article
              key={doc.id}
              className={`${styles.card} ${doc.is_hidden ? styles.cardHidden : ""}`}
            >
              {doc.is_hidden && (
                <span className={styles.hiddenFlag}>HIDDEN · ARCHIVED</span>
              )}
              <h3 className={styles.cardTitle}>{doc.title}</h3>
              {doc.description && (
                <p className={styles.cardDescription}>{doc.description}</p>
              )}

              <div className={styles.cardMeta}>
                <span>{formatBytes(doc.file_size)}</span>
                <span>·</span>
                <span>{doc.highlight_count} highlights</span>
                <span>·</span>
                <span>{doc.comment_count} comments</span>
              </div>
              <div className={styles.cardMetaDim}>
                Added {formatDate(doc.created_at)} by{" "}
                {doc.uploaded_by_name || doc.uploaded_by_email}
              </div>
              <div className={styles.cardRetention}>
                Retain until {formatDate(doc.retain_until)}
              </div>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => setOpenDoc(doc)}
                >
                  Open Reader
                </button>

                {canManage && (
                  <>
                    <button
                      type="button"
                      className={styles.ghostBtn}
                      onClick={() => toggleHidden(doc)}
                    >
                      {doc.is_hidden ? "Restore" : "Hide"}
                    </button>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => {
                        setDeleteTarget(doc);
                        setDeleteConfirmText("");
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete warning */}
      {deleteTarget && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteTarget(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h2 className={styles.modalTitle}>
              Permanently delete this document?
            </h2>

            <p className={styles.modalLead}>
              You are about to permanently delete{" "}
              <strong>{deleteTarget.title}</strong>. This cannot be undone.
            </p>

            <ul className={styles.modalConsequences}>
              <li>
                The PDF file will be destroyed and cannot be recovered from this
                system.
              </li>
              <li>
                <strong>{deleteTarget.highlight_count} highlights</strong> and{" "}
                <strong>{deleteTarget.comment_count} comments</strong>,
                including every reply, will be destroyed with it.
              </li>
              {retentionActive(deleteTarget) && (
                <li className={styles.modalLegal}>
                  This document is inside its seven-year retention window (until{" "}
                  {formatDate(deleteTarget.retain_until)}). Board records and
                  the discussion attached to them may need to be retained for
                  legal, audit, or litigation-hold reasons. Deleting early could
                  destroy material you are obligated to keep.
                </li>
              )}
              <li>
                A record of this deletion — who deleted it and when — will be
                written to the audit log.
              </li>
            </ul>

            <p className={styles.modalHint}>
              If you only want it out of the way, use <strong>Hide</strong>{" "}
              instead. Hidden documents keep everything and can be restored with
              one click.
            </p>

            <label className={styles.label}>
              Type <strong>DELETE</strong> to confirm
              <input
                className={styles.input}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                autoFocus
              />
            </label>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setDeleteTarget(null)}
              >
                Keep Document
              </button>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => {
                  toggleHidden(deleteTarget);
                  setDeleteTarget(null);
                }}
              >
                Hide Instead
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={confirmDelete}
                disabled={deleteConfirmText !== "DELETE" || deleting}
              >
                {deleting ? "Deleting…" : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
