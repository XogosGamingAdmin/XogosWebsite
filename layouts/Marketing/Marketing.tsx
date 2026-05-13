"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { MarketingFooter, MarketingHeader } from "@/components/Marketing";
import { BoardroomHeader } from "@/components/Marketing/BoardroomHeader";
import styles from "./Marketing.module.css";

export function MarketingLayout({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  const pathname = usePathname();

  // Show BoardroomHeader for all board-related paths
  const showBoardroomHeader = pathname?.startsWith("/boardroom");

  return (
    <div className={clsx(className, styles.layout)} {...props}>
      {showBoardroomHeader ? <BoardroomHeader /> : <MarketingHeader />}
      <main>{children}</main>
      <MarketingFooter className={styles.footer} />
    </div>
  );
}
