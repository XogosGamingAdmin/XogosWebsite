"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface IncentiveProgram {
  id: string;
  title: string;
  category: string;
  description: string;
  imagePath: string;
  features: string[];
  status: "active" | "coming-soon";
  comingSoonDate?: string;
}

export default function IncentivesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProgram, setActiveProgram] = useState<IncentiveProgram | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const programs: IncentiveProgram[] = [
    {
      id: "iserv-volunteering",
      title: "iServ Volunteering",
      category: "Community Service",
      description:
        "Make a real difference in your community while earning rewards for your future. iServ connects students with local non-profit organizations for meaningful volunteer opportunities. Every hour of service earns iPlay coins that can be converted into scholarships. Help neighbors, mentor younger students, clean parks, assist at food banks, and more—all while building character and earning toward college.",
      imagePath: "/images/games/new_iserv_volunteer.png",
      status: "active",
      features: [
        "Partner with local non-profits",
        "Track volunteer hours digitally",
        "Earn iPlay coins per hour served",
        "Convert coins to scholarships",
        "Build community connections",
        "Develop leadership skills",
        "Create lasting impact",
        "Receive service certificates",
      ],
    },
    {
      id: "pryde-gym",
      title: "Pryde Gym",
      category: "Physical Activity",
      description:
        "Get active, get rewarded! Pryde Gym transforms physical fitness into an adventure where every workout earns you iPlay coins. Track your activities, complete fitness challenges, join team sports, and watch your rewards grow as you build healthy habits. Whether you're running, swimming, playing basketball, or hitting the gym—your physical efforts count toward scholarships.",
      imagePath: "/images/games/new_pryde_gym.png",
      status: "coming-soon",
      comingSoonDate: "End of 2026",
      features: [
        "Track multiple activity types",
        "Earn coins for exercise time",
        "Complete fitness challenges",
        "Join team competitions",
        "Set and achieve goals",
        "Connect fitness trackers",
        "Weekly activity rewards",
        "Health milestone bonuses",
      ],
    },
  ];

  const handleProgramClick = (program: IncentiveProgram) => {
    setActiveProgram(program);
  };

  const closeProgramDetails = () => {
    setActiveProgram(null);
  };

  return (
    <MarketingLayout>
      <div className={styles.incentivesPage}>
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
              <div className={styles.heroBadge}>Earn Off-Screen</div>
              <h1
                className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
              >
                Active <span className={styles.highlightText}>Incentives</span>
              </h1>
              <p
                className={`${styles.heroSubtitle} ${isLoaded ? styles.visible : ""}`}
              >
                Step away from the screen and into real-world activities that
                reward you. Earn iPlay coins through community service and
                physical activity—then convert them into real scholarships.
              </p>
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className={styles.howItWorksSection}>
          <Container>
            <div className={styles.howItWorksContent}>
              <h2 className={styles.howItWorksTitle}>How Active Incentives Work</h2>
              <div className={styles.stepsGrid}>
                <div className={styles.stepCard}>
                  <div className={styles.stepNumber}>1</div>
                  <h3 className={styles.stepTitle}>Choose Your Activity</h3>
                  <p className={styles.stepDescription}>
                    Select from community service or physical activity programs
                  </p>
                </div>
                <div className={styles.stepArrow}>→</div>
                <div className={styles.stepCard}>
                  <div className={styles.stepNumber}>2</div>
                  <h3 className={styles.stepTitle}>Get Active</h3>
                  <p className={styles.stepDescription}>
                    Volunteer in your community or complete fitness activities
                  </p>
                </div>
                <div className={styles.stepArrow}>→</div>
                <div className={styles.stepCard}>
                  <div className={styles.stepNumber}>3</div>
                  <h3 className={styles.stepTitle}>Earn iPlay Coins</h3>
                  <p className={styles.stepDescription}>
                    Your real-world efforts are rewarded with digital currency
                  </p>
                </div>
                <div className={styles.stepArrow}>→</div>
                <div className={styles.stepCard}>
                  <div className={styles.stepNumber}>4</div>
                  <h3 className={styles.stepTitle}>Fund Your Future</h3>
                  <p className={styles.stepDescription}>
                    Convert coins into scholarships for your education
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Programs Section */}
        <section className={styles.programsSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Active Incentive Programs</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                Real activities, real rewards. Choose how you want to earn.
              </p>
            </div>

            <div className={styles.programsGrid}>
              {programs.map((program) => (
                <div
                  key={program.id}
                  className={`${styles.programCard} ${program.status === "coming-soon" ? styles.comingSoonCard : ""}`}
                  onClick={() => handleProgramClick(program)}
                >
                  {program.status === "coming-soon" && (
                    <div className={styles.comingSoonBanner}>
                      Coming Soon - {program.comingSoonDate}
                    </div>
                  )}
                  <div className={styles.programImageContainer}>
                    <Image
                      src={program.imagePath}
                      alt={program.title}
                      width={500}
                      height={300}
                      className={styles.programImage}
                    />
                    <div className={styles.programOverlay}>
                      <div className={styles.programCategory}>
                        {program.category}
                      </div>
                      {program.status === "active" && (
                        <div className={styles.statusBadge}>Available Now</div>
                      )}
                    </div>
                  </div>
                  <div className={styles.programContent}>
                    <h3 className={styles.programTitle}>{program.title}</h3>
                    <p className={styles.programDescription}>
                      {program.description.length > 180
                        ? `${program.description.substring(0, 180)}...`
                        : program.description}
                    </p>
                    <button className={styles.programButton}>
                      {program.status === "active" ? "Learn More" : "Coming Soon"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Impact Stats */}
        <section className={styles.statsSection}>
          <Container>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statValue}>1 Hour</div>
                <div className={styles.statLabel}>= 1 iPlay Coin</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <div className={styles.statValue}>$0.10</div>
                <div className={styles.statLabel}>Per Coin Value</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎓</div>
                <div className={styles.statValue}>Real</div>
                <div className={styles.statLabel}>Scholarships</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🌟</div>
                <div className={styles.statValue}>Unlimited</div>
                <div className={styles.statLabel}>Earning Potential</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <Container>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Earn While You Grow?</h2>
              <p className={styles.ctaDescription}>
                Join thousands of students who are making a difference in their
                communities and building healthier habits—all while earning
                toward their future education.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/membership" className={styles.primaryButton}>
                  Get Started
                </Link>
                <Link href="/games" className={styles.secondaryButton}>
                  Explore Games
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Program Details Modal */}
        {activeProgram && (
          <div className={styles.programModal} onClick={closeProgramDetails}>
            <div
              className={styles.programModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeModalButton}
                onClick={closeProgramDetails}
              >
                ×
              </button>
              <div className={styles.programModalHeader}>
                <div className={styles.programModalImageContainer}>
                  <Image
                    src={activeProgram.imagePath}
                    alt={activeProgram.title}
                    width={600}
                    height={350}
                    className={styles.programModalImage}
                  />
                  <div className={styles.programModalOverlay}>
                    <div className={styles.programModalCategory}>
                      {activeProgram.category}
                    </div>
                    {activeProgram.status === "coming-soon" && (
                      <div className={styles.modalComingSoonBadge}>
                        Coming {activeProgram.comingSoonDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.programModalBody}>
                <h2 className={styles.programModalTitle}>
                  {activeProgram.title}
                </h2>
                <p className={styles.programModalDescription}>
                  {activeProgram.description}
                </p>

                <div className={styles.programModalFeatures}>
                  <h3 className={styles.programModalSubtitle}>Program Features</h3>
                  <ul className={styles.featuresList}>
                    {activeProgram.features.map((feature, index) => (
                      <li key={index} className={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.programModalActions}>
                  {activeProgram.status === "active" ? (
                    <Link
                      href="/membership"
                      className={styles.modalPrimaryButton}
                    >
                      Join This Program
                    </Link>
                  ) : (
                    <button className={styles.modalDisabledButton} disabled>
                      Coming {activeProgram.comingSoonDate}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
