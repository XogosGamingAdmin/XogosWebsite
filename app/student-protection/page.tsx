"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface SafetyFeature {
  id: string;
  icon: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  details: string[];
}

export default function StudentProtectionPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const safetyFeatures: SafetyFeature[] = [
    {
      id: "parent-accounts",
      icon: "👨‍👩‍👧",
      title: "Every Parent Gets a Linked Account",
      shortDescription:
        "Parents have full visibility and control over their student's gaming experience.",
      fullDescription:
        "When a student gets signed up for Xogos, their parent or guardian automatically receives a linked parent or teacher account. This isn't optional—it's required. Parents can see what games their students play, how much time they spend, what they're learning, and who they are chatting with in the platform itself. They can set time limits, start discussions with their students about who they are talking with, and join them in the games their students are playing.",
      details: [
        "Real-time activity monitoring dashboard",
        "Customizable time limits and play schedules",
        "Join your students in their games",
        "Compete Against Your Students: Are You Smarter than your 3rd Grader?",
        "Direct access to academic achievement data",
        "One-click account pause for any situation",
      ],
    },
    {
      id: "know-customers",
      icon: "✓",
      title: "We Know Each of Our Customers",
      shortDescription:
        "No anonymous accounts. Every user is verified to ensure a trusted community.",
      fullDescription:
        "Unlike other platforms where anyone can create an anonymous account, Xogos requires identity verification for all users. Parents must verify their identity during signup, and students are linked to verified parent accounts. This creates a closed, trusted community where everyone is accountable. We don't allow fake profiles, bots, or anonymous users.",
      details: [
        "Parent identity verification required at signup",
        "Students must be linked to verified parent accounts",
        "No anonymous or guest accounts allowed",
        "Regular account audits to ensure community integrity",
        "Immediate removal of any suspicious accounts",
        "Background checks for all teachers and administrators",
      ],
    },
    {
      id: "software-safeguards",
      icon: "🔒",
      title: "Advanced Software Safeguards",
      shortDescription:
        "Enterprise-grade security protects every account and every piece of data.",
      fullDescription:
        "We employ the same security standards used by banks and healthcare systems. All data is encrypted both in transit and at rest. We use multi-factor authentication, continuous security monitoring, and regular third-party security audits. Our systems are designed to detect and prevent unauthorized access before it can cause any harm.",
      details: [
        "256-bit AES encryption for all data",
        "Multi-factor authentication available",
        "24/7 security monitoring and threat detection",
        "Regular third-party security audits",
        "COPPA compliant data handling",
        "Automatic session timeouts for inactive accounts",
      ],
    },
    {
      id: "no-chat",
      icon: "🚫",
      title: "No In-Game Chats",
      shortDescription:
        "Zero open chat features means zero opportunities for predatory behavior.",
      fullDescription:
        "We made a deliberate choice: no open chat features. Period. Many incidents involving students online happen through chat systems where strangers can initiate conversations. By eliminating this vector entirely, we remove the primary way predators contact students online. While there are no in-game chats, students can still collaborate through our platform chat which allows them to stay connected.",
      details: [
        "No direct messaging between users",
        "No public chat rooms or forums",
        "No voice chat during gameplay",
        "Structured collaboration only through teacher-monitored channels",
        "Pre-written response options for necessary communications",
        "All interactions logged and reviewable by parents",
      ],
    },
    {
      id: "age-restricted",
      icon: "🧑‍🎓",
      title: "Everyone is Between 6-19",
      shortDescription:
        "Our platform is exclusively for students, with verified adults limited to parents and teachers.",
      fullDescription:
        "Xogos is built exclusively for students aged 6-19. The only adults on the platform are verified parents (who can only see their own student's accounts) and verified teachers (who undergo background checks). There are no random adults, no influencers, no content creators trying to build audiences. Just students learning and growing together.",
      details: [
        "Strict age verification during signup",
        "Adults limited to verified parents and teachers only",
        "Parents can only access their own student's data",
        "Teachers undergo background checks before approval",
        "Regular age verification audits",
        "Immediate removal of any adult misrepresenting their role",
      ],
    },
    {
      id: "known-connections",
      icon: "👥",
      title: "Students Only Interact with People They Know",
      shortDescription:
        "No strangers. Students connect only with classmates, friends, and family.",
      fullDescription:
        "Students can only connect with people they already know in real life. Family is automatic, but may be blocked temporarily. Friends can join by three means: 1. Join an organization (Scouts, Trail Life, 4H, NHS, etc.) where all students can be connected in local groups, 2. Classroom—those in the same classroom may join with other classmates, 3. A friend request may be sent but expires in 10 minutes. Remember, parents can see who their kids are connected to and should start discussions with their students. There's no 'discover users' feature, no public profiles to browse, and no way for strangers to find or contact students.",
      details: [
        "All friend requests require parent approval",
        "No public user directory or search",
        "Classroom connections verified by teachers",
        "Family connections verified through parent accounts",
        "No 'suggested friends' from unknown users",
        "Connection history visible to parents at all times",
      ],
    },
  ];

  return (
    <MarketingLayout>
      <PageTracker pagePath="/student-protection" pageName="Student Protection" />
      <div className={styles.page}>
        {/* Background */}
        <div className={styles.background}>
          <div className={styles.grid}></div>
          <div className={styles.glow}></div>
          <div className={styles.glow}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <Container>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>🛡️</span>
                <span>SAFETY FIRST</span>
              </div>
              <h1 className={styles.heroTitle}>Student Protection</h1>
              <p className={styles.heroSubtitle}>
                We&apos;re not just another gaming platform. We&apos;re the safest place for students
                to play and learn online. Here&apos;s how we&apos;re different from everyone else.
              </p>
            </div>
          </Container>
        </section>

        {/* Message to Students Section */}
        <section className={styles.studentMessageSection}>
          <Container>
            <div className={styles.studentMessageContent}>
              <div className={styles.studentMessageIcon}>🎮</div>
              <h2 className={styles.studentMessageTitle}>A Message to Our Students</h2>
              <p className={styles.studentMessageText}>
                Hey there! We know there are a lot of gaming websites out there that look fun and exciting.
                But here&apos;s something important you should know: some of those places can be dangerous.
                There are people online called predators—adults who pretend to be kids or act friendly,
                but they actually want to hurt young people like you.
              </p>
              <p className={styles.studentMessageText}>
                <strong>That&apos;s exactly why we built Xogos the way we did.</strong> Every safeguard
                on this page exists to keep YOU safe while you have fun and learn. You can play games,
                connect with your real friends and classmates, and earn coins for scholarships—all
                without worrying about strangers trying to contact you. We&apos;ve got your back.
              </p>
              <div className={styles.studentMessageHighlight}>
                <span className={styles.highlightIcon}>💪</span>
                <span>Play safe. Learn lots. Have fun with friends you actually know!</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Different from Competitors Section */}
        <section className={styles.differenceSection}>
          <Container>
            <div className={styles.differenceContent}>
              <h2 className={styles.differenceTitle}>
                Why We&apos;re Different From Every Competitor
              </h2>
              <div className={styles.differenceGrid}>
                <div className={styles.differenceCard}>
                  <h3 className={styles.differenceCardTitle}>Other Gaming Platforms</h3>
                  <ul className={styles.differenceList}>
                    <li className={styles.differenceNegative}>
                      <span className={styles.xMark}>✗</span>
                      Anonymous accounts allow anyone to join
                    </li>
                    <li className={styles.differenceNegative}>
                      <span className={styles.xMark}>✗</span>
                      Open chat with strangers
                    </li>
                    <li className={styles.differenceNegative}>
                      <span className={styles.xMark}>✗</span>
                      Monetize students through ads and purchases
                    </li>
                    <li className={styles.differenceNegative}>
                      <span className={styles.xMark}>✗</span>
                      Designed to maximize screen time
                    </li>
                    <li className={styles.differenceNegative}>
                      <span className={styles.xMark}>✗</span>
                      Limited or no parental oversight
                    </li>
                  </ul>
                </div>
                <div className={`${styles.differenceCard} ${styles.differenceCardXogos}`}>
                  <h3 className={styles.differenceCardTitle}>Xogos Gaming</h3>
                  <ul className={styles.differenceList}>
                    <li className={styles.differencePositive}>
                      <span className={styles.checkMark}>✓</span>
                      Every user verified and linked to parents
                    </li>
                    <li className={styles.differencePositive}>
                      <span className={styles.checkMark}>✓</span>
                      Zero chat features with strangers
                    </li>
                    <li className={styles.differencePositive}>
                      <span className={styles.checkMark}>✓</span>
                      No ads, no microtransactions, simple subscription
                    </li>
                    <li className={styles.differencePositive}>
                      <span className={styles.checkMark}>✓</span>
                      Incentivizes getting OFF the screen
                    </li>
                    <li className={styles.differencePositive}>
                      <span className={styles.checkMark}>✓</span>
                      Full parental dashboard and controls
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* No Monetization Section */}
        <section className={styles.noMonetizationSection}>
          <Container>
            <div className={styles.noMonetizationContent}>
              <div className={styles.noMonetizationText}>
                <h2 className={styles.noMonetizationTitle}>
                  <span className={styles.noMonetizationIcon}>💰</span>
                  We Don&apos;t Monetize Your Students
                </h2>
                <p className={styles.noMonetizationDescription}>
                  Most platforms treat students as products—showing them ads, pushing
                  microtransactions, and selling their data. We took a different path.
                  Xogos runs on a simple, transparent subscription model. No ads. No
                  in-app purchases. No selling data. No tricks to keep kids glued to screens.
                </p>
                <p className={styles.noMonetizationDescription}>
                  <strong>Instead, we incentivize them to get off the screen.</strong> Our
                  active incentive programs reward students for volunteering in their
                  communities, staying physically active, and achieving academic goals
                  in the real world. The coins they earn can be used in their games or converted to actual
                  scholarships for their future education.
                </p>
              </div>
              <div className={styles.noMonetizationVisual}>
                <div className={styles.incentiveItem}>
                  <span className={styles.incentiveIcon}>🎮</span>
                  <span>Earn Coins by Playing Games</span>
                </div>
                <div className={styles.incentiveItem}>
                  <span className={styles.incentiveIcon}>📚</span>
                  <span>Earn Coins for Getting Good Grades</span>
                </div>
                <div className={styles.incentiveItem}>
                  <span className={styles.incentiveIcon}>🌳</span>
                  <span>Earn Coins for Doing Things Off-Screen</span>
                </div>
                <div className={styles.incentiveItem}>
                  <span className={styles.incentiveIcon}>🎓</span>
                  <span>Use Coins in Games or Convert to Scholarships</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Safety Features Detailed */}
        <section className={styles.featuresSection}>
          <Container>
            <div className={styles.featuresHeading}>
              <h2 className={styles.featuresTitle}>Our Six Pillars of Student Safety</h2>
              <p className={styles.featuresSubtitle}>
                Every feature was designed with one question in mind:
                &quot;How does this protect our students?&quot;
              </p>
            </div>
            <div className={styles.featuresGrid}>
              {safetyFeatures.map((feature) => (
                <div key={feature.id} className={styles.featureCard}>
                  <div className={styles.featureHeader}>
                    <div className={styles.featureIconWrapper}>
                      <span className={styles.featureIcon}>{feature.icon}</span>
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                  </div>
                  <p className={styles.featureDescription}>{feature.fullDescription}</p>
                  <ul className={styles.featureDetails}>
                    {feature.details.map((detail, index) => (
                      <li key={index} className={styles.featureDetail}>
                        <span className={styles.detailCheck}>✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <Container>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Give Your Student a Safe Place to Learn?</h2>
              <p className={styles.ctaText}>
                Join thousands of families who trust Xogos to provide a secure,
                educational gaming experience.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/games" className={styles.ctaBtn}>
                  Explore Our Games
                </Link>
                <Link href="/about" className={styles.ctaBtnSecondary}>
                  Learn More About Us
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </MarketingLayout>
  );
}
