"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./GameHeader.module.css";

interface GameHeaderProps {
  gameTitle: string;
  gameSubject: string;
  themeColor?: string;
}

export function GameHeader({
  gameTitle,
  gameSubject,
  themeColor = "#f59e0b",
}: GameHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "auto";
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      style={{ "--theme-color": themeColor } as React.CSSProperties}
    >
      <div className={styles.container}>
        <div className={styles.logoAndNav}>
          {/* Game Info */}
          <div className={styles.gameInfo}>
            <Link href="/games" className={styles.backLink}>
              <span className={styles.backArrow}>←</span>
              <span className={styles.backText}>Back to Games</span>
            </Link>
            <div className={styles.gameDetails}>
              <h1 className={styles.gameTitle}>{gameTitle}</h1>
              <span className={styles.gameSubject}>{gameSubject}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}
          >
            <div className={styles.navLinkContainer}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              <Link href="/games" className={styles.navLink}>
                Games
              </Link>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
              <Link href="/docs" className={styles.navLink}>
                Docs
              </Link>
              <Link href="/boardroom" className={styles.navLink}>
                Board
              </Link>
            </div>

            <div className={styles.buttonGroup}>
              <Link href="https://www.xogosgaming.com" className={styles.playButton}>
                Play Now
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
        </button>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ backgroundColor: themeColor }}
        ></div>
      </div>
    </header>
  );
}
