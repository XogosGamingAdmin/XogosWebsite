"use client";

import { useEffect, useState } from "react";
import { getFinancials } from "@/lib/actions/getFinancials";
import { XogosFinancials } from "@/types/dashboard";
import styles from "./XogosFinancialsCard.module.css";

export function XogosFinancialsCard() {
  const [financials, setFinancials] = useState<XogosFinancials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinancials() {
      const result = await getFinancials();
      if (result.data) {
        setFinancials(result.data);
      }
      setLoading(false);
    }
    loadFinancials();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{formatCurrency(financials.revenue)}</div>
                <div className={styles.statLabel}>Revenue</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{formatCurrency(financials.expenses)}</div>
                <div className={styles.statLabel}>Expenses</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{formatCurrency(financials.monthlyPayments)}</div>
                <div className={styles.statLabel}>Monthly Payments</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{formatCurrency(financials.yearlyPayments)}</div>
                <div className={styles.statLabel}>Yearly Payments</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{financials.lifetimeMembers}</div>
                <div className={styles.statLabel}>Lifetime Members</div>
              </div>
            </div>
            <div className={styles.footer}>
              <span className={styles.lastUpdated}>
                Last updated: {new Date(financials.lastUpdated).toLocaleDateString()}
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
