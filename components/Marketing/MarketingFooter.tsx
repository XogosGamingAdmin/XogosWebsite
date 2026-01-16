import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, useMemo } from "react";
import { Container } from "@/primitives/Container";
import styles from "./MarketingFooter.module.css";

export function MarketingFooter({
  className,
  ...props
}: ComponentProps<"footer">) {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className={clsx(styles.footer, className)} {...props}>
      <div className={styles.footerBackground}>
        <div className={styles.footerAbstractShape1}></div>
        <div className={styles.footerAbstractShape2}></div>
        <div className={styles.footerAbstractShape3}></div>
      </div>

      <Container>
        <div className={styles.footerContent}>
          <div className={styles.footerBranding}>
            <Link href="/" className={styles.footerLogo}>
              <div className={styles.footerLogoImage}>
                <Image
                  src="/images/fullLogo.jpeg"
                  alt="Xogos Gaming Logo"
                  width={100}
                  height={60}
                  className={styles.footerLogoImg}
                />
              </div>
              <span className={styles.footerLogoText}>XOGOS GAMING</span>
            </Link>
            <p className={styles.footerTagline}>
              Educational Gaming that makes a difference
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerLinkColumn}>
              <h4 className={styles.footerLinkTitle}>Platform</h4>
              <Link href="/games" className={styles.footerLink}>
                Games
              </Link>
              <Link href="/membership" className={styles.footerLink}>
                Membership
              </Link>
              <Link href="/scholarships" className={styles.footerLink}>
                Scholarships
              </Link>
              <Link href="/forum" className={styles.footerLink}>
                Forum
              </Link>
              <Link href="/events" className={styles.footerLink}>
                Events
              </Link>
            </div>

            <div className={styles.footerLinkColumn}>
              <h4 className={styles.footerLinkTitle}>Company</h4>
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
              <Link href="/board/members" className={styles.footerLink}>
                Board Room
              </Link>
              <Link
                href="/signin?callbackUrl=/dashboard"
                className={styles.footerLink}
              >
                Board Sign-In
              </Link>
              <Link href="/contact" className={styles.footerLink}>
                Contact
              </Link>
            </div>

            <div className={styles.footerLinkColumn}>
              <h4 className={styles.footerLinkTitle}>Resources</h4>
              <Link href="/blog" className={styles.footerLink}>
                Blog
              </Link>
              <Link href="/docs" className={styles.footerLink}>
                Documentation
              </Link>
              <Link href="/faq" className={styles.footerLink}>
                FAQ
              </Link>
            </div>

            <div className={styles.footerLinkColumn}>
              <h4 className={styles.footerLinkTitle}>Connect</h4>
              <Link
                href="https://x.com/XogosGamingInc"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter / X
              </Link>
              <Link
                href="https://facebook.com/xogosgaminginc"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </Link>
              <Link
                href="https://www.instagram.com/xogosgaminginc/"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </Link>
              <Link
                href="https://www.pinterest.com/xogosgaminginc/"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pinterest
              </Link>
              <Link
                href="https://www.youtube.com/@XogosGamingInc"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            ©{year} Xogos Gaming Inc. All rights reserved.
          </p>
          <div className={styles.footerLegal}>
            <Link href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={styles.legalLink}>
              Terms of Use
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
