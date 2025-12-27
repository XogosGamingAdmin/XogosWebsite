"use client";

import { useEffect, useState } from "react";
import { getChecklists } from "@/lib/actions/getChecklists";
import { updateChecklistItem } from "@/lib/actions/updateChecklistItem";
import { ChecklistItem } from "@/types/dashboard";
import styles from "./MonthlyMeetingChecklistCard.module.css";

export function MonthlyMeetingChecklistCard() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChecklist() {
      const result = await getChecklists();
      if (result.data) {
        setChecklist(result.data);
      }
      setLoading(false);
    }
    loadChecklist();
  }, []);

  const handleToggle = async (itemId: string, completed: boolean) => {
    // Optimistic update
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, completed } : item))
    );

    const result = await updateChecklistItem({ itemId, completed });
    if (result.error) {
      // Revert on error
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, completed: !completed } : item
        )
      );
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Monthly Meeting Checklist</h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : checklist.length > 0 ? (
          <div className={styles.checklistItems}>
            {checklist.map((item) => (
              <label key={item.id} className={styles.checklistItem}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => handleToggle(item.id, e.target.checked)}
                  className={styles.checkbox}
                />
                <span
                  className={styles.taskText}
                  data-completed={item.completed || undefined}
                >
                  {item.task}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            No checklist items yet. Your administrator will add tasks for you.
          </p>
        )}
      </div>
    </div>
  );
}
