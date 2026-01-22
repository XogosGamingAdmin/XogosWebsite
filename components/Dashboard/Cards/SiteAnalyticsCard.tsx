"use client";

import { useEffect, useState } from "react";
import { getVisitStats } from "@/lib/actions/getVisitStats";
import styles from "./SiteAnalyticsCard.module.css";

interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
  boardRoomVisits: number;
  boardRoomUniqueVisitors: number;
  pageBreakdown: {
    pagePath: string;
    pageName: string | null;
    visitCount: number;
    uniqueVisitors: number;
  }[];
}

export function SiteAnalyticsCard() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  async function loadStats() {
    setLoading(true);
    const result = await getVisitStats(timeRange);
    if (result.data) {
      setStats(result.data);
    }
    setLoading(false);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Site Analytics</h2>
        <select
          className={styles.timeSelect}
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : stats ? (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{stats.totalVisits}</div>
                <div className={styles.statLabel}>Total Site Visits</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{stats.uniqueVisitors}</div>
                <div className={styles.statLabel}>Unique Visitors</div>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.statHighlight}>
                <div className={styles.statValue}>{stats.boardRoomVisits}</div>
                <div className={styles.statLabel}>Board Room Visits</div>
              </div>
              <div className={styles.statHighlight}>
                <div className={styles.statValue}>{stats.boardRoomUniqueVisitors}</div>
                <div className={styles.statLabel}>Board Room Unique</div>
              </div>
            </div>
            {stats.pageBreakdown.length > 0 && (
              <div className={styles.breakdown}>
                <h3 className={styles.breakdownTitle}>Top Pages</h3>
                <div className={styles.pageList}>
                  {stats.pageBreakdown.slice(0, 5).map((page) => (
                    <div key={page.pagePath} className={styles.pageItem}>
                      <span className={styles.pageName}>
                        {page.pageName || page.pagePath}
                      </span>
                      <span className={styles.pageCount}>
                        {page.visitCount} visits
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className={styles.empty}>No visit data yet</p>
        )}
      </div>
    </div>
  );
}
