"use client";

import { useState } from "react";
import { addRssSubscription } from "@/lib/actions/addRssSubscription";
import styles from "./AddRSSFeedCard.module.css";

interface Props {
  onAdd?: () => void;
}

export function AddRSSFeedCard({ onAdd }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [topic, setTopic] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Topic is required");
      return;
    }

    setSaving(true);
    setError("");

    const result = await addRssSubscription({
      topic: topic.trim(),
      displayName: displayName.trim() || topic.trim(),
    });

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setTopic("");
      setDisplayName("");
      setIsAdding(false);
      if (onAdd) onAdd();
    }
  }

  function handleCancel() {
    setIsAdding(false);
    setTopic("");
    setDisplayName("");
    setError("");
  }

  if (!isAdding) {
    return (
      <div className={styles.addCard}>
        <button
          onClick={() => setIsAdding(true)}
          className={styles.addButton}
          aria-label="Add new RSS feed"
        >
          <span className={styles.plusIcon}>+</span>
          <span>Add RSS Feed</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.addCard}>
      <form onSubmit={handleSubmit} className={styles.addForm}>
        <h3 className={styles.formTitle}>Add News Feed</h3>

        <div className={styles.field}>
          <label htmlFor="topic" className={styles.label}>
            Topic *
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={styles.input}
            placeholder="e.g., blockchain technology"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="displayName" className={styles.label}>
            Display Name (optional)
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={styles.input}
            placeholder="e.g., Blockchain News"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button type="submit" disabled={saving} className={styles.saveButton}>
            {saving ? "Adding..." : "Add Feed"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
