"use client";

import styles from "./XogosScholarshipsCard.module.css";

const ScholarshipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="48"
    height="48"
  >
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

export function XogosScholarshipsCard() {
  return (
    <a
      href="https://scholarship-board.myxogos.com"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.iconWrapper}>
        <ScholarshipIcon />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>Xogos Scholarships</h2>
        <p className={styles.description}>
          Manage and review scholarship applications
        </p>
      </div>
      <div className={styles.arrow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </div>
    </a>
  );
}
