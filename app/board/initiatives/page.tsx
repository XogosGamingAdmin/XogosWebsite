"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

// Easter Egg Component - Hidden treasure for players to find
// Note: This code can be changed for future events. The backend should validate and track redemptions.
// Event Period: January 25, 2026 - February 28, 2026
function EasterEgg() {
  const [found, setFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEventActive, setIsEventActive] = useState(false);

  const secretCode = "XOGOS-EGG-2026-439234F";

  // Event date range (UTC to avoid timezone issues)
  const eventStartDate = new Date("2026-01-25T00:00:00");
  const eventEndDate = new Date("2026-02-28T23:59:59");

  useEffect(() => {
    const now = new Date();
    setIsEventActive(now >= eventStartDate && now <= eventEndDate);
  }, []);

  const handleClick = () => {
    setFound(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secretCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Don't render anything if event is not active
  if (!isEventActive) {
    return null;
  }

  if (!found) {
    return (
      <button
        className={styles.hiddenEgg}
        onClick={handleClick}
        title="What's this?"
        aria-label="Hidden Easter Egg"
      >
        <span className={styles.eggIcon}>🥚</span>
      </button>
    );
  }

  return (
    <div className={styles.easterEggFound}>
      <div className={styles.eggConfetti}>🎉</div>
      <h3 className={styles.eggTitle}>You Found It!</h3>
      <p className={styles.eggMessage}>
        Congratulations, treasure hunter! You discovered the hidden Easter Egg.
        Use this code when you sign up to receive <strong>5 FREE coins</strong>!
      </p>
      <div className={styles.eggCodeBox}>
        <span className={styles.eggCode}>{secretCode}</span>
        <button
          className={styles.eggCopyBtn}
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className={styles.eggNote}>
        Enter this code in Xogos to claim your reward!
      </p>
      <p className={styles.eggWarning}>
        This code can only be redeemed once per account.
      </p>
    </div>
  );
}

// Static board member data with default initiatives
const staticBoardMembers = [
  {
    id: "michael-weaver",
    name: "Michael Weaver",
    title: "President",
    role: "Insurance & Risk",
    imagePath: "/images/board/weaver.jpg",
    responsibilities: [
      "Lead the board in strategic initiatives",
      "Oversee insurance coverage and risk management",
      "Develop crisis management protocols",
    ],
    contributions: [
      "Establish guidelines for new educational game launches",
      "Direct risk assessments for crypto-based activities",
    ],
    staticInitiatives: [
      {
        title: "Enterprise Risk Register",
        description:
          "Create a dynamic risk register tracking organizational liabilities, particularly around student data, volunteer apps, and DOE-related compliance changes.",
        objectives: [
          "Categorize all major and minor risks across the company",
          "Define risk response strategies for top threats",
          "Align insurance policies to newly discovered exposures",
        ],
      },
      {
        title: "Create and define strategy",
        description:
          "Create the purpose and course of defining and pursuing the strategy.",
        objectives: [
          "Define what the layers are to the approach of the defining our initiatives",
          "Collaborate on defining the Educational Framework.",
          "Figure out how to utilize board member talent, schedule, and timeline accordingly.",
        ],
      },
    ],
  },
  {
    id: "zack-edwards",
    name: "Zack Edwards",
    title: "CEO",
    role: "Executive Oversight",
    imagePath: "/images/board/zack.png",
    responsibilities: [
      "Execute day-to-day company management",
      "Implement the board's strategic vision",
      "Oversee game development pipeline",
    ],
    contributions: [
      "Link educational content to gameplay mechanics",
      "Identify emerging educational technology trends",
    ],
    staticInitiatives: [
      {
        title: "New Partnerships & Market Expansion",
        description:
          "Pursue relationships with external organizations—both educational and corporate—to accelerate Xogos' brand awareness, scholarship sponsors, and membership growth.",
        objectives: [
          "Secure at least two major sponsorships for scholarships",
          "Expand pilot programs into five new states",
          "Increase membership by 25% within the next quarter",
        ],
      },
      {
        title: "Game Development Pipeline",
        description:
          "Ensure timely release of new educational games in alignment with K-12 curriculum updates and feedback from pilot schools.",
        objectives: [
          "Coordinate tasks across design, dev, and QA teams",
          "Integrate board feedback on educational standards",
          "Publish at least one major new game every two quarters",
        ],
      },
    ],
  },
  {
    id: "braden-perry",
    name: "Braden Perry",
    title: "Legal Director",
    role: "Legal & Regulatory",
    imagePath: "/images/board/braden.jpg",
    responsibilities: [
      "Oversee all legal aspects of operations",
      "Ensure compliance with regulatory obligations",
      "Monitor gaming regulations across jurisdictions",
    ],
    contributions: [
      "Develop legal frameworks for educational blockchain",
      "Review IP protections and scholarship distribution rules",
    ],
    staticInitiatives: [
      {
        title: "Legal Aspects of Crypto Integration",
        description:
          "Examine the legal ramifications of offering crypto-based rewards to students, ensuring compliance with SEC, FinCEN, COPPA, and other relevant regulations.",
        objectives: [
          "Clarify how iPlay & iServ tokens align with US securities law",
          "Draft standard disclaimers and parental consents",
          "Coordinate with external counsel in each pilot state",
        ],
      },
      {
        title: "Regulatory Review for Scholarship Program",
        description:
          "Audit the scholarship program's processes and documentation to confirm compliance in all served districts, especially if the Department of Education's structure changes.",
        objectives: [
          "Confirm student-eligibility processes follow relevant laws",
          "Maintain accurate records for philanthropic contributions",
          "Adapt quickly if the DOE merges or defunds certain programs",
        ],
      },
    ],
  },
  {
    id: "terrance-gatsby",
    name: "Terrance Gatsby",
    title: "Crypto & Exchanges Director",
    role: "Cryptocurrency Integration",
    imagePath: "/images/board/terrance.jpg",
    responsibilities: [
      "Oversee digital currency integration",
      "Ensure security of cryptocurrency transactions",
      "Develop educational crypto content for students",
    ],
    contributions: [
      "Create wallet systems suited for minors",
      "Establish scholarship distribution protocols on-chain",
    ],
    staticInitiatives: [
      {
        title: "Secure Student Wallet Systems",
        description:
          "Enhance security, user experience, and age-appropriate features in the Xogos wallet, ensuring children's accounts stay safe from external threats.",
        objectives: [
          "Add multi-signature or parental oversight features",
          "Automate compliance checks for suspicious activity",
          "Roll out a user-friendly redesign by next quarter",
        ],
      },
      {
        title: "Exchange Listings & Partnerships",
        description:
          "Explore new exchange listings for iServ while forming close partnerships with fiat-crypto gateways to streamline scholarships and token liquidity.",
        objectives: [
          "List iServ on at least two reputable exchanges",
          "Implement a direct buy feature with minimal KYC friction",
          "Coordinate promotional efforts with strategic partners",
        ],
      },
    ],
  },
  {
    id: "mckayla-reece",
    name: "McKayla Reece",
    title: "Education Director",
    role: "Educational Strategy",
    imagePath: "/images/board/mckayla.jpg",
    responsibilities: [
      "Create educational content strategies",
      "Align game content with curriculum standards",
      "Evaluate real-world preparedness of the platform",
    ],
    contributions: [
      "Define new educational topics for each grade level",
      "Lead teacher/school pilot programs for Xogos",
    ],
    staticInitiatives: [
      {
        title: "Educational Content Roadmap",
        description:
          "Expand game-based curricula to cover more advanced financial topics, civics, or trades education, matching the latest K-12 guidelines and potential DOE shifts.",
        objectives: [
          "Launch 2 advanced-subject game modules per year",
          "Collaborate with pilot schools for immediate feedback",
          "Measure student performance gains with in-game analytics",
        ],
      },
      {
        title: "Pilot Program for Curriculum Integration",
        description:
          "Bring Xogos tools directly into classrooms with a pilot group of teachers, focusing on bridging any gap if the Department of Education is downsized.",
        objectives: [
          "Recruit 20 teachers across 4 states to test the platform",
          "Publish a short study on improved student engagement",
          "Adapt teacher dashboards to new local or state requirements",
        ],
      },
    ],
  },
  {
    id: "kevin-stursberg",
    name: "Kevin Stursberg",
    title: "Accounting Director",
    role: "Financial Oversight",
    imagePath: "/images/board/kevin.jpg",
    responsibilities: [
      "Oversee financial reporting and operations",
      "Ensure accuracy in financial statements",
      "Manage audits & cryptocurrency accounting",
    ],
    contributions: [
      "Create budgets for new game expansions",
      "Develop financial literacy mechanics in games",
    ],
    staticInitiatives: [
      {
        title: "Financial Reporting & Budget Projections",
        description:
          "Implement updated monthly/quarterly financial reporting integrating iServ-based scholarships, forecasting cash flow if DOE or state-level funding shifts.",
        objectives: [
          "Integrate crypto data into standard financial reports",
          "Improve expense tracking for scholarship distributions",
          "Refine 6- and 12-month cash flow projections",
        ],
      },
      {
        title: "Crypto Tax Reporting",
        description:
          "Design robust tax-reporting processes for iServ tokens, ensuring all scholarship-related transactions and volunteer programs meet federal/state guidelines.",
        objectives: [
          "Develop an internal ledger for iServ movements",
          "Implement automated 1099 or K-1 generation for relevant participants",
          "Coordinate with legal to meet multi-state tax rules",
        ],
      },
    ],
  },
];

interface Initiative {
  id?: string;
  title: string;
  description: string;
  objectives: string[];
  createdAt?: string;
}

interface DynamicInitiative {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  createdAt: string;
}

interface BoardMemberWithInitiatives {
  id: string;
  name: string;
  title: string;
  role: string;
  imagePath: string;
  responsibilities: string[];
  contributions: string[];
  initiatives: Initiative[];
  hasMoreInitiatives: boolean;
}

export default function BoardInitiativesPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMemberWithInitiatives[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitiatives() {
      try {
        // Fetch dynamic initiatives from database
        const res = await fetch("/api/initiatives");
        const data = await res.json();
        const dynamicData = data.initiativesByMember || [];

        // Merge static and dynamic data
        const merged = staticBoardMembers.map((member) => {
          // Find dynamic initiatives for this member
          const dynamicMember = dynamicData.find(
            (d: { memberId: string }) => d.memberId === member.id
          );
          const dynamicInitiatives: DynamicInitiative[] = dynamicMember?.initiatives || [];

          // Combine: dynamic initiatives first (newest), then static as fallback
          // Show max 2 on the card, rest go to detail page
          const allInitiatives = [
            ...dynamicInitiatives.map((i: DynamicInitiative) => ({
              id: i.id,
              title: i.title,
              description: i.description,
              objectives: i.objectives,
              createdAt: i.createdAt,
            })),
            ...member.staticInitiatives,
          ];

          return {
            ...member,
            initiatives: allInitiatives.slice(0, 2), // Show only 2 on main page
            hasMoreInitiatives: allInitiatives.length > 2,
          };
        });

        setBoardMembers(merged);
      } catch (error) {
        console.error("Error loading initiatives:", error);
        // Fallback to static data
        setBoardMembers(
          staticBoardMembers.map((m) => ({
            ...m,
            initiatives: m.staticInitiatives.slice(0, 2),
            hasMoreInitiatives: m.staticInitiatives.length > 2,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitiatives();
  }, []);

  if (loading) {
    return (
      <MarketingLayout>
        <Container className={styles.section}>
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <p>Loading initiatives...</p>
          </div>
        </Container>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <Container className={styles.section}>
        {/* Hero Section */}
        <div className={styles.heroInfo}>
          <h1 className={styles.heroTitle}>Board Initiatives</h1>
          <p className={styles.heroLead}>
            Where each board member's role and responsibilities align with
            initiatives guiding our next steps.
          </p>
          {/* Hidden Easter Egg - Placed subtly in the hero */}
          <EasterEgg />
        </div>
      </Container>

      <Container className={styles.section}>
        <h2 className={styles.sectionTitle}>Board & Their Initiatives</h2>
        <div className={styles.boardMembersGrid}>
          {boardMembers.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              {/* Sidebar-like portion */}
              <div className={styles.memberSidebar}>
                <div className={styles.memberImageContainer}>
                  {member.imagePath ? (
                    <img
                      src={member.imagePath}
                      alt={member.name}
                      className={styles.memberImage}
                    />
                  ) : (
                    <div className={styles.memberPlaceholder} />
                  )}
                </div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <h4 className={styles.memberTitle}>{member.title}</h4>
                <span className={styles.memberRole}>{member.role}</span>
              </div>

              {/* Details portion */}
              <div className={styles.memberDetails}>
                <div className={styles.memberSection}>
                  <h4 className={styles.memberSectionTitle}>
                    Responsibilities
                  </h4>
                  <ul className={styles.memberList}>
                    {member.responsibilities.map((resp, idx) => (
                      <li key={idx} className={styles.memberListItem}>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.memberSection}>
                  <h4 className={styles.memberSectionTitle}>
                    Key Contributions
                  </h4>
                  <ul className={styles.memberList}>
                    {member.contributions.map((contr, idx) => (
                      <li key={idx} className={styles.memberListItem}>
                        {contr}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.memberSection}>
                  <h4 className={styles.memberSectionTitle}>Initiatives</h4>
                  <div className={styles.initiativesGrid}>
                    {member.initiatives.map((init, idx) => (
                      <div key={init.id || idx} className={styles.initiativeCard}>
                        <h5 className={styles.initiativeTitle}>{init.title}</h5>
                        <p className={styles.initiativeDescription}>
                          {init.description}
                        </p>
                        <h6 className={styles.objectivesLabel}>Objectives:</h6>
                        <ul className={styles.initiativeList}>
                          {init.objectives.map((obj, objIdx) => (
                            <li
                              key={objIdx}
                              className={styles.initiativeListItem}
                            >
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* More Initiatives Button */}
                  {member.hasMoreInitiatives && (
                    <Link
                      href={`/board/initiatives/${member.id}`}
                      className={styles.moreInitiativesButton}
                    >
                      Click for More Initiatives
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </MarketingLayout>
  );
}
