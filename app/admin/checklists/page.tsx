"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ADMIN_FINANCIALS_URL,
  ADMIN_STATISTICS_URL,
  DASHBOARD_HOME_URL,
} from "@/constants";
import { users } from "@/data/users";
import { createChecklistItem } from "@/lib/actions/createChecklistItem";
import { deleteChecklistItem } from "@/lib/actions/deleteChecklistItem";
import { getAllChecklists } from "@/lib/actions/getAllChecklists";
import { Button } from "@/primitives/Button";
import { ChecklistItem } from "@/types/dashboard";
import styles from "./page.module.css";

export default function ChecklistsPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadChecklists() {
      try {
        const result = await getAllChecklists();
        if (result.error) {
          console.error("Error loading checklists:", result.error.message);
        } else if (result.data) {
          setItems(result.data);
        }
      } catch (error) {
        console.error("Error loading checklists:", error);
      }
    }

    loadChecklists();
    if (users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !selectedUserId) return;

    setLoading(true);
    setMessage("");

    const result = await createChecklistItem({
      userId: selectedUserId,
      task: newTask,
    });

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else if (result.data) {
      setItems([...items, result.data]);
      setNewTask("");
      setMessage("Checklist item created successfully!");
    }

    setLoading(false);
  };

  const handleDelete = async (itemId: string) => {
    setMessage("");

    const result = await deleteChecklistItem({ itemId });

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setItems(items.filter((item) => item.id !== itemId));
      setMessage("Checklist item deleted successfully!");
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : userId;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href={DASHBOARD_HOME_URL} className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>Admin: Manage Checklists</h1>
        </div>
        <div className={styles.tabs}>
          <Link href={ADMIN_STATISTICS_URL} className={styles.tab}>
            Statistics
          </Link>
          <Link href={ADMIN_FINANCIALS_URL} className={styles.tab}>
            Financials
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Create Checklist Item</h2>
          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="userId" className={styles.label}>
                Board Member
              </label>
              <select
                id="userId"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className={styles.select}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="task" className={styles.label}>
                Task
              </label>
              <input
                id="task"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task description"
                className={styles.input}
              />
            </div>

            <Button type="submit" disabled={loading || !newTask.trim()}>
              {loading ? "Creating..." : "Create Item"}
            </Button>
          </form>
        </section>

        {message && (
          <p
            className={
              message.startsWith("Error")
                ? styles.errorMessage
                : styles.successMessage
            }
          >
            {message}
          </p>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>All Checklist Items</h2>
          {items.length > 0 ? (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemUser}>
                      {getUserName(item.userId)}
                    </div>
                    <div className={styles.itemTask}>{item.task}</div>
                    <div className={styles.itemMeta}>
                      {item.completed ? "✓ Completed" : "○ Pending"}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>
              No checklist items yet. Create one above.
            </p>
          )}
        </section>

        <p className={styles.note}>
          NOTE: Deletions update the in-memory data. For persistent storage,
          you'll need to manually update /data/checklists.ts or implement a
          database.
        </p>
      </div>
    </div>
  );
}
