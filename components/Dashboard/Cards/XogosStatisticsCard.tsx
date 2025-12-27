"use client";

import { useEffect, useState } from "react";
import { getStatistics } from "@/lib/actions/getStatistics";
import { XogosStatistics } from "@/types/dashboard";
import styles from "./XogosStatisticsCard.module.css";

export function XogosStatisticsCard() {
  const [statistics, setStatistics] = useState<XogosStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatistics() {
      const result = await getStatistics();
      if (result.data) {
        setStatistics(result.data);
      }
      setLoading(false);
    }
    loadStatistics();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Xogos Statistics</h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : statistics ? (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{statistics.accounts}</div>
                <div className={styles.statLabel}>Accounts</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{statistics.activeUsers}</div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{statistics.totalHours}</div>
                <div className={styles.statLabel}>Total Hours</div>
              </div>
            </div>
            <div className={styles.footer}>
              <span className={styles.lastUpdated}>
                Last updated: {new Date(statistics.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </>
        ) : (
          <p className={styles.error}>Failed to load statistics</p>
        )}
      </div>
    </div>
  );
}
