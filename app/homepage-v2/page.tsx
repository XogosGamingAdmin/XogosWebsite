"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

export default function HomepageV2() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeQuest, setActiveQuest] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const quests = [
    {
      id: 1,
      title: "The Science Explorer",
      game: "Bug and Seek",
      description: "Discover 220 real-life insects and learn about ecosystems",
      rewards: ["500 Gold", "Explorer Badge", "Nature Scroll"],
      difficulty: "Beginner",
      image: "/images/games/BugandSeek.jpg",
      progress: 45,
    },
    {
      id: 2,
      title: "Kingdom of Numbers",
      game: "Totally Medieval",
      description: "Build your kingdom using mathematical strategies",
      rewards: ["750 Gold", "Math Master Badge", "Royal Decree"],
      difficulty: "Intermediate",
      image: "/images/games/TotallyMedieval.jpg",
      progress: 20,
    },
    {
      id: 3,
      title: "Path to Prosperity",
      game: "Debt-Free Millionaire",
      description: "Master financial literacy and achieve wealth",
      rewards: ["1000 Gold", "Tycoon Badge", "Golden Ledger"],
      difficulty: "Advanced",
      image: "/images/games/DebtFreeMil.jpg",
      progress: 0,
    },
    {
      id: 4,
      title: "Chronicles of History",
      game: "Battles and Thrones",
      description: "Lead armies and shape the course of history",
      rewards: ["850 Gold", "Strategist Badge", "War Banner"],
      difficulty: "Intermediate",
      image: "/images/games/BattleThrones.jpg",
      progress: 10,
    },
  ];

  const treasures = [
    { name: "Knowledge Gems", amount: 2500, icon: "💎", color: "#a855f7" },
    { name: "Gold Coins", amount: 15000, icon: "🪙", color: "#f59e0b" },
    { name: "XP Stars", amount: 8750, icon: "⭐", color: "#3b82f6" },
    { name: "Achievement Scrolls", amount: 12, icon: "📜", color: "#10b981" },
  ];

  const milestones = [
    { level: 1, title: "Novice Learner", unlocked: true, reward: "Starter Pack" },
    { level: 5, title: "Apprentice Scholar", unlocked: true, reward: "Bonus XP" },
    { level: 10, title: "Knowledge Seeker", unlocked: true, reward: "Rare Badge" },
    { level: 25, title: "Wisdom Keeper", unlocked: false, reward: "Scholarship Boost" },
    { level: 50, title: "Grand Master", unlocked: false, reward: "Legendary Rewards" },
  ];

  return (
    <MarketingLayout>
      <div className={styles.questPage}>
        {/* Progress Map */}
        <div className={styles.progressMap}>
          <div className={styles.progressPath} style={{ height: `${scrollProgress}%` }}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.mountains}></div>
            <div className={styles.clouds}></div>
            <div className={styles.stars}></div>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.questBanner}>
              <span className={styles.bannerIcon}>⚔️</span>
              <span>YOUR ADVENTURE AWAITS</span>
            </div>
            <h1 className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}>
              Embark on Your
              <span className={styles.highlight}> Learning Quest</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Journey through worlds of knowledge, complete epic quests,
              and earn legendary rewards for your education.
            </p>
            <div className={styles.heroActions}>
              <Link href="/games" className={styles.questBtn}>
                <span className={styles.btnIcon}>🗡️</span>
                Begin Your Quest
                <span className={styles.btnShine}></span>
              </Link>
              <Link href="/about" className={styles.mapBtn}>
                <span className={styles.btnIcon}>🗺️</span>
                View World Map
              </Link>
            </div>
          </div>
          <div className={styles.heroCharacter}>
            <div className={styles.characterGlow}></div>
            <div className={styles.characterFrame}>
              <Image
                src="/images/fullLogo.jpeg"
                alt="Hero Character"
                width={280}
                height={280}
                className={styles.characterImage}
              />
            </div>
            <div className={styles.characterLevel}>
              <span>LVL 12</span>
            </div>
          </div>
        </section>

        {/* Treasure Chest Section */}
        <section className={styles.treasureSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🏆</span>
            Your Treasure Chest
          </h2>
          <div className={styles.treasureGrid}>
            {treasures.map((treasure, index) => (
              <div
                key={index}
                className={styles.treasureCard}
                style={{ "--treasure-color": treasure.color } as React.CSSProperties}
              >
                <div className={styles.treasureIcon}>{treasure.icon}</div>
                <div className={styles.treasureAmount}>{treasure.amount.toLocaleString()}</div>
                <div className={styles.treasureName}>{treasure.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quest Board Section */}
        <section className={styles.questSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>📋</span>
            Quest Board
          </h2>
          <div className={styles.questBoard}>
            <div className={styles.questList}>
              {quests.map((quest, index) => (
                <div
                  key={quest.id}
                  className={`${styles.questCard} ${activeQuest === index ? styles.active : ""}`}
                  onClick={() => setActiveQuest(index)}
                >
                  <div className={styles.questImageWrapper}>
                    <Image
                      src={quest.image}
                      alt={quest.game}
                      fill
                      className={styles.questImage}
                    />
                    <div className={styles.questDifficulty}>{quest.difficulty}</div>
                  </div>
                  <div className={styles.questInfo}>
                    <h3 className={styles.questTitle}>{quest.title}</h3>
                    <p className={styles.questGame}>{quest.game}</p>
                    <p className={styles.questDesc}>{quest.description}</p>
                    <div className={styles.questProgress}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${quest.progress}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>{quest.progress}% Complete</span>
                    </div>
                    <div className={styles.questRewards}>
                      {quest.rewards.map((reward, i) => (
                        <span key={i} className={styles.rewardTag}>{reward}</span>
                      ))}
                    </div>
                    <Link href="/games" className={styles.acceptQuest}>
                      {quest.progress > 0 ? "Continue Quest" : "Accept Quest"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestone Path Section */}
        <section className={styles.milestoneSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🛤️</span>
            Your Journey Path
          </h2>
          <div className={styles.milestonePath}>
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`${styles.milestoneNode} ${milestone.unlocked ? styles.unlocked : styles.locked}`}
              >
                <div className={styles.milestoneMarker}>
                  {milestone.unlocked ? "✓" : milestone.level}
                </div>
                <div className={styles.milestoneInfo}>
                  <div className={styles.milestoneLevel}>Level {milestone.level}</div>
                  <div className={styles.milestoneTitle}>{milestone.title}</div>
                  <div className={styles.milestoneReward}>
                    <span className={styles.rewardIcon}>🎁</span>
                    {milestone.reward}
                  </div>
                </div>
                {index < milestones.length - 1 && (
                  <div className={`${styles.pathLine} ${milestone.unlocked ? styles.active : ""}`}></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaScroll}>
            <div className={styles.scrollTop}></div>
            <div className={styles.scrollContent}>
              <h2 className={styles.ctaTitle}>Ready for Adventure?</h2>
              <p className={styles.ctaText}>
                Join thousands of heroes on their quest for knowledge and rewards.
                Your legend begins today.
              </p>
              <Link href="/games" className={styles.ctaBtn}>
                <span>🏰</span>
                Enter the Kingdom
              </Link>
            </div>
            <div className={styles.scrollBottom}></div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
