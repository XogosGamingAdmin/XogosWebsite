"use client";

import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

const boardMembers = [
  {
    id: 1,
    name: "Zack Edwards",
    title: "CEO",
    image: "/images/board/zack.jpg",
    initiatives: [
      {
        title: "Platform Expansion",
        description:
          "Scaling Xogos Gaming platform to new markets and demographics",
        status: "active",
        progress: 65,
      },
      {
        title: "AI Integration",
        description:
          "Implementing AI-powered learning analytics across all games",
        status: "active",
        progress: 40,
      },
      {
        title: "Scholarship Program Growth",
        description: "Expanding the scholarship program to reach more students",
        status: "planning",
        progress: 20,
      },
    ],
  },
  {
    id: 2,
    name: "Michael Weaver",
    title: "President, Insurance & Risk",
    image: "/images/board/michael.jpg",
    initiatives: [
      {
        title: "Risk Management Framework",
        description: "Comprehensive risk assessment and mitigation strategies",
        status: "active",
        progress: 75,
      },
      {
        title: "Insurance Portfolio Review",
        description: "Annual review and optimization of corporate insurance",
        status: "completed",
        progress: 100,
      },
    ],
  },
  {
    id: 3,
    name: "Braden Perry",
    title: "Legal Director",
    image: "/images/board/braden.jpg",
    initiatives: [
      {
        title: "Compliance Framework",
        description: "COPPA and FERPA compliance for educational gaming",
        status: "active",
        progress: 80,
      },
      {
        title: "IP Protection Strategy",
        description:
          "Intellectual property protection for game assets and content",
        status: "active",
        progress: 55,
      },
    ],
  },
  {
    id: 4,
    name: "Terrance Gatsby",
    title: "Communications Director",
    image: "/images/board/terrance.jpg",
    initiatives: [
      {
        title: "Brand Awareness Campaign",
        description: "Multi-channel marketing strategy for brand recognition",
        status: "active",
        progress: 45,
      },
      {
        title: "Community Engagement",
        description: "Building educator and parent community partnerships",
        status: "planning",
        progress: 15,
      },
    ],
  },
  {
    id: 5,
    name: "Kevin Stursberg",
    title: "Accounting Director",
    image: "/images/board/kevin.jpg",
    initiatives: [
      {
        title: "Financial Reporting Enhancement",
        description:
          "Streamlined financial reporting and dashboard development",
        status: "active",
        progress: 70,
      },
      {
        title: "Audit Preparation",
        description: "Preparing for annual external audit",
        status: "active",
        progress: 50,
      },
    ],
  },
  {
    id: 6,
    name: "McKayla Reece",
    title: "Marketing & Education Director",
    image: "/images/board/mckayla.jpg",
    initiatives: [
      {
        title: "Curriculum Alignment",
        description: "Aligning game content with state educational standards",
        status: "active",
        progress: 60,
      },
      {
        title: "Teacher Resource Hub",
        description: "Creating comprehensive resources for educators",
        status: "planning",
        progress: 25,
      },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#22c55e";
    case "active":
      return "#3b82f6";
    case "planning":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "active":
      return "In Progress";
    case "planning":
      return "Planning";
    default:
      return status;
  }
};

export default function InitiativesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.grid}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
      </div>

      <Container className={styles.container}>
        <div className={styles.backLink}>
          <Link href="/boardroom">← Back to Board Room</Link>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Board Initiatives</h1>
          <p className={styles.subtitle}>
            Track the strategic initiatives and projects led by each board
            member
          </p>
        </div>

        <div className={styles.membersList}>
          {boardMembers.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberAvatar}>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className={styles.memberInfo}>
                  <h2 className={styles.memberName}>{member.name}</h2>
                  <p className={styles.memberTitle}>{member.title}</p>
                </div>
              </div>

              <div className={styles.initiativesList}>
                {member.initiatives.map((initiative, idx) => (
                  <div key={idx} className={styles.initiativeItem}>
                    <div className={styles.initiativeHeader}>
                      <h3 className={styles.initiativeTitle}>
                        {initiative.title}
                      </h3>
                      <span
                        className={styles.initiativeStatus}
                        style={{
                          backgroundColor: `${getStatusColor(initiative.status)}20`,
                          color: getStatusColor(initiative.status),
                          borderColor: `${getStatusColor(initiative.status)}40`,
                        }}
                      >
                        {getStatusLabel(initiative.status)}
                      </span>
                    </div>
                    <p className={styles.initiativeDescription}>
                      {initiative.description}
                    </p>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${initiative.progress}%`,
                            backgroundColor: getStatusColor(initiative.status),
                          }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>
                        {initiative.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
