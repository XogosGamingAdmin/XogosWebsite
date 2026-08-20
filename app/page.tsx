"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing/Marketing";
import styles from "./page.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Audience = "student" | "parent" | "educator";

type SectionKey =
  | "games"
  | "cartridges"
  | "quests"
  | "power"
  | "stats"
  | "homeschool"
  | "reviews"
  | "scholarship"
  | "pricing"
  | "blog";

type Day = "MON" | "TUE" | "WED" | "THU" | "FRI";

type AchievementId =
  | "insert-coin"
  | "first-coin"
  | "quest-master"
  | "cartridge-collector"
  | "identity-explorer"
  | "power-surge";

interface Game {
  id: string;
  title: string;
  subject: string;
  level: string;
  description: string;
  logo: string;
  color: string;
  videoId?: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface CtaLink {
  label: string;
  href: string;
  /** true when the link leaves this site (e.g. the myXogos play portal) */
  external?: boolean;
}

interface AudienceContent {
  playerName: string;
  playerIcon: string;
  playerImage: string;
  playerTagline: string;
  heroSubtitle: string;
  benefitsTitle: string;
  benefits: Benefit[];
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

interface DailyQuest {
  id: string;
  label: string;
  emoji: string;
  coins: number;
}

interface LessonItem {
  time: string;
  subject: string;
  activity: string;
  isXogos: boolean;
  coins?: string;
}

interface Cartridge {
  subject: string;
  emoji: string;
  color: string;
  hint: string;
  games: Game[];
}

interface Achievement {
  id: AchievementId;
  icon: string;
  title: string;
  description: string;
}

interface Toast {
  key: number;
  achievement: Achievement;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  drift: number;
  spin: number;
  size: number;
  isCoin: boolean;
}

interface Review {
  quote: string;
  name: string;
  player: string;
  accent: "red" | "purple" | "gold";
  avatar: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Games data (mirrors app/page.tsx)
// ---------------------------------------------------------------------------

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
    videoId: "edXjP7znaI4",
  },
  {
    id: "splunker",
    title: "Splunker",
    subject: "Science",
    level: "Beginner-Intermediate",
    description:
      "Dig deep. Discover everything. Splunker is an epic 2D exploration and mining adventure where players dig through massive cave systems, uncover hidden treasures, mine valuable resources, and survive mysterious underground environments—all while learning about geology, mining, Earth science, environmental science, and the incredible processes that shaped our planet. A growing world of new biomes, underground ecosystems, hidden civilizations, and rare minerals expands with every update. Grab your pickaxe, light your torch—the underground has never been this much fun!",
    logo: "/images/games/Splunker.png",
    color: "#f97316",
    videoId: "uSYO-wM6t90",
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
  },
  {
    id: "digital-frontier",
    title: "Digital Frontier",
    subject: "STEM",
    level: "Intermediate",
    description:
      "A story-driven STEM adventure game where players step into a neon digital world as User, a self-aware program fighting to escape a controlled system. Through fast-paced racing, circuit repair, tank battles, structural puzzles, energy rerouting, and coding challenges, players learn real physics, engineering, and computer science concepts.",
    logo: "/images/games/new_digial_frontier.png",
    color: "#00d4ff",
    videoId: "Ep3ZhAFmLp8",
  },
  {
    id: "exploration-library",
    title: "Exploration Library",
    subject: "Literature",
    level: "Beginner-Advanced",
    description:
      "A revolutionary approach to classic literature that transforms passive reading into active discovery. Experience Treasure Island, Swiss Family Robinson, and Pride and Prejudice through multiple character perspectives, with modern retellings or original Victorian prose, text-to-speech, and vocabulary help.",
    logo: "/images/games/ExplorationLibrary_logo.png",
    color: "#a855f7",
    videoId: "V9vLVN-oiec",
  },
  {
    id: "historical-conquest",
    title: "Historical Conquest",
    subject: "History",
    level: "Intermediate",
    description:
      "A strategic history-based card game that resembles Pokemon in appearance and Risk in gameplay mechanics. All cards are based on historical figures, events, and places. Players earn iPlay coins for time spent in the game and can purchase additional decks using their earned coins.",
    logo: "/images/games/new_historical-conquest.png",
    color: "#e62739",
    videoId: "OUg4Bu6AbnI",
  },
  {
    id: "hunt-the-past",
    title: "Hunt the Past",
    subject: "History",
    level: "Beginner-Advanced",
    description:
      "The cutting-edge online encyclopedia where students don't just look up people, places, and events—they talk to them. Thanks to built-in AI, students can ask questions, receive narrative responses from virtual historical figures, explore linked sources, and dive into compelling stories tied to each topic.",
    logo: "/images/games/new_huntthepast.png",
    color: "#f59e0b",
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
    videoId: "7lPyLazH2Jw",
  },
  {
    id: "monster-math",
    title: "Monster Math",
    subject: "Mathematics",
    level: "Beginner-Intermediate",
    description:
      "A thrilling test of brains and reflexes where learning meets survival. Play as the fearless Green Monster, racing to devour correct numbers while avoiding the hungry Red Monster. Every level ramps up with tougher math problems—multiples, factors, primes, and equations.",
    logo: "/images/games/MonsterMath_logo.png",
    color: "#22c55e",
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
    videoId: "JPCvcnIoRUs",
  },
  {
    id: "body-battle",
    title: "Body Battle",
    subject: "Science",
    level: "Intermediate",
    description:
      "An action-packed health science adventure where players command the body's immune system against invading pathogens. Learn about anatomy, the immune response, bacteria, viruses, and how the human body defends itself. Battle through organs and systems while mastering real medical concepts.",
    logo: "/images/games/new_body_battle.png",
    color: "#fb7185",
    videoId: "uUiOOmIVAwg",
  },
  {
    id: "timequest",
    title: "TimeQuest",
    subject: "History",
    level: "Intermediate",
    description:
      "Travel through time to experience history firsthand! Visit ancient civilizations, witness pivotal moments, and interact with historical figures across different eras. Complete missions that teach cause and effect, historical context, and the interconnected nature of world events.",
    logo: "/images/games/new_timequest.png",
    color: "#38bdf8",
  },
];

const subjects: string[] = [
  "All",
  ...Array.from(new Set(allGames.map((g) => g.subject))),
];

const gamesBySubject = (subject: string): Game[] =>
  allGames.filter((g) => g.subject === subject);

// ---------------------------------------------------------------------------
// Audience content
// ---------------------------------------------------------------------------

const audienceContent: Record<Audience, AudienceContent> = {
  student: {
    playerName: "Student",
    playerIcon: "🎮",
    playerImage: "/images/players/player-student.png",
    playerTagline: "Play games. Stack coins.",
    heroSubtitle:
      "Play games that are actually fun, level up your skills without even noticing, and stack iPlay coins you can turn into real scholarship money. Yes, really.",
    benefitsTitle: "PLAYER PERKS",
    benefits: [
      {
        icon: "🕹️",
        title: "Games That Are Actually Fun",
        description:
          "70% fun, 30% education. No boring worksheets in disguise—real games you'll want to keep playing.",
      },
      {
        icon: "🪙",
        title: "Earn iPlay Coins",
        description:
          "Every game session, high grade, volunteer hour, and workout earns coins toward your future.",
      },
      {
        icon: "🏆",
        title: "Level Up In Real Life",
        description:
          "Coins convert into real scholarship funds for college, trade school, or certificate programs.",
      },
      {
        icon: "🎁",
        title: "Special Events",
        description:
          "Seasonal events, hidden codes, and bonus challenges drop extra coins all year long.",
      },
    ],
    primaryCta: {
      label: "Start Playing",
      href: "https://www.myXogos.com",
      external: true,
    },
    secondaryCta: { label: "How To Play", href: "/about" },
  },
  parent: {
    playerName: "Homeschool Parent",
    playerIcon: "🏠",
    playerImage: "/images/players/player-parent.png",
    playerTagline: "Curriculum, safety, scholarships.",
    heroSubtitle:
      "A safe, ad-free platform where your kids play genuinely educational games, take real-world elective classes, balance their screen time with off-screen rewards, and earn iPlay coins that convert into real scholarship funds.",
    benefitsTitle: "WHY HOMESCHOOL FAMILIES CHOOSE XOGOS",
    benefits: [
      {
        icon: "📚",
        title: "Electives That Count",
        description:
          "Dozens of free elective classes—cooking, astronomy, wilderness survival, personal finance—that slot right into your homeschool day.",
      },
      {
        icon: "🛡️",
        title: "Safe By Design",
        description:
          "Parent-linked accounts, no in-game chat with strangers, no ads, no microtransactions. Ages 6-19 only.",
      },
      {
        icon: "⚖️",
        title: "Screen-Time Balance",
        description:
          "Off-screen incentives reward volunteering, exercise, and hands-on learning—not endless scrolling.",
      },
      {
        icon: "🎓",
        title: "Scholarships From Merit",
        description:
          "Coins your kids earn convert quarterly into real scholarship funds for universities and trade schools.",
      },
    ],
    primaryCta: { label: "Explore Classes", href: "/classes" },
    secondaryCta: { label: "Parent's Guide", href: "/parent-guide" },
  },
  educator: {
    playerName: "Educator",
    playerIcon: "🏫",
    playerImage: "/images/players/player-educator.png",
    playerTagline: "Classroom-ready learning.",
    heroSubtitle:
      "Curriculum-aligned games and electives your students will actually ask to play—wrapped in the safety controls, oversight, and structure your classroom requires.",
    benefitsTitle: "BUILT FOR YOUR CLASSROOM",
    benefits: [
      {
        icon: "🧭",
        title: "Curriculum Aligned",
        description:
          "Games reinforce core subjects—math, history, science, literature, STEM, and financial literacy.",
      },
      {
        icon: "🖥️",
        title: "Classroom Ready",
        description:
          "Quiz modes like Lightning Round work for whole-class play or independent practice stations.",
      },
      {
        icon: "🔍",
        title: "Oversight & Safety",
        description:
          "Linked adult accounts, software safeguards, and known-connections-only policies keep students protected.",
      },
      {
        icon: "🌟",
        title: "Motivation Built In",
        description:
          "The iPlay coin economy gives students a real, tangible reason to engage with the material.",
      },
    ],
    primaryCta: { label: "See The Games", href: "/games" },
    secondaryCta: { label: "Safety Measures", href: "/student-protection" },
  },
};

const sectionOrder: Record<Audience, SectionKey[]> = {
  student: [
    "games",
    "cartridges",
    "power",
    "quests",
    "stats",
    "homeschool",
    "reviews",
    "scholarship",
    "blog",
    "pricing",
  ],
  parent: [
    "quests",
    "homeschool",
    "power",
    "cartridges",
    "games",
    "reviews",
    "scholarship",
    "blog",
    "pricing",
    "stats",
  ],
  educator: [
    "games",
    "cartridges",
    "stats",
    "quests",
    "homeschool",
    "reviews",
    "scholarship",
    "blog",
    "pricing",
    "power",
  ],
};

// ---------------------------------------------------------------------------
// Power meter daily quests (Design 3 reward chart, arcade-ified)
// ---------------------------------------------------------------------------

const dailyQuests: DailyQuest[] = [
  { id: "game", label: "Played a learning game", emoji: "🎮", coins: 3 },
  { id: "grades", label: "Get Good Grades", emoji: "📝", coins: 5 },
  { id: "volunteer", label: "Volunteered an hour", emoji: "🤝", coins: 4 },
  {
    id: "outside",
    label: "Exercised or played outside",
    emoji: "🌳",
    coins: 2,
  },
  { id: "elective", label: "Elective Classes", emoji: "🧑‍🍳", coins: 3 },
];

const METER_MAX = dailyQuests.reduce((sum, quest) => sum + quest.coins, 0);

// ---------------------------------------------------------------------------
// Weekly Quest Log (Design 3 lesson planner, arcade-ified)
// ---------------------------------------------------------------------------

const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI"];

const lessonPlans: Record<Day, LessonItem[]> = {
  MON: [
    {
      time: "9:00",
      subject: "Math",
      activity: "Fractions workbook, pages 12-14",
      isXogos: false,
    },
    {
      time: "10:00",
      subject: "Math",
      activity: "Monster Math — race to Level 10",
      isXogos: true,
      coins: "30 min · earns coins",
    },
    {
      time: "11:00",
      subject: "Reading",
      activity: "Read-aloud on the couch",
      isXogos: false,
    },
    {
      time: "1:00",
      subject: "Elective",
      activity: "Debt Free Millionaire: Personal Finance",
      isXogos: true,
      coins: "hands-on class",
    },
  ],
  TUE: [
    {
      time: "9:00",
      subject: "Writing",
      activity: "Journal entry + copywork",
      isXogos: false,
    },
    {
      time: "10:00",
      subject: "History",
      activity: "Historical Conquest card battle",
      isXogos: true,
      coins: "30 min · earns coins",
    },
    {
      time: "11:00",
      subject: "History",
      activity: "Narration + timeline project",
      isXogos: false,
    },
    {
      time: "1:00",
      subject: "Elective",
      activity: "KitchenLab Academy — bake & measure",
      isXogos: true,
      coins: "hands-on class",
    },
  ],
  WED: [
    {
      time: "9:00",
      subject: "Science",
      activity: "Backyard bug hunt with magnifying glass",
      isXogos: false,
    },
    {
      time: "10:00",
      subject: "Science",
      activity: "Bug and Seek — log your finds in the codex",
      isXogos: true,
      coins: "30 min · earns coins",
    },
    {
      time: "11:30",
      subject: "Art",
      activity: "Nature sketching & observation journal",
      isXogos: false,
    },
    {
      time: "1:00",
      subject: "Service",
      activity: "iServ volunteering at the food pantry",
      isXogos: true,
      coins: "off-screen · earns coins",
    },
  ],
  THU: [
    {
      time: "9:00",
      subject: "Literature",
      activity: "Exploration Library — Treasure Island, ch. 4",
      isXogos: true,
      coins: "earns coins",
    },
    {
      time: "10:00",
      subject: "Literature",
      activity: "Narration + discussion over snacks",
      isXogos: false,
    },
    {
      time: "11:00",
      subject: "STEM",
      activity: "Hands-on circuits with breadboard kit",
      isXogos: false,
    },
    {
      time: "1:00",
      subject: "Elective",
      activity: "StarFall Academy — evening sky prep",
      isXogos: true,
      coins: "hands-on class",
    },
  ],
  FRI: [
    {
      time: "9:00",
      subject: "Life Skills",
      activity: "Debt-Free Millionaire — budget your avatar's month",
      isXogos: true,
      coins: "earns coins",
    },
    {
      time: "10:00",
      subject: "Review",
      activity: "Weekly review & portfolio update",
      isXogos: false,
    },
    {
      time: "11:00",
      subject: "Free Study",
      activity: "Library trip & project time",
      isXogos: false,
    },
    {
      time: "1:00",
      subject: "Elective",
      activity: "Survival Academy — knots & shelter building",
      isXogos: true,
      coins: "hands-on class",
    },
  ],
};

// ---------------------------------------------------------------------------
// Subject cartridges (Design 3 flashcards, arcade-ified)
// ---------------------------------------------------------------------------

// Lightning Round is a rapid-fire quiz that spans every subject, so it loads
// onto every cartridge rather than only its own.
const LIGHTNING_ROUND_ID = "lightning-round";

const cartridgeGames = (subject: string): Game[] => {
  const games = gamesBySubject(subject);
  if (games.some((game) => game.id === LIGHTNING_ROUND_ID)) {
    return games;
  }
  const lightningRound = allGames.find(
    (game) => game.id === LIGHTNING_ROUND_ID
  );
  return lightningRound ? [...games, lightningRound] : games;
};

const cartridgeDefs: Omit<Cartridge, "games" | "hint">[] = [
  { subject: "Mathematics", emoji: "➗", color: "#22c55e" },
  { subject: "History", emoji: "🏛️", color: "#e62739" },
  { subject: "Science", emoji: "🔬", color: "#4ade80" },
  { subject: "Literature", emoji: "📖", color: "#a855f7" },
  { subject: "STEM", emoji: "🤖", color: "#00d4ff" },
  { subject: "Financial Literacy", emoji: "🪙", color: "#e6bb84" },
];

const cartridges: Cartridge[] = cartridgeDefs.map((def) => {
  const games = cartridgeGames(def.subject);
  return {
    ...def,
    games,
    hint: `${games.length} GAME${games.length === 1 ? "" : "S"} LOADED`,
  };
});

// ---------------------------------------------------------------------------
// Player reviews (Design 3 sticky notes, arcade-ified)
// ---------------------------------------------------------------------------

const reviews: Review[] = [
  {
    quote:
      "Our co-op uses the elective classes as our Friday enrichment block. The kids think it's a treat — I count it as school.",
    name: "Sarah, homeschooling 3 kids in Ohio",
    player: "PLAYER 1",
    accent: "gold",
    avatar: "/images/players/review-2.png",
  },
  {
    quote:
      "My history-hater begged for one more round of Historical Conquest. I quietly added it to the transcript.",
    name: "Marcus, dad & part-time teacher",
    player: "PLAYER 2",
    accent: "red",
    avatar: "/images/players/review-3.png",
  },
  {
    quote:
      "The coins made our reward chart real. She watches her scholarship balance the way I watch my garden.",
    name: "Denise, second-generation homeschooler",
    player: "PLAYER 3",
    accent: "purple",
    avatar: "/images/players/review-1.png",
  },
];

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

const achievementCatalog: Record<AchievementId, Achievement> = {
  "insert-coin": {
    id: "insert-coin",
    icon: "🕹️",
    title: "INSERT COIN",
    description: "You pressed start. Welcome to the arcade.",
  },
  "first-coin": {
    id: "first-coin",
    icon: "🪙",
    title: "FIRST COIN GET",
    description: "You earned your very first iPlay coin.",
  },
  "quest-master": {
    id: "quest-master",
    icon: "📋",
    title: "QUEST MASTER",
    description: "Every daily quest checked off. Legendary.",
  },
  "cartridge-collector": {
    id: "cartridge-collector",
    icon: "📼",
    title: "CARTRIDGE COLLECTOR",
    description: "Flipped three subject cartridges.",
  },
  "identity-explorer": {
    id: "identity-explorer",
    icon: "🎭",
    title: "TRIPLE IDENTITY",
    description: "Tried all three player types.",
  },
  "power-surge": {
    id: "power-surge",
    icon: "⚡",
    title: "POWER SURGE",
    description: "Charged the scholarship meter to 100%.",
  },
};

const achievementIds: AchievementId[] = [
  "insert-coin",
  "first-coin",
  "quest-master",
  "cartridge-collector",
  "identity-explorer",
  "power-surge",
];

// ---------------------------------------------------------------------------
// Ticker + floating coins
// ---------------------------------------------------------------------------

const tickerItems: string[] = [
  "★ Emma earned 5 coins in Monster Math",
  "★ New class unlocked: KitchenLab Academy",
  "★ Liam beat the circuit-repair level in Digital Frontier",
  "★ The Hansen family filled their coin jar",
  "★ Ava converted saved coins into her scholarship fund",
  "★ Historical Conquest family tournament this Friday",
  "★ Noah logged 2 iServ volunteer hours",
  "★ StarFall Academy stargazing night — new session open",
  "★ Sofia hit a 12-answer streak in Lightning Round",
  "★ New codex entry: the Atlas beetle joins Bug and Seek",
];

interface FloatingCoin {
  id: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  size: string;
}

const floatingCoins: FloatingCoin[] = [
  { id: 1, left: "6%", top: "16%", delay: "0s", duration: "7s", size: "30px" },
  {
    id: 2,
    left: "14%",
    top: "62%",
    delay: "1.4s",
    duration: "9s",
    size: "22px",
  },
  {
    id: 3,
    left: "88%",
    top: "22%",
    delay: "0.6s",
    duration: "8s",
    size: "34px",
  },
  {
    id: 4,
    left: "80%",
    top: "68%",
    delay: "2.2s",
    duration: "7.5s",
    size: "24px",
  },
  {
    id: 5,
    left: "93%",
    top: "48%",
    delay: "3s",
    duration: "10s",
    size: "18px",
  },
  {
    id: 6,
    left: "4%",
    top: "40%",
    delay: "1s",
    duration: "8.5s",
    size: "20px",
  },
];

const confettiColors: string[] = [
  "#e62739",
  "#9d5cff",
  "#e6bb84",
  "#00d4ff",
  "#22c55e",
  "#fbbf24",
];

// ---------------------------------------------------------------------------
// Stat card with animated count-up
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [playersLearning, setPlayersLearning] = useState<number>(0);
  const [audience, setAudience] = useState<Audience>("parent");
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Power meter + daily quests
  const [questsDone, setQuestsDone] = useState<Set<string>>(new Set());
  const [lastGain, setLastGain] = useState<{
    amount: number;
    id: number;
  } | null>(null);
  const [combo, setCombo] = useState<number>(0);
  const [shaking, setShaking] = useState<boolean>(false);

  // Weekly quest log
  const [activeDay, setActiveDay] = useState<Day>("TUE");

  // Subject cartridges
  const [flippedCartridges, setFlippedCartridges] = useState<Set<string>>(
    new Set()
  );

  // Achievements + toasts + confetti
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [hudOpen, setHudOpen] = useState<boolean>(false);

  // Latest blog post
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);

  const unlockedRef = useRef<Set<AchievementId>>(new Set());
  const visitedAudiencesRef = useRef<Set<Audience>>(new Set(["parent"]));
  const flippedEverRef = useRef<Set<string>>(new Set());
  const meterWasFullRef = useRef<boolean>(false);
  const comboTimerRef = useRef<number | null>(null);
  const confettiTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);

    // Players Learning is maintained in Admin → Statistics (Accounts field)
    async function fetchMemberStats() {
      try {
        const response = await fetch("/api/public-stats");
        const data = await response.json();
        if (data.playersLearning) {
          setPlayersLearning(data.playersLearning);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchMemberStats();

    // Fetch latest blog post
    async function fetchLatestPost() {
      try {
        const response = await fetch("/api/blog", { cache: "no-store" });
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setLatestPost(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching latest blog post:", error);
      }
    }
    fetchLatestPost();
  }, []);

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) window.clearTimeout(comboTimerRef.current);
      if (confettiTimerRef.current)
        window.clearTimeout(confettiTimerRef.current);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Achievement + FX helpers
  // -------------------------------------------------------------------------

  const unlock = useCallback((id: AchievementId): void => {
    if (unlockedRef.current.has(id)) return;
    unlockedRef.current.add(id);
    setUnlocked(new Set(unlockedRef.current));
    const toastKey = Date.now() + Math.random();
    setToasts((prev) => [
      ...prev,
      { key: toastKey, achievement: achievementCatalog[id] },
    ]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.key !== toastKey));
    }, 4600);
  }, []);

  const fireConfetti = useCallback((withCoins: boolean): void => {
    const pieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 1.6,
      color: confettiColors[i % confettiColors.length],
      drift: Math.random() * 160 - 80,
      spin: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
      isCoin: withCoins && i % 6 === 0,
    }));
    setConfetti(pieces);
    if (confettiTimerRef.current) {
      window.clearTimeout(confettiTimerRef.current);
    }
    confettiTimerRef.current = window.setTimeout(() => setConfetti([]), 4200);
  }, []);

  // -------------------------------------------------------------------------
  // Derived coin math
  // -------------------------------------------------------------------------

  const questCoins: number = dailyQuests.reduce(
    (sum, quest) => (questsDone.has(quest.id) ? sum + quest.coins : sum),
    0
  );
  const totalCoins = questCoins;
  const meterPercent = Math.min((totalCoins / METER_MAX) * 100, 100);
  const meterFull = totalCoins >= METER_MAX;
  const allQuestsDone = questsDone.size === dailyQuests.length;

  const rank: string = meterFull
    ? "SCHOLAR"
    : totalCoins >= 12
      ? "CHAMPION"
      : totalCoins >= 5
        ? "PLAYER"
        : "ROOKIE";

  // First coin achievement
  useEffect(() => {
    if (totalCoins > 0) {
      unlock("first-coin");
    }
  }, [totalCoins, unlock]);

  // All daily quests complete → confetti + achievement
  useEffect(() => {
    if (allQuestsDone) {
      unlock("quest-master");
      fireConfetti(true);
    }
  }, [allQuestsDone, unlock, fireConfetti]);

  // Meter full → confetti + screen shake + achievement
  useEffect(() => {
    if (meterFull && !meterWasFullRef.current) {
      meterWasFullRef.current = true;
      unlock("power-surge");
      fireConfetti(false);
      setShaking(true);
      const timer = window.setTimeout(() => setShaking(false), 650);
      return () => window.clearTimeout(timer);
    }
    if (!meterFull) {
      meterWasFullRef.current = false;
    }
    return undefined;
  }, [meterFull, unlock, fireConfetti]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleAudience = (key: Audience): void => {
    setAudience(key);
    visitedAudiencesRef.current.add(key);
    if (visitedAudiencesRef.current.size === 3) {
      unlock("identity-explorer");
    }
  };

  const toggleQuest = (id: string): void => {
    const quest = dailyQuests.find((q) => q.id === id);
    const isChecking = !questsDone.has(id);
    if (isChecking && quest) {
      setLastGain({ amount: quest.coins, id: Date.now() });
      setCombo((current) => current + 1);
      if (comboTimerRef.current) {
        window.clearTimeout(comboTimerRef.current);
      }
      comboTimerRef.current = window.setTimeout(() => setCombo(0), 2000);
    }
    setQuestsDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleCartridge = (subject: string): void => {
    flippedEverRef.current.add(subject);
    if (flippedEverRef.current.size >= 3) {
      unlock("cartridge-collector");
    }
    setFlippedCartridges((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) {
        next.delete(subject);
      } else {
        next.add(subject);
      }
      return next;
    });
  };

  const handleInsertCoin = (): void => {
    fireConfetti(true);
    unlock("insert-coin");
    const cabinet = document.getElementById("game-cabinet");
    if (cabinet) {
      cabinet.scrollIntoView({ behavior: "smooth" });
    }
  };

  const resetMeter = (): void => {
    setQuestsDone(new Set());
    setLastGain(null);
    setCombo(0);
  };

  const content = audienceContent[audience];

  const filteredGames =
    activeSubject === "All"
      ? allGames
      : allGames.filter((game) => game.subject === activeSubject);

  const stats = [
    playersLearning > 0
      ? { value: playersLearning, suffix: "", label: "Players Learning" }
      : { value: 500, suffix: "+", label: "Players Learning" },
    { value: 18, suffix: "", label: "Educational Games" },
    { value: 15, suffix: "", label: "Free Elective Classes" },
    { value: 98, suffix: "%", label: "Fun Rating" },
  ];

  // -------------------------------------------------------------------------
  // Sections (rendered in audience-specific order)
  // -------------------------------------------------------------------------

  const gamesSection = (
    <section className={styles.gamesSection} id="game-cabinet">
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonRed}`}>
          PLAY
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🕹️</span>
          THE GAME CABINET
        </h2>
        <p className={styles.sectionSubtitle}>
          {audience === "parent"
            ? "Every title teaches a real subject. Filter by what your kids are studying this week."
            : audience === "educator"
              ? "Filter the library by subject to find titles that fit your lesson plan."
              : "Pick a subject, pick a game, press start."}
        </p>
      </div>

      <div className={styles.filterChips}>
        {subjects.map((subject) => (
          <button
            key={subject}
            type="button"
            className={`${styles.filterChip} ${
              activeSubject === subject ? styles.filterChipActive : ""
            }`}
            onClick={() => setActiveSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className={styles.gamesGrid}>
        {filteredGames.map((game) => (
          <button
            key={game.id}
            type="button"
            className={styles.gameCard}
            onClick={() => setSelectedGame(game)}
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
              <span className={styles.gameSubject}>{game.subject}</span>
              <h3 className={styles.gameTitle}>{game.title}</h3>
              <span className={styles.gameLevel}>{game.level}</span>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.sectionFooterLink}>
        <Link href="/games" className={styles.outlineBtn}>
          View All Games →
        </Link>
      </div>
    </section>
  );

  const cartridgesSection = (
    <section className={styles.cartridgeSection}>
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonPurple}`}>
          PLAY
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>📼</span>
          SUBJECT CARTRIDGES
        </h2>
        <p className={styles.sectionSubtitle}>
          Every subject is a cartridge. Flip one over to see which games are
          loaded on it — collect and flip three to unlock an achievement.
        </p>
      </div>

      <div className={styles.cartridgeGrid}>
        {cartridges.map((card) => {
          const isFlipped = flippedCartridges.has(card.subject);
          return (
            <button
              key={card.subject}
              type="button"
              className={`${styles.cartridge} ${
                isFlipped ? styles.cartridgeFlipped : ""
              }`}
              onClick={() => toggleCartridge(card.subject)}
              aria-pressed={isFlipped}
              aria-label={`Flip ${card.subject} cartridge`}
              style={{ "--cart-color": card.color } as React.CSSProperties}
            >
              <span className={styles.cartridgeInner}>
                <span className={styles.cartridgeFront}>
                  <span className={styles.cartridgeRidges}></span>
                  <span className={styles.cartridgeLabel}>
                    <span className={styles.cartridgeEmoji}>{card.emoji}</span>
                    <span className={styles.cartridgeSubject}>
                      {card.subject}
                    </span>
                    <span className={styles.cartridgeHint}>{card.hint}</span>
                  </span>
                  <span className={styles.cartridgeFlipTag}>TAP TO FLIP ↻</span>
                </span>
                <span className={styles.cartridgeBack}>
                  <span className={styles.cartridgeBackTitle}>
                    {card.subject}
                  </span>
                  {card.games.map((game) => (
                    <span key={game.id} className={styles.cartGame}>
                      <span className={styles.cartGameLogo}>
                        <Image
                          src={game.logo}
                          alt={game.title}
                          fill
                          className={styles.cartGameImage}
                          sizes="44px"
                        />
                      </span>
                      <span className={styles.cartGameText}>
                        <span className={styles.cartGameTitle}>
                          {game.title}
                        </span>
                        <span className={styles.cartGameLevel}>
                          {game.level}
                        </span>
                      </span>
                    </span>
                  ))}
                  <span className={styles.cartridgeFlipTagBack}>
                    TAP TO FLIP BACK ↺
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );

  const questsSection = (
    <section className={styles.questLogSection}>
      <div className={styles.questLogPanel}>
        <div className={styles.questLogScanlines}></div>
        <div className={styles.sectionHeading}>
          <span className={`${styles.sectionKeyword} ${styles.neonPurple}`}>
            LEARN
          </span>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🗓️</span>
            WEEKLY QUEST LOG
          </h2>
          <p className={styles.sectionSubtitle}>
            A sample homeschool week with Xogos slotted in. Select a level
            (a.k.a. a day) — glowing rows are Xogos quests that earn coins, the
            rest is your regular curriculum.
          </p>
        </div>

        <div
          className={styles.dayTabs}
          role="tablist"
          aria-label="Weekly quest log days"
        >
          {days.map((day) => (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={activeDay === day}
              className={`${styles.dayTab} ${
                activeDay === day ? styles.dayTabActive : ""
              }`}
              onClick={() => setActiveDay(day)}
            >
              <span className={styles.dayTabLevel}>LV</span>
              {day}
            </button>
          ))}
        </div>

        <ul className={styles.questList} key={activeDay}>
          {lessonPlans[activeDay].map((item, index) => (
            <li
              key={`${activeDay}-${index}`}
              className={`${styles.questItem} ${
                item.isXogos ? styles.questItemXogos : ""
              }`}
              style={
                { "--row-delay": `${index * 0.07}s` } as React.CSSProperties
              }
            >
              <span className={styles.questTime}>{item.time}</span>
              <span className={styles.questBody}>
                <span className={styles.questSubject}>{item.subject}</span>
                <span className={styles.questActivity}>{item.activity}</span>
              </span>
              {item.isXogos ? (
                <span className={styles.questCoin}>🪙 {item.coins}</span>
              ) : (
                <span className={styles.questOffline}>your curriculum</span>
              )}
            </li>
          ))}
        </ul>

        <p className={styles.questFootnote}>
          ▸ Xogos quests slot into any rhythm — morning basket, loop schedule,
          or afternoon quiet time. Swap freely; the coins still count.
        </p>
      </div>
    </section>
  );

  const powerSection = (
    <section className={styles.powerSection}>
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonGold}`}>
          EARN
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>⚡</span>
          SCHOLARSHIP POWER-UP METER
        </h2>
        <p className={styles.sectionSubtitle}>
          Check off today&apos;s quests to see how everyday effort—on screen and
          off—charges the scholarship meter with iPlay coins. Complete them all
          for a surprise.
        </p>
      </div>

      <div className={styles.powerPanel}>
        <div className={styles.powerLeft}>
          <h3 className={styles.powerColumnTitle}>
            <span>📋</span> DAILY QUEST CHECKLIST
          </h3>
          <div className={styles.questChecklist}>
            {dailyQuests.map((quest) => {
              const isDone = questsDone.has(quest.id);
              return (
                <button
                  key={quest.id}
                  type="button"
                  className={`${styles.checkItem} ${
                    isDone ? styles.checkItemDone : ""
                  }`}
                  onClick={() => toggleQuest(quest.id)}
                  aria-pressed={isDone}
                >
                  <span className={styles.checkBox}>{isDone ? "✓" : ""}</span>
                  <span className={styles.checkEmoji}>{quest.emoji}</span>
                  <span className={styles.checkLabel}>{quest.label}</span>
                  <span className={styles.checkCoins}>+{quest.coins} 🪙</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.powerMeterWrap}>
          <div className={styles.coinCounter}>
            <span className={styles.coinCounterIcon}>🪙</span>
            <span className={styles.coinCounterValue}>{totalCoins}</span>
            <span className={styles.coinCounterLabel}>iPlay Coins</span>
            {lastGain && (
              <span key={lastGain.id} className={styles.coinFloat}>
                +{lastGain.amount}
              </span>
            )}
            {combo >= 2 && (
              <span key={`combo-${combo}`} className={styles.comboBadge}>
                x{combo} COMBO!
              </span>
            )}
          </div>

          <div className={styles.coinJar} aria-hidden="true">
            {dailyQuests
              .filter((quest) => questsDone.has(quest.id))
              .map((quest, questIndex) =>
                Array.from({ length: quest.coins }).map((_, i) => (
                  <span
                    key={`${quest.id}-${i}`}
                    className={styles.jarCoin}
                    style={
                      {
                        "--coin-delay": `${i * 0.12}s`,
                        "--coin-x": `${((questIndex * 37 + i * 23) % 76) - 38}px`,
                      } as React.CSSProperties
                    }
                  >
                    🪙
                  </span>
                ))
              )}
            <span className={styles.coinJarLabel}>
              {questCoins > 0
                ? `${questCoins} from today's quests`
                : "quest coins land here"}
            </span>
          </div>

          <div className={styles.powerMeter}>
            <div
              className={`${styles.powerFill} ${
                meterFull ? styles.powerFillFull : ""
              }`}
              style={{ width: `${meterPercent}%` }}
            >
              <div className={styles.powerShine}></div>
            </div>
            <span className={styles.powerText}>
              {meterFull
                ? "POWER UP! SCHOLARSHIP BOOST UNLOCKED"
                : `${Math.floor(meterPercent)}% CHARGED`}
            </span>
          </div>

          <div className={styles.rankRow}>
            <span className={styles.rankLabel}>RANK</span>
            <span
              className={`${styles.rankValue} ${
                meterFull ? styles.rankValueMax : ""
              }`}
            >
              {rank}
            </span>
            <span className={styles.rankTrack}>
              ROOKIE → PLAYER → CHAMPION → SCHOLAR
            </span>
          </div>

          <p className={styles.powerNote}>
            Every quarter, students can convert saved iPlay coins into real
            scholarship funds for universities, trade schools, and certificate
            programs. The more they play, learn, and do, the more their future
            fund grows.
          </p>

          <div className={styles.powerActions}>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={resetMeter}
            >
              ↺ Reset Demo
            </button>
            <Link href="/scholarships" className={styles.outlineBtn}>
              How Scholarships Work →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  const statsSection = (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
      <p className={styles.statsSubline}>
        One subscription. No ads. No microtransactions. Just play, learn, and
        earn.
      </p>
    </section>
  );

  const homeschoolSection = (
    <section className={styles.homeschoolSection}>
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonPurple}`}>
          LEARN
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🏠</span>
          BUILT FOR HOMESCHOOL FAMILIES
        </h2>
        <p className={styles.sectionSubtitle}>
          Xogos isn&apos;t just games. It&apos;s daily electives, real-world
          skill-building, and rewards for getting off the screen—designed to fit
          the way homeschool families actually learn.
        </p>
      </div>

      <div className={styles.familyBanner}>
        <div className={styles.familyPhotoWrap}>
          <Image
            src="/images/homeschool-family.png"
            alt="A parent and student exploring Xogos together on a laptop at the kitchen table"
            width={460}
            height={460}
            className={styles.familyPhoto}
          />
        </div>
        <div className={styles.familyCopy}>
          {audience === "parent" ? (
            <p className={styles.parentExpandedText}>
              You set the pace. Your kids pick electives they&apos;re excited
              about, play games mapped to core subjects, and earn coins for the
              things you already value—good grades, service, and staying active.
              No ads ever, no tricks to keep them glued to a device, and every
              account is linked to yours.
            </p>
          ) : audience === "educator" ? (
            <p className={styles.parentExpandedText}>
              Built to slot into the school day or the co-op block. Every title
              maps to a real subject, accounts stay linked to a trusted adult,
              and there are no ads or microtransactions competing for your
              students&apos; attention.
            </p>
          ) : (
            <p className={styles.parentExpandedText}>
              Play the games you actually want to play, take the classes that
              sound fun, and stack up coins the whole time. Your family can see
              your progress—and those coins go toward your future.
            </p>
          )}
          <div className={styles.familyStamp}>
            <span className={styles.familyStampIcon}>🛡️</span>
            Ages 6&ndash;19 · Parent-linked accounts · No ads, ever
          </div>
        </div>
      </div>

      <div className={styles.homeschoolGrid}>
        <div className={styles.homeschoolBlock}>
          <h3 className={styles.blockTitle}>
            <span className={styles.blockIcon}>📚</span>
            Free Elective Classes
          </h3>
          <p className={styles.blockText}>
            Hands-on classes that push learning into the real world—not more
            screen time. Real-life applications, not theory.
          </p>
          <div className={styles.electiveGrid}>
            <Link href="/classes" className={styles.electiveCard}>
              <Image
                src="/images/programs/survival_academy.png"
                alt="Survival Academy"
                width={120}
                height={120}
                className={styles.electiveLogo}
              />
              <span className={styles.electiveLabel}>Survival Academy</span>
            </Link>
            <Link href="/classes" className={styles.electiveCard}>
              <Image
                src="/images/programs/debt_free_millionaire_investor.png"
                alt="Debt Free Millionaire Investor"
                width={120}
                height={120}
                className={styles.electiveLogo}
              />
              <span className={styles.electiveLabel}>DFM Investor</span>
            </Link>
            <Link href="/classes" className={styles.electiveCard}>
              <Image
                src="/images/programs/starfall_academy.png"
                alt="StarFall Academy"
                width={120}
                height={120}
                className={styles.electiveLogo}
              />
              <span className={styles.electiveLabel}>StarFall Academy</span>
            </Link>
            <Link href="/classes" className={styles.electiveCard}>
              <Image
                src="/images/programs/kitchenlab_academy.png"
                alt="KitchenLab Academy"
                width={120}
                height={120}
                className={styles.electiveLogo}
              />
              <span className={styles.electiveLabel}>KitchenLab Academy</span>
            </Link>
          </div>
        </div>

        <div className={styles.homeschoolBlock}>
          <h3 className={styles.blockTitle}>
            <span className={styles.blockIcon}>🌤️</span>
            Off-Screen Incentives
          </h3>
          <p className={styles.blockText}>
            We reward what happens away from the screen. Volunteering and
            physical activity earn coins too.
          </p>
          <div className={styles.incentiveGrid}>
            <Link href="/incentives" className={styles.incentiveCard}>
              <Image
                src="/images/games/new_iserv_volunteer.png"
                alt="iServ Volunteering"
                width={130}
                height={130}
                className={styles.incentiveLogo}
              />
              <span className={styles.incentiveLabel}>iServ Volunteering</span>
            </Link>
            <Link href="/incentives" className={styles.incentiveCard}>
              <div className={styles.incentiveImageWrapper}>
                <Image
                  src="/images/games/new_pryde_gym.png"
                  alt="Pryde Gym"
                  width={130}
                  height={130}
                  className={styles.incentiveLogo}
                />
                <div className={styles.comingSoonOverlay}>Coming 2026</div>
              </div>
              <span className={styles.incentiveLabel}>Pryde Gym</span>
            </Link>
          </div>
          <Link href="/incentives" className={styles.outlineBtnSmall}>
            About Active Incentives →
          </Link>
        </div>
      </div>

      <div className={styles.trustBar}>
        <div className={styles.trustBarHeading}>
          <span className={styles.trustShield}>🛡️</span>
          <span>STUDENT PROTECTION, STANDARD ON EVERY ACCOUNT</span>
        </div>
        <div className={styles.trustBadges}>
          <div className={styles.trustBadge}>
            <Image
              src="/images/security/parent-linked.png"
              alt="Parent Linked Accounts"
              width={72}
              height={72}
              className={styles.trustImage}
            />
            <span>Parent Linked Accounts</span>
          </div>
          <div className={styles.trustBadge}>
            <Image
              src="/images/security/know-customers.png"
              alt="Know Our Customers"
              width={72}
              height={72}
              className={styles.trustImage}
            />
            <span>Know Our Customers</span>
          </div>
          <div className={styles.trustBadge}>
            <Image
              src="/images/security/software-safeguards.png"
              alt="Software Safeguards"
              width={72}
              height={72}
              className={styles.trustImage}
            />
            <span>Software Safeguards</span>
          </div>
          <div className={styles.trustBadge}>
            <Image
              src="/images/security/no-chat.png"
              alt="No In-Game Chats"
              width={72}
              height={72}
              className={styles.trustImage}
            />
            <span>No In-Game Chats</span>
          </div>
          <div className={styles.trustBadge}>
            <Image
              src="/images/security/age-restricted.png"
              alt="Ages 6-19 Only"
              width={72}
              height={72}
              className={styles.trustImage}
            />
            <span>Ages 6-19 Only</span>
          </div>
          <div className={styles.trustBadge}>
            <Image
              src="/images/security/known-connections.png"
              alt="Known Connections Only"
              width={72}
              height={72}
              className={styles.trustImage}
            />
            <span>Known Connections Only</span>
          </div>
        </div>
        <Link href="/student-protection" className={styles.outlineBtnSmall}>
          Our Safety Measures →
        </Link>
      </div>
    </section>
  );

  const reviewsSection = (
    <section className={styles.reviewsSection}>
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonGold}`}>
          HIGH SCORES
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🏅</span>
          PLAYER REVIEWS
        </h2>
        <p className={styles.sectionSubtitle}>
          Straight from the homeschool leaderboard — real-style notes from the
          parents running the show.
        </p>
      </div>
      <div className={styles.reviewGrid}>
        {reviews.map((review) => (
          <figure
            key={review.player}
            className={`${styles.reviewCard} ${
              review.accent === "red"
                ? styles.reviewRed
                : review.accent === "purple"
                  ? styles.reviewPurple
                  : styles.reviewGold
            }`}
          >
            <div className={styles.reviewTopBar}>
              <span className={styles.reviewAvatar}>
                <Image
                  src={review.avatar}
                  alt=""
                  width={56}
                  height={56}
                  className={styles.reviewAvatarImage}
                />
              </span>
              <span className={styles.reviewPlayer}>{review.player}</span>
              <span className={styles.reviewStars}>★★★★★</span>
            </div>
            <blockquote className={styles.reviewQuote}>
              &quot;{review.quote}&quot;
            </blockquote>
            <figcaption className={styles.reviewName}>
              — {review.name}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className={styles.reviewDisclaimer}>
        Sample reviews for illustration — your family&apos;s high score goes
        here next.
      </p>
    </section>
  );

  const scholarshipSection = (
    <section className={styles.scholarshipSection}>
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonGold}`}>
          EARN
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🎓</span>
          TURN COINS INTO COLLEGE
        </h2>
      </div>
      <div className={styles.scholarshipContent}>
        <div className={styles.scholarshipText}>
          <p className={styles.scholarshipDescription}>
            Every iPlay coin earned through gameplay, academic achievements, and
            real-world activities has real value. Coins can be spent on in-game
            upgrades and digital benefits—or saved and converted quarterly into
            actual scholarship funds for universities, trade schools, and
            certificate programs. We&apos;re not just gamifying education;
            we&apos;re funding futures.
          </p>
          <ul className={styles.scholarshipList}>
            <li>
              <span className={styles.scholarshipListIcon}>🎮</span>
              Earn through gameplay
            </li>
            <li>
              <span className={styles.scholarshipListIcon}>📝</span>
              Bonus for good grades
            </li>
            <li>
              <span className={styles.scholarshipListIcon}>🏃</span>
              Rewards for real-world activity
            </li>
            <li>
              <span className={styles.scholarshipListIcon}>🎓</span>
              Convert to scholarships
            </li>
          </ul>
          <Link href="/scholarships" className={styles.primaryBtn}>
            Learn About Scholarships →
          </Link>
        </div>
        <div className={styles.scholarshipVisual}>
          <Image
            src="/images/coin-to-diploma.png"
            alt="Coins converting to scholarships"
            width={420}
            height={315}
            className={styles.scholarshipImage}
          />
        </div>
      </div>
    </section>
  );

  const pricingSection = (
    <section className={styles.pricingSection}>
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonGold}`}>
          JOIN
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🪙</span>
          SELECT YOUR PASS
        </h2>
        <p className={styles.pricingSubtitle}>
          One membership unlocks everything &mdash; every game, every elective
          class, and every coin earned toward scholarships. No ads. No
          microtransactions. Ever.
        </p>
      </div>
      <div className={styles.pricingGrid}>
        <div className={styles.pricingCard}>
          <div className={styles.pricingTier}>MONTHLY</div>
          <div className={styles.pricingPrice}>
            <span className={styles.pricingCurrency}>$</span>
            <span className={styles.pricingAmount}>7</span>
            <span className={styles.pricingPeriod}>/month</span>
          </div>
          <p className={styles.pricingTagline}>
            Insert a coin each month. Cancel anytime.
          </p>
          <ul className={styles.pricingFeatures}>
            <li>All educational games</li>
            <li>All free elective classes</li>
            <li>Earn coins toward scholarships</li>
            <li>Full parent dashboard &amp; safety controls</li>
          </ul>
          <a
            href="https://www.myXogos.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pricingBtn}
          >
            Start Monthly
          </a>
        </div>

        <div className={`${styles.pricingCard} ${styles.pricingPopular}`}>
          <div className={styles.pricingBadge}>2 MONTHS FREE</div>
          <div className={styles.pricingTier}>YEARLY</div>
          <div className={styles.pricingPrice}>
            <span className={styles.pricingCurrency}>$</span>
            <span className={styles.pricingAmount}>70</span>
            <span className={styles.pricingPeriod}>/year</span>
          </div>
          <p className={styles.pricingTagline}>
            A full year of Play, Learn, Earn for the price of ten months.
          </p>
          <ul className={styles.pricingFeatures}>
            <li>Everything in Monthly</li>
            <li>Save $14 every year</li>
            <li>One payment, zero interruptions</li>
            <li>Perfect for the school year &amp; summer</li>
          </ul>
          <a
            href="https://www.historicalconquest.com/xogos-gaming"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pricingBtn}
          >
            Go Yearly
          </a>
        </div>

        <div className={`${styles.pricingCard} ${styles.pricingLifetime}`}>
          <div className={styles.pricingBadge}>2026 LAUNCH SPECIAL</div>
          <div className={styles.pricingTier}>LIFETIME</div>
          <div className={styles.pricingPrice}>
            <span className={styles.pricingCurrency}>$</span>
            <span className={styles.pricingAmount}>150</span>
            <span className={styles.pricingPeriod}>one time</span>
          </div>
          <p className={styles.pricingTagline}>
            One payment covers their entire childhood &mdash; up to 19 years of
            age.
          </p>
          <ul className={styles.pricingFeatures}>
            <li>Everything in Yearly</li>
            <li>Membership until age 19</li>
            <li>Every new game &amp; class we release</li>
            <li>Years of coin-earning toward scholarships</li>
          </ul>
          <p className={styles.pricingPromoNote}>
            <span className={styles.pricingPromoIcon}>🎉</span>
            Available in 2026 only &mdash; a special promotion celebrating the
            opening of Xogos Gaming this year.
          </p>
          <a
            href="https://www.historicalconquest.com/xogos-gaming"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pricingBtn}
          >
            Unlock Lifetime
          </a>
        </div>
      </div>
    </section>
  );

  const blogSection = (
    <section className={styles.blogSection}>
      <div className={styles.sectionHeading}>
        <span className={`${styles.sectionKeyword} ${styles.neonPurple}`}>
          READ
        </span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>📰</span>
          LATEST FROM THE BLOG
        </h2>
      </div>
      {latestPost ? (
        <div className={styles.blogContent}>
          <div className={styles.blogImageWrap}>
            <Image
              src={latestPost.imageUrl || "/images/blog-placeholder.png"}
              alt={latestPost.title}
              width={500}
              height={300}
              className={styles.blogImage}
            />
            <span className={styles.blogCategory}>{latestPost.category}</span>
          </div>
          <div className={styles.blogText}>
            <h3 className={styles.blogTitle}>{latestPost.title}</h3>
            <p className={styles.blogExcerpt}>{latestPost.excerpt}</p>
            <div className={styles.blogMeta}>
              <span className={styles.blogDate}>{latestPost.publishedAt}</span>
            </div>
            <Link href={`/blog/${latestPost.id}`} className={styles.primaryBtn}>
              Read Article →
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.blogLoading}>Loading latest post...</div>
      )}
      <div className={styles.blogAllLink}>
        <Link href="/blog" className={styles.secondaryBtn}>
          View All Articles →
        </Link>
      </div>
    </section>
  );

  const sections: Record<SectionKey, React.ReactElement> = {
    games: gamesSection,
    cartridges: cartridgesSection,
    quests: questsSection,
    power: powerSection,
    stats: statsSection,
    homeschool: homeschoolSection,
    reviews: reviewsSection,
    scholarship: scholarshipSection,
    pricing: pricingSection,
    blog: blogSection,
  };

  // -------------------------------------------------------------------------

  return (
    <MarketingLayout>
      <PageTracker pagePath="/" pageName="Homepage" />
      <div
        className={`${styles.arcadePage} ${shaking ? styles.screenShake : ""}`}
      >
        {/* Achievement HUD */}
        <div className={styles.hud}>
          <button
            type="button"
            className={styles.hudButton}
            onClick={() => setHudOpen((prev) => !prev)}
            aria-expanded={hudOpen}
            aria-label="Toggle achievements panel"
          >
            <span className={styles.hudTrophy}>🏆</span>
            <span className={styles.hudCount}>
              {unlocked.size}/{achievementIds.length}
            </span>
            <span className={styles.hudDivider}>·</span>
            <span className={styles.hudRank}>{rank}</span>
          </button>
          {hudOpen && (
            <div className={styles.hudPanel}>
              <div className={styles.hudPanelTitle}>ACHIEVEMENTS</div>
              {achievementIds.map((id) => {
                const achievement = achievementCatalog[id];
                const isUnlocked = unlocked.has(id);
                return (
                  <div
                    key={id}
                    className={`${styles.hudRow} ${
                      isUnlocked ? styles.hudRowUnlocked : ""
                    }`}
                  >
                    <span className={styles.hudRowIcon}>
                      {isUnlocked ? achievement.icon : "🔒"}
                    </span>
                    <span className={styles.hudRowText}>
                      <span className={styles.hudRowTitle}>
                        {achievement.title}
                      </span>
                      <span className={styles.hudRowDesc}>
                        {isUnlocked ? achievement.description : "???"}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievement toasts */}
        <div className={styles.toastStack} aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.key} className={styles.toast}>
              <div className={styles.toastShine}></div>
              <span className={styles.toastIcon}>{toast.achievement.icon}</span>
              <span className={styles.toastText}>
                <span className={styles.toastHeading}>
                  ACHIEVEMENT UNLOCKED
                </span>
                <span className={styles.toastTitle}>
                  {toast.achievement.title}
                </span>
                <span className={styles.toastDesc}>
                  {toast.achievement.description}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Confetti burst */}
        {confetti.length > 0 && (
          <div className={styles.confettiLayer} aria-hidden="true">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className={`${styles.confettiPiece} ${
                  piece.isCoin ? styles.confettiCoin : ""
                }`}
                style={
                  {
                    left: `${piece.left}%`,
                    "--cf-delay": `${piece.delay}s`,
                    "--cf-duration": `${piece.duration}s`,
                    "--cf-color": piece.color,
                    "--cf-drift": `${piece.drift}px`,
                    "--cf-spin": `${piece.spin}deg`,
                    "--cf-size": `${piece.size}px`,
                  } as React.CSSProperties
                }
              >
                {piece.isCoin ? "🪙" : ""}
              </span>
            ))}
          </div>
        )}

        {/* Animated background */}
        <div className={styles.gridBackground}>
          <div className={styles.starfield}></div>
          <div className={styles.starfieldFar}></div>
          <div className={styles.gridLines}></div>
          <div className={styles.glowOrbs}></div>
        </div>

        {/* Hero */}
        <section className={styles.hero}>
          {floatingCoins.map((coin) => (
            <span
              key={coin.id}
              className={styles.floatingCoin}
              aria-hidden="true"
              style={
                {
                  left: coin.left,
                  top: coin.top,
                  fontSize: coin.size,
                  "--float-delay": coin.delay,
                  "--float-duration": coin.duration,
                } as React.CSSProperties
              }
            >
              🪙
            </span>
          ))}

          <div
            className={`${styles.heroInner} ${isLoaded ? styles.visible : ""}`}
          >
            <div className={styles.levelBadge}>
              <span className={styles.levelIcon}>⭐</span>
              <span>ARCADE 2.0 SUPERCHARGED · LEVEL UP YOUR EDUCATION</span>
            </div>

            <div className={styles.heroImageWrap}>
              <Image
                src="/images/mother-and-son.png"
                alt="Mother helping son with homework"
                width={400}
                height={280}
                className={styles.heroFamilyImage}
                priority
              />
            </div>

            <h1 className={styles.heroTitle}>
              <span
                className={`${styles.glitchWord} ${styles.neonRed}`}
                data-text="PLAY."
              >
                PLAY.
              </span>
              <span
                className={`${styles.glitchWord} ${styles.neonPurple}`}
                data-text="LEARN."
              >
                LEARN.
              </span>
              <span
                className={`${styles.glitchWord} ${styles.neonGold}`}
                data-text="EARN."
              >
                EARN.
              </span>
            </h1>

            {/* Choose Your Player */}
            <div className={styles.playerSelect}>
              <div className={styles.playerSelectLabel}>
                <span className={styles.blinkArrow}>▶</span>
                CHOOSE YOUR PLAYER
              </div>
              <div className={styles.playerCards}>
                {(Object.keys(audienceContent) as Audience[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.playerCard} ${
                      audience === key ? styles.playerCardActive : ""
                    }`}
                    onClick={() => handleAudience(key)}
                  >
                    <span className={styles.playerPortrait}>
                      <Image
                        src={audienceContent[key].playerImage}
                        alt={audienceContent[key].playerName}
                        width={140}
                        height={140}
                        className={styles.playerPortraitImage}
                      />
                    </span>
                    <span className={styles.playerName}>
                      {audienceContent[key].playerName}
                    </span>
                    <span className={styles.playerTagline}>
                      {audienceContent[key].playerTagline}
                    </span>
                    {audience === key && (
                      <span className={styles.playerSelected}>SELECTED</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <p className={styles.heroSubtitle} key={audience}>
              {content.heroSubtitle}
            </p>

            <div className={styles.heroActions}>
              {content.primaryCta.external ? (
                <a
                  href={content.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  <span className={styles.btnIcon}>🎮</span>
                  {content.primaryCta.label}
                </a>
              ) : (
                <Link
                  href={content.primaryCta.href}
                  className={styles.primaryBtn}
                >
                  <span className={styles.btnIcon}>🎮</span>
                  {content.primaryCta.label}
                </Link>
              )}
              {content.secondaryCta.external ? (
                <a
                  href={content.secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryBtn}
                >
                  <span className={styles.btnIcon}>📖</span>
                  {content.secondaryCta.label}
                </a>
              ) : (
                <Link
                  href={content.secondaryCta.href}
                  className={styles.secondaryBtn}
                >
                  <span className={styles.btnIcon}>📖</span>
                  {content.secondaryCta.label}
                </Link>
              )}
            </div>

            <button
              type="button"
              className={styles.insertCoin}
              onClick={handleInsertCoin}
            >
              <span className={styles.insertCoinSlot}>▮</span>
              INSERT COIN TO START
              <span className={styles.insertCoinSlot}>▮</span>
            </button>
          </div>
        </section>

        {/* Live ticker */}
        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[0, 1].map((copy) => (
              <div key={copy} className={styles.tickerGroup}>
                {tickerItems.map((item) => (
                  <span key={`${copy}-${item}`} className={styles.tickerItem}>
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tailored benefits panel */}
        <section className={styles.benefitsSection}>
          <h2 className={styles.benefitsTitle} key={`title-${audience}`}>
            {content.benefitsTitle}
          </h2>
          <div className={styles.benefitsGrid} key={`grid-${audience}`}>
            {content.benefits.map((benefit) => (
              <div key={benefit.title} className={styles.benefitCard}>
                <span className={styles.benefitIcon}>{benefit.icon}</span>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Audience-ordered sections */}
        {sectionOrder[audience].map((key) => (
          <React.Fragment key={key}>{sections[key]}</React.Fragment>
        ))}

        {/* Final CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>READY PLAYER ONE?</h2>
            <p className={styles.ctaText}>
              Join a platform where kids can be kids, families stay in control,
              and every coin earned builds a future.
            </p>
            <div className={styles.ctaButtons}>
              <a
                href="https://www.myXogos.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtn}
              >
                Start Playing
              </a>
              <Link href="/parent-guide" className={styles.ctaBtnAlt}>
                Parent&apos;s Guide
              </Link>
            </div>
            <div className={styles.highScore}>
              <span>
                🏅 {unlocked.size} OF {achievementIds.length} ACHIEVEMENTS
                UNLOCKED · INSERT CURIOSITY TO CONTINUE
              </span>
            </div>
          </div>
        </section>

        {/* Game details modal */}
        {selectedGame && (
          <div
            className={styles.gameModal}
            onClick={() => setSelectedGame(null)}
          >
            <div
              className={styles.gameModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.gameModalClose}
                onClick={() => setSelectedGame(null)}
              >
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
                    </div>
                  ) : (
                    <div className={styles.videoComingSoon}>
                      <span className={styles.videoComingSoonIcon}>🎬</span>
                      <span>Video Coming Soon</span>
                    </div>
                  )}
                </div>

                <div className={styles.gameModalActions}>
                  <Link href="/games" className={styles.primaryBtn}>
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
