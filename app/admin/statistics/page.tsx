"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TrendsDisplay } from "@/components/TrendsDisplay";
import {
  ADMIN_CHECKLISTS_URL,
  ADMIN_FINANCIALS_URL,
  ADMIN_GROUPS_URL,
  DASHBOARD_HOME_URL,
} from "@/constants";
import { getStatistics } from "@/lib/actions/getStatistics";
import { updateStatistics } from "@/lib/actions/updateStatistics";
import { Button } from "@/primitives/Button";
import styles from "./page.module.css";

export default function StatisticsPage() {
  const [accounts, setAccounts] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadStatistics() {
      const result = await getStatistics();
      if (result.data) {
        setAccounts(result.data.accounts);
        setActiveUsers(result.data.activeUsers);
        setTotalHours(result.data.totalHours);
      }
      setLoading(false);
    }
    loadStatistics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const result = await updateStatistics({
      accounts,
      activeUsers,
      totalHours,
    });

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Statistics updated successfully!");
    }

    setSaving(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href={DASHBOARD_HOME_URL} className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>Admin: Xogos Statistics</h1>
        </div>
        <div className={styles.tabs}>
          <Link href={ADMIN_FINANCIALS_URL} className={styles.tab}>
            Financials
          </Link>
          <Link href={ADMIN_CHECKLISTS_URL} className={styles.tab}>
            Checklists
          </Link>
          <Link href={ADMIN_GROUPS_URL} className={styles.tab}>
            Groups
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="accounts" className={styles.label}>
                Accounts
              </label>
              <input
                id="accounts"
                type="number"
                value={accounts}
                onChange={(e) => setAccounts(Number(e.target.value))}
                className={styles.input}
                min="0"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="activeUsers" className={styles.label}>
                Active Users
              </label>
              <input
                id="activeUsers"
                type="number"
                value={activeUsers}
                onChange={(e) => setActiveUsers(Number(e.target.value))}
                className={styles.input}
                min="0"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="totalHours" className={styles.label}>
                Total Hours
              </label>
              <input
                id="totalHours"
                type="number"
                value={totalHours}
                onChange={(e) => setTotalHours(Number(e.target.value))}
                className={styles.input}
                min="0"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Statistics"}
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

            <p className={styles.note}>
              ✅ Changes are saved to AWS RDS PostgreSQL database with
              timestamp. Each update creates a new historical record for
              trending/analytics.
            </p>
          </form>
        )}

        {/* Historical Data Display */}
        <div className={styles.trendsSection}>
          <TrendsDisplay type="statistics" limit={10} />
        </div>
      </div>
    </div>
  );
}
