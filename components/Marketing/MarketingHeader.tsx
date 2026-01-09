"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, useEffect, useState } from "react";
import { Container } from "@/primitives/Container";
import styles from "./MarketingHeader.module.css";

export function MarketingHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header
      className={clsx(className, styles.header, isScrolled && styles.scrolled)}
      {...props}
    >
      <Container className={styles.container}>
        <div className={styles.logoAndLinks}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/fullLogo.jpeg"
                alt="Xogos Gaming"
                width={100}
                height={40}
                className={styles.logoImg}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </Link>
          <nav
            className={clsx(styles.nav, mobileMenuOpen && styles.mobileOpen)}
          >
            <div className={styles.navLinkContainer}>
              <Link href="/games" className={styles.navLink}>
                Games
              </Link>
              <Link href="/about" className={styles.navLink}>
                About Us
              </Link>
              <Link href="/blog" className={styles.navLink}>
                Blog
              </Link>
              <Link
                href="/signin"
                className={styles.mobileSignInButton}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </nav>
        </div>
        <div className={styles.actionButtons}>
          <Link href="/signin" className={styles.signInButton}>
            Sign In
          </Link>
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
