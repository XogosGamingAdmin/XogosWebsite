"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getProfile } from "@/lib/actions/getProfile";
import { updateRssTopic } from "@/lib/actions/updateRssTopic";
import { getChecklists } from "@/lib/actions/getChecklists";
import { Avatar } from "@/primitives/Avatar";
import { Button } from "@/primitives/Button";
import { ChecklistItem } from "@/types/dashboard";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [rssTopic, setRssTopic] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const [profileResult, checklistResult] = await Promise.all([
        getProfile(),
        getChecklists(),
      ]);

      if (profileResult.data) {
        setRssTopic(profileResult.data.rssTopic);
      }

      if (checklistResult.data) {
        setChecklist(checklistResult.data);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const result = await updateRssTopic({ rssTopic });

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Profile updated successfully!");
    }

    setSaving(false);
  };

  if (!session?.user?.info) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile Settings</h1>
      </div>

      <div className={styles.sections}>
        {/* Profile Info Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>
          <div className={styles.profileInfo}>
            <Avatar
              className={styles.avatar}
              name={session.user.info.name}
              size={80}
              src={session.user.info.avatar}
            />
            <div className={styles.details}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <div className={styles.value}>{session.user.info.name}</div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <div className={styles.value}>{session.user.info.id}</div>
              </div>
            </div>
          </div>
        </section>

        {/* RSS Topic Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>News Feed Settings</h2>
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="rssTopic" className={styles.label}>
                RSS Topic
              </label>
              <p className={styles.description}>
                Enter a topic to receive news articles on your dashboard
              </p>
              <input
                id="rssTopic"
                type="text"
                value={rssTopic}
                onChange={(e) => setRssTopic(e.target.value)}
                placeholder="e.g., blockchain, gaming, esports"
                className={styles.input}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
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
          </form>
        </section>

        {/* Checklist Section (Read-only) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Monthly Checklist</h2>
          {loading ? (
            <p className={styles.loading}>Loading...</p>
          ) : checklist.length > 0 ? (
            <div className={styles.checklistItems}>
              {checklist.map((item) => (
                <div key={item.id} className={styles.checklistItem}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className={styles.checkbox}
                  />
                  <span
                    className={styles.taskText}
                    data-completed={item.completed || undefined}
                  >
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>
              No checklist items. Your administrator will add tasks for you.
            </p>
          )}
          <p className={styles.note}>
            Checklist items can be checked off from the dashboard. Managed by
            administrators.
          </p>
        </section>
      </div>
    </div>
  );
}
