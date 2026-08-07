"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styles from "./page.module.css";

// Worker is served from /public so the PDF never touches a third-party CDN.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export const MAX_HIGHLIGHT_CHARS = 100;
export const MAX_COMMENT_CHARS = 500;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Highlight {
  id: string;
  document_id: string;
  page_number: number;
  highlighted_text: string;
  position: Rect[] | null;
  created_by_email: string;
  created_by_name: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  highlight_id: string;
  parent_comment_id: string | null;
  comment_text: string;
  author_email: string;
  author_name: string | null;
  created_at: string;
}

interface PendingSelection {
  pageNumber: number;
  text: string;
  rects: Rect[];
}

interface BookReaderProps {
  documentId: string;
  documentTitle: string;
  onClose: () => void;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const displayName = (name: string | null, email: string): string =>
  name || email.split("@")[0];

export default function BookReader({
  documentId,
  documentTitle,
  onClose,
}: BookReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [spreadStart, setSpreadStart] = useState<number>(1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(460);

  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [pending, setPending] = useState<PendingSelection | null>(null);
  const [pendingComment, setPendingComment] = useState("");
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(
    null
  );
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);

  const leftPageRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);

  const fileUrl = `/api/documents/${documentId}/file`;

  // --- load highlights + comments -----------------------------------------

  const loadAnnotations = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents/${documentId}/highlights`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setHighlights(data.highlights || []);
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to load annotations", error);
    }
  }, [documentId]);

  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  // Size pages to the available width so a two-page spread always fits
  useEffect(() => {
    const resize = () => {
      const available = Math.min(window.innerWidth - 420, 1080);
      setPageWidth(Math.max(260, Math.floor(available / 2) - 24));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // --- paging --------------------------------------------------------------

  const goNext = () => {
    if (spreadStart + 2 > numPages) return;
    setFlipping("next");
    window.setTimeout(() => {
      setSpreadStart((s) => Math.min(s + 2, Math.max(1, numPages - 1)));
      setFlipping(null);
    }, 380);
  };

  const goPrev = () => {
    if (spreadStart <= 1) return;
    setFlipping("prev");
    window.setTimeout(() => {
      setSpreadStart((s) => Math.max(1, s - 2));
      setFlipping(null);
    }, 380);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (pending) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreadStart, numPages, pending]);

  // --- text selection ------------------------------------------------------

  const handleMouseUp = () => {
    if (pending) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return;
    }

    const text = selection.toString().replace(/\s+/g, " ").trim();
    if (!text) return;

    // Which page of the spread does this selection live on?
    const range = selection.getRangeAt(0);
    const container =
      range.commonAncestorContainer.nodeType === 1
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement;

    let pageEl: HTMLDivElement | null = null;
    let pageNumber = spreadStart;

    if (leftPageRef.current?.contains(container as Node)) {
      pageEl = leftPageRef.current;
      pageNumber = spreadStart;
    } else if (rightPageRef.current?.contains(container as Node)) {
      pageEl = rightPageRef.current;
      pageNumber = spreadStart + 1;
    }

    if (!pageEl) return;

    if (text.length > MAX_HIGHLIGHT_CHARS) {
      setSelectionWarning(
        `That selection is ${text.length} characters. Highlights are limited to ${MAX_HIGHLIGHT_CHARS} — select a shorter phrase.`
      );
      selection.removeAllRanges();
      window.setTimeout(() => setSelectionWarning(null), 4200);
      return;
    }

    const pageRect = pageEl.getBoundingClientRect();
    const rects: Rect[] = Array.from(range.getClientRects())
      .filter((r) => r.width > 0 && r.height > 0)
      .map((r) => ({
        x: (r.left - pageRect.left) / pageRect.width,
        y: (r.top - pageRect.top) / pageRect.height,
        width: r.width / pageRect.width,
        height: r.height / pageRect.height,
      }));

    if (rects.length === 0) return;

    setPending({ pageNumber, text, rects });
    setPendingComment("");
    selection.removeAllRanges();
  };

  const cancelPending = () => {
    setPending(null);
    setPendingComment("");
  };

  const savePending = async () => {
    if (!pending || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/highlights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageNumber: pending.pageNumber,
          text: pending.text,
          position: pending.rects,
          comment: pendingComment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSelectionWarning(data.error || "Could not save that highlight");
        window.setTimeout(() => setSelectionWarning(null), 4200);
        return;
      }
      setHighlights((prev) => [...prev, data.highlight]);
      if (data.comment) setComments((prev) => [...prev, data.comment]);
      setActiveHighlightId(data.highlight.id);
      cancelPending();
    } catch (error) {
      console.error(error);
      setSelectionWarning("Could not save that highlight");
      window.setTimeout(() => setSelectionWarning(null), 4200);
    } finally {
      setSaving(false);
    }
  };

  // --- comments ------------------------------------------------------------

  const submitReply = async (highlightId: string, parentId: string | null) => {
    const text = replyText.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/highlights/${highlightId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, parentCommentId: parentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSelectionWarning(data.error || "Could not post that comment");
        window.setTimeout(() => setSelectionWarning(null), 4200);
        return;
      }
      setComments((prev) => [...prev, data.comment]);
      setReplyText("");
      setReplyTo(null);
    } catch (error) {
      console.error(error);
    }
  };

  // --- derived -------------------------------------------------------------

  const visiblePages = [spreadStart, spreadStart + 1];
  const spreadHighlights = highlights.filter((h) =>
    visiblePages.includes(h.page_number)
  );

  const rootComments = (highlightId: string) =>
    comments.filter(
      (c) => c.highlight_id === highlightId && !c.parent_comment_id
    );
  const replies = (commentId: string) =>
    comments.filter((c) => c.parent_comment_id === commentId);

  const renderHighlightOverlay = (pageNumber: number) =>
    highlights
      .filter((h) => h.page_number === pageNumber && h.position)
      .map((h) => (
        <React.Fragment key={h.id}>
          {(h.position || []).map((rect, i) => (
            <span
              key={`${h.id}-${i}`}
              className={`${styles.highlightRect} ${
                activeHighlightId === h.id ? styles.highlightActive : ""
              }`}
              style={{
                left: `${rect.x * 100}%`,
                top: `${rect.y * 100}%`,
                width: `${rect.width * 100}%`,
                height: `${rect.height * 100}%`,
              }}
              onClick={() => setActiveHighlightId(h.id)}
              role="button"
              tabIndex={-1}
              aria-label={`Highlight: ${h.highlighted_text}`}
            />
          ))}
        </React.Fragment>
      ));

  const pageSurface = (
    pageNumber: number,
    ref: React.RefObject<HTMLDivElement>,
    side: "left" | "right"
  ) => {
    if (pageNumber > numPages) {
      return (
        <div className={`${styles.pageSurface} ${styles.pageBlank}`}>
          <span>End of document</span>
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={`${styles.pageSurface} ${
          side === "left" ? styles.pageLeft : styles.pageRight
        }`}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Page
          pageNumber={pageNumber}
          width={pageWidth}
          renderTextLayer
          renderAnnotationLayer={false}
          loading={<div className={styles.pageLoading}>Rendering page…</div>}
        />
        <div className={styles.highlightLayer}>
          {renderHighlightOverlay(pageNumber)}
        </div>
        <span className={styles.pageNumber}>{pageNumber}</span>
      </div>
    );
  };

  return (
    <div className={styles.reader}>
      <div className={styles.readerBar}>
        <button type="button" className={styles.backBtn} onClick={onClose}>
          ← Library
        </button>
        <h2 className={styles.readerTitle}>{documentTitle}</h2>
        <span className={styles.readerMeta}>
          {numPages > 0
            ? `Pages ${spreadStart}–${Math.min(spreadStart + 1, numPages)} of ${numPages}`
            : "Loading…"}
        </span>
      </div>

      <p className={styles.readerNotice}>
        🔒 Board-confidential. This document is streamed to your browser for
        reading only — it is not downloadable and is never sent to any external
        or AI service. Highlights and comments are retained for 7 years.
      </p>

      {selectionWarning && (
        <div className={styles.warningToast}>{selectionWarning}</div>
      )}

      <div className={styles.readerBody}>
        <div className={styles.bookArea}>
          <button
            type="button"
            className={`${styles.flipBtn} ${styles.flipPrev}`}
            onClick={goPrev}
            disabled={spreadStart <= 1}
            aria-label="Previous pages"
          >
            ‹
          </button>

          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setLoadError(null);
            }}
            onLoadError={(err) => setLoadError(err.message)}
            loading={<div className={styles.docLoading}>Opening document…</div>}
            error={
              <div className={styles.docError}>
                This document could not be opened.
              </div>
            }
          >
            <div
              ref={spreadRef}
              className={`${styles.spread} ${
                flipping === "next"
                  ? styles.flipNext
                  : flipping === "prev"
                    ? styles.flipPrev2
                    : ""
              }`}
            >
              {pageSurface(spreadStart, leftPageRef, "left")}
              <div className={styles.spine} aria-hidden="true" />
              {pageSurface(spreadStart + 1, rightPageRef, "right")}
            </div>
          </Document>

          <button
            type="button"
            className={`${styles.flipBtn} ${styles.flipNext3}`}
            onClick={goNext}
            disabled={spreadStart + 2 > numPages}
            aria-label="Next pages"
          >
            ›
          </button>
        </div>

        {/* Annotations sidebar */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>
            Notes on these pages
            <span className={styles.sidebarCount}>
              {spreadHighlights.length}
            </span>
          </h3>

          {loadError && <p className={styles.sidebarEmpty}>{loadError}</p>}

          {spreadHighlights.length === 0 && !loadError && (
            <p className={styles.sidebarEmpty}>
              Select up to {MAX_HIGHLIGHT_CHARS} characters of text on either
              page to add the first note.
            </p>
          )}

          {spreadHighlights.map((h) => (
            <div
              key={h.id}
              className={`${styles.noteCard} ${
                activeHighlightId === h.id ? styles.noteCardActive : ""
              }`}
              onClick={() => setActiveHighlightId(h.id)}
            >
              <div className={styles.noteMeta}>
                <span className={styles.notePage}>p.{h.page_number}</span>
                <span className={styles.noteAuthor}>
                  {displayName(h.created_by_name, h.created_by_email)}
                </span>
                <span className={styles.noteDate}>
                  {formatDate(h.created_at)}
                </span>
              </div>

              <blockquote className={styles.noteQuote}>
                &ldquo;{h.highlighted_text}&rdquo;
              </blockquote>

              {rootComments(h.id).map((c) => (
                <div key={c.id} className={styles.comment}>
                  <div className={styles.commentHead}>
                    <strong>
                      {displayName(c.author_name, c.author_email)}
                    </strong>
                    <span>{formatDate(c.created_at)}</span>
                  </div>
                  <p className={styles.commentBody}>{c.comment_text}</p>

                  {replies(c.id).map((r) => (
                    <div key={r.id} className={styles.reply}>
                      <div className={styles.commentHead}>
                        <strong>
                          {displayName(r.author_name, r.author_email)}
                        </strong>
                        <span>{formatDate(r.created_at)}</span>
                      </div>
                      <p className={styles.commentBody}>{r.comment_text}</p>
                    </div>
                  ))}

                  {replyTo === c.id ? (
                    <div className={styles.replyBox}>
                      <textarea
                        className={styles.replyInput}
                        value={replyText}
                        maxLength={MAX_COMMENT_CHARS}
                        placeholder="Write a reply…"
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <div className={styles.replyActions}>
                        <span className={styles.charCount}>
                          {replyText.length}/{MAX_COMMENT_CHARS}
                        </span>
                        <button
                          type="button"
                          className={styles.ghostBtn}
                          onClick={() => {
                            setReplyTo(null);
                            setReplyText("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className={styles.smallBtn}
                          onClick={() => submitReply(h.id, c.id)}
                          disabled={!replyText.trim()}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.replyLink}
                      onClick={() => {
                        setReplyTo(c.id);
                        setReplyText("");
                      }}
                    >
                      Reply
                    </button>
                  )}
                </div>
              ))}

              {rootComments(h.id).length === 0 && (
                <>
                  {replyTo === `new-${h.id}` ? (
                    <div className={styles.replyBox}>
                      <textarea
                        className={styles.replyInput}
                        value={replyText}
                        maxLength={MAX_COMMENT_CHARS}
                        placeholder="Add a comment…"
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <div className={styles.replyActions}>
                        <span className={styles.charCount}>
                          {replyText.length}/{MAX_COMMENT_CHARS}
                        </span>
                        <button
                          type="button"
                          className={styles.ghostBtn}
                          onClick={() => {
                            setReplyTo(null);
                            setReplyText("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className={styles.smallBtn}
                          onClick={() => submitReply(h.id, null)}
                          disabled={!replyText.trim()}
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.replyLink}
                      onClick={() => {
                        setReplyTo(`new-${h.id}`);
                        setReplyText("");
                      }}
                    >
                      Add a comment
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </aside>
      </div>

      {/* New-highlight composer */}
      {pending && (
        <div className={styles.composerOverlay} onClick={cancelPending}>
          <div className={styles.composer} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.composerTitle}>Comment on this passage</h3>
            <p className={styles.composerMeta}>
              Page {pending.pageNumber} · {pending.text.length}/
              {MAX_HIGHLIGHT_CHARS} characters highlighted
            </p>
            <blockquote className={styles.composerQuote}>
              &ldquo;{pending.text}&rdquo;
            </blockquote>
            <textarea
              className={styles.composerInput}
              value={pendingComment}
              maxLength={MAX_COMMENT_CHARS}
              placeholder="What do you want to say about this passage? (optional)"
              onChange={(e) => setPendingComment(e.target.value)}
              autoFocus
            />
            <div className={styles.composerActions}>
              <span className={styles.charCount}>
                {pendingComment.length}/{MAX_COMMENT_CHARS}
              </span>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={cancelPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.smallBtn}
                onClick={savePending}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save highlight"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
