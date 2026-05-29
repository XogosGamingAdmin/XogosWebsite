"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GameHeader } from "@/components/Marketing/GameHeader";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

export default function PanicAttackPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const gameFeatures = [
    {
      icon: "🧠",
      title: "Stress Management",
      description:
        "Learn proven techniques to manage stress and anxiety through interactive scenarios and breathing exercises.",
    },
    {
      icon: "💚",
      title: "Emotional Intelligence",
      description:
        "Develop emotional awareness and regulation skills through guided experiences and self-reflection activities.",
    },
    {
      icon: "🛡️",
      title: "Coping Strategies",
      description:
        "Build a personalized toolkit of healthy coping mechanisms for dealing with overwhelming emotions.",
    },
    {
      icon: "🌱",
      title: "Mindfulness Training",
      description:
        "Practice mindfulness and grounding techniques that can be applied in real-life stressful situations.",
    },
    {
      icon: "📚",
      title: "Educational Content",
      description:
        "Understand the science behind stress, anxiety, and emotional regulation in an age-appropriate way.",
    },
    {
      icon: "🎯",
      title: "Progress Tracking",
      description:
        "Monitor your emotional growth and celebrate milestones in your mental wellness journey.",
    },
  ];

  const gameplayMechanics = [
    {
      title: "Interactive Scenarios",
      description:
        "Navigate through common stressful situations like test anxiety, social pressure, and family conflicts.",
      image: "/images/games/mechanics/scenarios.jpg",
    },
    {
      title: "Breathing Exercises",
      description:
        "Practice guided breathing techniques with visual and audio cues to help calm your mind and body.",
      image: "/images/games/mechanics/breathing.jpg",
    },
    {
      title: "Emotion Mapping",
      description:
        "Identify and track your emotions throughout different situations to build self-awareness.",
      image: "/images/games/mechanics/emotions.jpg",
    },
    {
      title: "Coping Toolkit",
      description:
        "Collect and customize healthy coping strategies that work best for your personality and situations.",
      image: "/images/games/mechanics/toolkit.jpg",
    },
  ];

  const learningObjectives = [
    "Recognize early signs of stress and anxiety",
    "Apply effective breathing and relaxation techniques",
    "Develop healthy emotional regulation strategies",
    "Build resilience for handling challenging situations",
    "Create a personal mental wellness action plan",
    "Practice mindfulness and grounding exercises",
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "gameplay", label: "How to Play" },
    { id: "learning", label: "Learning Goals" },
    { id: "safety", label: "Safety & Support" },
  ];

  return (
    <>
      <GameHeader
        gameTitle="Panic Attack!!"
        gameSubject="Mental Health & Wellness"
        themeColor="#f59e0b"
      />

      <div className={styles.panicAttackPage}>
        {/* Background elements */}
        <div className={styles.pageBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.bgGlow1}></div>
          <div className={styles.bgGlow2}></div>
          <div className={styles.calming}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <Container>
            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <div className={styles.heroImageContainer}>
                  <Image
                    src="/images/games/PanicAttack.jpg"
                    alt="Panic Attack Game"
                    width={500}
                    height={300}
                    className={styles.heroImage}
                  />
                  <div className={styles.heroImageOverlay}>
                    <div className={styles.gameStatus}>Available in Beta</div>
                  </div>
                </div>
              </div>
              <div className={styles.heroRight}>
                <h1
                  className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
                >
                  Learn to Navigate Life's{" "}
                  <span className={styles.highlightText}>Challenges</span>
                </h1>
                <p
                  className={`${styles.heroDescription} ${isLoaded ? styles.visible : ""}`}
                >
                  An innovative educational game that teaches stress management
                  and mental health awareness. Navigate through real-life
                  challenges while learning coping strategies, emotional
                  intelligence, and healthy habits in a safe, supportive
                  environment.
                </p>
                <div
                  className={`${styles.heroActions} ${isLoaded ? styles.visible : ""}`}
                >
                  <Link href="https://www.xogosgaming.com" className={styles.primaryButton}>
                    Start Playing
                  </Link>
                  <Link href="#safety" className={styles.secondaryButton}>
                    Safety Information
                  </Link>
                </div>
                <div className={styles.ageRating}>
                  <span className={styles.ratingBadge}>Ages 13+</span>
                  <span className={styles.ratingText}>
                    With parental guidance recommended
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Navigation Tabs */}
        <section className={styles.tabSection}>
          <Container>
            <div className={styles.tabContainer}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* Tab Content */}
        <section className={styles.contentSection}>
          <Container>
            {activeTab === "overview" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeading}>
                  <h2 className={styles.sectionTitle}>Game Features</h2>
                  <p className={styles.sectionSubtitle}>
                    Discover the tools and techniques that make Panic Attack!!
                    an effective learning experience
                  </p>
                </div>

                <div className={styles.featuresGrid}>
                  {gameFeatures.map((feature, index) => (
                    <div key={index} className={styles.featureCard}>
                      <div className={styles.featureIcon}>{feature.icon}</div>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      <p className={styles.featureDescription}>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "gameplay" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeading}>
                  <h2 className={styles.sectionTitle}>How to Play</h2>
                  <p className={styles.sectionSubtitle}>
                    Explore interactive mechanics designed to teach real-world
                    emotional regulation skills
                  </p>
                </div>

                <div className={styles.gameplayGrid}>
                  {gameplayMechanics.map((mechanic, index) => (
                    <div key={index} className={styles.gameplayCard}>
                      <div className={styles.gameplayImageContainer}>
                        <div className={styles.gameplayImagePlaceholder}>
                          <span className={styles.placeholderText}>
                            {mechanic.title}
                          </span>
                        </div>
                      </div>
                      <div className={styles.gameplayContent}>
                        <h3 className={styles.gameplayTitle}>
                          {mechanic.title}
                        </h3>
                        <p className={styles.gameplayDescription}>
                          {mechanic.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "learning" && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeading}>
                  <h2 className={styles.sectionTitle}>Learning Objectives</h2>
                  <p className={styles.sectionSubtitle}>
                    Educational goals and skills students will develop through
                    gameplay
                  </p>
                </div>

                <div className={styles.learningContent}>
                  <div className={styles.objectivesList}>
                    <h3 className={styles.objectivesTitle}>
                      By the end of this experience, students will be able to:
                    </h3>
                    <ul className={styles.objectivesGrid}>
                      {learningObjectives.map((objective, index) => (
                        <li key={index} className={styles.objectiveItem}>
                          <span className={styles.objectiveIcon}>✓</span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.curriculumInfo}>
                    <h3 className={styles.curriculumTitle}>
                      Curriculum Alignment
                    </h3>
                    <div className={styles.curriculumCards}>
                      <div className={styles.curriculumCard}>
                        <h4>Social-Emotional Learning (SEL)</h4>
                        <p>
                          Self-awareness, self-management, and responsible
                          decision-making competencies
                        </p>
                      </div>
                      <div className={styles.curriculumCard}>
                        <h4>Health Education Standards</h4>
                        <p>
                          Mental and emotional health, stress management, and
                          coping strategies
                        </p>
                      </div>
                      <div className={styles.curriculumCard}>
                        <h4>Life Skills Development</h4>
                        <p>
                          Problem-solving, critical thinking, and emotional
                          regulation techniques
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "safety" && (
              <div className={styles.tabContent} id="safety">
                <div className={styles.sectionHeading}>
                  <h2 className={styles.sectionTitle}>Safety & Support</h2>
                  <p className={styles.sectionSubtitle}>
                    Your mental health and safety are our top priorities
                  </p>
                </div>

                <div className={styles.safetyContent}>
                  <div className={styles.safetyNotice}>
                    <div className={styles.noticeIcon}>🛡️</div>
                    <div className={styles.noticeContent}>
                      <h3>Important Safety Information</h3>
                      <p>
                        Panic Attack!! is designed as an educational tool to
                        support mental wellness learning. It is not intended to
                        replace professional mental health care or therapy. If
                        you or someone you know is experiencing a mental health
                        crisis, please seek help immediately.
                      </p>
                    </div>
                  </div>

                  <div className={styles.resourcesGrid}>
                    <div className={styles.resourceCard}>
                      <h4>Crisis Support</h4>
                      <p>
                        If you're in immediate danger or having thoughts of
                        self-harm:
                      </p>
                      <ul>
                        <li>Call 988 (Suicide & Crisis Lifeline)</li>
                        <li>Text "HELLO" to 741741 (Crisis Text Line)</li>
                        <li>Call 911 or go to your nearest emergency room</li>
                      </ul>
                    </div>

                    <div className={styles.resourceCard}>
                      <h4>Additional Resources</h4>
                      <p>For ongoing mental health support:</p>
                      <ul>
                        <li>National Alliance on Mental Illness (NAMI)</li>
                        <li>Anxiety and Depression Association</li>
                        <li>Teen Mental Health First Aid</li>
                        <li>JED Campus Mental Health Resources</li>
                      </ul>
                    </div>

                    <div className={styles.resourceCard}>
                      <h4>For Parents & Educators</h4>
                      <p>Supporting students who use this game:</p>
                      <ul>
                        <li>Review content with students</li>
                        <li>Encourage open conversations</li>
                        <li>Monitor for concerning behaviors</li>
                        <li>Connect with school counselors when needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <Container>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Ready to Build Emotional Resilience?
              </h2>
              <p className={styles.ctaDescription}>
                Join students who are learning valuable life skills through
                engaging, evidence-based gameplay. Start your journey toward
                better mental wellness today.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="https://www.xogosgaming.com" className={styles.primaryButton}>
                  Start Your Journey
                </Link>
                <Link href="/games" className={styles.secondaryButton}>
                  Explore Other Games
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
