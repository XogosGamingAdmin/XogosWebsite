"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

// Static board member data with default initiatives (same as main page)
const staticBoardMembers = [
  {
    id: "michael-weaver",
    name: "Michael Weaver",
    title: "President",
    role: "Insurance & Risk",
    imagePath: "/images/board/weaver.jpg",
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

interface MemberData {
  id: string;
  name: string;
  title: string;
  role: string;
  imagePath: string;
  initiatives: Initiative[];
}

export default function MemberInitiativesPage() {
  const params = useParams();
  const memberId = params.memberId as string;
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemberInitiatives() {
      try {
        // Find static member data
        const staticMember = staticBoardMembers.find((m) => m.id === memberId);
        if (!staticMember) {
          setMemberData(null);
          setLoading(false);
          return;
        }

        // Fetch dynamic initiatives from database
        const res = await fetch("/api/initiatives");
        const data = await res.json();
        const dynamicData = data.initiativesByMember || [];

        // Find dynamic initiatives for this member
        const dynamicMember = dynamicData.find(
          (d: { memberId: string }) => d.memberId === memberId
        );
        const dynamicInitiatives: DynamicInitiative[] = dynamicMember?.initiatives || [];

        // Combine: dynamic initiatives first (newest), then static
        const allInitiatives: Initiative[] = [
          ...dynamicInitiatives.map((i: DynamicInitiative) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            objectives: i.objectives,
            createdAt: i.createdAt,
          })),
          ...staticMember.staticInitiatives,
        ];

        setMemberData({
          id: staticMember.id,
          name: staticMember.name,
          title: staticMember.title,
          role: staticMember.role,
          imagePath: staticMember.imagePath,
          initiatives: allInitiatives,
        });
      } catch (error) {
        console.error("Error loading member initiatives:", error);
        // Fallback to static data
        const staticMember = staticBoardMembers.find((m) => m.id === memberId);
        if (staticMember) {
          setMemberData({
            id: staticMember.id,
            name: staticMember.name,
            title: staticMember.title,
            role: staticMember.role,
            imagePath: staticMember.imagePath,
            initiatives: staticMember.staticInitiatives,
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadMemberInitiatives();
  }, [memberId]);

  if (loading) {
    return (
      <MarketingLayout>
        <Container className={styles.section}>
          <div className={styles.loading}>
            <p>Loading initiatives...</p>
          </div>
        </Container>
      </MarketingLayout>
    );
  }

  if (!memberData) {
    return (
      <MarketingLayout>
        <Container className={styles.section}>
          <div className={styles.notFound}>
            <h1>Member Not Found</h1>
            <p>The board member you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/board/initiatives" className={styles.backLink}>
              Back to Board Initiatives
            </Link>
          </div>
        </Container>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <Container className={styles.section}>
        {/* Back Navigation */}
        <Link href="/board/initiatives" className={styles.backLink}>
          &larr; Back to All Board Initiatives
        </Link>

        {/* Member Header */}
        <div className={styles.memberHeader}>
          <div className={styles.memberImageContainer}>
            {memberData.imagePath ? (
              <img
                src={memberData.imagePath}
                alt={memberData.name}
                className={styles.memberImage}
              />
            ) : (
              <div className={styles.memberPlaceholder} />
            )}
          </div>
          <div className={styles.memberInfo}>
            <h1 className={styles.memberName}>{memberData.name}</h1>
            <h2 className={styles.memberTitle}>{memberData.title}</h2>
            <span className={styles.memberRole}>{memberData.role}</span>
          </div>
        </div>

        {/* Initiatives Section */}
        <div className={styles.initiativesContainer}>
          <h2 className={styles.sectionTitle}>
            All Initiatives by {memberData.name.split(" ")[0]}
          </h2>
          <p className={styles.initiativeCount}>
            {memberData.initiatives.length} initiative
            {memberData.initiatives.length !== 1 ? "s" : ""} total
          </p>

          <div className={styles.initiativesGrid}>
            {memberData.initiatives.map((initiative, idx) => (
              <div key={initiative.id || idx} className={styles.initiativeCard}>
                <h3 className={styles.initiativeTitle}>{initiative.title}</h3>
                {initiative.createdAt && (
                  <span className={styles.initiativeDate}>
                    Posted{" "}
                    {new Date(initiative.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                <p className={styles.initiativeDescription}>
                  {initiative.description}
                </p>
                <h4 className={styles.objectivesLabel}>Objectives:</h4>
                <ul className={styles.initiativeList}>
                  {initiative.objectives.map((obj, objIdx) => (
                    <li key={objIdx} className={styles.initiativeListItem}>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </MarketingLayout>
  );
}
