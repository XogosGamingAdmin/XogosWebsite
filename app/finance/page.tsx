"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getMembershipMetrics,
  MembershipMetrics,
} from "@/lib/actions/getMembershipMetrics";
import styles from "./page.module.css";

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
        <small>Data will appear after Stripe processes payments</small>
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

export default function FinanceDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<MembershipMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMembershipMetrics();
        if (data === null) {
          // User doesn't have access, redirect to board
          setError("access_denied");
        } else {
          setMetrics(data);
        }
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError("fetch_error");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchData();
    } else if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/finance");
    }
  }, [status, router]);

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
              </div>
            </div>
            <div className={styles.memberTypeCard}>
              <div className={styles.memberTypeIcon}>📆</div>
              <div className={styles.memberTypeInfo}>
                <span className={styles.memberTypeLabel}>Yearly</span>
                <span className={styles.memberTypeCount}>
                  {metrics?.membersByType?.yearly || 0}
                </span>
              </div>
            </div>
            <div className={styles.memberTypeCard}>
              <div className={styles.memberTypeIcon}>♾️</div>
              <div className={styles.memberTypeInfo}>
                <span className={styles.memberTypeLabel}>Lifetime</span>
                <span className={styles.memberTypeCount}>
                  {metrics?.membersByType?.lifetime || 0}
                </span>
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
            </div>
            <div className={styles.revenueChartContainer}>
              <h3 className={styles.chartTitle}>Revenue Trend (6 Months)</h3>
              <RevenueChart data={metrics?.revenueTrend || []} />
            </div>
          </div>
        </section>

        {/* Data Source Info */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>📊 Data Source</h3>
            <p>
              This dashboard displays real-time data from Stripe. All membership
              and payment information is synced automatically via webhooks.
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
