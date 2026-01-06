"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DOCUMENT_URL } from "@/constants";
import { FileIcon, SpreadsheetIcon, WhiteboardIcon } from "@/icons";
import { getPublishedDocuments } from "@/lib/actions/getPublishedDocuments";
import { Document } from "@/types";
import styles from "./RecentBoardInsightsCard.module.css";

export function RecentBoardInsightsCard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublishedDocuments() {
      const result = await getPublishedDocuments({ limit: 6 });
      if (result.data) {
        setDocuments(result.data);
      }
      setLoading(false);
    }
    loadPublishedDocuments();
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Board Insights</h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : documents.length > 0 ? (
          <div className={styles.documentList}>
            {documents.map((document) => (
              <Link
                key={document.id}
                href={DOCUMENT_URL(document.type, document.id)}
                className={styles.documentItem}
              >
                <div className={styles.documentIcon}>
                  {getDocumentIcon(document.type)}
                </div>
                <div className={styles.documentInfo}>
                  <div className={styles.documentName}>{document.name}</div>
                  <div className={styles.documentMeta}>
                    Updated{" "}
                    {new Date(document.lastConnection).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            No published insights yet. Documents marked as published will appear
            here.
          </p>
        )}
      </div>
    </div>
  );
}
