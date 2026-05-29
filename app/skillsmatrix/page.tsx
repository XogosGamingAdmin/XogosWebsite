"use client";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface Director {
  id: number;
  name: string;
  title: string;
}

interface Skill {
  id: string;
  name: string;
  target: number;
}

interface SkillCategory {
  name: string;
  color: string;
  skills: Skill[];
}

interface Ratings {
  [key: string]: number;
}

const SkillsMatrix = () => {
  const [directors, setDirectors] = useState<Director[]>([
    { id: 1, name: "Michael Weaver", title: "President, Insurance & Risk" },
    { id: 2, name: "Zack Edwards", title: "CEO" },
    { id: 3, name: "Braden Perry", title: "Legal Director" },
    { id: 4, name: "Terrance Gatsby", title: "Communications Director" },
    { id: 5, name: "Kevin Stursberg", title: "Accounting Director" },
    { id: 6, name: "McKayla Reece", title: "Marketing & Education Director" },
    { id: 7, name: "Open Position", title: "Compliance Director" },
  ]);

  const skillCategories: SkillCategory[] = [
    {
      name: "Core Governance Skills",
      color: "#e62739",
      skills: [
        { id: "strategic", name: "Strategic Planning", target: 5 },
        { id: "leadership", name: "Board Leadership", target: 3 },
        { id: "financial", name: "Financial Oversight", target: 3 },
        { id: "risk", name: "Risk Management", target: 3 },
        { id: "legal", name: "Legal/Regulatory Compliance", target: 2 },
        { id: "tech", name: "Technology Governance", target: 2 },
      ],
    },
    {
      name: "Educational Content and Assessment",
      color: "#7928ca",
      skills: [
        { id: "curriculum", name: "K-12 Curriculum Standards", target: 2 },
        { id: "gamedesign", name: "Educational Game Design", target: 2 },
        { id: "assessment", name: "Learning Assessment Methods", target: 1 },
        { id: "edtech", name: "Education Technology Trends", target: 2 },
        { id: "accessibility", name: "Accessibility in Education", target: 1 },
      ],
    },
    {
      name: "Cryptocurrency and Blockchain",
      color: "#2dd4bf",
      skills: [
        { id: "blockchain", name: "Blockchain Fundamentals", target: 2 },
        { id: "crypto", name: "Cryptocurrency Operations", target: 2 },
        { id: "tokenomics", name: "Token Economics", target: 2 },
        { id: "cryptoreg", name: "Crypto Regulatory Landscape", target: 2 },
        { id: "security", name: "Digital Asset Security", target: 1 },
      ],
    },
    {
      name: "Youth Protection and Data Privacy",
      color: "#f59e0b",
      skills: [
        { id: "studentprotection", name: "Student Online Protection", target: 2 },
        { id: "dataprivacy", name: "Student Data Privacy", target: 2 },
        { id: "gaming", name: "Responsible Gaming Practices", target: 1 },
        { id: "identity", name: "Identity Verification", target: 1 },
        { id: "citizenship", name: "Digital Citizenship", target: 1 },
      ],
    },
    {
      name: "Scholarship and Financial Education Models",
      color: "#8b5cf6",
      skills: [
        { id: "scholaradmin", name: "Scholarship Administration", target: 2 },
        { id: "highered", name: "Higher Education Financing", target: 1 },
        { id: "finlit", name: "Financial Literacy Education", target: 1 },
        { id: "incentive", name: "Incentive Program Design", target: 2 },
        { id: "impact", name: "Impact Measurement", target: 1 },
      ],
    },
  ];

  const [ratings, setRatings] = useState<Ratings>({});

  useEffect(() => {
    const initialRatings: Ratings = {};
    directors.forEach((director) => {
      skillCategories.forEach((category) => {
        category.skills.forEach((skill) => {
          const key = `${director.id}-${skill.id}`;
          if ((ratings as Ratings)[key] === undefined) {
            initialRatings[key] = 0;
          }
        });
      });
    });

    if (Object.keys(initialRatings).length > 0) {
      setRatings((prev) => ({ ...prev, ...initialRatings }));
    }
  }, [directors, skillCategories]);

  const handleRatingChange = (
    directorId: number,
    skillId: string,
    value: number
  ) => {
    const key = `${directorId}-${skillId}`;
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const getRatingColor = (rating: number): string => {
    switch (rating) {
      case 4:
        return "#16a34a";
      case 3:
        return "#22c55e";
      case 2:
        return "#eab308";
      case 1:
        return "#f97316";
      case 0:
      default:
        return "#dc2626";
    }
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 4:
        return "Expert";
      case 3:
        return "Proficient";
      case 2:
        return "Basic";
      case 1:
        return "Limited";
      case 0:
      default:
        return "None";
    }
  };

  const analyzeGaps = (skillId: string): { status: string; text: string } => {
    const proficientCount = directors.reduce((count, director) => {
      const key = `${director.id}-${skillId}`;
      return ratings[key] >= 3 ? count + 1 : count;
    }, 0);

    const skill = skillCategories
      .flatMap((category) => category.skills)
      .find((s) => s.id === skillId);

    if (skill) {
      if (proficientCount >= skill.target) {
        return { status: "met", text: "Target Met" };
      } else {
        return {
          status: "gap",
          text: `Need ${skill.target - proficientCount} more`,
        };
      }
    }

    return { status: "unknown", text: "" };
  };

  const getPriorityAreas = (): Skill[] => {
    return skillCategories.flatMap((category) =>
      category.skills.filter((skill) => {
        const proficientCount = directors.reduce((count, director) => {
          const key = `${director.id}-${skill.id}`;
          return ratings[key] >= 3 ? count + 1 : count;
        }, 0);
        return proficientCount < skill.target;
      })
    );
  };

  return (
    <MarketingLayout>
      <div className={styles.skillsPage}>
        {/* Background Effects */}
        <div className={styles.skillsBackground}>
          <div className={styles.skillsGrid}></div>
          <div className={styles.bgGlow}></div>
          <div className={styles.bgGlow}></div>
          <div className={styles.bgGlow}></div>
        </div>

        <Container className={styles.container}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Board Skills Matrix</h1>
            <p className={styles.heroDescription}>
              Comprehensive assessment of board member expertise across key
              areas critical to Xogos Gaming&apos;s mission and operations.
            </p>
          </div>

          {/* Rating Scale Legend */}
          <div className={styles.legendSection}>
            <h2 className={styles.legendTitle}>Proficiency Rating Scale</h2>
            <div className={styles.legendGrid}>
              {[
                {
                  level: 4,
                  label: "Expert",
                  desc: "Extensive professional experience; recognized authority",
                },
                {
                  level: 3,
                  label: "Proficient",
                  desc: "Solid working knowledge and practical experience",
                },
                {
                  level: 2,
                  label: "Basic",
                  desc: "Fundamental understanding but limited experience",
                },
                {
                  level: 1,
                  label: "Limited",
                  desc: "Minimal knowledge; needs education",
                },
                { level: 0, label: "None", desc: "No knowledge or experience" },
              ].map((item) => (
                <div key={item.level} className={styles.legendItem}>
                  <div
                    className={styles.legendBadge}
                    style={{ backgroundColor: getRatingColor(item.level) }}
                  >
                    {item.level}
                  </div>
                  <div className={styles.legendContent}>
                    <h4 className={styles.legendLabel}>{item.label}</h4>
                    <p className={styles.legendDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Matrix */}
          <div className={styles.matrixSection}>
            {skillCategories.map((category) => (
              <div key={category.name} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h2
                    className={styles.categoryTitle}
                    style={{ color: category.color }}
                  >
                    {category.name}
                  </h2>
                  <div
                    className={styles.categoryAccent}
                    style={{ backgroundColor: category.color }}
                  ></div>
                </div>

                <div className={styles.skillsTable}>
                  {/* Table Header */}
                  <div className={styles.tableHeader}>
                    <div className={styles.skillNameHeader}>Skill Area</div>
                    {directors.map((director) => (
                      <div key={director.id} className={styles.directorHeader}>
                        <div className={styles.directorName}>
                          {director.name}
                        </div>
                        <div className={styles.directorTitle}>
                          {director.title}
                        </div>
                      </div>
                    ))}
                    <div className={styles.targetHeader}>Target</div>
                    <div className={styles.gapHeader}>Gap Analysis</div>
                  </div>

                  {/* Table Body */}
                  {category.skills.map((skill) => (
                    <div key={skill.id} className={styles.skillRow}>
                      <div className={styles.skillName}>{skill.name}</div>

                      {directors.map((director) => {
                        const key = `${director.id}-${skill.id}`;
                        const rating = ratings[key] || 0;
                        return (
                          <div key={director.id} className={styles.ratingCell}>
                            <select
                              className={styles.ratingSelect}
                              style={{
                                backgroundColor: getRatingColor(rating),
                                color: rating <= 1 ? "white" : "#000",
                              }}
                              value={rating}
                              onChange={(e) =>
                                handleRatingChange(
                                  director.id,
                                  skill.id,
                                  parseInt(e.target.value)
                                )
                              }
                            >
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                            <div className={styles.ratingLabel}>
                              {getRatingText(rating)}
                            </div>
                          </div>
                        );
                      })}

                      <div className={styles.targetCell}>
                        <span className={styles.targetValue}>
                          {skill.target}
                        </span>
                        <span className={styles.targetLabel}>at level 3+</span>
                      </div>

                      <div className={styles.gapCell}>
                        {(() => {
                          const gap = analyzeGaps(skill.id);
                          return (
                            <span
                              className={`${styles.gapStatus} ${styles[gap.status]}`}
                            >
                              {gap.text}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Priority Development Areas */}
          <div className={styles.prioritySection}>
            <h2 className={styles.priorityTitle}>Priority Development Areas</h2>
            <p className={styles.priorityDescription}>
              Based on the current assessment, these skill areas need
              development to meet our target proficiency levels:
            </p>

            <div className={styles.priorityGrid}>
              {getPriorityAreas().map((skill) => (
                <div key={skill.id} className={styles.priorityItem}>
                  <h4 className={styles.prioritySkillName}>{skill.name}</h4>
                  <div className={styles.priorityGap}>
                    {analyzeGaps(skill.id).text}
                  </div>
                </div>
              ))}
            </div>

            {getPriorityAreas().length === 0 && (
              <div className={styles.noPriorities}>
                <span className={styles.successIcon}>✓</span>
                All skill areas meet target proficiency levels!
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className={styles.summarySection}>
            <h2 className={styles.summaryTitle}>Skills Overview</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryValue}>
                  {skillCategories.reduce(
                    (total, cat) => total + cat.skills.length,
                    0
                  )}
                </div>
                <div className={styles.summaryLabel}>Total Skills Tracked</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryValue}>
                  {skillCategories.reduce(
                    (total, cat) =>
                      total +
                      cat.skills.reduce((sum, skill) => sum + skill.target, 0),
                    0
                  )}
                </div>
                <div className={styles.summaryLabel}>Target Proficiencies</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryValue}>
                  {getPriorityAreas().length}
                </div>
                <div className={styles.summaryLabel}>
                  Development Priorities
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryValue}>
                  {Math.round(
                    ((skillCategories.reduce(
                      (total, cat) =>
                        total +
                        cat.skills.reduce(
                          (sum, skill) => sum + skill.target,
                          0
                        ),
                      0
                    ) -
                      getPriorityAreas().length) /
                      skillCategories.reduce(
                        (total, cat) =>
                          total +
                          cat.skills.reduce(
                            (sum, skill) => sum + skill.target,
                            0
                          ),
                        0
                      )) *
                      100
                  )}
                  %
                </div>
                <div className={styles.summaryLabel}>Targets Met</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </MarketingLayout>
  );
};

export default SkillsMatrix;
