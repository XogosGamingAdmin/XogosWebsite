"use client";

import { useEffect, useState } from "react";
import {
  getErrorLogs,
  getErrorStats,
  clearOldErrorLogs,
} from "@/lib/actions/getErrorLogs";
import styles from "./ErrorLoggingCard.module.css";

interface ErrorLog {
  id: string;
  errorType: string;
  errorMessage: string;
  errorStack: string | null;
  userId: string | null;
  url: string | null;
  userAgent: string | null;
  metadata: object | null;
  createdAt: string;
}

interface ErrorStats {
  errorType: string;
  count: number;
  lastOccurrence: string;
}

export function ErrorLoggingCard() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [stats, setStats] = useState<ErrorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState<"stats" | "logs">("stats");
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    const [statsResult, logsResult] = await Promise.all([
      getErrorStats(7),
      getErrorLogs(20),
    ]);

    if (statsResult.error) {
      setError(statsResult.error.message);
    } else if (statsResult.data) {
      setStats(statsResult.data);
    }

    if (logsResult.data) {
      setLogs(logsResult.data);
    }

    setLoading(false);
  }

  async function handleClearOldLogs() {
    if (
      !confirm("Are you sure you want to clear error logs older than 30 days?")
    ) {
      return;
    }

    setClearing(true);
    const result = await clearOldErrorLogs(30);

    if (result.error) {
      alert(result.error.message);
    } else if (result.data) {
      alert(`Cleared ${result.data.deletedCount} old error logs.`);
      loadData();
    }

    setClearing(false);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getErrorTypeColor(type: string) {
    switch (type) {
      case "api_error":
        return styles.errorTypeApi;
      case "auth_error":
        return styles.errorTypeAuth;
      case "database_error":
        return styles.errorTypeDatabase;
      case "client_error":
        return styles.errorTypeClient;
      default:
        return styles.errorTypeDefault;
    }
  }

  const totalErrors = stats.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Error Monitoring</h2>
        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${view === "stats" ? styles.active : ""}`}
              onClick={() => setView("stats")}
            >
              Stats
            </button>
            <button
              className={`${styles.toggleBtn} ${view === "logs" ? styles.active : ""}`}
              onClick={() => setView("logs")}
            >
              Logs
            </button>
          </div>
          <button
            className={styles.refreshBtn}
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading error data...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : view === "stats" ? (
          <div className={styles.statsView}>
            <div className={styles.summaryRow}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Last 7 Days</span>
                <span className={styles.summaryValue}>{totalErrors}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Error Types</span>
                <span className={styles.summaryValue}>{stats.length}</span>
              </div>
            </div>

            {stats.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.successIcon}>✓</span>
                <p>No errors in the last 7 days!</p>
              </div>
            ) : (
              <div className={styles.statsList}>
                {stats.map((stat) => (
                  <div key={stat.errorType} className={styles.statItem}>
                    <div className={styles.statInfo}>
                      <span
                        className={`${styles.errorType} ${getErrorTypeColor(stat.errorType)}`}
                      >
                        {stat.errorType.replace(/_/g, " ")}
                      </span>
                      <span className={styles.lastOccurrence}>
                        Last: {formatDate(stat.lastOccurrence)}
                      </span>
                    </div>
                    <span className={styles.errorCount}>{stat.count}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <button
                className={styles.clearBtn}
                onClick={handleClearOldLogs}
                disabled={clearing}
              >
                {clearing ? "Clearing..." : "Clear Old Logs (30+ days)"}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.logsView}>
            {logs.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.successIcon}>✓</span>
                <p>No recent error logs</p>
              </div>
            ) : (
              <div className={styles.logsList}>
                {logs.map((log) => (
                  <div key={log.id} className={styles.logItem}>
                    <div className={styles.logHeader}>
                      <span
                        className={`${styles.errorType} ${getErrorTypeColor(log.errorType)}`}
                      >
                        {log.errorType.replace(/_/g, " ")}
                      </span>
                      <span className={styles.logTime}>
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className={styles.logMessage}>{log.errorMessage}</p>
                    {log.url && (
                      <span className={styles.logUrl}>URL: {log.url}</span>
                    )}
                    {log.userId && (
                      <span className={styles.logUser}>User: {log.userId}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
