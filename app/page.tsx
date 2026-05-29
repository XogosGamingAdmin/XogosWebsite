"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

// Stat Card component with animated counter
function StatCard({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
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
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statGlow}></div>
    </div>
  );
}

// SVG Icons for features
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

// Game type definition
interface Game {
  id: string;
  title: string;
  subject: string;
  level: string;
  description: string;
  logo: string;
  color: string;
  tutorialLink: string | null;
  videoId?: string;
}

// All games data
const allGames: Game[] = [
  {
    id: "bug-and-seek",
    title: "Bug and Seek",
    subject: "Science",
    level: "Beginner",
    description:
      "A nature-based exploration game where students become the new owners of a broken-down insectarium. Players explore real-world ecosystems to catch up to 220 real-life bugs, each with fun facts and humor built into every codex entry. The game teaches entomology, biology, ecology, and environmental science.",
    logo: "/images/games/new_bugandseek.png",
    color: "#4ade80",
    tutorialLink: null,
    videoId: "edXjP7znaI4",
  },
  {
    id: "debt-free-millionaire",
    title: "Debt-Free Millionaire",
    subject: "Financial Literacy",
    level: "Advanced",
    description:
      "A personal finance and career simulation that teaches financial literacy through practical scenarios. Players explore career paths, learn about budgeting, debt management, and wealth-building, earning iPlay coins as their in-game avatar reaches different savings milestones.",
    logo: "/images/games/DebtFreeMillionaire_logo.jpg",
    color: "#e6bb84",
    tutorialLink: null,
  },
  {
    id: "digital-frontier",
    title: "Digital Frontier",
    subject: "STEM",
    level: "Intermediate",
    description:
      "A story-driven STEM adventure game where players step into a neon digital world as User, a self-aware program fighting to escape a controlled system. Through fast-paced racing, circuit repair, tank battles, structural puzzles, energy rerouting, and coding challenges, players learn real physics, engineering, and computer science concepts. The game spans 11 connected levels, each introducing new mechanics and STEM ideas.",
    logo: "/images/games/new_digial_frontier.png",
    color: "#00d4ff",
    tutorialLink: null,
    videoId: "Ep3ZhAFmLp8",
  },
  {
    id: "exploration-library",
    title: "Exploration Library",
    subject: "Literature",
    level: "Beginner-Advanced",
    description:
      "A revolutionary approach to classic literature that transforms passive reading into active discovery. Experience Treasure Island, Swiss Family Robinson, and Pride and Prejudice through multiple character perspectives. Students can access modern retellings or original Victorian prose, with text-to-speech and vocabulary help. Each chapter offers four unique perspectives written in different narrative styles.",
    logo: "/images/games/ExplorationLibrary_logo.png",
    color: "#a855f7",
    tutorialLink: null,
    videoId: "V9vLVN-oiec",
  },
  {
    id: "historical-conquest",
    title: "Historical Conquest",
    subject: "History",
    level: "Intermediate",
    description:
      "A strategic history-based card game that resembles Pokémon in appearance and Risk in gameplay mechanics. All cards are based on historical figures, events, and places. Players earn iPlay coins for time spent in the game and can purchase additional decks using their earned coins.",
    logo: "/images/games/new_historical-conquest.png",
    color: "#e62739",
    tutorialLink: null,
  },
  {
    id: "hunt-the-past",
    title: "Hunt the Past",
    subject: "History",
    level: "Beginner-Advanced",
    description:
      "The cutting-edge online encyclopedia where students don't just look up people, places, and events—they talk to them. Thanks to built-in AI, students can ask questions, receive narrative responses from virtual historical figures, explore linked sources, and dive into compelling stories tied to each topic. Makes history conversational and exploratory.",
    logo: "/images/games/new_huntthepast.png",
    color: "#f59e0b",
    tutorialLink: null,
    videoId: "898Gw-sQVC0",
  },
  {
    id: "lightning-round",
    title: "Lightning Round",
    subject: "History",
    level: "Intermediate",
    description:
      "A fast-paced quiz game that tests and improves historical knowledge through quick-fire questions, timed challenges, and competitive multiplayer modes. Perfect for classroom use or independent learning with engaging rapid-fire gameplay.",
    logo: "/images/games/new_lightning_round.png",
    color: "#fbbf24",
    tutorialLink: null,
    videoId: "7lPyLazH2Jw",
  },
  {
    id: "monster-math",
    title: "Monster Math",
    subject: "Mathematics",
    level: "Beginner-Intermediate",
    description:
      "A thrilling test of brains and reflexes where learning meets survival. Play as the fearless Green Monster, racing to devour correct numbers while avoiding the hungry Red Monster. Every level ramps up with tougher math problems—multiples, factors, primes, and equations. Reaching Level 10 earns 1 iPlay coin toward scholarships!",
    logo: "/images/games/MonsterMath_logo.png",
    color: "#22c55e",
    tutorialLink: null,
    videoId: "RF0Gyyni6jE",
  },
  {
    id: "totally-medieval",
    title: "Totally Medieval",
    subject: "Mathematics",
    level: "Intermediate",
    description:
      "Build your medieval kingdom while mastering math skills through strategic resource management and castle building. Players solve increasingly complex math problems to acquire resources, build structures, and defend their kingdoms from rivals.",
    logo: "/images/games/new_totally-medieval.png",
    color: "#7928ca",
    tutorialLink: null,
    videoId: "JPCvcnIoRUs",
  },
];

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [screenImage, setScreenImage] = useState("/images/XogosLogo.png");
  const [totalMembers, setTotalMembers] = useState(0);
  const [playersLearning, setPlayersLearning] = useState(0);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    setIsLoaded(true);

    // Randomly select 4 games to display
    const shuffled = shuffleArray(allGames);
    setDisplayedGames(shuffled.slice(0, 4));

    // Fetch member stats from API
    async function fetchMemberStats() {
      try {
        const response = await fetch("/api/public-stats");
        const data = await response.json();
        if (data.totalMembers) {
          setTotalMembers(data.totalMembers);
        }
        if (data.playersLearning) {
          setPlayersLearning(data.playersLearning);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchMemberStats();
  }, []);

  const stats = [
    { value: playersLearning, suffix: "", label: "Players Learning" },
    { value: 13, suffix: "", label: "Educational Games" },
    { value: 15, suffix: "", label: "Free Online Classes" },
    { value: 98, suffix: "%", label: "Fun Rating" },
  ];

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

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

  return (
    <MarketingLayout>
      <PageTracker pagePath="/" pageName="Homepage" />
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
            <h1
              className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}
            >
              <span className={styles.heroPlay}>PLAY.</span>
              <span className={styles.heroLearn}>LEARN.</span>
              <span className={styles.heroEarn}>EARN.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Xogos combines engaging gameplay with meaningful education,
              allowing students to earn rewards that convert into real
              scholarship opportunities.
            </p>
            <div className={styles.heroActions}>
              <Link href="/games" className={styles.primaryBtn}>
                <span className={styles.btnIcon}>🎮</span>
                Check Out Games
              </Link>
              <Link href="/about" className={styles.secondaryBtn}>
                <span className={styles.btnIcon}>📖</span>
                HOW TO PLAY
              </Link>
            </div>
            <div className={styles.xpBar}>
              <div className={styles.xpFill} style={{ width: "65%" }}></div>
              <span className={styles.xpText}>
                6,500 / 10,000 XP to Next Level
              </span>
            </div>
          </div>

          {/* Game Boy Visual */}
          <div
            className={`${styles.heroVisual} ${isLoaded ? styles.visible : ""}`}
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
                            src={screenImage}
                            alt="Game Screen"
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
                    <div
                      className={styles.actionButton}
                      onClick={() =>
                        setScreenImage("/images/games/TotallyMedieval.jpg")
                      }
                    >
                      <span>A</span>
                    </div>
                    <div
                      className={styles.actionButton}
                      onClick={() =>
                        setScreenImage("/images/games/DebtFreeMil.jpg")
                      }
                    >
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
          <p className={styles.statsSubline}>
            Welcome Back Players. Welcome to our New Relaunch. Welcome to an Amazing Platform
          </p>
        </section>

        {/* Play + Learn = Earn Intro Section */}
        <section className={styles.playLearnEarnIntro}>
          <div className={styles.pleIntroContent}>
            <h2 className={styles.pleIntroTitle}>
              <span className={styles.heroPlay}>PLAY</span>
              <span className={styles.plePlus}>+</span>
              <span className={styles.heroLearn}>LEARN</span>
              <span className={styles.pleEquals}>=</span>
              <span className={styles.heroEarn}>EARN</span>
            </h2>
            <div className={styles.pleColumns}>
              <div className={styles.pleColumn}>
                <p className={styles.pleDescription}>
                  Imagine a platform where kids can be kids, be safe, and have fun online with friends and family, while they play games and learn.
                </p>
              </div>
              <div className={styles.pleColumn}>
                <p className={styles.pleDescription}>
                  Imagine a platform where students have access to dozens of elective classes where they can learn what they want, especially those that prepare them for the future.
                </p>
              </div>
              <div className={styles.pleColumn}>
                <p className={styles.pleDescription}>
                  Imagine a place where students could earn scholarships through their own merit on and off the screen, for universities and trade schools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Game Select Section - Now above Active Incentives */}
        <section className={styles.gameSelectSection}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionKeywordLarge} ${styles.heroPlay}`}>PLAY</span>
            <div className={`${styles.sectionUnderline} ${styles.sectionUnderlinePlay}`}></div>
          </div>
          <div className={styles.gameSelectContent}>
            <div className={styles.gameSelectText}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>🕹️</span>
                SELECT YOUR GAME
              </h2>
              <p className={styles.gameSelectDescription}>
                In our platform students can explore our collection of educational games designed to make learning fun and rewarding. Each game teaches valuable skills while letting students earn coins toward further gameplay and/or scholarships.
              </p>
              <Link href="/games" className={styles.learnMoreBtn}>
                View All Games →
              </Link>
            </div>
            <div className={styles.gameSelectGrid}>
              {displayedGames.map((game, index) => (
                <div
                  key={game.id}
                  className={`${styles.gameCard} ${activeGameIndex === index ? styles.active : ""}`}
                  onClick={() => handleGameClick(game)}
                  style={{ "--glow-color": game.color } as React.CSSProperties}
                >
                  <div className={styles.gameImageWrapper}>
                    <Image
                      src={game.logo}
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
                      <span className={styles.levelBadgeSmall}>{game.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Learn From Playing Games Section */}
        <section className={styles.learnFromGamesSection}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionKeywordLarge} ${styles.heroLearn}`}>LEARN</span>
            <div className={`${styles.sectionUnderline} ${styles.sectionUnderlineLearn}`}></div>
          </div>
          <div className={styles.learnFromGamesContent}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🎯</span>
              LEARN FROM PLAYING GAMES
            </h2>
            <p className={styles.learnFromGamesDescription}>
              We believe in games that are <strong>70% fun</strong> and only <strong>30% educational</strong>.
              Why? Because the more students enjoy playing, the more they&apos;ll keep coming back.
              And every time they play, they learn a little bit more. It&apos;s not about cramming
              education down their throats—it&apos;s about making learning so enjoyable that they
              don&apos;t even realize they&apos;re doing it.
            </p>
            <div className={styles.learnFromGamesStats}>
              <div className={styles.learnFromGamesStat}>
                <span className={styles.statPercent}>70%</span>
                <span className={styles.statDesc}>Pure Fun</span>
              </div>
              <div className={styles.learnFromGamesPlus}>+</div>
              <div className={styles.learnFromGamesStat}>
                <span className={styles.statPercent}>30%</span>
                <span className={styles.statDesc}>Education</span>
              </div>
              <div className={styles.learnFromGamesEquals}>=</div>
              <div className={styles.learnFromGamesStat}>
                <span className={styles.statPercent}>100%</span>
                <span className={styles.statDesc}>Engagement</span>
              </div>
            </div>
          </div>
        </section>

        {/* Free Elective Classes Section - Images left, text right */}
        <section className={styles.electiveClassesSection}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionKeywordLarge} ${styles.heroLearn}`}>LEARN</span>
            <div className={`${styles.sectionUnderline} ${styles.sectionUnderlineLearn}`}></div>
          </div>
          <div className={styles.electiveContent}>
            <div className={styles.electiveGrid}>
              <Link href="/classes" className={styles.electiveCard}>
                <Image
                  src="/images/programs/survival_academy.png"
                  alt="Survival Academy"
                  width={150}
                  height={150}
                  className={styles.electiveLogo}
                />
                <span className={styles.electiveLabel}>Survival Academy</span>
              </Link>
              <Link href="/classes" className={styles.electiveCard}>
                <Image
                  src="/images/programs/debt_free_millionaire_investor.png"
                  alt="Debt Free Millionaire Investor"
                  width={150}
                  height={150}
                  className={styles.electiveLogo}
                />
                <span className={styles.electiveLabel}>DFM Investor</span>
              </Link>
              <Link href="/classes" className={styles.electiveCard}>
                <Image
                  src="/images/programs/starfall_academy.png"
                  alt="StarFall Academy"
                  width={150}
                  height={150}
                  className={styles.electiveLogo}
                />
                <span className={styles.electiveLabel}>StarFall Academy</span>
              </Link>
              <Link href="/classes" className={styles.electiveCard}>
                <Image
                  src="/images/programs/kitchenlab_academy.png"
                  alt="KitchenLab Academy"
                  width={150}
                  height={150}
                  className={styles.electiveLogo}
                />
                <span className={styles.electiveLabel}>KitchenLab Academy</span>
              </Link>
            </div>
            <div className={styles.electiveText}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>📚</span>
                FREE ELECTIVE CLASSES
              </h2>
              <p className={styles.electiveDescription}>
                With a Xogos subscription, students gain access to dozens of online, and yet still hands-on, elective classes that teach real-world skills—from cooking and astronomy to wilderness survival and personal finance. These aren&apos;t screen-based games; they&apos;re online classes that give students more reason to get off the screen and experience these classes in the real-world. Not theoretical classes but real-life applications. These are experiences that build confidence, knowledge, and life skills.
              </p>
              <Link href="/classes" className={styles.learnMoreBtn}>
                Explore All Classes →
              </Link>
            </div>
          </div>
        </section>

        {/* Active Incentive Programs Section */}
        <section className={styles.activeIncentiveSection}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionKeywordLarge} ${styles.heroEarn}`}>EARN</span>
            <div className={`${styles.sectionUnderline} ${styles.sectionUnderlineEarn}`}></div>
          </div>
          <div className={styles.incentiveContent}>
            <div className={styles.incentiveText}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>🌟</span>
                ACTIVE INCENTIVE PROGRAMS
              </h2>
              <p className={styles.incentiveDescription}>
                We believe students shouldn&apos;t be on screens all day. That&apos;s why Xogos runs on a simple subscription model with no ads, no microtransactions, and no tricks to keep kids glued to devices. Instead, we incentivize real-world growth through programs that reward getting off the screen. These coins they can also convert to scholarships as they grow up on Xogos.
              </p>
              <Link href="/incentives" className={styles.learnMoreBtn}>
                Learn More About Active Incentives →
              </Link>
            </div>
            <div className={styles.incentiveGrid}>
              <Link href="/incentives" className={styles.incentiveCard}>
                <Image
                  src="/images/games/new_iserv_volunteer.png"
                  alt="iServ Volunteering"
                  width={150}
                  height={150}
                  className={styles.incentiveLogo}
                />
                <span className={styles.incentiveLabel}>iServ Volunteering</span>
              </Link>
              <Link href="/incentives" className={styles.incentiveCard}>
                <div className={styles.incentiveImageWrapper}>
                  <Image
                    src="/images/games/new_pryde_gym.png"
                    alt="Pryde Gym"
                    width={150}
                    height={150}
                    className={styles.incentiveLogo}
                  />
                  <div className={styles.comingSoonOverlay}>Coming 2026</div>
                </div>
                <span className={styles.incentiveLabel}>Pryde Gym</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Scholarship Program Section - Title centered above both */}
        <section className={styles.scholarshipSection}>
          <h2 className={styles.scholarshipTitleCentered}>
            <span className={styles.heroEarn}>EARN</span>
            <span className={styles.titleIcon}>🎓</span>
            TURN COINS INTO COLLEGE
          </h2>
          <div className={styles.scholarshipContent}>
            <div className={styles.scholarshipText}>
              <p className={styles.scholarshipDescription}>
                Every iPlay coin earned through gameplay, academic achievements, and real-world activities has real value. Students earn coins by playing educational games, maintaining good grades, volunteering in their communities, and staying physically active. These coins can be spent on in-game upgrades and digital benefits—or saved and converted into actual scholarship funds for universities, trade schools, and certificate programs. We&apos;re not just gamifying education; we&apos;re funding futures.
              </p>
              <div className={styles.scholarshipStats}>
                <div className={styles.scholarshipStat}>
                  <span className={styles.scholarshipStatIcon}>🎮</span>
                  <span className={styles.scholarshipStatText}>Earn through gameplay</span>
                </div>
                <div className={styles.scholarshipStat}>
                  <span className={styles.scholarshipStatIcon}>📝</span>
                  <span className={styles.scholarshipStatText}>Bonus for good grades</span>
                </div>
                <div className={styles.scholarshipStat}>
                  <span className={styles.scholarshipStatIcon}>🏃</span>
                  <span className={styles.scholarshipStatText}>Rewards for real-world activity</span>
                </div>
                <div className={styles.scholarshipStat}>
                  <span className={styles.scholarshipStatIcon}>🎓</span>
                  <span className={styles.scholarshipStatText}>Convert to scholarships</span>
                </div>
              </div>
            </div>
            <div className={styles.scholarshipVisual}>
              <Image
                src="/images/coin-to-diploma.png"
                alt="Coins converting to scholarships"
                width={400}
                height={300}
                className={styles.scholarshipImage}
              />
              <Link href="/scholarships" className={styles.scholarshipBtn}>
                Learn About Scholarships →
              </Link>
            </div>
          </div>
        </section>

        {/* Student Security Section */}
        <section className={styles.studentSecuritySection}>
          <div className={styles.securityContent}>
            <div className={styles.securityText}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>🛡️</span>
                STUDENT PROTECTION
              </h2>
              <p className={styles.securityDescription}>
                We prioritize the security and safety of every student on our platform.
                Here&apos;s how we protect them.
              </p>
              <Link href="/student-protection" className={styles.securityBtn}>
                Learn More About Our Safety Measures →
              </Link>
            </div>
            <div className={styles.securityGrid}>
              <div className={styles.securityCard}>
                <div className={styles.securityImageWrapper}>
                  <Image
                    src="/images/security/parent-linked.png"
                    alt="Parent Linked Accounts"
                    width={120}
                    height={120}
                    className={styles.securityImage}
                  />
                </div>
                <h3 className={styles.securityTitle}>Parent Linked Accounts</h3>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityImageWrapper}>
                  <Image
                    src="/images/security/know-customers.png"
                    alt="Know Our Customers"
                    width={120}
                    height={120}
                    className={styles.securityImage}
                  />
                </div>
                <h3 className={styles.securityTitle}>Know Our Customers</h3>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityImageWrapper}>
                  <Image
                    src="/images/security/software-safeguards.png"
                    alt="Software Safeguards"
                    width={120}
                    height={120}
                    className={styles.securityImage}
                  />
                </div>
                <h3 className={styles.securityTitle}>Software Safeguards</h3>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityImageWrapper}>
                  <Image
                    src="/images/security/no-chat.png"
                    alt="No In-Game Chats"
                    width={120}
                    height={120}
                    className={styles.securityImage}
                  />
                </div>
                <h3 className={styles.securityTitle}>No In-Game Chats</h3>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityImageWrapper}>
                  <Image
                    src="/images/security/age-restricted.png"
                    alt="Ages 6-19 Only"
                    width={120}
                    height={120}
                    className={styles.securityImage}
                  />
                </div>
                <h3 className={styles.securityTitle}>Ages 6-19 Only</h3>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityImageWrapper}>
                  <Image
                    src="/images/security/known-connections.png"
                    alt="Known Connections Only"
                    width={120}
                    height={120}
                    className={styles.securityImage}
                  />
                </div>
                <h3 className={styles.securityTitle}>Known Connections Only</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Special Events Section */}
        <section className={styles.specialEventsSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🎁</span>
              SPECIAL EVENTS
            </h2>
            <p className={styles.sectionSubtitle}>
              Throughout the year, we host special events where you can earn
              bonus coins! These coins go towards in-game purchases and can even
              contribute to scholarship funds.
            </p>
            <div className={styles.eventsDates}>
              <span className={styles.dateLabel}>2026 Event Season:</span>
              <span className={styles.dateRange}>
                January 1 - December 31, 2026
              </span>
            </div>
          </div>

          <div className={styles.eventsGrid}>
            {/* Event 1 - Easter Egg Hunt (Active) */}
            <div className={`${styles.eventCard} ${styles.eventActive}`}>
              <div className={styles.eventStatus}>
                <span className={styles.statusDot}></span>
                ACTIVE NOW
              </div>
              <div className={styles.eventIcon}>🥚</div>
              <h3 className={styles.eventTitle}>Easter Egg Hunt</h3>
              <p className={styles.eventDescription}>
                A secret code is hidden somewhere on our website. Find it and
                earn
                <strong> 5 FREE coins</strong> when you start playing Xogos!
              </p>
              <div className={styles.eventHint}>
                <span className={styles.hintIcon}>💡</span>
                <span>
                  Hint: Explore where our board members share their vision for
                  the future...
                </span>
              </div>
              <div className={styles.eventDates}>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Starts</span>
                  <span className={styles.eventDateValue}>Jan 25, 2026</span>
                </div>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Ends</span>
                  <span className={styles.eventDateValue}>Feb 28, 2027</span>
                </div>
              </div>
              <div className={styles.eventReward}>
                <span className={styles.rewardIcon}>🪙</span>
                <span>+5 Coins</span>
              </div>
            </div>

            {/* Event 2 - Coming Soon */}
            <div className={`${styles.eventCard} ${styles.eventComingSoon}`}>
              <div className={styles.eventStatus}>
                <span className={styles.statusDotInactive}></span>
                COMING SOON
              </div>
              <div className={styles.eventIcon}>🎮</div>
              <h3 className={styles.eventTitle}>Summer Challenge</h3>
              <p className={styles.eventDescription}>
                A special summer event is being prepared. Stay tuned for
                exciting challenges and bigger rewards!
              </p>
              <div className={styles.eventDates}>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Starts</span>
                  <span className={styles.eventDateValue}>Jun 1, 2026</span>
                </div>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Ends</span>
                  <span className={styles.eventDateValue}>Aug 31, 2026</span>
                </div>
              </div>
              <div className={styles.eventReward}>
                <span className={styles.rewardIcon}>🪙</span>
                <span>??? Coins</span>
              </div>
            </div>

            {/* Event 3 - Coming Soon */}
            <div className={`${styles.eventCard} ${styles.eventComingSoon}`}>
              <div className={styles.eventStatus}>
                <span className={styles.statusDotInactive}></span>
                COMING SOON
              </div>
              <div className={styles.eventIcon}>🎄</div>
              <h3 className={styles.eventTitle}>Holiday Special</h3>
              <p className={styles.eventDescription}>
                End the year with a bang! Our biggest event of the year is
                coming this holiday season.
              </p>
              <div className={styles.eventDates}>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Starts</span>
                  <span className={styles.eventDateValue}>Dec 1, 2026</span>
                </div>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Ends</span>
                  <span className={styles.eventDateValue}>Dec 31, 2026</span>
                </div>
              </div>
              <div className={styles.eventReward}>
                <span className={styles.rewardIcon}>🪙</span>
                <span>??? Coins</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Xogos Section */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>✨</span>
              WHY CHOOSE XOGOS
            </h2>
            <p className={styles.sectionSubtitle}>
              Our platform combines educational value with engaging gameplay to
              create meaningful learning experiences.
            </p>
          </div>
          <div className={styles.featuresGrid}>
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

        {/* Game Details Modal */}
        {selectedGame && (
          <div className={styles.gameModal} onClick={closeModal}>
            <div
              className={styles.gameModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.gameModalClose} onClick={closeModal}>
                ×
              </button>
              <div className={styles.gameModalHeader}>
                <div className={styles.gameModalLogoWrapper}>
                  <Image
                    src={selectedGame.logo}
                    alt={selectedGame.title}
                    fill
                    className={styles.gameModalLogo}
                  />
                </div>
              </div>
              <div className={styles.gameModalBody}>
                <h2 className={styles.gameModalTitle}>{selectedGame.title}</h2>
                <div className={styles.gameModalMeta}>
                  <span className={styles.gameModalSubject}>
                    {selectedGame.subject}
                  </span>
                  <span
                    className={styles.gameModalLevel}
                    style={
                      {
                        "--level-color": selectedGame.color,
                      } as React.CSSProperties
                    }
                  >
                    {selectedGame.level}
                  </span>
                </div>
                <p className={styles.gameModalDescription}>
                  {selectedGame.description}
                </p>

                {/* Video Player */}
                <div className={styles.videoSection}>
                  <h3 className={styles.videoSectionTitle}>Watch Tutorial</h3>
                  {selectedGame.videoId ? (
                    <div className={styles.videoContainer}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${selectedGame.videoId}?rel=0&modestbranding=1&showinfo=0&fs=1&disablekb=1&iv_load_policy=3`}
                        title={`${selectedGame.title} Tutorial`}
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.videoPlayer}
                      ></iframe>
                      {/* Overlays to block YouTube links */}
                      <div className={styles.videoBlockerTop}></div>
                      <div className={styles.videoBlockerBottom}></div>
                    </div>
                  ) : (
                    <div className={styles.videoComingSoon}>
                      <span className={styles.videoComingSoonIcon}>🎬</span>
                      <span>Video Coming Soon</span>
                    </div>
                  )}
                </div>

                <div className={styles.gameModalActions}>
                  <Link href="/games" className={styles.gameModalPlayBtn}>
                    View All Games
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
