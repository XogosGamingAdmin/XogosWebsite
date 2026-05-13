"use client";

import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

const menuItems = [
  {
    id: "dashboard",
    title: "Board Room Dashboard",
    description: "Access your collaborative workspace and documents",
    href: "/dashboard",
    icon: "📊",
    color: "#e62739",
  },
  {
    id: "skills",
    title: "Skills Matrix",
    description: "Assess your competencies and view team skills breakdown",
    href: "/boardroom/skills-matrix",
    icon: "🎯",
    color: "#7928ca",
  },
  {
    id: "initiatives",
    title: "Initiatives",
    description: "Track board member initiatives and projects",
    href: "/boardroom/initiatives",
    icon: "🎯",
    color: "#2dd4bf",
  },
  {
    id: "bylaws",
    title: "ByLaws",
    description: "Corporate bylaws and governance documents",
    href: "/boardroom/bylaws",
    icon: "📜",
    color: "#f59e0b",
  },
  {
    id: "schema",
    title: "Website Schema",
    description: "Visual map of the entire website structure",
    href: "/boardroom/website-schema",
    icon: "🗺️",
    color: "#8b5cf6",
  },
  {
    id: "enterprise",
    title: "Xogos Enterprise",
    description: "Corporate structure and subsidiary overview",
    href: "/boardroom/enterprise",
    icon: "🏢",
    color: "#06b6d4",
  },
];

export default function BoardroomMenu() {
  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.grid}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
      </div>

      <Container className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Board Room</h1>
          <p className={styles.subtitle}>
            Welcome to the Xogos Gaming Board of Directors portal
          </p>
        </div>

        <div className={styles.menuGrid}>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={styles.menuCard}
              style={{ "--accent-color": item.color } as React.CSSProperties}
            >
              <div className={styles.cardAccent}></div>
              <div className={styles.cardContent}>
                <span className={styles.cardIcon}>{item.icon}</span>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </div>

        <div className={styles.quickLinks}>
          <Link href="/dashboard" className={styles.quickLink}>
            ← Back to Dashboard
          </Link>
        </div>
      </Container>
    </div>
  );
}
