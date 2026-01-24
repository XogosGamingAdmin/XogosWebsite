"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { PageTracker } from "@/components/Analytics";
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

// SVG Icons for features
const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const LearnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

const EarnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
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
}

// All games data
const allGames: Game[] = [
  {
    id: "bug-and-seek",
    title: "Bug and Seek",
    subject: "Science",
    level: "Beginner",
    description: "A nature-based exploration game where students become the new owners of a broken-down insectarium. Players explore real-world ecosystems to catch up to 220 real-life bugs, each with fun facts and humor built into every codex entry. The game teaches entomology, biology, ecology, and environmental science.",
    logo: "/images/games/BugAndSeek_logo.jpg",
    color: "#4ade80",
    tutorialLink: null,
  },
  {
    id: "debt-free-millionaire",
    title: "Debt-Free Millionaire",
    subject: "Financial Literacy",
    level: "Advanced",
    description: "A personal finance and career simulation that teaches financial literacy through practical scenarios. Players explore career paths, learn about budgeting, debt management, and wealth-building, earning iPlay coins as their in-game avatar reaches different savings milestones.",
    logo: "/images/games/DebtFreeMillionaire_logo.jpg",
    color: "#e6bb84",
    tutorialLink: null,
  },
  {
    id: "digital-frontier",
    title: "Digital Frontier",
    subject: "STEM",
    level: "Intermediate",
    description: "A story-driven STEM adventure game where players step into a neon digital world as User, a self-aware program fighting to escape a controlled system. Through fast-paced racing, circuit repair, tank battles, structural puzzles, energy rerouting, and coding challenges, players learn real physics, engineering, and computer science concepts. The game spans 11 connected levels, each introducing new mechanics and STEM ideas.",
    logo: "/images/games/DigitalFrontier_logo.png",
    color: "#00d4ff",
    tutorialLink: null,
  },
  {
    id: "exploration-library",
    title: "Exploration Library",
    subject: "Literature",
    level: "Beginner-Advanced",
    description: "A revolutionary approach to classic literature that transforms passive reading into active discovery. Experience Treasure Island, Swiss Family Robinson, and Pride and Prejudice through multiple character perspectives. Students can access modern retellings or original Victorian prose, with text-to-speech and vocabulary help. Each chapter offers four unique perspectives written in different narrative styles.",
    logo: "/images/games/ExplorationLibrary_logo.png",
    color: "#a855f7",
    tutorialLink: null,
  },
  {
    id: "historical-conquest",
    title: "Historical Conquest",
    subject: "History",
    level: "Intermediate",
    description: "A strategic history-based card game that resembles Pokémon in appearance and Risk in gameplay mechanics. All cards are based on historical figures, events, and places. Players earn iPlay coins for time spent in the game and can purchase additional decks using their earned coins.",
    logo: "/images/games/HistoricalConquest_logo.jpg",
    color: "#e62739",
    tutorialLink: null,
  },
  {
    id: "hunt-the-past",
    title: "Hunt the Past",
    subject: "History",
    level: "Beginner-Advanced",
    description: "The cutting-edge online encyclopedia where students don't just look up people, places, and events—they talk to them. Thanks to built-in AI, students can ask questions, receive narrative responses from virtual historical figures, explore linked sources, and dive into compelling stories tied to each topic. Makes history conversational and exploratory.",
    logo: "/images/games/HuntThePast_logo.jpg",
    color: "#f59e0b",
    tutorialLink: null,
  },
  {
    id: "iserv-volunteer",
    title: "iServ Volunteer",
    subject: "Community Service",
    level: "Intermediate-Advanced",
    description: "Take action in your community—helping neighbors, running local events, cleaning parks, or mentoring younger kids—and every hour you serve earns you iPlay coins. These coins can be used in the Xogos Gaming Platform to unlock games, characters, and gear—or convert into real scholarships that fund your future!",
    logo: "/images/games/iServVolunteer_logo.jpg",
    color: "#22c55e",
    tutorialLink: null,
  },
  {
    id: "lightning-round",
    title: "Lightning Round",
    subject: "History",
    level: "Intermediate",
    description: "A fast-paced quiz game that tests and improves historical knowledge through quick-fire questions, timed challenges, and competitive multiplayer modes. Perfect for classroom use or independent learning with engaging rapid-fire gameplay.",
    logo: "/images/games/LightningRound_logo.png",
    color: "#fbbf24",
    tutorialLink: null,
  },
  {
    id: "monster-math",
    title: "Monster Math",
    subject: "Mathematics",
    level: "Beginner-Intermediate",
    description: "A thrilling test of brains and reflexes where learning meets survival. Play as the fearless Green Monster, racing to devour correct numbers while avoiding the hungry Red Monster. Every level ramps up with tougher math problems—multiples, factors, primes, and equations. Reaching Level 10 earns 1 iPlay coin toward scholarships!",
    logo: "/images/games/MonsterMath_logo.png",
    color: "#22c55e",
    tutorialLink: null,
  },
  {
    id: "totally-medieval",
    title: "Totally Medieval",
    subject: "Mathematics",
    level: "Intermediate",
    description: "Build your medieval kingdom while mastering math skills through strategic resource management and castle building. Players solve increasingly complex math problems to acquire resources, build structures, and defend their kingdoms from rivals.",
    logo: "/images/games/TotallyMedieval_logo.png",
    color: "#7928ca",
    tutorialLink: null,
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
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchMemberStats();
  }, []);

  const stats = [
    { value: 301, suffix: "", label: "Players Learning" },
    { value: 13, suffix: "", label: "Educational Games" },
    { value: 58, suffix: " So Far", label: "Coins Earned" },
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
            <h1 className={`${styles.heroTitle} ${isLoaded ? styles.visible : ""}`}>
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
              <span className={styles.xpText}>6,500 / 10,000 XP to Next Level</span>
            </div>
          </div>

          {/* Game Boy Visual */}
          <div className={`${styles.heroVisual} ${isLoaded ? styles.visible : ""}`}>
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
                      <div className={`${styles.dpadButton} ${styles.dpadUp}`}></div>
                      <div className={`${styles.dpadButton} ${styles.dpadRight}`}></div>
                      <div className={`${styles.dpadButton} ${styles.dpadDown}`}></div>
                      <div className={`${styles.dpadButton} ${styles.dpadLeft}`}></div>
                      <div className={styles.dpadCenter}></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.actionButtons}>
                    <div
                      className={styles.actionButton}
                      onClick={() => setScreenImage("/images/games/TotallyMedieval.jpg")}
                    >
                      <span>A</span>
                    </div>
                    <div
                      className={styles.actionButton}
                      onClick={() => setScreenImage("/images/games/DebtFreeMil.jpg")}
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
            Relaunch of Xogos Gaming Platform - January 26
          </p>
        </section>

        {/* Game Select Section */}
        <section className={styles.gameSelectSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🕹️</span>
            SELECT YOUR GAME
          </h2>
          <div className={styles.gameCarousel}>
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
        </section>

        {/* Special Events Section */}
        <section className={styles.specialEventsSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🎁</span>
              SPECIAL EVENTS
            </h2>
            <p className={styles.sectionSubtitle}>
              Throughout the year, we host special events where you can earn bonus coins!
              These coins go towards in-game purchases and can even contribute to scholarship funds.
            </p>
            <div className={styles.eventsDates}>
              <span className={styles.dateLabel}>2026 Event Season:</span>
              <span className={styles.dateRange}>January 1 - December 31, 2026</span>
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
                A secret code is hidden somewhere on our website. Find it and earn
                <strong> 5 FREE coins</strong> when you start playing Xogos!
              </p>
              <div className={styles.eventHint}>
                <span className={styles.hintIcon}>💡</span>
                <span>Hint: Explore where our board members share their vision for the future...</span>
              </div>
              <div className={styles.eventDates}>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Starts</span>
                  <span className={styles.eventDateValue}>Jan 25, 2026</span>
                </div>
                <div className={styles.eventDateItem}>
                  <span className={styles.eventDateLabel}>Ends</span>
                  <span className={styles.eventDateValue}>Feb 28, 2026</span>
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
                A special summer event is being prepared. Stay tuned for exciting
                challenges and bigger rewards!
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
                End the year with a bang! Our biggest event of the year is coming
                this holiday season.
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
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorksSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🎯</span>
              HOW IT WORKS
            </h2>
            <p className={styles.sectionSubtitle}>
              Our three-step process makes it easy to turn educational
              achievements into future opportunities.
            </p>
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Play Educational Games</h3>
                <p className={styles.stepDescription}>
                  Engage with our collection of fun, interactive games
                  designed to build knowledge and skills across multiple
                  subject areas. Each achievement is verified through our
                  secure blockchain technology.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
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
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Convert to Scholarships</h3>
                <p className={styles.stepDescription}>
                  Transform your accumulated tokens into real scholarship
                  funds through our transparent conversion system. Your
                  educational achievements directly contribute to your
                  academic future.
                </p>
              </div>
            </div>
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
            <div className={styles.gameModalContent} onClick={(e) => e.stopPropagation()}>
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
                  <span className={styles.gameModalSubject}>{selectedGame.subject}</span>
                  <span
                    className={styles.gameModalLevel}
                    style={{ "--level-color": selectedGame.color } as React.CSSProperties}
                  >
                    {selectedGame.level}
                  </span>
                </div>
                <p className={styles.gameModalDescription}>{selectedGame.description}</p>
                <div className={styles.gameModalActions}>
                  {selectedGame.tutorialLink ? (
                    <Link href={selectedGame.tutorialLink} className={styles.gameModalTutorialBtn}>
                      Watch Tutorial
                    </Link>
                  ) : (
                    <span className={styles.gameModalTutorialComingSoon}>
                      Tutorial Coming Soon
                    </span>
                  )}
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
