"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DOCUMENT_URL } from "@/constants";
import { FileIcon, SpreadsheetIcon, WhiteboardIcon } from "@/icons";
import { getPublishedDocuments } from "@/lib/actions/getPublishedDocuments";
import { getRecentInitiatives } from "@/lib/actions/getRecentInitiatives";
import { Document } from "@/types";
import styles from "./RecentBoardInsightsCard.module.css";

interface Initiative {
  id: string;
  memberId: string;
  memberName: string;
  memberTitle: string;
  memberImage: string;
  title: string;
  description: string;
  createdAt: string;
}

// Combined insight type for sorting
interface Insight {
  type: "document" | "initiative";
  id: string;
  title: string;
  subtitle: string;
  date: Date;
  href: string;
  document?: Document;
  initiative?: Initiative;
}

// Initiative icon
const InitiativeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="18"
    height="18"
  >
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
  </svg>
);

export function RecentBoardInsightsCard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      const [docsResult, initiativesResult] = await Promise.all([
        getPublishedDocuments({ limit: 6 }),
        getRecentInitiatives(6),
      ]);

      if (docsResult.data) {
        setDocuments(docsResult.data);
      }
      if (initiativesResult.data) {
        setInitiatives(initiativesResult.data);
      }
      setLoading(false);
    }
    loadInsights();
  }, []);

  const getDocumentIcon = (type: Document["type"]) => {
    switch (type) {
      case "text":
        return <FileIcon />;
      case "spreadsheet":
        return <SpreadsheetIcon />;
      case "whiteboard":
        return <WhiteboardIcon />;
      default:
        return <FileIcon />;
    }
  };

  // Combine and sort by date
  const combinedInsights: Insight[] = [
    ...documents.map((doc) => ({
      type: "document" as const,
      id: doc.id,
      title: doc.name,
      subtitle: `Document`,
      date: new Date(doc.lastConnection),
      href: DOCUMENT_URL(doc.type, doc.id),
      document: doc,
    })),
    ...initiatives.map((init) => ({
      type: "initiative" as const,
      id: init.id,
      title: init.title,
      subtitle: `by ${init.memberName}`,
      date: new Date(init.createdAt),
      href: `/board/initiatives/${init.memberId}`,
      initiative: init,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Board Insights</h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : combinedInsights.length > 0 ? (
          <div className={styles.documentList}>
            {combinedInsights.map((insight) => (
              <Link
                key={`${insight.type}-${insight.id}`}
                href={insight.href}
                className={styles.documentItem}
              >
                <div
                  className={`${styles.documentIcon} ${insight.type === "initiative" ? styles.initiativeIcon : ""}`}
                >
                  {insight.type === "document" && insight.document
                    ? getDocumentIcon(insight.document.type)
                    : <InitiativeIcon />}
                </div>
                <div className={styles.documentInfo}>
                  <div className={styles.documentName}>{insight.title}</div>
                  <div className={styles.documentMeta}>
                    {insight.type === "initiative" ? (
                      <span className={styles.initiativeTag}>Initiative</span>
                    ) : null}
                    {insight.subtitle} &middot;{" "}
                    {insight.date.toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            No insights yet. Published documents and board member initiatives
            will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
