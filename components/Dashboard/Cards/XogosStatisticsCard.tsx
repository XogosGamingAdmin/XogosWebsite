"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getStatistics } from "@/lib/actions/getStatistics";
import { getStatisticsHistory } from "@/lib/actions/getStatisticsHistory";
import { XogosStatistics } from "@/types/dashboard";
import styles from "./XogosStatisticsCard.module.css";

type HistoryRecord = {
  accounts: number;
  activeUsers: number;
  totalHours: number;
  lastUpdated: string;
};

export function XogosStatisticsCard() {
  const [statistics, setStatistics] = useState<XogosStatistics | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [statsResult, historyResult] = await Promise.all([
        getStatistics(),
        getStatisticsHistory({ limit: 30 }),
      ]);
      if (statsResult.data) {
        setStatistics(statsResult.data);
      }
      if (historyResult.data) {
        // Reverse so oldest is first (left side of chart)
        setHistory([...historyResult.data].reverse());
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const chartData = history.map((record) => ({
    date: new Date(record.lastUpdated).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    Accounts: record.accounts,
    "Active Users": record.activeUsers,
    "Total Hours": record.totalHours,
  }));

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
                <div className={styles.statValue}>
                  {statistics.activeUsers}
                </div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{statistics.totalHours}</div>
                <div className={styles.statLabel}>Total Hours</div>
              </div>
            </div>
            {chartData.length > 1 && (
              <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Growth Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#999" }}
                      stroke="#555"
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#999" }} stroke="#555" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #333",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="Accounts"
                      stroke="#e62739"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Active Users"
                      stroke="#e6bb84"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Total Hours"
                      stroke="#7928ca"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className={styles.footer}>
              <span className={styles.lastUpdated}>
                Last updated:{" "}
                {new Date(statistics.lastUpdated).toLocaleDateString()}
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
