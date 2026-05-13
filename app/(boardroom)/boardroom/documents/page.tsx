"use client";

import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

export default function BoardroomDocumentsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.grid}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
      </div>

      <Container className={styles.container}>
        <div className={styles.backLink}>
          <Link href="/boardroom">← Back to Board Room</Link>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Board Room Documents</h1>
          <p className={styles.subtitle}>
            Access shared documents, whiteboards, and spreadsheets
          </p>
        </div>

        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>📄</div>
          <h2 className={styles.placeholderTitle}>Document Portal</h2>
          <p className={styles.placeholderText}>
            Access your collaborative documents in the document management
            system.
          </p>
          <Link href="/dashboard/documents" className={styles.actionButton}>
            Open Documents →
          </Link>
        </div>
      </Container>
    </div>
  );
}
