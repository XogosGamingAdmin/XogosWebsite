"use client";

import Link from "next/link";
import React from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "@/components/Marketing/InfoPage.module.css";

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <PageTracker pagePath="/privacy" pageName="Privacy Policy" />
      <div className={styles.page}>
        <div className={styles.gridBackground} aria-hidden="true"></div>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>LEGAL</span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>
            How Xogos Gaming Inc. collects, uses, and protects your information.
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
                  1. Introduction
                </h2>
                <p>
                  Xogos Gaming Inc. (&quot;Xogos,&quot; &quot;we,&quot;
                  &quot;us,&quot; or &quot;our&quot;) is committed to protecting
                  the privacy of our users, especially children. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you use our educational gaming platform
                  at myXogos.com and xogosgaming.com.
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
                  2. Information We Collect
                </h2>
                <p>
                  <strong style={{ color: "#fff" }}>Account Information:</strong>{" "}
                  When a parent or guardian creates an account, we collect name,
                  email address, and payment information for membership billing.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Student Profiles:</strong>{" "}
                  Parents create student accounts with a display name and age.
                  We do not collect personal information directly from children
                  under 13 without verified parental consent.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Usage Data:</strong> We
                  collect information about gameplay, including games played,
                  time spent, achievements earned, and iPlay coins accumulated.
                  This helps us improve the platform and track educational
                  progress.
                </p>
                <p>
                  <strong style={{ color: "#fff" }}>Academy Submissions:</strong>{" "}
                  When students complete academy assignments (cooking photos,
                  written work, etc.), these are stored securely and visible only
                  to the student and their linked parent account.
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
                  3. How We Use Your Information
                </h2>
                <ul style={{ paddingLeft: "24px", margin: "16px 0" }}>
                  <li style={{ marginBottom: "8px" }}>
                    To provide and maintain the Xogos platform and services
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    To track educational progress and iPlay coin earnings
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    To process scholarship conversions through our partner,
                    Innovate the Future
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    To communicate important updates about the platform
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    To improve our games and educational content
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    To ensure platform safety and prevent misuse
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
                  4. Children&apos;s Privacy (COPPA Compliance)
                </h2>
                <p>
                  Xogos complies with the Children&apos;s Online Privacy
                  Protection Act (COPPA). We do not knowingly collect personal
                  information from children under 13 without verifiable parental
                  consent. All student accounts must be created by a parent or
                  guardian.
                </p>
                <p>Parents have the right to:</p>
                <ul style={{ paddingLeft: "24px", margin: "16px 0" }}>
                  <li style={{ marginBottom: "8px" }}>
                    Review their child&apos;s personal information
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Request deletion of their child&apos;s data
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Refuse further collection of their child&apos;s information
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Set time limits and parental controls on their child&apos;s
                    account
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
                  5. Data Security
                </h2>
                <p>
                  We implement industry-standard security measures to protect
                  your information, including:
                </p>
                <ul style={{ paddingLeft: "24px", margin: "16px 0" }}>
                  <li style={{ marginBottom: "8px" }}>
                    Encrypted connections (HTTPS/TLS) for all data transmission
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Secure password hashing and storage
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Regular security audits and updates
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Limited employee access to personal data
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
                  6. Information Sharing
                </h2>
                <p>
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share information only in these limited
                  circumstances:
                </p>
                <ul style={{ paddingLeft: "24px", margin: "16px 0" }}>
                  <li style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#fff" }}>
                      Scholarship Processing:
                    </strong>{" "}
                    When students convert iPlay coins to scholarships, necessary
                    information is shared with Innovate the Future to process
                    the funds.
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#fff" }}>Service Providers:</strong>{" "}
                    We use trusted third-party services for hosting, payment
                    processing (Stripe), and email delivery. These providers are
                    contractually bound to protect your data.
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#fff" }}>Legal Requirements:</strong>{" "}
                    We may disclose information if required by law or to protect
                    the safety of our users.
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
                  7. Cookies and Tracking
                </h2>
                <p>
                  We use essential cookies to maintain your session and
                  preferences. We do not use advertising cookies or sell data to
                  advertisers. The platform contains no third-party ads.
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
                  8. Data Retention
                </h2>
                <p>
                  We retain account information for as long as the account is
                  active. Scholarship-related records are retained as required
                  for tax and audit purposes. You may request deletion of your
                  account and associated data at any time by contacting us.
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
                  9. Your Rights
                </h2>
                <p>You have the right to:</p>
                <ul style={{ paddingLeft: "24px", margin: "16px 0" }}>
                  <li style={{ marginBottom: "8px" }}>
                    Access and download your personal data
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Correct inaccurate information
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Delete your account and data
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Opt out of non-essential communications
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
                  10. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by email and by posting the
                  new policy on this page with an updated date.
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
                  11. Contact Us
                </h2>
                <p>
                  If you have questions about this Privacy Policy or our data
                  practices, please contact us through our{" "}
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
            <h2 className={styles.ctaTitle}>Questions?</h2>
            <p className={styles.ctaText}>
              Learn more about how we protect students on our Student Protection
              page, or contact us directly.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/student-protection" className={styles.primaryBtn}>
                Student Protection
              </Link>
              <Link href="/contact" className={styles.secondaryBtn}>
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
