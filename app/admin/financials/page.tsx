"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TrendsDisplay } from "@/components/TrendsDisplay";
import {
  ADMIN_CHECKLISTS_URL,
  ADMIN_GROUPS_URL,
  ADMIN_STATISTICS_URL,
  DASHBOARD_HOME_URL,
} from "@/constants";
import { getFinancials } from "@/lib/actions/getFinancials";
import { updateFinancials } from "@/lib/actions/updateFinancials";
import { Button } from "@/primitives/Button";
import styles from "../statistics/page.module.css";

export default function FinancialsPage() {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState(0);
  const [yearlyPayments, setYearlyPayments] = useState(0);
  const [lifetimeMembers, setLifetimeMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadFinancials() {
      const result = await getFinancials();
      if (result.data) {
        setRevenue(result.data.revenue);
        setExpenses(result.data.expenses);
        setMonthlyPayments(result.data.monthlyPayments);
        setYearlyPayments(result.data.yearlyPayments);
        setLifetimeMembers(result.data.lifetimeMembers);
      }
      setLoading(false);
    }
    loadFinancials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const result = await updateFinancials({
      revenue,
      expenses,
      monthlyPayments,
      yearlyPayments,
      lifetimeMembers,
    });

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Financials updated successfully!");
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
          <h1 className={styles.title}>Admin: Xogos Financials</h1>
        </div>
        <div className={styles.tabs}>
          <Link href={ADMIN_STATISTICS_URL} className={styles.tab}>
            Statistics
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
              <label htmlFor="revenue" className={styles.label}>
                Revenue ($)
              </label>
              <input
                id="revenue"
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className={styles.input}
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="expenses" className={styles.label}>
                Expenses ($)
              </label>
              <input
                id="expenses"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className={styles.input}
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="monthlyPayments" className={styles.label}>
                Monthly Payments ($)
              </label>
              <input
                id="monthlyPayments"
                type="number"
                value={monthlyPayments}
                onChange={(e) => setMonthlyPayments(Number(e.target.value))}
                className={styles.input}
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="yearlyPayments" className={styles.label}>
                Yearly Payments ($)
              </label>
              <input
                id="yearlyPayments"
                type="number"
                value={yearlyPayments}
                onChange={(e) => setYearlyPayments(Number(e.target.value))}
                className={styles.input}
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="lifetimeMembers" className={styles.label}>
                Lifetime Members
              </label>
              <input
                id="lifetimeMembers"
                type="number"
                value={lifetimeMembers}
                onChange={(e) => setLifetimeMembers(Number(e.target.value))}
                className={styles.input}
                min="0"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Financials"}
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
          <TrendsDisplay type="financials" limit={10} />
        </div>
      </div>
    </div>
  );
}
