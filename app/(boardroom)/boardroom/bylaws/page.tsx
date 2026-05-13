"use client";

import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

export default function BylawsPage() {
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
          <h1 className={styles.title}>Corporate ByLaws</h1>
          <p className={styles.subtitle}>
            Xogos Gaming Inc. governance documents and corporate bylaws
          </p>
        </div>

        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>📜</div>
          <h2 className={styles.placeholderTitle}>Coming Soon</h2>
          <p className={styles.placeholderText}>
            Corporate bylaws and governance documents will be available here.
          </p>
        </div>
      </Container>
    </div>
  );
}
