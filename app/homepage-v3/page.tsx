"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

export default function HomepageV3() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");
  const [countdown, setCountdown] = useState({ days: 12, hours: 8, mins: 45, secs: 30 });

  useEffect(() => {
    setIsLoaded(true);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; mins = 0; secs = 0; }
        return { days, hours, mins, secs };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const leaderboard = [
    { rank: 1, name: "AceMaster", score: 28500, avatar: "🥇", change: "up" },
    { rank: 2, name: "BrainStorm", score: 26200, avatar: "🥈", change: "up" },
    { rank: 3, name: "QuizKing", score: 24800, avatar: "🥉", change: "down" },
    { rank: 4, name: "LearnPro", score: 23100, avatar: "4", change: "up" },
    { rank: 5, name: "StudyChamp", score: 21900, avatar: "5", change: "same" },
  ];

  const featuredGames = [
    {
      title: "Bug and Seek",
      category: "Science",
      players: "2.3K",
      rating: 4.8,
      image: "/images/games/BugandSeek.jpg",
      status: "live",
    },
    {
      title: "Totally Medieval",
      category: "Mathematics",
      players: "1.8K",
      rating: 4.9,
      image: "/images/games/TotallyMedieval.jpg",
      status: "popular",
    },
    {
      title: "Debt-Free Millionaire",
      category: "Finance",
      players: "3.1K",
      rating: 4.7,
      image: "/images/games/DebtFreeMil.jpg",
      status: "new",
    },
    {
      title: "Battles and Thrones",
      category: "History",
      players: "2.7K",
      rating: 4.6,
      image: "/images/games/BattleThrones.jpg",
      status: "live",
    },
  ];

  const tournaments = [
    {
      name: "Science Championship",
      prize: "$500",
      participants: 128,
      game: "Bug and Seek",
      startDate: "Jan 28",
    },
    {
      name: "Math Masters League",
      prize: "$750",
      participants: 256,
      game: "Totally Medieval",
      startDate: "Feb 5",
    },
    {
      name: "Financial Futures Cup",
      prize: "$1000",
      participants: 64,
      game: "Debt-Free Millionaire",
      startDate: "Feb 12",
    },
  ];

  const stats = [
    { label: "Active Players", value: "50K+", icon: "👥" },
    { label: "Games Played", value: "2M+", icon: "🎮" },
    { label: "Scholarships", value: "$100K", icon: "🎓" },
    { label: "Schools", value: "500+", icon: "🏫" },
  ];

  return (
    <MarketingLayout>
      <div className={styles.esportsPage}>
        {/* Background Effects */}
        <div className={styles.backgroundEffects}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gridOverlay}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.liveBadge}>
              <span className={styles.liveIndicator}></span>
              LIVE NOW
            </div>
            <h1 className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}>
              Where Learning
              <span className={styles.gradientText}> Meets Competition</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Join the ultimate educational esports platform. Compete, learn, and earn real rewards
              in tournaments designed for the next generation of scholars.
            </p>
            <div className={styles.heroCta}>
              <Link href="/games" className={styles.primaryBtn}>
                Join the Arena
                <span className={styles.btnArrow}>→</span>
              </Link>
              <Link href="/about" className={styles.secondaryBtn}>
                Watch Trailer
                <span className={styles.playIcon}>▶</span>
              </Link>
            </div>
            <div className={styles.heroStats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.heroStat}>
                  <span className={styles.statIcon}>{stat.icon}</span>
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageWrapper}>
              <div className={styles.imageGlow}></div>
              <Image
                src="/images/fullLogo.jpeg"
                alt="Xogos Gaming"
                width={400}
                height={400}
                className={styles.heroImage}
              />
            </div>
            <div className={styles.floatingBadge}>
              <span className={styles.badgeIcon}>🏆</span>
              <span>$100K+ in Scholarships</span>
            </div>
          </div>
        </section>

        {/* Tournament Banner */}
        <section className={styles.tournamentBanner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerInfo}>
              <span className={styles.bannerLabel}>NEXT MAJOR EVENT</span>
              <h3 className={styles.bannerTitle}>Spring Championship 2025</h3>
              <p className={styles.bannerPrize}>$5,000 Prize Pool</p>
            </div>
            <div className={styles.countdown}>
              <div className={styles.countdownItem}>
                <span className={styles.countdownValue}>{countdown.days}</span>
                <span className={styles.countdownLabel}>Days</span>
              </div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownValue}>{countdown.hours}</span>
                <span className={styles.countdownLabel}>Hours</span>
              </div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownValue}>{countdown.mins}</span>
                <span className={styles.countdownLabel}>Mins</span>
              </div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownValue}>{countdown.secs}</span>
                <span className={styles.countdownLabel}>Secs</span>
              </div>
            </div>
            <Link href="/games" className={styles.bannerBtn}>
              Register Now
            </Link>
          </div>
        </section>

        {/* Featured Games Section */}
        <section className={styles.gamesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Games</h2>
            <div className={styles.tabNav}>
              <button
                className={`${styles.tabBtn} ${activeTab === "trending" ? styles.active : ""}`}
                onClick={() => setActiveTab("trending")}
              >
                Trending
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === "new" ? styles.active : ""}`}
                onClick={() => setActiveTab("new")}
              >
                New
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === "popular" ? styles.active : ""}`}
                onClick={() => setActiveTab("popular")}
              >
                Popular
              </button>
            </div>
          </div>
          <div className={styles.gamesGrid}>
            {featuredGames.map((game, index) => (
              <div key={index} className={styles.gameCard}>
                <div className={styles.gameImageWrapper}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className={styles.gameImage}
                  />
                  <div className={styles.gameStatus} data-status={game.status}>
                    {game.status === "live" && <span className={styles.liveIndicator}></span>}
                    {game.status.toUpperCase()}
                  </div>
                </div>
                <div className={styles.gameContent}>
                  <span className={styles.gameCategory}>{game.category}</span>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.gameMeta}>
                    <span className={styles.gamePlayers}>👥 {game.players} playing</span>
                    <span className={styles.gameRating}>⭐ {game.rating}</span>
                  </div>
                  <Link href="/games" className={styles.playBtn}>
                    Play Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard & Tournaments Section */}
        <section className={styles.competitionSection}>
          <div className={styles.leaderboardCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>🏆 Global Leaderboard</h3>
              <Link href="/games" className={styles.viewAllLink}>View All</Link>
            </div>
            <div className={styles.leaderboardList}>
              {leaderboard.map((player) => (
                <div key={player.rank} className={styles.leaderboardItem}>
                  <div className={styles.playerRank}>
                    {player.rank <= 3 ? player.avatar : `#${player.rank}`}
                  </div>
                  <div className={styles.playerInfo}>
                    <span className={styles.playerName}>{player.name}</span>
                    <span className={styles.playerScore}>{player.score.toLocaleString()} pts</span>
                  </div>
                  <div className={`${styles.rankChange} ${styles[player.change]}`}>
                    {player.change === "up" && "↑"}
                    {player.change === "down" && "↓"}
                    {player.change === "same" && "−"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tournamentsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>🎯 Upcoming Tournaments</h3>
              <Link href="/games" className={styles.viewAllLink}>View All</Link>
            </div>
            <div className={styles.tournamentsList}>
              {tournaments.map((tournament, index) => (
                <div key={index} className={styles.tournamentItem}>
                  <div className={styles.tournamentInfo}>
                    <h4 className={styles.tournamentName}>{tournament.name}</h4>
                    <span className={styles.tournamentGame}>{tournament.game}</span>
                  </div>
                  <div className={styles.tournamentMeta}>
                    <span className={styles.tournamentPrize}>{tournament.prize}</span>
                    <span className={styles.tournamentDate}>{tournament.startDate}</span>
                  </div>
                  <button className={styles.joinBtn}>Join</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Compete?</h2>
              <p className={styles.ctaText}>
                Join thousands of students competing for scholarships, prizes, and academic glory.
                Your journey to the top starts here.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/games" className={styles.ctaPrimaryBtn}>
                  Create Account
                </Link>
                <Link href="/about" className={styles.ctaSecondaryBtn}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className={styles.ctaVisual}>
              <div className={styles.ctaIcons}>
                <span className={styles.floatingIcon} style={{ "--delay": "0s" } as React.CSSProperties}>🎮</span>
                <span className={styles.floatingIcon} style={{ "--delay": "0.5s" } as React.CSSProperties}>🏆</span>
                <span className={styles.floatingIcon} style={{ "--delay": "1s" } as React.CSSProperties}>🎓</span>
                <span className={styles.floatingIcon} style={{ "--delay": "1.5s" } as React.CSSProperties}>💰</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
