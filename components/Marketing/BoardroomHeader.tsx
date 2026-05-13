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
      if (path === "/boardroom") {
        return window.location.pathname === "/boardroom";
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
          <nav
            className={clsx(styles.nav, mobileMenuOpen && styles.mobileOpen)}
          >
            <div className={styles.navLinkContainer}>
              <Link
                href="/boardroom"
                className={clsx(
                  styles.navLink,
                  isActive("/boardroom") && styles.active
                )}
              >
                Board Room
              </Link>
              <Link
                href="/boardroom/skills-matrix"
                className={clsx(
                  styles.navLink,
                  isActive("/boardroom/skills-matrix") && styles.active
                )}
              >
                Skills Matrix
              </Link>
              <Link
                href="/boardroom/initiatives"
                className={clsx(
                  styles.navLink,
                  isActive("/boardroom/initiatives") && styles.active
                )}
              >
                Initiatives
              </Link>
              <Link
                href="/boardroom/bylaws"
                className={clsx(
                  styles.navLink,
                  isActive("/boardroom/bylaws") && styles.active
                )}
              >
                ByLaws
              </Link>
              <Link
                href="/boardroom/enterprise"
                className={clsx(
                  styles.navLink,
                  isActive("/boardroom/enterprise") && styles.active
                )}
              >
                Enterprise
              </Link>
              <Link
                href="/dashboard"
                className={clsx(
                  styles.navLink,
                  isActive("/dashboard") && styles.active
                )}
              >
                Dashboard
              </Link>
            </div>
          </nav>
        </div>
        <div className={styles.actionButtons}>
          <button
            className={clsx(
              styles.mobileMenuToggle,
              mobileMenuOpen && styles.mobileOpen
            )}
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
