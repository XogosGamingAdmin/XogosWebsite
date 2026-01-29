"use client";

import Image from "next/image";
import Link from "next/link";
// eslint-disable-next-line import/order, sort-imports
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

// Game type
interface Game {
  id: string;
  title: string;
  subject: string;
  description: string;
  imagePath: string;
  featured?: boolean;
  status: "active" | "beta" | "upcoming";
  features?: string[];
}

export default function GamesPage() {
  // Animation on scroll
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Games data based on whitepaper and existing content
  const games: Game[] = [
    {
      id: "bug-and-seek",
      title: "Bug and Seek",
      subject: "Science",
      description:
        "A nature-based exploration game where students become the new owners of a broken-down insectarium. Players explore real-world ecosystems to catch up to 220 real-life bugs, each with fun facts and humor built into every codex entry. The game teaches entomology, biology, ecology, and environmental science.",
      imagePath: "/images/games/BugAndSeek_logo.jpg",
      featured: true,
      status: "active",
      features: [
        "220+ real insects to discover",
        "Ecosystem exploration",
        "Museum restoration",
        "Scientific facts database",
        "Environmental education",
      ],
    },
    {
      id: "debt-free-millionaire",
      title: "Debt-Free Millionaire",
      subject: "Personal Finance",
      description:
        "A personal finance and career simulation that teaches financial literacy through practical scenarios. Players explore career paths, learn about budgeting, debt management, and wealth-building, earning iPlay coins as their in-game avatar reaches different savings milestones.",
      imagePath: "/images/games/DebtFreeMillionaire_logo.jpg",
      featured: true,
      status: "active",
      features: [
        "Career simulation",
        "Budget management",
        "Credit building system",
        "Investment strategies",
        "Real-world scenarios",
      ],
    },
    {
      id: "digital-frontier",
      title: "Digital Frontier",
      subject: "STEM",
      description:
        "A story-driven STEM adventure game where players step into a neon digital world as User, a self-aware program fighting to escape a controlled system. Through fast-paced racing, circuit repair, tank battles, structural puzzles, energy rerouting, and coding challenges, players learn real physics, engineering, and computer science concepts by using them to survive. Newton's laws, projectile motion, electrical circuits, energy flow, and basic programming are woven directly into gameplay.",
      imagePath: "/images/games/DigitalFrontier_logo.png",
      featured: true,
      status: "active",
      features: [
        "11 connected levels",
        "Physics and engineering challenges",
        "Circuit repair puzzles",
        "Coding challenges",
        "Community-driven expansion",
      ],
    },
    {
      id: "exploration-library",
      title: "Exploration Library",
      subject: "Literature",
      description:
        "A revolutionary approach to classic literature that transforms passive reading into active discovery. Experience Treasure Island, Swiss Family Robinson, and Pride and Prejudice through multiple character perspectives. Students can access modern retellings or original Victorian prose, with text-to-speech and vocabulary help. Each chapter offers four unique perspectives written in different narrative styles.",
      imagePath: "/images/games/ExplorationLibrary_logo.png",
      featured: true,
      status: "active",
      features: [
        "Multiple character perspectives",
        "Modern and original text options",
        "Text-to-speech support",
        "Vocabulary assistance",
        "Classic literature made accessible",
      ],
    },
    {
      id: "historical-conquest-digital",
      title: "Historical Conquest Digital",
      subject: "History",
      description:
        "A strategic history-based game that resembles Pokémon in appearance and Risk in gameplay mechanics, with all cards based on historical figures, events, and places. Players earn iPlay coins for time spent in the game and can purchase additional decks using their earned coins.",
      imagePath: "/images/games/HistoricalConquest_logo.jpg",
      featured: true,
      status: "active",
      features: [
        "Strategic card-based gameplay",
        "Real historical figures and events",
        "Collectible deck system",
        "Multiplayer battles",
        "Timeline learning",
      ],
    },
    {
      id: "hunt-the-past",
      title: "Hunt the Past",
      subject: "History",
      description:
        "The cutting-edge online encyclopedia where students don't just look up people, places, and events—they talk to them. Thanks to built-in AI, students can ask questions, receive narrative responses from virtual historical figures, explore linked sources, and dive into compelling stories tied to each topic. Makes history conversational and exploratory.",
      imagePath: "/images/games/HuntThePast_logo.jpg",
      featured: true,
      status: "active",
      features: [
        "AI-powered conversations",
        "Talk to historical figures",
        "Linked source exploration",
        "Interactive storytelling",
        "Dynamic learning paths",
      ],
    },
    {
      id: "iserv-volunteer",
      title: "iServ Volunteer",
      subject: "Community Service",
      description:
        "Take action in your community—helping neighbors, running local events, cleaning parks, or mentoring younger kids—and every hour you serve earns you iPlay coins. These coins can be used in the Xogos Gaming Platform to unlock games, characters, and gear—or convert into real scholarships that fund your future!",
      imagePath: "/images/games/iServVolunteer_logo.jpg",
      status: "active",
      features: [
        "Track volunteer hours",
        "Earn iPlay coins",
        "Convert to scholarships",
        "Community missions",
        "Real-world impact",
      ],
    },
    {
      id: "lightning-round",
      title: "Lightning Round",
      subject: "History",
      description:
        "A fast-paced quiz game that tests and improves historical knowledge through quick-fire questions, timed challenges, and competitive multiplayer modes. Perfect for classroom use or independent learning.",
      imagePath: "/images/games/LightningRound_logo.png",
      status: "active",
      features: [
        "Fast-paced quiz format",
        "Timed challenges",
        "Multiplayer competition",
        "Classroom integration",
        "Historical knowledge base",
      ],
    },
    {
      id: "monster-math",
      title: "Monster Math",
      subject: "Mathematics",
      description:
        "A thrilling test of brains and reflexes where learning meets survival. Play as the fearless Green Monster, racing to devour correct numbers while avoiding the hungry Red Monster. Every level ramps up with tougher math problems—multiples, factors, primes, and equations. Reaching Level 10 earns 1 iPlay coin toward scholarships!",
      imagePath: "/images/games/MonsterMath_logo.png",
      featured: true,
      status: "active",
      features: [
        "Survival math gameplay",
        "Progressive difficulty",
        "Multiples, factors, primes",
        "Earn iPlay coins",
        "Fast-paced action",
      ],
    },
    {
      id: "totally-medieval",
      title: "Totally Medieval",
      subject: "Mathematics",
      description:
        "Build your medieval kingdom while mastering math skills through strategic resource management and castle building. Players solve increasingly complex math problems to acquire resources, build structures, and defend their kingdoms from rivals.",
      imagePath: "/images/games/TotallyMedieval_logo.png",
      featured: true,
      status: "active",
      features: [
        "Kingdom building mechanics",
        "Progressive math challenges",
        "Resource management",
        "Strategic gameplay",
        "Medieval theme",
      ],
    },
  ];

  const subjects = Array.from(new Set(games.map((game) => game.subject)));

  const filteredGames = selectedSubject
    ? games.filter((game) => game.subject === selectedSubject)
    : games;

  const featuredGames = games.filter((game) => game.featured);

  const handleGameClick = (game: Game) => {
    setActiveGame(game);
  };

  const closeGameDetails = () => {
    setActiveGame(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { text: "Available Now", className: styles.statusActive };
      case "beta":
        return { text: "Beta Testing", className: styles.statusBeta };
      case "upcoming":
        return { text: "Coming Soon", className: styles.statusUpcoming };
      default:
        return { text: "Available", className: styles.statusActive };
    }
  };

  return (
    <MarketingLayout>
      <div className={styles.gamesPage}>
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
                Xogos <span className={styles.highlightText}>Games</span>
              </h1>
              <p
                className={`${styles.heroSubtitle} ${isLoaded ? styles.visible : ""}`}
              >
                Where learning meets play, turning education into an adventure
                that rewards real achievement
              </p>
            </div>
          </Container>
        </section>

        {/* Featured Games Section */}
        <section className={styles.featuredSection}>
          <Container>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>
                <h2 className={styles.sectionTitle}>Featured Games</h2>
                <div className={styles.sectionDecoration}></div>
                <p className={styles.sectionSubtitle}>
                  Discover our core educational games designed to make learning
                  engaging and rewarding
                </p>
              </div>

              <div className={styles.featuredGamesSlider}>
                {featuredGames.map((game, index) => (
                  <div
                    key={index}
                    className={styles.featuredGameCard}
                    onClick={() => handleGameClick(game)}
                  >
                    <div className={styles.gameImageContainer}>
                      <Image
                        src={game.imagePath}
                        alt={game.title}
                        width={320}
                        height={180}
                        className={styles.gameImage}
                      />
                      <div className={styles.gameOverlay}>
                        <div className={styles.gameSubject}>{game.subject}</div>
                        <div
                          className={`${styles.gameStatus} ${getStatusBadge(game.status).className}`}
                        >
                          {getStatusBadge(game.status).text}
                        </div>
                      </div>
                    </div>
                    <div className={styles.gameContent}>
                      <h3 className={styles.gameTitle}>{game.title}</h3>
                      <p className={styles.gameDescription}>
                        {game.description.length > 120
                          ? `${game.description.substring(0, 120)}...`
                          : game.description}
                      </p>
                      <button className={styles.gameDetailsButton}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Filter Section */}
        <section className={styles.filterSection}>
          <Container>
            <div className={styles.filterContainer}>
              <h3 className={styles.filterTitle}>Filter by Subject:</h3>
              <div className={styles.filterButtons}>
                <button
                  className={`${styles.filterButton} ${selectedSubject === null ? styles.active : ""}`}
                  onClick={() => setSelectedSubject(null)}
                >
                  All Subjects
                </button>
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    className={`${styles.filterButton} ${selectedSubject === subject ? styles.active : ""}`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* All Games Grid */}
        <section className={styles.gamesGridSection}>
          <Container>
            <div className={styles.gamesGrid}>
              {filteredGames.map((game, index) => (
                <div
                  key={index}
                  className={styles.gameCard}
                  onClick={() => handleGameClick(game)}
                >
                  <div className={styles.gameCardImageContainer}>
                    <Image
                      src={game.imagePath}
                      alt={game.title}
                      width={280}
                      height={160}
                      className={styles.gameCardImage}
                    />
                    <div className={styles.gameCardOverlay}>
                      <div className={styles.gameCardSubject}>
                        {game.subject}
                      </div>
                      <div
                        className={`${styles.gameCardStatus} ${getStatusBadge(game.status).className}`}
                      >
                        {getStatusBadge(game.status).text}
                      </div>
                    </div>
                  </div>
                  <div className={styles.gameCardContent}>
                    <h4 className={styles.gameCardTitle}>{game.title}</h4>
                    <p className={styles.gameCardDescription}>
                      {game.description.length > 100
                        ? `${game.description.substring(0, 100)}...`
                        : game.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Call to Action Section */}
        <section className={styles.ctaSection}>
          <Container>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Start Learning?</h2>
              <p className={styles.ctaDescription}>
                Join thousands of students who are already earning while they
                learn. Start your educational gaming journey today and unlock
                real scholarship opportunities.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/membership" className={styles.primaryButton}>
                  Join Now
                </Link>
                <Link href="/scholarships" className={styles.secondaryButton}>
                  Learn About Scholarships
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

        {/* Game Details Modal */}
        {activeGame && (
          <div className={styles.gameModal} onClick={closeGameDetails}>
            <div
              className={styles.gameModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeModalButton}
                onClick={closeGameDetails}
              >
                ×
              </button>
              <div className={styles.gameModalHeader}>
                <div className={styles.gameModalImageContainer}>
                  <Image
                    src={activeGame.imagePath}
                    alt={activeGame.title}
                    width={500}
                    height={280}
                    className={styles.gameModalImage}
                  />
                  <div className={styles.gameModalOverlay}>
                    <div className={styles.gameModalSubject}>
                      {activeGame.subject}
                    </div>
                    <div
                      className={`${styles.gameModalStatus} ${getStatusBadge(activeGame.status).className}`}
                    >
                      {getStatusBadge(activeGame.status).text}
                    </div>
                  </div>
                </div>
                <div className={styles.gameModalInfo}>
                  <h2 className={styles.gameModalTitle}>{activeGame.title}</h2>
                </div>
              </div>
              <div className={styles.gameModalBody}>
                <p className={styles.gameModalDescription}>
                  {activeGame.description}
                </p>

                {activeGame.features && (
                  <div className={styles.gameModalFeatures}>
                    <h3 className={styles.gameModalSubtitle}>Key Features</h3>
                    <ul className={styles.gameFeaturesList}>
                      {activeGame.features.map((feature, index) => (
                        <li key={index} className={styles.gameFeatureItem}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.gameModalActions}>
                  {activeGame.status === "active" && (
                    <a
                      href="https://www.myXogos.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalPrimaryButton}
                    >
                      Play Now
                    </a>
                  )}
                  {activeGame.status === "beta" && (
                    <a
                      href="https://www.myXogos.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalSecondaryButton}
                    >
                      Join Beta
                    </a>
                  )}
                  {activeGame.status === "upcoming" && (
                    <button className={styles.modalDisabledButton} disabled>
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
