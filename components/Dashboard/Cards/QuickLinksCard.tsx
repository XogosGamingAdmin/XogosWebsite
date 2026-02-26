"use client";

import { useSession } from "next-auth/react";
import { canAccessFinancialDashboard } from "@/lib/auth/financial";
import styles from "./QuickLinksCard.module.css";

// Icons
const ScholarshipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

const FinancialIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20"
    height="20"
  >
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

interface QuickLink {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
  color: string;
}

export function QuickLinksCard() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // Define all available links
  const allLinks: (QuickLink & { requiresFinancialAccess?: boolean })[] = [
    {
      id: "scholarships",
      title: "Xogos Scholarships",
      description: "Manage scholarship applications",
      href: "https://scholarship-board.myxogos.com",
      icon: <ScholarshipIcon />,
      external: true,
      color: "#7c3aed",
    },
    {
      id: "financial",
      title: "Financial Dashboard",
      description: "View financial metrics & reports",
      href: "/finance",
      icon: <FinancialIcon />,
      external: false,
      color: "#059669",
      requiresFinancialAccess: true,
    },
  ];

  // Filter links based on user permissions
  const visibleLinks = allLinks.filter((link) => {
    if (link.requiresFinancialAccess) {
      return canAccessFinancialDashboard(userEmail);
    }
    return true;
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Links</h2>
      </div>
      <div className={styles.content}>
        {visibleLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className={styles.linkItem}
          >
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: link.color }}
            >
              {link.icon}
            </div>
            <div className={styles.linkInfo}>
              <div className={styles.linkTitle}>{link.title}</div>
              <div className={styles.linkDescription}>{link.description}</div>
            </div>
            <div className={styles.arrow}>
              <ArrowIcon />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
