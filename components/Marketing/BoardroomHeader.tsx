"use client";

import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Container } from "@/primitives/Container";
import styles from "./BoardroomHeader.module.css";

export function BoardroomHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Helper to determine active link
  const isActive = (path: string) => {
    if (typeof window !== "undefined") {
      // Use exact matching for the main board room
      if (path === "/board") {
        return window.location.pathname === "/board";
      }
      // Use startsWith for other paths
      return window.location.pathname.startsWith(path);
    }
    return false;
  };

  return (
    <header className={clsx(styles.header, isScrolled && styles.scrolled)}>
      <Container className={styles.container}>
        <div className={styles.logoAndLinks}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>Xogos Gaming</span>
          </Link>
          <nav className={clsx(styles.nav, mobileMenuOpen && styles.mobileOpen)}>
            <div className={styles.navLinkContainer}>
              <Link
                href="/board"
                className={clsx(styles.navLink, isActive("/board") && styles.active)}
              >
                Board Room
              </Link>
              <Link
                href="/board/members"
                className={clsx(styles.navLink, isActive("/board/members") && styles.active)}
              >
                Members
              </Link>
              <Link
                href="/board/initiatives"
                className={clsx(styles.navLink, isActive("/board/initiatives") && styles.active)}
              >
                Initiatives
              </Link>
              <Link
                href="/board/risk"
                className={clsx(styles.navLink, isActive("/board/risk") && styles.active)}
              >
                Risk
              </Link>
              <Link
                href="/board/tokenomics"
                className={clsx(styles.navLink, isActive("/board/tokenomics") && styles.active)}
              >
                Tokenomics
              </Link>
              <Link
                href="/board/insights"
                className={clsx(styles.navLink, isActive("/board/insights") && styles.active)}
              >
                Insights
              </Link>
            </div>
          </nav>
        </div>
        <div className={styles.actionButtons}>
          <button
            className={clsx(styles.mobileMenuToggle, mobileMenuOpen && styles.mobileOpen)}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </Container>
    </header>
  );
}
