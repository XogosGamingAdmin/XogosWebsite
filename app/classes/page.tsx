"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  imagePath: string;
  features: string[];
  status: "active" | "coming-soon";
}

export default function ClassesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const programs: Program[] = [
    {
      id: "survival-academy",
      title: "Survival Academy",
      category: "Wilderness Survival & Life Skills",
      description:
        "Learn essential wilderness survival techniques and practical life skills that prepare you for any situation. From fire-starting and shelter-building to navigation and first aid, students gain hands-on experience in outdoor environments while building confidence, resilience, and self-reliance.",
      imagePath: "/images/programs/survival_academy.png",
      status: "active",
      features: [
        "Wilderness survival techniques",
        "Fire-starting and shelter-building",
        "Navigation and orienteering",
        "First aid and emergency response",
        "Outdoor cooking and foraging",
        "Team leadership skills",
      ],
    },
    {
      id: "debt-free-millionaire-investor",
      title: "Debt Free Millionaire Investor",
      category: "Personal Finance & Investing",
      description:
        "Master the fundamentals of personal finance and investing through interactive lessons and real-world simulations. Learn budgeting, saving strategies, understanding credit, stock market basics, and long-term wealth building. Students graduate financially literate and prepared for their financial futures.",
      imagePath: "/images/programs/debt_free_millionaire_investor.png",
      status: "active",
      features: [
        "Budgeting and saving strategies",
        "Understanding credit and debt",
        "Stock market fundamentals",
        "Investment portfolio basics",
        "Real estate introduction",
        "Entrepreneurship foundations",
      ],
    },
    {
      id: "starfall-academy",
      title: "StarFall Academy",
      category: "Astronomy & Space Science",
      description:
        "Explore the wonders of the cosmos through hands-on astronomy education. Students learn to identify constellations, understand planetary science, and discover the mysteries of black holes, galaxies, and the expanding universe. Includes telescope observation sessions and space mission simulations.",
      imagePath: "/images/programs/starfall_academy.png",
      status: "active",
      features: [
        "Constellation identification",
        "Telescope observation sessions",
        "Planetary science exploration",
        "Space mission simulations",
        "Astrophysics fundamentals",
        "Night sky photography",
      ],
    },
    {
      id: "kitchenlab-academy",
      title: "KitchenLab Academy",
      category: "Culinary Arts & Cooking",
      description:
        "Discover the science and art of cooking in our hands-on culinary program. Students learn kitchen safety, nutrition fundamentals, cooking techniques from around the world, and how to prepare healthy, delicious meals. Perfect for developing independence and creativity in the kitchen.",
      imagePath: "/images/programs/kitchenlab_academy.png",
      status: "active",
      features: [
        "Kitchen safety and hygiene",
        "Nutrition and healthy eating",
        "Global cuisine exploration",
        "Baking and pastry basics",
        "Meal planning and prep",
        "Food science experiments",
      ],
    },
  ];

  const handleProgramClick = (program: Program) => {
    setActiveProgram(program);
  };

  const closeProgramDetails = () => {
    setActiveProgram(null);
  };

  return (
    <MarketingLayout>
      <div className={styles.classesPage}>
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
              <div className={styles.heroBadge}>Off-Screen Learning</div>
              <h1
                className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
              >
                Xogos <span className={styles.highlightText}>Classes</span>
              </h1>
              <p
                className={`${styles.heroSubtitle} ${isLoaded ? styles.visible : ""}`}
              >
                Real-world skills, hands-on learning. Our classes take students
                off the screen and into experiences that build confidence,
                knowledge, and practical abilities for life.
              </p>
              <div className={styles.comingSoonBanner}>
                <span className={styles.bannerIcon}>🚀</span>
                <span>15 Classes launching by end of July 2026!</span>
              </div>
              <p className={styles.upcomingClasses}>
                Including: Personal Finance, Journalism, Game Design, Business,
                Marine Biology, and more!
              </p>
            </div>
          </Container>
        </section>

        {/* Programs Grid */}
        <section className={styles.programsSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Available Classes</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                Enroll in hands-on classes that teach real-world skills while
                earning iPlay coins toward scholarships
              </p>
            </div>

            <div className={styles.programsGrid}>
              {programs.map((program) => (
                <div
                  key={program.id}
                  className={styles.programCard}
                  onClick={() => handleProgramClick(program)}
                >
                  <div className={styles.programImageContainer}>
                    <Image
                      src={program.imagePath}
                      alt={program.title}
                      width={400}
                      height={250}
                      className={styles.programImage}
                    />
                    <div className={styles.programOverlay}>
                      <div className={styles.programCategory}>
                        {program.category}
                      </div>
                    </div>
                  </div>
                  <div className={styles.programContent}>
                    <h3 className={styles.programTitle}>{program.title}</h3>
                    <p className={styles.programDescription}>
                      {program.description.length > 150
                        ? `${program.description.substring(0, 150)}...`
                        : program.description}
                    </p>
                    <button className={styles.programButton}>
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Earn Coins Section */}
        <section className={styles.earnCoinsSection}>
          <Container>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Earn Coins While You Learn</h2>
              <div className={styles.sectionDecoration}></div>
              <p className={styles.sectionSubtitle}>
                Participate in classes and contribute to earn iPlay coins toward scholarships
              </p>
            </div>
            <div className={styles.earnExamples}>
              <div className={styles.earnCard}>
                <div className={styles.earnIcon}>🍳</div>
                <h3 className={styles.earnTitle}>KitchenLab Academy</h3>
                <p className={styles.earnDescription}>
                  We need great recipes with real photos! For each recipe you
                  submit with actual pictures you took, you&apos;ll earn iPlay coins.
                  Help build our recipe database while learning to cook.
                </p>
                <div className={styles.earnReward}>
                  <span>Submit a recipe with photos</span>
                  <span className={styles.coinBadge}>🪙 Earn Coins</span>
                </div>
              </div>
              <div className={styles.earnCard}>
                <div className={styles.earnIcon}>📰</div>
                <h3 className={styles.earnTitle}>Journalism</h3>
                <p className={styles.earnDescription}>
                  Practice real journalism skills! Submit articles to earn coins,
                  and earn even more when your article gets published. Learn to
                  research, write, and edit like a professional journalist.
                </p>
                <div className={styles.earnRewards}>
                  <div className={styles.earnReward}>
                    <span>Submit an article</span>
                    <span className={styles.coinBadge}>🪙 1 Coin</span>
                  </div>
                  <div className={styles.earnReward}>
                    <span>Article gets published</span>
                    <span className={styles.coinBadge}>🪙 5 Coins</span>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.earnNote}>
              Each class offers unique opportunities to contribute and earn.
              The more you participate, the more you can earn toward your future!
            </p>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefitsSection}>
          <Container>
            <div className={styles.benefitsContent}>
              <h2 className={styles.benefitsTitle}>Why Off-Screen Learning?</h2>
              <div className={styles.benefitsGrid}>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>🎯</div>
                  <h3 className={styles.benefitTitle}>Real Skills</h3>
                  <p className={styles.benefitDescription}>
                    Learn practical abilities you&apos;ll use throughout your life
                  </p>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>🏆</div>
                  <h3 className={styles.benefitTitle}>Earn Rewards</h3>
                  <p className={styles.benefitDescription}>
                    Gain iPlay coins for scholarships while learning
                  </p>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>🤝</div>
                  <h3 className={styles.benefitTitle}>Build Connections</h3>
                  <p className={styles.benefitDescription}>
                    Meet peers and mentors in hands-on environments
                  </p>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>💪</div>
                  <h3 className={styles.benefitTitle}>Grow Confidence</h3>
                  <p className={styles.benefitDescription}>
                    Develop self-reliance through real accomplishments
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
              <h2 className={styles.ctaTitle}>Ready to Learn Beyond the Screen?</h2>
              <p className={styles.ctaDescription}>
                Join thousands of students discovering real-world skills while
                earning rewards toward their future education.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="https://www.xogosgaming.com" className={styles.primaryButton}>
                  Enroll Now
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
                  <h3 className={styles.programModalSubtitle}>What You&apos;ll Learn</h3>
                  <ul className={styles.featuresList}>
                    {activeProgram.features.map((feature, index) => (
                      <li key={index} className={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.programModalActions}>
                  <Link
                    href="https://www.xogosgaming.com"
                    className={styles.modalPrimaryButton}
                  >
                    Enroll in This Class
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
