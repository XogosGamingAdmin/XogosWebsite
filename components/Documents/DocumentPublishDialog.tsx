"use client";

import { ComponentProps, useState } from "react";
import { Button } from "@/primitives/Button";
import { Dialog } from "@/primitives/Dialog";
import { Input } from "@/primitives/Input";
import { Select } from "@/primitives/Select";
import {
  DOCUMENT_CATEGORIES,
  PublishedDocumentCategory,
} from "@/types/published-document";
import styles from "./DocumentPublishDialog.module.css";

interface Props
  extends Omit<ComponentProps<typeof Dialog>, "content" | "title"> {
  documentId: string;
  documentName: string;
  onPublishDocument: (data: {
    category: PublishedDocumentCategory;
    description: string;
  }) => Promise<void>;
}

export function DocumentPublishDialog({
  documentId,
  documentName,
  onOpenChange = () => {},
  onPublishDocument,
  children,
  ...props
}: Props) {
  const [category, setCategory] = useState<PublishedDocumentCategory>("technical");
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublishDocument() {
    if (!documentId || !description.trim()) {
      setError("Please provide a description for the document.");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      await onPublishDocument({
        category,
        description: description.trim(),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish document");
    } finally {
      setIsPublishing(false);
    }
  }

  const categoryItems = DOCUMENT_CATEGORIES.map((cat) => ({
    value: cat.id,
    title: cat.name,
  }));

  return (
    <Dialog
      content={
        <div className={styles.dialog}>
          <p className={styles.description}>
            Publish &quot;{documentName}&quot; to the public documentation pages.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <Select
              items={categoryItems}
              value={category}
              onChange={(value) => setCategory(value as PublishedDocumentCategory)}
              placeholder="Select a category"
              aboveOverlay
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for SEO and the document card..."
              rows={4}
            />
            <p className={styles.hint}>
              This description will be used for SEO metadata and displayed on the document card.
            </p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <Button onClick={() => onOpenChange(false)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={handlePublishDocument}
              variant="primary"
              disabled={isPublishing || !description.trim()}
            >
              {isPublishing ? "Publishing..." : "Publish to Public"}
            </Button>
          </div>
        </div>
      }
      onOpenChange={onOpenChange}
      title="Publish Document"
      {...props}
    >
      {children}
    </Dialog>
  );
}
