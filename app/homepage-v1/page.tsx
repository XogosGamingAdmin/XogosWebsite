"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

// Stat Card component with animated counter
function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const duration = 2000;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return (
    <div className={styles.statCard} ref={ref}>
      <div className={styles.statValue}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statGlow}></div>
    </div>
  );
}

export default function HomepageV1() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeGame, setActiveGame] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    { value: 10000, suffix: "+", label: "Players Learning" },
    { value: 50, suffix: "+", label: "Educational Games" },
    { value: 1000000, suffix: "", label: "Coins Earned" },
    { value: 98, suffix: "%", label: "Fun Rating" },
  ];

  const games = [
    {
      title: "Bug and Seek",
      subject: "Science",
      xp: 500,
      level: "Beginner",
      image: "/images/games/BugandSeek.jpg",
      color: "#00ff88",
    },
    {
      title: "Totally Medieval",
      subject: "Mathematics",
      xp: 750,
      level: "Intermediate",
      image: "/images/games/TotallyMedieval.jpg",
      color: "#ff00ff",
    },
    {
      title: "Debt-Free Millionaire",
      subject: "Financial Literacy",
      xp: 1000,
      level: "Advanced",
      image: "/images/games/DebtFreeMil.jpg",
      color: "#00ffff",
    },
    {
      title: "Battles and Thrones",
      subject: "History",
      xp: 850,
      level: "Intermediate",
      image: "/images/games/BattleThrones.jpg",
      color: "#ffff00",
    },
  ];

  const achievements = [
    { name: "First Login", icon: "🎮", unlocked: true },
    { name: "Quiz Master", icon: "🧠", unlocked: true },
    { name: "Speed Learner", icon: "⚡", unlocked: true },
    { name: "Coin Collector", icon: "🪙", unlocked: false },
    { name: "Perfect Score", icon: "🏆", unlocked: false },
    { name: "Study Streak", icon: "🔥", unlocked: false },
  ];

  return (
    <MarketingLayout>
      <div className={styles.arcadePage}>
        {/* Animated Background */}
        <div className={styles.gridBackground}>
          <div className={styles.gridLines}></div>
          <div className={styles.glowOrbs}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.levelBadge}>
              <span className={styles.levelIcon}>⭐</span>
              <span>LEVEL UP YOUR EDUCATION</span>
            </div>
            <h1 className={`${styles.heroTitle} ${isLoaded ? styles.glitch : ""}`}>
              <span className={styles.neonText}>PLAY.</span>
              <span className={styles.neonTextAlt}>LEARN.</span>
              <span className={styles.neonTextAccent}>EARN.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Enter the arcade where education meets gaming. Unlock achievements,
              earn real rewards, and level up your future.
            </p>
            <div className={styles.heroActions}>
              <Link href="/games" className={styles.primaryBtn}>
                <span className={styles.btnIcon}>🎮</span>
                INSERT COIN
              </Link>
              <Link href="/about" className={styles.secondaryBtn}>
                <span className={styles.btnIcon}>📖</span>
                HOW TO PLAY
              </Link>
            </div>
            <div className={styles.xpBar}>
              <div className={styles.xpFill} style={{ width: "65%" }}></div>
              <span className={styles.xpText}>6,500 / 10,000 XP to Next Level</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.arcadeMachine}>
              <div className={styles.screenGlow}></div>
              <Image
                src="/images/XogosLogo.png"
                alt="Xogos Gaming"
                width={300}
                height={300}
                className={styles.logoImage}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </section>

        {/* Game Select Section */}
        <section className={styles.gameSelectSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🕹️</span>
            SELECT YOUR GAME
          </h2>
          <div className={styles.gameCarousel}>
            {games.map((game, index) => (
              <div
                key={index}
                className={`${styles.gameCard} ${activeGame === index ? styles.active : ""}`}
                onClick={() => setActiveGame(index)}
                style={{ "--glow-color": game.color } as React.CSSProperties}
              >
                <div className={styles.gameImageWrapper}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className={styles.gameImage}
                  />
                  <div className={styles.gameOverlay}>
                    <span className={styles.playIcon}>▶</span>
                  </div>
                </div>
                <div className={styles.gameInfo}>
                  <div className={styles.gameSubject}>{game.subject}</div>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.gameStats}>
                    <span className={styles.xpReward}>+{game.xp} XP</span>
                    <span className={styles.gameLevel}>{game.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className={styles.achievementsSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🏆</span>
            ACHIEVEMENTS
          </h2>
          <div className={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
              >
                <div className={styles.achievementIcon}>{achievement.icon}</div>
                <div className={styles.achievementName}>{achievement.name}</div>
                {!achievement.unlocked && <div className={styles.lockIcon}>🔒</div>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>READY PLAYER ONE?</h2>
            <p className={styles.ctaText}>
              Join thousands of students already leveling up their education
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/games" className={styles.ctaBtn}>
                START PLAYING NOW
              </Link>
            </div>
            <div className={styles.highScore}>
              <span>🏅 HIGH SCORE TODAY: 15,750 XP</span>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
