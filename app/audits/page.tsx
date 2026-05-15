"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface AuditRecord {
  quarter: string;
  date: string;
  status: "completed" | "upcoming";
  details: string;
}

export default function AuditsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const auditRecords: AuditRecord[] = [
    {
      quarter: "Q1 2026",
      date: "January 2026",
      status: "completed",
      details: "First quarterly audit completed. All funds verified and accounted for.",
    },
    {
      quarter: "Q2 2026",
      date: "April 2026",
      status: "completed",
      details: "Second quarterly audit completed. 100% compliance with financial reporting standards.",
    },
    {
      quarter: "Q3 2026",
      date: "July 2026",
      status: "upcoming",
      details: "Third quarterly audit scheduled.",
    },
  ];

  return (
    <MarketingLayout>
      <div className={styles.auditsPage}>
        {/* Background elements */}
        <div className={styles.pageBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.bgGlow1}></div>
          <div className={styles.bgGlow2}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <Container>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>Financial Transparency</div>
              <h1
                className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
              >
                Audit <span className={styles.highlightText}>Results</span>
              </h1>
              <p
                className={`${styles.heroSubtitle} ${isLoaded ? styles.visible : ""}`}
              >
                We believe in complete transparency about how scholarship funds
                are managed. Every dollar is tracked, verified, and reported.
              </p>
            </div>
          </Container>
        </section>

        {/* Audit Status Banner */}
        <section className={styles.statusBanner}>
          <Container>
            <div className={styles.statusContent}>
              <div className={styles.statusIcon}>✓</div>
              <div className={styles.statusText}>
                <span className={styles.statusLabel}>Current Status:</span>
                <span className={styles.statusValue}>100% Audited</span>
              </div>
              <div className={styles.statusDate}>
                Last audit completed: April 2026
              </div>
            </div>
          </Container>
        </section>

        {/* Funding Structure Section */}
        <section className={styles.fundingSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>How We&apos;re Funded</h2>
              <div className={styles.sectionDecoration}></div>
            </div>
            <div className={styles.fundingContent}>
              <div className={styles.fundingCard}>
                <div className={styles.fundingIcon}>🏛️</div>
                <h3 className={styles.fundingTitle}>Innovate the Future</h3>
                <p className={styles.fundingDescription}>
                  Xogos Gaming scholarship funds are held and managed by
                  <strong> Innovate the Future</strong>, a registered 501(c)(3)
                  non-profit organization. This structure ensures that all
                  donations and scholarship funds are handled with the highest
                  standards of financial accountability and legal compliance.
                </p>
                <div className={styles.nonprofitBadge}>
                  501(c)(3) Non-Profit Organization
                </div>
              </div>
              <div className={styles.fundingFlow}>
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}>💰</div>
                  <div className={styles.flowLabel}>Donations Received</div>
                  <div className={styles.flowDescription}>
                    Generous donors contribute to Innovate the Future
                  </div>
                </div>
                <div className={styles.flowArrow}>→</div>
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}>🏦</div>
                  <div className={styles.flowLabel}>Funds Held Securely</div>
                  <div className={styles.flowDescription}>
                    Non-profit holds and manages all scholarship funds
                  </div>
                </div>
                <div className={styles.flowArrow}>→</div>
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}>🎓</div>
                  <div className={styles.flowLabel}>Scholarships Distributed</div>
                  <div className={styles.flowDescription}>
                    Xogos Gaming distributes through merit-based education system
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Distribution Process Section */}
        <section className={styles.distributionSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Quarterly Distribution Process</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                How scholarship funds are raised, converted, and verified
              </p>
            </div>
            <div className={styles.distributionContent}>
              <div className={styles.distributionStep}>
                <div className={styles.distributionNumber}>1</div>
                <div className={styles.distributionInfo}>
                  <h4 className={styles.distributionTitle}>Fundraising</h4>
                  <p className={styles.distributionDescription}>
                    Each quarter, Innovate the Future raises funds through
                    generous donations from individuals, organizations, and
                    corporate partners who believe in educational equity.
                  </p>
                </div>
              </div>
              <div className={styles.distributionStep}>
                <div className={styles.distributionNumber}>2</div>
                <div className={styles.distributionInfo}>
                  <h4 className={styles.distributionTitle}>Students Convert Coins</h4>
                  <p className={styles.distributionDescription}>
                    During the quarter, students who have earned iPlay coins
                    through gameplay, classes, and real-world activities can
                    convert their coins for scholarships. All converted coins
                    go into a collective pot.
                  </p>
                </div>
              </div>
              <div className={styles.distributionStep}>
                <div className={styles.distributionNumber}>3</div>
                <div className={styles.distributionInfo}>
                  <h4 className={styles.distributionTitle}>Proportional Distribution</h4>
                  <p className={styles.distributionDescription}>
                    Each student receives a percentage of the raised funds based
                    on their share of total coins converted. If you converted 10%
                    of all coins that quarter, you receive 10% of the funds raised.
                  </p>
                </div>
              </div>
              <div className={styles.distributionStep}>
                <div className={styles.distributionNumber}>4</div>
                <div className={styles.distributionInfo}>
                  <h4 className={styles.distributionTitle}>Verification & Tracking</h4>
                  <p className={styles.distributionDescription}>
                    Your scholarship earnings are tracked digitally in your Xogos
                    Bank. Our system calculates exactly what we owe each student,
                    and Innovate the Future is audited to verify they hold that
                    total amount in FDIC-secured bank accounts.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Quarterly Audits Section */}
        <section className={styles.auditsSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Quarterly Audits</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                Regular financial audits ensure complete accountability
              </p>
            </div>
            <div className={styles.auditsTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>Quarter</div>
                <div className={styles.tableHeaderCell}>Date</div>
                <div className={styles.tableHeaderCell}>Status</div>
                <div className={styles.tableHeaderCell}>Details</div>
              </div>
              {auditRecords.map((audit, index) => (
                <div
                  key={index}
                  className={`${styles.tableRow} ${audit.status === "completed" ? styles.completed : styles.upcoming}`}
                >
                  <div className={styles.tableCell}>
                    <span className={styles.quarterLabel}>{audit.quarter}</span>
                  </div>
                  <div className={styles.tableCell}>{audit.date}</div>
                  <div className={styles.tableCell}>
                    <span
                      className={`${styles.statusBadge} ${audit.status === "completed" ? styles.statusCompleted : styles.statusUpcoming}`}
                    >
                      {audit.status === "completed" ? "Completed" : "Scheduled"}
                    </span>
                  </div>
                  <div className={styles.tableCell}>{audit.details}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Transparency Commitment Section */}
        <section className={styles.commitmentSection}>
          <Container>
            <div className={styles.commitmentContent}>
              <h2 className={styles.commitmentTitle}>Our Commitment to Transparency</h2>
              <div className={styles.commitmentGrid}>
                <div className={styles.commitmentCard}>
                  <div className={styles.commitmentIcon}>📊</div>
                  <h3 className={styles.commitmentCardTitle}>Regular Reporting</h3>
                  <p className={styles.commitmentCardDescription}>
                    Quarterly financial reports are published and made available
                    to stakeholders, donors, and the public.
                  </p>
                </div>
                <div className={styles.commitmentCard}>
                  <div className={styles.commitmentIcon}>🔍</div>
                  <h3 className={styles.commitmentCardTitle}>Independent Audits</h3>
                  <p className={styles.commitmentCardDescription}>
                    All audits are conducted by independent third-party auditors
                    to ensure objectivity and accuracy.
                  </p>
                </div>
                <div className={styles.commitmentCard}>
                  <div className={styles.commitmentIcon}>🔒</div>
                  <h3 className={styles.commitmentCardTitle}>Secure Tracking</h3>
                  <p className={styles.commitmentCardDescription}>
                    Blockchain technology ensures every coin earned and converted
                    is permanently and transparently recorded.
                  </p>
                </div>
                <div className={styles.commitmentCard}>
                  <div className={styles.commitmentIcon}>⚖️</div>
                  <h3 className={styles.commitmentCardTitle}>Legal Compliance</h3>
                  <p className={styles.commitmentCardDescription}>
                    Full compliance with 501(c)(3) regulations and educational
                    funding requirements.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <Container>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Questions About Our Finances?</h2>
              <p className={styles.ctaDescription}>
                We welcome inquiries about our financial management and audit
                processes. Transparency is at the core of everything we do.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/contact" className={styles.primaryButton}>
                  Contact Us
                </Link>
                <Link href="/scholarships" className={styles.secondaryButton}>
                  Learn About Scholarships
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </MarketingLayout>
  );
}
