"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getMembershipMetrics,
  MembershipMetrics,
} from "@/lib/actions/getMembershipMetrics";
import {
  addManualMember,
  addManualRevenue,
  getRecentManualEntries,
  deleteManualEntry,
} from "@/lib/actions/manualEntries";
import styles from "./page.module.css";

const MANUAL_ENTRY_ADMIN = "zack@xogosgaming.com";

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricContent}>
        <span className={styles.metricTitle}>{title}</span>
        <span className={styles.metricValue}>{value}</span>
        {subtitle && (
          <span
            className={`${styles.metricSubtitle} ${trend ? styles[trend] : ""}`}
          >
            {trend === "up" && "↑ "}
            {trend === "down" && "↓ "}
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

function RevenueChart({
  data,
}: {
  data: Array<{ month: string; total: number }>;
}) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartPlaceholder}>
        <p>No revenue data available yet</p>
        <small>Data will appear after payments are processed</small>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.total)) || 1;

  return (
    <div className={styles.chart}>
      <div className={styles.chartBars}>
        {data.map((item, index) => {
          const height = (item.total / maxValue) * 100;
          const monthName = new Date(item.month).toLocaleDateString("en-US", {
            month: "short",
          });
          return (
            <div key={index} className={styles.chartBar}>
              <div
                className={styles.bar}
                style={{ height: `${Math.max(height, 5)}%` }}
              >
                <span className={styles.barValue}>
                  ${item.total.toLocaleString()}
                </span>
              </div>
              <span className={styles.barLabel}>{monthName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ManualEntry {
  id: string;
  type: string;
  value: number;
  description: string;
  date: string;
  entry_type: "member" | "revenue";
  created_at: string;
}

export default function FinanceDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<MembershipMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentEntries, setRecentEntries] = useState<ManualEntry[]>([]);

  // Manual entry form states
  const [memberType, setMemberType] = useState<"monthly" | "yearly" | "lifetime">("monthly");
  const [memberCount, setMemberCount] = useState(1);
  const [memberNotes, setMemberNotes] = useState("");
  const [memberDate, setMemberDate] = useState(new Date().toISOString().split("T")[0]);

  const [revenueAmount, setRevenueAmount] = useState(0);
  const [revenueDescription, setRevenueDescription] = useState("");
  const [revenueDate, setRevenueDate] = useState(new Date().toISOString().split("T")[0]);

  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isAdmin = session?.user?.email?.toLowerCase() === MANUAL_ENTRY_ADMIN.toLowerCase();

  async function fetchData() {
    try {
      const data = await getMembershipMetrics();
      if (data === null) {
        setError("access_denied");
      } else {
        setMetrics(data);
      }

      if (isAdmin) {
        const entries = await getRecentManualEntries();
        if (entries) {
          setRecentEntries(entries as ManualEntry[]);
        }
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError("fetch_error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    } else if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/finance");
    }
  }, [status, router, isAdmin]);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormMessage(null);

    const result = await addManualMember(memberType, memberCount, memberNotes, memberDate);

    if (result.success) {
      setFormMessage({ type: "success", text: "Member entry added successfully!" });
      setMemberCount(1);
      setMemberNotes("");
      fetchData(); // Refresh data
    } else {
      setFormMessage({ type: "error", text: result.error || "Failed to add entry" });
    }

    setSubmitting(false);
  }

  async function handleAddRevenue(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormMessage(null);

    const result = await addManualRevenue(revenueAmount, revenueDescription, revenueDate);

    if (result.success) {
      setFormMessage({ type: "success", text: "Revenue entry added successfully!" });
      setRevenueAmount(0);
      setRevenueDescription("");
      fetchData(); // Refresh data
    } else {
      setFormMessage({ type: "error", text: result.error || "Failed to add entry" });
    }

    setSubmitting(false);
  }

  async function handleDeleteEntry(id: string, entryType: "member" | "revenue") {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    const result = await deleteManualEntry(id, entryType);
    if (result.success) {
      fetchData(); // Refresh data
    }
  }

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Access denied - redirect to board
  if (error === "access_denied") {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <div className={styles.accessDeniedIcon}>🔒</div>
          <h1>Access Restricted</h1>
          <p>
            The Financial Dashboard is only accessible to members of the Audit
            Committee.
          </p>
          <p className={styles.accessDeniedSubtext}>
            Signed in as: {session?.user?.email}
          </p>
          <div className={styles.accessDeniedActions}>
            <Link href="/dashboard" className={styles.primaryButton}>
              Go to Board Dashboard
            </Link>
            <Link href="/" className={styles.secondaryButton}>
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error === "fetch_error") {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Dashboard</h2>
          <p>Unable to fetch financial data. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.primaryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <h1>Financial Dashboard</h1>
            <span className={styles.badge}>Audit Committee</span>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.userEmail}>{session?.user?.email}</span>
            <Link href="/dashboard" className={styles.backLink}>
              ← Board Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Overview Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Membership Overview</h2>
          <div className={styles.metricsGrid}>
            <MetricCard
              icon="👥"
              title="Total Members"
              value={metrics?.totalMembers || 0}
              subtitle="Active subscriptions"
            />
            <MetricCard
              icon="📈"
              title="New This Month"
              value={metrics?.newMembersThisMonth || 0}
              trend={metrics?.newMembersThisMonth ? "up" : "neutral"}
              subtitle="new subscribers"
            />
            <MetricCard
              icon="📉"
              title="Lost This Month"
              value={metrics?.membersLostThisMonth || 0}
              trend={metrics?.membersLostThisMonth ? "down" : "neutral"}
              subtitle="cancellations"
            />
            <MetricCard
              icon="🔄"
              title="Churn Rate"
              value={`${metrics?.churnRate || 0}%`}
              trend={
                metrics?.churnRate && metrics.churnRate > 5 ? "down" : "neutral"
              }
              subtitle="this month"
            />
          </div>
        </section>

        {/* Membership Types Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Members by Type</h2>
          <div className={styles.memberTypeGrid}>
            <div className={styles.memberTypeCard}>
              <div className={styles.memberTypeIcon}>📅</div>
              <div className={styles.memberTypeInfo}>
                <span className={styles.memberTypeLabel}>Monthly</span>
                <span className={styles.memberTypeCount}>
                  {metrics?.membersByType?.monthly || 0}
                </span>
                {isAdmin && (
                  <span className={styles.memberTypeBreakdown}>
                    Stripe: {metrics?.stripeMembers?.monthly || 0} | Manual: {metrics?.manualMembers?.monthly || 0}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.memberTypeCard}>
              <div className={styles.memberTypeIcon}>📆</div>
              <div className={styles.memberTypeInfo}>
                <span className={styles.memberTypeLabel}>Yearly</span>
                <span className={styles.memberTypeCount}>
                  {metrics?.membersByType?.yearly || 0}
                </span>
                {isAdmin && (
                  <span className={styles.memberTypeBreakdown}>
                    Stripe: {metrics?.stripeMembers?.yearly || 0} | Manual: {metrics?.manualMembers?.yearly || 0}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.memberTypeCard}>
              <div className={styles.memberTypeIcon}>♾️</div>
              <div className={styles.memberTypeInfo}>
                <span className={styles.memberTypeLabel}>Lifetime</span>
                <span className={styles.memberTypeCount}>
                  {metrics?.membersByType?.lifetime || 0}
                </span>
                {isAdmin && (
                  <span className={styles.memberTypeBreakdown}>
                    Stripe: {metrics?.stripeMembers?.lifetime || 0} | Manual: {metrics?.manualMembers?.lifetime || 0}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Revenue</h2>
          <div className={styles.revenueSection}>
            <div className={styles.revenueCard}>
              <div className={styles.revenueHeader}>
                <span className={styles.revenueIcon}>💰</span>
                <span className={styles.revenueLabel}>This Month</span>
              </div>
              <span className={styles.revenueValue}>
                $
                {metrics?.revenueThisMonth?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "0.00"}
              </span>
              <span className={styles.revenueCurrency}>
                {(metrics?.currency || "usd").toUpperCase()}
              </span>
              {isAdmin && (
                <div className={styles.revenueBreakdown}>
                  <span>Stripe: ${metrics?.stripeRevenue?.toFixed(2) || "0.00"}</span>
                  <span>Manual: ${metrics?.manualRevenue?.toFixed(2) || "0.00"}</span>
                </div>
              )}
            </div>
            <div className={styles.revenueChartContainer}>
              <h3 className={styles.chartTitle}>Revenue Trend (6 Months)</h3>
              <RevenueChart data={metrics?.revenueTrend || []} />
            </div>
          </div>
        </section>

        {/* Manual Entry Section - Only for Zack */}
        {isAdmin && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>📝 Manual Entry</h2>

            {formMessage && (
              <div className={`${styles.formMessage} ${styles[formMessage.type]}`}>
                {formMessage.text}
              </div>
            )}

            <div className={styles.manualEntryGrid}>
              {/* Add Member Form */}
              <div className={styles.manualEntryCard}>
                <h3>Add Members</h3>
                <form onSubmit={handleAddMember}>
                  <div className={styles.formGroup}>
                    <label>Member Type</label>
                    <select
                      value={memberType}
                      onChange={(e) => setMemberType(e.target.value as "monthly" | "yearly" | "lifetime")}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Count</label>
                    <input
                      type="number"
                      min="1"
                      value={memberCount}
                      onChange={(e) => setMemberCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Date</label>
                    <input
                      type="date"
                      value={memberDate}
                      onChange={(e) => setMemberDate(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Notes (optional)</label>
                    <input
                      type="text"
                      value={memberNotes}
                      onChange={(e) => setMemberNotes(e.target.value)}
                      placeholder="e.g., School batch signup"
                    />
                  </div>
                  <button type="submit" disabled={submitting} className={styles.submitButton}>
                    {submitting ? "Adding..." : "Add Members"}
                  </button>
                </form>
              </div>

              {/* Add Revenue Form */}
              <div className={styles.manualEntryCard}>
                <h3>Add Revenue</h3>
                <form onSubmit={handleAddRevenue}>
                  <div className={styles.formGroup}>
                    <label>Amount ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={revenueAmount}
                      onChange={(e) => setRevenueAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Date</label>
                    <input
                      type="date"
                      value={revenueDate}
                      onChange={(e) => setRevenueDate(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <input
                      type="text"
                      value={revenueDescription}
                      onChange={(e) => setRevenueDescription(e.target.value)}
                      placeholder="e.g., Grant funding, Donation"
                    />
                  </div>
                  <button type="submit" disabled={submitting} className={styles.submitButton}>
                    {submitting ? "Adding..." : "Add Revenue"}
                  </button>
                </form>
              </div>
            </div>

            {/* Recent Manual Entries */}
            {recentEntries.length > 0 && (
              <div className={styles.recentEntriesSection}>
                <h3>Recent Manual Entries</h3>
                <div className={styles.entriesTable}>
                  <div className={styles.entriesHeader}>
                    <span>Type</span>
                    <span>Value</span>
                    <span>Description</span>
                    <span>Date</span>
                    <span>Action</span>
                  </div>
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className={styles.entryRow}>
                      <span className={styles.entryType}>
                        {entry.entry_type === "member" ? `👥 ${entry.type}` : "💰 Revenue"}
                      </span>
                      <span>
                        {entry.entry_type === "member"
                          ? `${entry.value} members`
                          : `$${Number(entry.value).toFixed(2)}`}
                      </span>
                      <span>{entry.description || "-"}</span>
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleDeleteEntry(entry.id, entry.entry_type)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Data Source Info */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>📊 Data Source</h3>
            <p>
              This dashboard combines data from Stripe (automatic) and manual entries.
              All membership and payment information is synced automatically via webhooks.
            </p>
            <p className={styles.infoNote}>
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Xogos Gaming Financial Dashboard • Audit Committee Access Only</p>
      </footer>
    </div>
  );
}
