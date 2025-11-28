"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

// SVG Icons for features and ecosystem
const GameIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const LearnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

const EarnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
  </svg>
);

const TokenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-9v2h2v-2h-2zm0-8v6h2V5h-2z" />
  </svg>
);

const VerificationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
  </svg>
);

const AIPIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

// Game card component
interface GameProps {
  title: string;
  releaseDate: string;
  subject: string;
  description: string;
  status: "active" | "upcoming" | "beta";
  imageUrl: string;
}

const GameCard = ({
  title,
  releaseDate,
  subject,
  description,
  status,
  imageUrl,
}: GameProps) => {
  return (
    <div className={styles.gameCard}>
      <div className={styles.gameHeader}>
        <Image src={imageUrl} alt={title} fill className={styles.gameImage} />
        <div className={`${styles.gameStatus} ${styles[status]}`}>
          {status.toUpperCase()}
        </div>
      </div>
      <div className={styles.gameBody}>
        <div className={styles.gameSubject}>{subject}</div>
        <h3 className={styles.gameTitle}>{title}</h3>
        <p className={styles.gameDescription}>{description}</p>
      </div>
      <div className={styles.gameFooter}>
        <span className={styles.gameReleaseInfo}>
          {status === "active" ? "Available Now" : releaseDate}
        </span>
        <Link href="/games" className={styles.gameLink}>
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    { value: "100%", label: "Learning While Playing" },
    { value: "180 Days", label: "Path to Double Rewards" },
    { value: "Real $$$", label: "For College Education" },
    { value: "Every Day", label: "Progress Toward College" },
  ];

  const features = [
    {
      icon: <GameIcon />,
      title: "Engaging Gameplay",
      description:
        "Fun, interactive games that make learning enjoyable while building important skills across various subjects.",
    },
    {
      icon: <LearnIcon />,
      title: "Educational Content",
      description:
        "Curriculum-aligned material that reinforces classroom learning and expands knowledge in key areas.",
    },
    {
      icon: <EarnIcon />,
      title: "Reward System",
      description:
        "Earn coins that can be saved and converted into scholarship funds for future education.",
    },
  ];

  const ecosystemItems = [
    {
      icon: <TokenIcon />,
      title: "Dual-Token Economy",
      description:
        "Our platform uses a unique dual-token system with iPlay educational tokens for in-platform rewards and iServ tokens for governance and market connection.",
    },
    {
      icon: <VerificationIcon />,
      title: "Achievement Verification",
      description:
        "Educational achievements are securely verified through our oracle network, ensuring genuine educational accomplishment is rewarded.",
    },
    {
      icon: <AIPIcon />,
      title: "Active Incentive Programs",
      description:
        "Beyond digital games, earn rewards through real-world activities including volunteer work, physical education, and peer tutoring.",
    },
    {
      icon: <EarnIcon />,
      title: "Scholarship Conversion",
      description:
        "Convert your earned tokens into real scholarship value through our transparent conversion system tied to educational milestones.",
    },
  ];

  const games = [
    {
      title: "Totally Medieval",
      releaseDate: "November 2024",
      subject: "Mathematics",
      description:
        "Master numerical concepts through medieval strategic gameplay. Build kingdoms, manage resources, and solve math problems.",
      status: "upcoming" as const,
      imageUrl: "/images/games/TotallyMedieval.jpg",
    },
    {
      title: "Battles and Thrones Simulator",
      releaseDate: "January 2025",
      subject: "History",
      description:
        "Lead historical kingdoms through epic battles and political intrigue. This simulation game teaches strategic thinking and historical context as players navigate alliances, conflicts, and resource management based on real historical scenarios.",
      status: "upcoming" as const,
      imageUrl: "/images/games/BattleThrones.jpg",
    },
    {
      title: "Bug and Seek",
      releaseDate: "Available Now",
      subject: "Science",
      description:
        "A nature-based exploration game where students become the new owners of a broken-down insectarium. Players explore real-world ecosystems to catch up to 220 real-life bugs, each with fun facts and humor built into every codex entry.",
      status: "active" as const,
      imageUrl: "/images/games/BugandSeek.jpg",
    },
    {
      title: "Debt-Free Millionaire",
      releaseDate: "In Development",
      subject: "Financial Literacy",
      description:
        "A career-readiness and financial literacy simulation that teaches students how to manage money, plan a career, and make life decisions that impact their future. Players choose a career, earn a salary, budget monthly expenses, and work toward financial freedom.",
      status: "beta" as const,
      imageUrl: "/images/games/DebtFreeMil.jpg",
    },
  ];

  const pricingPlans = [
    {
      type: "Monthly",
      amount: "$6",
      period: "per month",
      features: [
        "Access to all educational games",
        "Progress tracking",
        "Basic reward earning",
        "Cancel anytime",
      ],
    },
    {
      type: "Annual",
      amount: "$60",
      period: "per year",
      features: [
        "Save 16% compared to monthly",
        "Access to all educational games",
        "Enhanced reward earning (10% bonus)",
        "Priority support",
      ],
    },
    {
      type: "Lifetime",
      amount: "$120",
      period: "one-time payment",
      features: [
        "Permanent access to all games",
        "Maximum reward earning (15% bonus)",
        "Early access to new releases",
        "VIP support",
      ],
    },
  ];

  return (
    <MarketingLayout>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.heroGrid}></div>
            <div className={styles.heroAccent}></div>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <h1
                className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
              >
                Transforming Education Through{" "}
                <span className={styles.heroEmphasis}>Gaming</span>
              </h1>

              <div
                className={`${styles.heroTagline} ${isLoaded ? styles.visible : ""}`}
              >
                <span className={styles.heroPlay}>Play</span>
                <span className={styles.heroLearn}>Learn</span>
                <span className={styles.heroEarn}>Earn</span>
              </div>

              <p
                className={`${styles.heroDescription} ${isLoaded ? styles.visible : ""}`}
              >
                Xogos combines engaging gameplay with meaningful education,
                allowing students to earn rewards that convert into real
                scholarship opportunities.
              </p>

              <div
                className={`${styles.ctaButtons} ${isLoaded ? styles.visible : ""}`}
              >
                <Link href="/games" className={styles.primaryButton}>
                  Explore Games
                </Link>
                <Link href="/membership" className={styles.secondaryButton}>
                  Join Membership
                </Link>
              </div>
            </div>

            <div
              className={`${styles.heroRight} ${isLoaded ? styles.visible : ""}`}
            >
              <div className={styles.gameBoyContainer}>
                <div className={styles.gameBoyBody}>
                  {/* Top Section */}
                  <div className={styles.gameBoyTop}>
                    <div className={styles.speakerGrill}>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={styles.speakerHole}></div>
                      ))}
                    </div>
                    <div className={styles.nintendoLogo}>XOGOS</div>
                  </div>

                  {/* Screen Section */}
                  <div className={styles.screenSection}>
                    <div className={styles.screenBezel}>
                      <div className={styles.screenInner}>
                        <div className={styles.gameScreen}>
                          <div className={styles.screenReflection}></div>
                          <div className={styles.logoDisplay}>
                            <Image
                              src="/images/fullLogo.jpeg"
                              alt="Xogos Gaming Logo"
                              fill
                              className={styles.gameLogo}
                              priority
                            />
                          </div>
                          <div className={styles.scanlines}></div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.screenLabel}>XOGOS GAMING</div>
                  </div>

                  {/* Controls Section */}
                  <div className={styles.controlsSection}>
                    {/* D-Pad */}
                    <div className={styles.dpadContainer}>
                      <div className={styles.dpad}>
                        <div
                          className={`${styles.dpadButton} ${styles.dpadUp}`}
                        ></div>
                        <div
                          className={`${styles.dpadButton} ${styles.dpadRight}`}
                        ></div>
                        <div
                          className={`${styles.dpadButton} ${styles.dpadDown}`}
                        ></div>
                        <div
                          className={`${styles.dpadButton} ${styles.dpadLeft}`}
                        ></div>
                        <div className={styles.dpadCenter}></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                      <div className={styles.actionButton}>
                        <span>A</span>
                      </div>
                      <div className={styles.actionButton}>
                        <span>B</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className={styles.gameBoyBottom}>
                    <div className={styles.selectStart}>
                      <div className={styles.miniButton}></div>
                      <span className={styles.buttonLabel}>SELECT</span>
                      <div className={styles.miniButton}></div>
                      <span className={styles.buttonLabel}>START</span>
                    </div>
                    <div className={styles.powerLed}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Why Choose Xogos</h2>
            <p className={styles.sectionSubtitle}>
              Our platform combines educational value with engaging gameplay to
              create meaningful learning experiences.
            </p>
          </div>

          <div className={styles.featuresContainer}>
            <div className={styles.featuresWrapper}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem Section (based on whitepaper content) */}
        <section className={styles.ecosystemSection}>
          <div className={styles.ecosystemBackground}>
            <div className={styles.ecosystemGrid}></div>
          </div>

          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Our Ecosystem</h2>
            <p className={styles.sectionSubtitle}>
              Discover how our innovative platform creates pathways from
              educational gaming to real-world opportunities.
            </p>
          </div>

          <div className={styles.ecosystemContainer}>
            <div className={styles.ecosystemCard}>
              <div className={styles.ecosystemContent}>
                {ecosystemItems.map((item, index) => (
                  <div key={index} className={styles.ecosystemItem}>
                    <div className={styles.ecosystemItemTitle}>
                      <div className={styles.ecosystemItemIcon}>
                        {item.icon}
                      </div>
                      {item.title}
                    </div>
                    <p className={styles.ecosystemItemDescription}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className={styles.gamesSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Featured Games</h2>
            <p className={styles.sectionSubtitle}>
              Explore our collection of educational games designed to make
              learning fun and rewarding.
            </p>
          </div>

          <div className={styles.gamesContainer}>
            <div className={styles.gamesGrid}>
              {games.map((game, index) => (
                <GameCard
                  key={index}
                  title={game.title}
                  releaseDate={game.releaseDate}
                  subject={game.subject}
                  description={game.description}
                  status={game.status}
                  imageUrl={game.imageUrl}
                />
              ))}
            </div>

            <div className={styles.gamesViewAll}>
              <Link href="/games" className={styles.primaryButton}>
                View All Games
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section - Based on Technical Whitepaper */}
        <section className={styles.howItWorksSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>
              Our three-step process makes it easy to turn educational
              achievements into future opportunities.
            </p>
          </div>

          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepLeft}>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Play Educational Games</h3>
                  <p className={styles.stepDescription}>
                    Engage with our collection of fun, interactive games
                    designed to build knowledge and skills across multiple
                    subject areas. Each achievement is verified through our
                    secure blockchain technology, ensuring genuine educational
                    progress.
                  </p>
                </div>
              </div>
              <div className={styles.stepRight}></div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepLeft}>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Save & Multiply Rewards</h3>
                  <p className={styles.stepDescription}>
                    As you earn iPlay tokens through educational achievements,
                    you can save them in the Xogos Bank where they grow through
                    our multiplier system. The longer you save, the more your
                    tokens grow – up to 2x after 180 days.
                  </p>
                </div>
              </div>
              <div className={styles.stepRight}></div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepLeft}>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Convert to Scholarships</h3>
                  <p className={styles.stepDescription}>
                    Transform your accumulated tokens into real scholarship
                    funds through our transparent conversion system. Your
                    educational achievements directly contribute to your
                    academic future, creating a path from gaming to higher
                    education.
                  </p>
                </div>
              </div>
              <div className={styles.stepRight}></div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className={styles.pricingSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Membership Plans</h2>
            <p className={styles.sectionSubtitle}>
              Choose the membership option that works best for you and start
              your educational gaming journey.
            </p>
          </div>

          <div className={styles.pricingContainer}>
            <div className={styles.pricingCards}>
              {pricingPlans.map((plan, index) => (
                <div key={index} className={styles.pricingCard}>
                  <div className={styles.pricingHeader}>
                    <div className={styles.pricingType}>{plan.type}</div>
                    <div className={styles.pricingAmount}>{plan.amount}</div>
                    <div className={styles.pricingPeriod}>{plan.period}</div>
                  </div>
                  <div className={styles.pricingBody}>
                    <ul>
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.pricingFooter}>
                    <Link
                      href="/membership"
                      className={`${styles.primaryButton} ${styles.pricingCta}`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className={styles.newsletterSection}>
          <div className={styles.newsletterContainer}>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Stay Updated</h2>
              <p className={styles.sectionSubtitle}>
                Subscribe to our newsletter for the latest games, educational
                resources, and platform updates.
              </p>
            </div>

            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>

            <p className={styles.newsletterDisclaimer}>
              We respect your privacy and will never share your information.
            </p>

            <div className={styles.socialLinks}>
              <p className={styles.socialLinksLabel}>
                Follow us on social media:
              </p>
              <div className={styles.socialIconsRow}>
                <Link
                  href="https://x.com/XogosEducation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconLink}
                  title="Twitter / X"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  href="https://facebook.com/xogosgames"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconLink}
                  title="Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.instagram.com/historicalconquest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconLink}
                  title="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.pinterest.com/xogos_education"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconLink}
                  title="Pinterest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.youtube.com/@historicalconquest1473"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconLink}
                  title="YouTube"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>
              </div>
              <Link href="/rss" className={styles.rssLink}>
                View all feeds & RSS subscriptions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
