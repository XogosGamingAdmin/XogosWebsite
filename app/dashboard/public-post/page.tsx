"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { isBoardMember, getBoardMemberByEmail } from "@/lib/auth/admin";
import styles from "./page.module.css";

interface Initiative {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  createdAt: string;
}

export default function PublicPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  const memberInfo = getBoardMemberByEmail(session?.user?.email);

  // Fetch existing initiatives for this user
  useEffect(() => {
    async function fetchInitiatives() {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("/api/initiatives/my");
        if (res.ok) {
          const data = await res.json();
          setInitiatives(data.initiatives || []);
        }
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchInitiatives();
    }
  }, [session, status]);

  // Redirect if not authenticated or not a board member
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated" && !isBoardMember(session?.user?.email)) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setObjectives("");
    setEditingId(null);
  };

  const handleEdit = (initiative: Initiative) => {
    setTitle(initiative.title);
    setDescription(initiative.description);
    setObjectives(initiative.objectives.join("\n"));
    setEditingId(initiative.id);
    setMessage(null);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this initiative? This action cannot be undone.")) {
      return;
    }

    setDeleting(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/initiatives/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Initiative deleted successfully" });
        setInitiatives((prev) => prev.filter((init) => init.id !== id));
        // If we were editing this initiative, reset the form
        if (editingId === id) {
          resetForm();
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete initiative" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Parse objectives (one per line)
    const objectivesList = objectives
      .split("\n")
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    if (objectivesList.length === 0) {
      setMessage({ type: "error", text: "Please add at least one objective" });
      setSaving(false);
      return;
    }

    try {
      const url = editingId ? `/api/initiatives/${editingId}` : "/api/initiatives";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          objectives: objectivesList,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: editingId
            ? "Initiative updated successfully!"
            : "Initiative published successfully! It will appear on the Board Initiatives page.",
        });
        // Reset form
        resetForm();
        // Refresh initiatives list
        const refreshRes = await fetch("/api/initiatives/my");
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setInitiatives(refreshData.initiatives || []);
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || `Failed to ${editingId ? "update" : "publish"} initiative`,
        });
      }
    } catch {
      setMessage({ type: "error", text: `An error occurred while ${editingId ? "updating" : "publishing"}` });
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

  if (!session || !isBoardMember(session?.user?.email)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Public Post - Board Initiatives</h1>
        <Link href="/dashboard" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </header>

      {memberInfo && (
        <div className={styles.memberInfo}>
          <img
            src={memberInfo.imagePath}
            alt={memberInfo.name}
            className={styles.memberAvatar}
          />
          <div>
            <h2 className={styles.memberName}>{memberInfo.name}</h2>
            <p className={styles.memberTitle}>
              {memberInfo.title} - {memberInfo.role}
            </p>
          </div>
        </div>
      )}

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
      )}

      <div className={styles.content}>
        {/* Create/Edit Initiative Form */}
        <section className={styles.formSection}>
          <h2>{editingId ? "Edit Initiative" : "Create New Initiative"}</h2>
          <p className={styles.formDescription}>
            Your initiative will be published on the{" "}
            <Link href="/board/initiatives" target="_blank">
              Board Initiatives
            </Link>{" "}
            page under your name.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Initiative Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter initiative title"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                placeholder="Describe your initiative and its purpose..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="objectives">Objectives * (one per line)</label>
              <textarea
                id="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                rows={5}
                required
                placeholder="Objective 1&#10;Objective 2&#10;Objective 3"
              />
            </div>

            <div className={styles.formButtons}>
              <button type="submit" disabled={saving} className={styles.submitButton}>
                {saving
                  ? editingId
                    ? "Updating..."
                    : "Publishing..."
                  : editingId
                    ? "Update Initiative"
                    : "Publish Initiative"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={styles.cancelButton}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Existing Initiatives */}
        <section className={styles.initiativesSection}>
          <h2>Your Published Initiatives ({initiatives.length})</h2>
          <div className={styles.initiativesList}>
            {initiatives.length === 0 ? (
              <p className={styles.noInitiatives}>
                You haven&apos;t published any initiatives yet.
              </p>
            ) : (
              initiatives.map((init) => (
                <div
                  key={init.id}
                  className={`${styles.initiativeItem} ${editingId === init.id ? styles.editing : ""}`}
                >
                  <h3>{init.title}</h3>
                  <p className={styles.initiativeDescription}>{init.description}</p>
                  <div className={styles.initiativeMeta}>
                    <span>{new Date(init.createdAt).toLocaleDateString()}</span>
                    <span>{init.objectives.length} objectives</span>
                  </div>
                  <div className={styles.initiativeActions}>
                    <button
                      onClick={() => handleEdit(init)}
                      className={styles.editButton}
                      disabled={deleting === init.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(init.id)}
                      className={styles.deleteButton}
                      disabled={deleting === init.id}
                    >
                      {deleting === init.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
