"use client";

import Link from "next/link";
import React from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "@/components/Marketing/InfoPage.module.css";

export default function TermsPage() {
  return (
    <MarketingLayout>
      <PageTracker pagePath="/terms" pageName="Terms of Use" />
      <div className={styles.page}>
        <div className={styles.gridBackground} aria-hidden="true"></div>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>LEGAL</span>
          <h1 className={styles.heroTitle}>Terms of Use</h1>
          <p className={styles.heroSubtitle}>
            The rules and guidelines for using Xogos Gaming services.
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(229, 229, 229, 0.6)",
              marginTop: "16px",
            }}
          >
            Last updated: October 9, 2026
          </p>
        </section>

        <section className={styles.contactSection}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className={styles.card} style={{ padding: "32px 36px" }}>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.8,
                  color: "rgba(229, 229, 229, 0.9)",
                }}
              >
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: 0,
                    marginBottom: "16px",
                  }}
                >
                  1. Agreement to Terms
                </h2>
                <p>
                  By accessing or using the Xogos Gaming platform at myXogos.com
                  and xogosgaming.com, you agree to be bound by these Terms of
                  Use and our{" "}
                  <Link
                    href="/privacy"
                    style={{ color: "#e62739", textDecoration: "underline" }}
                  >
                    Privacy Policy
                  </Link>
                  . If you are a parent or guardian creating an account for a
                  child, you agree to these terms on their behalf.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  2. Account Registration
                </h2>
                <p>
                  <strong style={{ color: "#fff" }}>Parent Accounts:</strong>{" "}
                  Only adults (18 years or older) may create parent/guardian
                  accounts. You are responsible for maintaining the security of
                  your account credentials and for all activity under your
                  account.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Student Accounts:</strong>{" "}
                  Student accounts must be created by a parent or guardian.
                  Parents are responsible for their children&apos;s use of the
                  platform and agree to supervise their activity as appropriate.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Accurate Information:</strong>{" "}
                  You agree to provide accurate, current, and complete
                  information during registration and to update it as needed.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  3. Membership and Billing
                </h2>
                <p>
                  <strong style={{ color: "#fff" }}>Subscription:</strong> Xogos
                  operates on a monthly subscription model. Your membership
                  automatically renews each month unless canceled.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Family Plan:</strong> A
                  single membership includes up to 4 student accounts within the
                  same household.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Cancellation:</strong> You
                  may cancel your subscription at any time through your account
                  settings. Access continues through the end of your current
                  billing period.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Refunds:</strong> We offer a
                  satisfaction guarantee for new members. Contact us within 14
                  days of your first payment for a full refund.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  4. iPlay Coins and Scholarships
                </h2>
                <p>
                  <strong style={{ color: "#fff" }}>Earning Coins:</strong>{" "}
                  Students earn iPlay coins by playing educational games,
                  completing academy assignments, achieving goals, and
                  participating in community service through iServ.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Coin Ownership:</strong>{" "}
                  iPlay coins have no cash value and cannot be sold, traded, or
                  transferred outside the Xogos platform. They may only be
                  converted to scholarships as described below.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>
                    Scholarship Conversion:
                  </strong>{" "}
                  When a student has accumulated sufficient iPlay coins, they
                  may be converted to real scholarship funds held by our
                  partner, Innovate the Future, a 501(c)(3) nonprofit. Minimum
                  balances and conversion rates are displayed in the platform.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Scholarship Terms:</strong>{" "}
                  Scholarships are subject to the terms set by Innovate the
                  Future and may only be used for qualified educational
                  expenses.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  5. Acceptable Use
                </h2>
                <p>You agree NOT to:</p>
                <ul style={{ paddingLeft: "24px", margin: "16px 0" }}>
                  <li style={{ marginBottom: "8px" }}>
                    Use automated tools, bots, or scripts to interact with the
                    platform or accumulate coins
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Create multiple accounts to circumvent limits or gain unfair
                    advantages
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Share account credentials with anyone outside your household
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Upload inappropriate, offensive, or harmful content
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Attempt to access other users&apos; accounts or private data
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Use the platform for any illegal purpose
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Interfere with or disrupt the platform&apos;s operation
                  </li>
                </ul>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  6. User Content
                </h2>
                <p>
                  <strong style={{ color: "#fff" }}>Submissions:</strong> Some
                  features allow students to submit content (photos, written
                  work, game creations). You retain ownership of content you
                  create but grant Xogos a license to store and display it
                  within the platform.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Content Standards:</strong>{" "}
                  All submitted content must be appropriate for a
                  family-friendly educational environment. We reserve the right
                  to remove content that violates these standards.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>The Forge:</strong> Games
                  created in The Forge may be shared with other users. By
                  publishing a game, you grant Xogos and other users a license
                  to play and interact with your creation.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  7. Intellectual Property
                </h2>
                <p>
                  The Xogos platform, including all games, academies, graphics,
                  and software, is owned by Xogos Gaming Inc. and protected by
                  copyright and trademark laws. You may not copy, modify,
                  distribute, or create derivative works without our written
                  permission.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  8. Third-Party Services
                </h2>
                <p>
                  Our platform may integrate with third-party services
                  (Innovate the Future for scholarships, community service
                  partners for iServ). These services have their own terms and
                  policies that apply to your use of them.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  9. Account Termination
                </h2>
                <p>
                  We may suspend or terminate accounts that violate these terms.
                  In cases of termination for cause, accumulated iPlay coins may
                  be forfeited. You may close your account at any time by
                  contacting us.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  10. Disclaimers and Limitations
                </h2>
                <p>
                  <strong style={{ color: "#fff" }}>Educational Purpose:</strong>{" "}
                  Xogos is designed for entertainment and educational
                  enrichment. Our games and academies supplement but do not
                  replace formal education.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Service Availability:</strong>{" "}
                  We strive for continuous availability but do not guarantee
                  uninterrupted access. We are not liable for any losses due to
                  service interruptions.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Limitation of Liability:</strong>{" "}
                  To the maximum extent permitted by law, Xogos Gaming Inc.
                  shall not be liable for any indirect, incidental, or
                  consequential damages arising from your use of the platform.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  11. Changes to Terms
                </h2>
                <p>
                  We may update these Terms of Use from time to time. We will
                  notify you of material changes by email and by posting the new
                  terms on this page. Continued use of the platform after
                  changes constitutes acceptance of the new terms.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  12. Governing Law
                </h2>
                <p>
                  These Terms are governed by the laws of the State of Texas,
                  United States, without regard to conflict of law principles.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    marginTop: "32px",
                    marginBottom: "16px",
                  }}
                >
                  13. Contact Us
                </h2>
                <p>
                  If you have questions about these Terms of Use, please contact
                  us through our{" "}
                  <Link
                    href="/contact"
                    style={{ color: "#e62739", textDecoration: "underline" }}
                  >
                    Contact page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to Join?</h2>
            <p className={styles.ctaText}>
              Create your family account and start your educational gaming
              journey today.
            </p>
            <div className={styles.ctaButtons}>
              <a
                href="https://www.myXogos.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryBtn}
              >
                Get Started
              </a>
              <Link href="/privacy" className={styles.secondaryBtn}>
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
