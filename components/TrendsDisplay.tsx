"use client";

import { useEffect, useState } from "react";
import { getFinancialsHistory } from "@/lib/actions/getFinancialsHistory";
import { getStatisticsHistory } from "@/lib/actions/getStatisticsHistory";
import styles from "./TrendsDisplay.module.css";

interface StatRecord {
  id: number;
  accounts: number;
  activeUsers: number;
  totalHours: number;
  lastUpdated: string;
  updatedBy: string;
}

interface FinancialRecord {
  id: number;
  revenue: number;
  expenses: number;
  monthlyPayments: number;
  yearlyPayments: number;
  lifetimeMembers: number;
  lastUpdated: string;
  updatedBy: string;
}

interface TrendsDisplayProps {
  type: "statistics" | "financials";
  limit?: number;
}

export function TrendsDisplay({ type, limit = 10 }: TrendsDisplayProps) {
  const [statsHistory, setStatsHistory] = useState<StatRecord[]>([]);
  const [financialsHistory, setFinancialsHistory] = useState<FinancialRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setError(null);

      try {
        if (type === "statistics") {
          const result = await getStatisticsHistory({ limit });
          if (result.error) {
            setError(result.error.message);
          } else if (result.data) {
            // Reverse to show oldest first (chronological)
            setStatsHistory([...result.data].reverse());
          }
        } else {
          const result = await getFinancialsHistory({ limit });
          if (result.error) {
            setError(result.error.message);
          } else if (result.data) {
            // Reverse to show oldest first (chronological)
            setFinancialsHistory([...result.data].reverse());
          }
        }
      } catch (err) {
        setError("Failed to load historical data");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [type, limit]);

  if (loading) {
    return <div className={styles.loading}>Loading trends...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (type === "statistics" && statsHistory.length === 0) {
    return (
      <div className={styles.noData}>No statistics history available yet.</div>
    );
  }

  if (type === "financials" && financialsHistory.length === 0) {
    return (
      <div className={styles.noData}>No financials history available yet.</div>
    );
  }

  return (
    <div className={styles.trendsContainer}>
      <h3 className={styles.title}>
        {type === "statistics" ? "Statistics History" : "Financials History"}
      </h3>

      {type === "statistics" ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Accounts</th>
                <th>Active Users</th>
                <th>Total Hours</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              {statsHistory.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.lastUpdated).toLocaleString()}</td>
                  <td className={styles.numberCell}>
                    {record.accounts.toLocaleString()}
                  </td>
                  <td className={styles.numberCell}>
                    {record.activeUsers.toLocaleString()}
                  </td>
                  <td className={styles.numberCell}>
                    {record.totalHours.toLocaleString()}
                  </td>
                  <td className={styles.emailCell}>{record.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Monthly Pay</th>
                <th>Yearly Pay</th>
                <th>Lifetime</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              {financialsHistory.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.lastUpdated).toLocaleString()}</td>
                  <td className={styles.moneyCell}>
                    ${record.revenue.toLocaleString()}
                  </td>
                  <td className={styles.moneyCell}>
                    ${record.expenses.toLocaleString()}
                  </td>
                  <td className={styles.moneyCell}>
                    ${record.monthlyPayments.toLocaleString()}
                  </td>
                  <td className={styles.moneyCell}>
                    ${record.yearlyPayments.toLocaleString()}
                  </td>
                  <td className={styles.numberCell}>
                    {record.lifetimeMembers}
                  </td>
                  <td className={styles.emailCell}>{record.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
