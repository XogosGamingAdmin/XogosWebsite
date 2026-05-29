"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

// Team member type
interface TeamMember {
  name: string;
  title: string;
  description: string;
  imagePath?: string;
}

export default function AboutPage() {
  // Animation on scroll
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Team members data
  const teamMembers: TeamMember[] = [
    {
      name: "Zack Edwards",
      title: "President and Creator",
      description:
        "From managing projects for the State of Alaska to developing games enjoyed everywhere.",
      imagePath: "/images/team/Zack.png",
    },
    {
      name: "Josh Forsman",
      title: "Sales Representative",
      description:
        "With over a decade of game sales, he now travels the United States to sell games to audiences near and far.",
      imagePath: "/images/team/Joshua.png",
    },
    {
      name: "Devang Vamja",
      title: "Data Analyst and AI Specialist",
      description:
        "From his 10 years of programming, he went back to school to become a Data Scientist.",
      imagePath: "/images/team/Devang.png",
    },
    {
      name: "Tyler Newman",
      title: "Back-End Software Developer",
      description:
        "From the Coast Guard to designing games, he is now helping to build Xogos.",
      imagePath: "/images/team/Tyler.png",
    },
  ];

  // iPlay coin benefits
  const benefits = [
    {
      title: "Enhanced Gaming Experience",
      description:
        "Level up your gaming with rewards for achievements and progress",
      icon: "🎮",
    },
    {
      title: "Digital Rewards Access",
      description: "Unlock exclusive digital content and power-ups",
      icon: "🏆",
    },
    {
      title: "Real-World Prizes",
      description: "Convert coins to tangible rewards from our sponsors",
      icon: "🎁",
    },
    {
      title: "Scholarship Opportunities",
      description: "Transform gameplay into future education funding",
      icon: "🎓",
    },
    {
      title: "Community Connection",
      description: "Join a network of like-minded students and educators",
      icon: "👥",
    },
  ];

  return (
    <MarketingLayout>
      <div className={styles.aboutPage}>
        {/* Background elements */}
        <div className={styles.pageBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.bgGlow1}></div>
          <div className={styles.bgGlow2}></div>
          <div className={styles.bgGlow3}></div>
          <div className={styles.pixelOverlay}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <Container>
            <div className={styles.heroContent}>
              <h1
                className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
              >
                About <span className={styles.highlightText}>Xogos Gaming</span>
              </h1>
              <p
                className={`${styles.heroSubtitle} ${isLoaded ? styles.visible : ""}`}
              >
                Where learning meets play, and every achievement brings
                real-world rewards
              </p>
            </div>
          </Container>
        </section>

        {/* Founder's Story Section */}
        <section className={styles.storySection}>
          <Container>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>
                <h2 className={styles.sectionTitle}>The Founder's Story</h2>
                <div className={styles.sectionDecoration}></div>
              </div>

              <div className={styles.storyContent}>
                <div className={styles.storyPanel}>
                  <div className={styles.storyIcon}>
                    <span className={styles.storyIconSymbol}>🎲</span>
                  </div>
                  <h3 className={styles.storyPanelTitle}>
                    The Game Designer Dad
                  </h3>
                  <p className={styles.storyText}>
                    As a game designer with over 20 years in educational games,
                    our founder watched his own kids abandon the physical games
                    he created the moment screens lit up. Joining them online
                    was an eye-opener: unknown "friends," virtual currency
                    traps, inappropriate chat, and concerning content. He wanted
                    a platform where kids could safely play, learn, and grow -
                    so he built one.
                  </p>
                </div>

                <div className={styles.storyPanel}>
                  <div className={styles.storyIcon}>
                    <span className={styles.storyIconSymbol}>👨‍🏫</span>
                  </div>
                  <h3 className={styles.storyPanelTitle}>
                    The Educator's Request
                  </h3>
                  <p className={styles.storyText}>
                    Teachers and parents loved the physical games but faced
                    practical challenges: cost per student, durability issues,
                    and setup time. When asked to create a digital version of
                    Historical Conquest, educators requested more - math games,
                    science, English, personal finance - all without monetizing
                    students, free of ads and in-game purchases, running on even
                    basic hardware. Their requests were right.
                  </p>
                </div>
              </div>

              <div className={styles.storySummary}>
                <p className={styles.summaryText}>
                  Xogos combines these needs: a trusted platform for parents,
                  engaging games kids love, and practical tools for educators.
                  Every time we share Xogos with a parent, they smile and say,
                  "Finally." That's why we built it. And with each subscription,
                  we get closer to releasing more value-driven games and
                  programs - plus, students can earn scholarships while playing.
                  A true win for everyone involved.
                </p>
                <div className={styles.gameControllerSection}>
                  <div className={styles.gameController}>
                    <div className={styles.controllerBody}>
                      <div className={styles.controllerLeft}>
                        <div className={styles.dPad}>
                          <div className={`${styles.dPadBtn} ${styles.dPadUp}`}>
                            ↑
                          </div>
                          <div
                            className={`${styles.dPadBtn} ${styles.dPadRight}`}
                          >
                            →
                          </div>
                          <div
                            className={`${styles.dPadBtn} ${styles.dPadDown}`}
                          >
                            ↓
                          </div>
                          <div
                            className={`${styles.dPadBtn} ${styles.dPadLeft}`}
                          >
                            ←
                          </div>
                          <div className={styles.dPadMiddle}></div>
                        </div>
                      </div>
                      <div className={styles.controllerCenter}>
                        <div className={styles.centerButton}></div>
                        <div className={styles.centerButton}></div>
                      </div>
                      <div className={styles.controllerRight}>
                        <div className={styles.buttonsCluster}>
                          <button
                            className={`${styles.actionButton} ${styles.btnX}`}
                          >
                            X
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.btnY}`}
                          >
                            Y
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.btnA}`}
                          >
                            A
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.btnB}`}
                          >
                            B
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className={styles.controllerShadow}></div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <Container>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>
                <h2 className={styles.sectionTitle}>Our Team</h2>
                <div className={styles.sectionDecoration}></div>
              </div>
              <p className={styles.teamIntro}>
                Our dynamic team comprises experienced developers who bring
                technical expertise to the project. We also collaborate with
                multiple game development contractors to ensure a robust
                platform, with guidance from a 7-member Board of Advisors with
                diverse expertise.
              </p>

              <div className={styles.teamGrid}>
                {teamMembers.map((member, index) => (
                  <div key={index} className={styles.teamCard}>
                    <div className={styles.teamImageContainer}>
                      {member.imagePath ? (
                        <Image
                          src={member.imagePath}
                          alt={member.name}
                          width={150}
                          height={150}
                          className={styles.teamImage}
                        />
                      ) : (
                        <div className={styles.teamPlaceholder}>
                          <span>{member.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className={styles.teamHoverEffect}></div>
                    </div>
                    <h3 className={styles.teamName}>{member.name}</h3>
                    <h4 className={styles.teamTitle}>{member.title}</h4>
                    <p className={styles.teamDescription}>
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* iPlay Coins Section */}
        <section className={styles.coinsSection}>
          <Container>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>
                <h2 className={styles.sectionTitle}>What are iPlay Coins?</h2>
                <div className={styles.sectionDecoration}></div>
              </div>

              <div className={styles.coinsContent}>
                <div className={styles.coinsLeft}>
                  <p className={styles.coinsDescription}>
                    Drawing from a vision of revolutionizing learning, we
                    created the iPlay coin system. After years of refining our
                    educational games, we saw an opportunity to make education
                    even more engaging and rewarding.
                  </p>
                  <p className={styles.coinsDescription}>
                    Inspired by blockchain technology, we conceptualized a
                    unique digital currency that doesn't just stay in the
                    virtual realm—it transcends into real-world opportunities.
                  </p>
                  <p className={styles.coinsDescription}>
                    By playing our games, users earn iPlay coins through
                    achievements. These coins unlock in-game benefits, exclusive
                    digital rewards, and can even pave the way to tangible
                    rewards from our sponsors.
                  </p>
                  <p className={styles.coinsHighlight}>
                    The pinnacle: iPlay coins have the potential to transform
                    into actual scholarship opportunities, bridging the gap
                    between education and empowerment.
                  </p>
                </div>

                <div className={styles.coinAnimation}>
                  <div className={styles.coin}>
                    <div className={styles.coinFront}>
                      <span>iP</span>
                    </div>
                    <div className={styles.coinEdge}></div>
                    <div className={styles.coinBack}>
                      <span>X</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefitsSection}>
          <Container>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>
                <h2 className={styles.sectionTitle}>
                  Discover a World of Benefits
                </h2>
                <div className={styles.sectionDecoration}></div>
              </div>
              <p className={styles.benefitsIntro}>
                Join Xogos and unlock possibilities through our iPlay coin
                system. Ready to embark on an educational journey that's not
                only exciting but also incredibly rewarding?
              </p>

              <div className={styles.benefitsGrid}>
                {benefits.map((benefit, index) => (
                  <div key={index} className={styles.benefitCard}>
                    <div className={styles.benefitIcon}>{benefit.icon}</div>
                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                    <p className={styles.benefitDescription}>
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className={styles.earlyAdopter}>
                <div className={styles.adopterHighlight}>
                  <h3 className={styles.adopterTitle}>Early Adopters</h3>
                  <p className={styles.adopterText}>
                    Coming on early means you get to collect more coins and
                    store them for when things start really heating up and the
                    games and rewards are implemented. Join now and get ahead of
                    the curve!
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* What Makes Us Different Section */}
        <section className={styles.differenceSection}>
          <Container>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>
                <h2 className={styles.sectionTitle}>What Makes Us Different</h2>
                <div className={styles.sectionDecoration}></div>
              </div>

              <div className={styles.differenceContent}>
                <div className={styles.differenceCard}>
                  <div className={styles.differenceShape}></div>
                  <div className={styles.differenceText}>
                    <p>
                      Earn coins while playing games, no more wasting your
                      hard-earned money on game tokens. In Xogos, you earn them
                      through gameplay.
                    </p>
                  </div>
                </div>

                <div className={styles.differenceCard}>
                  <div className={styles.differenceShape}></div>
                  <div className={styles.differenceText}>
                    <p>
                      Don't judge a book by its cover. We aren't like other
                      educational games - while they are 70% learning and 30%
                      fun, we're different. We want you to have fun so you come
                      back, because the more you play, the more you learn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <Container>
            <div className={styles.ctaContainer}>
              <h2 className={styles.ctaTitle}>Ready to Join the Revolution?</h2>
              <p className={styles.ctaText}>
                Experience gaming that rewards you with real opportunities while
                making learning fun.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/games" className={styles.primaryButton}>
                  Explore Games
                </Link>
                <Link href="https://www.xogosgaming.com" className={styles.secondaryButton}>
                  Join Now
                </Link>
              </div>
              <div className={styles.ctaDecoration}>
                <div className={styles.pixelElement}></div>
                <div className={styles.pixelElement}></div>
                <div className={styles.pixelElement}></div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </MarketingLayout>
  );
}
