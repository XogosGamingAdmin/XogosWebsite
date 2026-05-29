"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

export default function ScholarshipsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <MarketingLayout>
      <div className={styles.scholarshipsPage}>
        {/* Background elements */}
        <div className={styles.pageBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.bgGlow1}></div>
          <div className={styles.bgGlow2}></div>
          <div className={styles.bgGlow3}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <Container>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>Fund Your Future</div>
              <h1
                className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
              >
                Xogos <span className={styles.highlightText}>Scholarships</span>
              </h1>
              <p
                className={`${styles.heroSubtitle} ${isLoaded ? styles.visible : ""}`}
              >
                Turn your educational achievements into real scholarship funds.
                Every iPlay coin you earn has real monetary value that can be
                converted into funding for your future education.
              </p>
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorksSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                Our three-step process makes it easy to turn educational
                achievements into future opportunities.
              </p>
            </div>
            <div className={styles.stepsContainer}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Play Educational Games</h3>
                  <p className={styles.stepDescription}>
                    Engage with our collection of fun, interactive games designed
                    to build knowledge and skills across multiple subject areas.
                    Each achievement is verified through our secure blockchain
                    technology. Play games like Debt-Free Millionaire, Bug and Seek,
                    Historical Conquest, and many more while earning iPlay coins
                    for your educational progress.
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Save & Multiply Rewards</h3>
                  <p className={styles.stepDescription}>
                    As you earn iPlay tokens through educational achievements, you
                    can save them in the Xogos Bank where they grow through our
                    multiplier system. The longer you save, the more your tokens
                    grow &ndash; up to 2x after 180 days. This teaches valuable lessons
                    about saving and compound growth while building your scholarship fund.
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Convert to Scholarships</h3>
                  <p className={styles.stepDescription}>
                    Transform your accumulated tokens into real scholarship funds
                    through our transparent conversion system. Your educational
                    achievements directly contribute to your academic future.
                    Funds can be applied to universities, trade schools, certificate
                    programs, and other accredited educational institutions.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Quarterly Distribution Section */}
        <section className={styles.coinValueSection}>
          <Container>
            <div className={styles.coinValueContent}>
              <div className={styles.coinValueText}>
                <h2 className={styles.coinValueTitle}>
                  Quarterly Scholarship Distribution
                </h2>
                <p className={styles.coinValueDescription}>
                  Each quarter, Innovate the Future announces how much money they
                  have raised through generous donations. During that quarter,
                  students convert their earned coins in the Xogos Bank for
                  scholarships. All converted coins go into a collective pot, and
                  each student receives a percentage of the raised funds based on
                  their share of the total coins converted.
                </p>
                <div className={styles.exampleBox}>
                  <h4 className={styles.exampleTitle}>Example Distribution</h4>
                  <p className={styles.exampleText}>
                    If Innovate the Future raises <strong>$5,000</strong> and 10
                    students each convert <strong>10 coins</strong> (100 total coins
                    in the pot), each student contributed 10% of the coins. Therefore,
                    each student receives <strong>10% of $5,000 = $500</strong> in
                    scholarship funds, which is tracked digitally in their Xogos Bank.
                  </p>
                </div>
              </div>
              <div className={styles.coinValueVisual}>
                <Image
                  src="/images/coin-to-diploma.png"
                  alt="Coins converting to scholarships"
                  width={400}
                  height={300}
                  className={styles.coinImage}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Earning Methods Section */}
        <section className={styles.earningSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Ways to Earn</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                Multiple paths to building your scholarship fund
              </p>
            </div>
            <div className={styles.earningGrid}>
              <div className={styles.earningCard}>
                <div className={styles.earningIcon}>🎮</div>
                <h3 className={styles.earningTitle}>Educational Games</h3>
                <p className={styles.earningDescription}>
                  Play our catalog of educational games across subjects like math,
                  science, history, and financial literacy. Complete levels and
                  achievements to earn coins.
                </p>
              </div>
              <div className={styles.earningCard}>
                <div className={styles.earningIcon}>📝</div>
                <h3 className={styles.earningTitle}>Academic Performance</h3>
                <p className={styles.earningDescription}>
                  Maintain good grades and earn bonus coins. Submit your report
                  cards to receive additional rewards for academic excellence.
                </p>
              </div>
              <div className={styles.earningCard}>
                <div className={styles.earningIcon}>🤝</div>
                <h3 className={styles.earningTitle}>Community Service</h3>
                <p className={styles.earningDescription}>
                  Volunteer with local non-profits through iServ. Every hour of
                  verified community service earns you iPlay coins.
                </p>
              </div>
              <div className={styles.earningCard}>
                <div className={styles.earningIcon}>🏃</div>
                <h3 className={styles.earningTitle}>Physical Activity</h3>
                <p className={styles.earningDescription}>
                  Stay active with Pryde Gym (coming soon). Track your workouts
                  and physical activities to earn coins while staying healthy.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Savings Multiplier Section */}
        <section className={styles.multiplierSection}>
          <Container>
            <div className={styles.multiplierContent}>
              <h2 className={styles.multiplierTitle}>The Savings Multiplier</h2>
              <p className={styles.multiplierDescription}>
                Learn the power of saving! When you choose to save your coins
                instead of spending them, they grow over time. The longer you
                save, the more you earn.
              </p>
              <div className={styles.multiplierTable}>
                <div className={styles.multiplierRow}>
                  <span className={styles.multiplierDays}>30 Days</span>
                  <span className={styles.multiplierBonus}>1.1x Multiplier</span>
                </div>
                <div className={styles.multiplierRow}>
                  <span className={styles.multiplierDays}>60 Days</span>
                  <span className={styles.multiplierBonus}>1.25x Multiplier</span>
                </div>
                <div className={styles.multiplierRow}>
                  <span className={styles.multiplierDays}>90 Days</span>
                  <span className={styles.multiplierBonus}>1.5x Multiplier</span>
                </div>
                <div className={styles.multiplierRow}>
                  <span className={styles.multiplierDays}>180 Days</span>
                  <span className={styles.multiplierBonus}>2x Multiplier</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Transparency Section */}
        <section className={styles.transparencySection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Full Transparency & Verification</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                We believe in complete transparency about how scholarship funds work
              </p>
            </div>
            <div className={styles.transparencyGrid}>
              <div className={styles.transparencyCard}>
                <div className={styles.transparencyIcon}>🔒</div>
                <h3 className={styles.transparencyTitle}>Digital Tracking</h3>
                <p className={styles.transparencyDescription}>
                  Your scholarship earnings are tracked digitally in your Xogos
                  Bank, so you can always see exactly how much you&apos;ve earned
                  toward your future education.
                </p>
              </div>
              <div className={styles.transparencyCard}>
                <div className={styles.transparencyIcon}>📊</div>
                <h3 className={styles.transparencyTitle}>Quarterly Audits</h3>
                <p className={styles.transparencyDescription}>
                  Our system tracks what we owe students in total. Innovate the
                  Future is audited quarterly to verify they hold that exact
                  amount in their FDIC-secured bank account.
                </p>
              </div>
              <div className={styles.transparencyCard}>
                <div className={styles.transparencyIcon}>🏦</div>
                <h3 className={styles.transparencyTitle}>FDIC Secured</h3>
                <p className={styles.transparencyDescription}>
                  All scholarship funds are held in FDIC-insured bank accounts
                  by Innovate the Future, a 501(c)(3) non-profit, ensuring your
                  earned scholarships are always protected.
                </p>
              </div>
            </div>
            <div className={styles.auditLink}>
              <Link href="/audits" className={styles.auditLinkBtn}>
                View Our Audit Results →
              </Link>
            </div>
          </Container>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <Container>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Start Building Your Scholarship Today</h2>
              <p className={styles.ctaDescription}>
                Join thousands of students who are already earning toward their
                future education through gameplay and real-world activities.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="https://www.xogosgaming.com" className={styles.primaryButton}>
                  Get Started
                </Link>
                <Link href="/games" className={styles.secondaryButton}>
                  Explore Games
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </MarketingLayout>
  );
}
