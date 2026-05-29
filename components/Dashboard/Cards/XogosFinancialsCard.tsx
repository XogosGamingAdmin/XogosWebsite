"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getFinancials } from "@/lib/actions/getFinancials";
import { getFinancialsHistory } from "@/lib/actions/getFinancialsHistory";
import { XogosFinancials } from "@/types/dashboard";
import styles from "./XogosFinancialsCard.module.css";

type HistoryRecord = {
  revenue: number;
  expenses: number;
  monthlyPayments: number;
  yearlyPayments: number;
  lifetimeMembers: number;
  lastUpdated: string;
};

export function XogosFinancialsCard() {
  const [financials, setFinancials] = useState<XogosFinancials | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [financialsResult, historyResult] = await Promise.all([
        getFinancials(),
        getFinancialsHistory({ limit: 30 }),
      ]);
      if (financialsResult.data) {
        setFinancials(financialsResult.data);
      }
      if (historyResult.data) {
        setHistory([...historyResult.data].reverse());
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const chartData = history.map((record) => ({
    date: new Date(record.lastUpdated).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    Revenue: record.revenue,
    Expenses: record.expenses,
  }));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Xogos Financials</h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : financials ? (
          <>
            {chartData.length > 1 && (
              <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Financial Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#999" }}
                      stroke="#555"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#999" }}
                      stroke="#555"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #333",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Expenses"
                      stroke="#e62739"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  {formatCurrency(financials.revenue)}
                </div>
                <div className={styles.statLabel}>Revenue</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  {formatCurrency(financials.expenses)}
                </div>
                <div className={styles.statLabel}>Expenses</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  {formatCurrency(financials.monthlyPayments)}
                </div>
                <div className={styles.statLabel}>Monthly Accounts</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  {formatCurrency(financials.yearlyPayments)}
                </div>
                <div className={styles.statLabel}>Yearly Members</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  {financials.lifetimeMembers}
                </div>
                <div className={styles.statLabel}>Lifetime Members</div>
              </div>
            </div>
            <div className={styles.footer}>
              <span className={styles.lastUpdated}>
                Last updated:{" "}
                {new Date(financials.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </>
        ) : (
          <p className={styles.error}>Failed to load financials</p>
        )}
      </div>
    </div>
  );
}
