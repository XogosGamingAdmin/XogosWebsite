"use client";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { ComponentProps, useCallback, useState } from "react";
import { DashboardHeader, DashboardSidebar } from "@/components/Dashboard";
import { LiveblocksProvider } from "@/liveblocks.config";
import { Group } from "@/types";
import styles from "./Dashboard.module.css";

interface Props extends ComponentProps<"div"> {
  groups: Group[];
}

export function DashboardLayout({
  children,
  groups,
  className,
  ...props
}: Props) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleMenuClick = useCallback(() => {
    setMenuOpen((isOpen) => !isOpen);
  }, []);

  // Wait for session to be ready before rendering LiveblocksProvider
  if (status === "loading") {
    return (
      <div className={clsx(className, styles.container)} {...props}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Only render LiveblocksProvider when session.user.info is available
  if (!session?.user?.info) {
    return (
      <div className={clsx(className, styles.container)} {...props}>
        <div className={styles.loading}>Initializing...</div>
      </div>
    );
  }

  return (
    <LiveblocksProvider>
      <div className={clsx(className, styles.container)} {...props}>
        <header className={styles.header}>
          <DashboardHeader isOpen={isMenuOpen} onMenuClick={handleMenuClick} />
        </header>
        <aside className={styles.aside} data-open={isMenuOpen || undefined}>
          <DashboardSidebar groups={groups} />
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </LiveblocksProvider>
  );
}
