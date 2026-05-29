"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface SkillData {
  id: string;
  user_email: string;
  user_name: string;
  user_avatar: string | null;
  skill_category: string;
  skill_name: string;
  proficiency_level: number;
}

interface MemberWithSkills {
  user_email: string;
  user_name: string;
  user_avatar: string | null;
  skills_count: number;
  last_updated: string | null;
}

interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Core Governance Skills",
    color: "#e62739",
    skills: ["Strategic Planning", "Board Leadership", "Financial Oversight", "Risk Management", "Legal/Regulatory Compliance", "Technology Governance"],
  },
  {
    name: "Educational Content & Assessment",
    color: "#7928ca",
    skills: ["K-12 Curriculum Standards", "Educational Game Design", "Learning Assessment Methods", "Education Technology Trends", "Accessibility in Education"],
  },
  {
    name: "Cryptocurrency & Blockchain",
    color: "#2dd4bf",
    skills: ["Blockchain Fundamentals", "Cryptocurrency Operations", "Token Economics", "Crypto Regulatory Landscape", "Digital Asset Security"],
  },
  {
    name: "Youth Protection & Data Privacy",
    color: "#f59e0b",
    skills: ["Student Online Protection", "Student Data Privacy", "Responsible Gaming Practices", "Identity Verification", "Digital Citizenship"],
  },
  {
    name: "Scholarship & Financial Education",
    color: "#8b5cf6",
    skills: ["Scholarship Administration", "Higher Education Financing", "Financial Literacy Education", "Incentive Program Design", "Impact Measurement"],
  },
  {
    name: "Marketing & Communications",
    color: "#3b82f6",
    skills: ["Brand Development", "Social Media Marketing", "Public Relations", "Content Strategy", "Marketing Analytics"],
  },
];

export default function SkillsResultsPage() {
  const [allSkills, setAllSkills] = useState<SkillData[]>([]);
  const [membersWithSkills, setMembersWithSkills] = useState<MemberWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        setAllSkills(data.allSkills || []);
        setMembersWithSkills(data.membersWithSkills || []);
      }
    } catch (error) {
      console.error("Error fetching skills data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number): string => {
    switch (rating) {
      case 5: return "#16a34a";
      case 4: return "#22c55e";
      case 3: return "#eab308";
      case 2: return "#f97316";
      case 1: return "#ef4444";
      default: return "#374151";
    }
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 5: return "Expert";
      case 4: return "Proficient";
      case 3: return "Intermediate";
      case 2: return "Basic";
      case 1: return "Novice";
      default: return "N/A";
    }
  };

  const getMemberSkills = (memberEmail: string) => {
    return allSkills.filter((s) => s.user_email === memberEmail);
  };

  const getMemberSkillLevel = (memberEmail: string, skillName: string): number => {
    const skill = allSkills.find(
      (s) => s.user_email === memberEmail && s.skill_name === skillName
    );
    return skill?.proficiency_level || 0;
  };

  const getSkillAverage = (skillName: string): number => {
    const skillRatings = allSkills.filter((s) => s.skill_name === skillName);
    if (skillRatings.length === 0) return 0;
    const sum = skillRatings.reduce((acc, s) => acc + s.proficiency_level, 0);
    return sum / skillRatings.length;
  };

  const getCategoryAverage = (categoryName: string): number => {
    const category = skillCategories.find((c) => c.name === categoryName);
    if (!category) return 0;

    const averages = category.skills.map((skill) => getSkillAverage(skill));
    const validAverages = averages.filter((a) => a > 0);
    if (validAverages.length === 0) return 0;

    return validAverages.reduce((a, b) => a + b, 0) / validAverages.length;
  };

  const getGapAnalysis = () => {
    const gaps: { skill: string; category: string; avg: number; gap: string }[] = [];

    skillCategories.forEach((category) => {
      category.skills.forEach((skill) => {
        const avg = getSkillAverage(skill);
        if (avg < 3) {
          gaps.push({
            skill,
            category: category.name,
            avg,
            gap: avg === 0 ? "No coverage" : avg < 2 ? "Critical gap" : "Needs development",
          });
        }
      });
    });

    return gaps.sort((a, b) => a.avg - b.avg);
  };

  const assessedMembers = membersWithSkills.filter((m) => m.skills_count > 0);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.background}>
          <div className={styles.grid}></div>
          <div className={styles.glow}></div>
          <div className={styles.glow}></div>
          <div className={styles.glow}></div>
        </div>
        <Container className={styles.container}>
          <div className={styles.loading}>Loading team results...</div>
        </Container>
      </div>
    );
  }

  const gaps = getGapAnalysis();

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
          <Link href="/boardroom/skills-matrix">← Back to My Assessment</Link>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Team Skills Results</h1>
          <p className={styles.subtitle}>
            Individual assessments and collective skill analysis
          </p>
        </div>

        <div className={styles.statsOverview}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{assessedMembers.length}</div>
            <div className={styles.statLabel}>Members Assessed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{allSkills.length}</div>
            <div className={styles.statLabel}>Total Ratings</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: gaps.length > 5 ? "#ef4444" : gaps.length > 0 ? "#f59e0b" : "#22c55e" }}>
              {gaps.length}
            </div>
            <div className={styles.statLabel}>Skill Gaps</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0)}
            </div>
            <div className={styles.statLabel}>Skills Tracked</div>
          </div>
        </div>

        {/* Gap Analysis Section */}
        {gaps.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>⚠️ Board Skill Gaps</h2>
            <p className={styles.sectionDescription}>
              Areas where the board lacks sufficient expertise (average below 3.0)
            </p>
            <div className={styles.gapsGrid}>
              {gaps.map((gap, idx) => (
                <div key={idx} className={styles.gapCard} data-severity={gap.avg === 0 ? "critical" : gap.avg < 2 ? "high" : "medium"}>
                  <div className={styles.gapHeader}>
                    <span className={styles.gapSkill}>{gap.skill}</span>
                    <span className={styles.gapBadge} style={{ backgroundColor: getRatingColor(Math.round(gap.avg)) }}>
                      {gap.avg > 0 ? gap.avg.toFixed(1) : "0"}
                    </span>
                  </div>
                  <div className={styles.gapMeta}>
                    <span className={styles.gapCategory}>{gap.category}</span>
                    <span className={styles.gapLevel}>{gap.gap}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Collective Skills by Category */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📊 Collective Skill Breakdown</h2>
          <p className={styles.sectionDescription}>
            Team-wide proficiency averages by category and skill
          </p>
          <div className={styles.collectiveGrid}>
            {skillCategories.map((category) => {
              const catAvg = getCategoryAverage(category.name);

              return (
                <div key={category.name} className={styles.collectiveCard}>
                  <div className={styles.collectiveHeader} style={{ borderColor: category.color }}>
                    <h3 className={styles.collectiveCategory} style={{ color: category.color }}>
                      {category.name}
                    </h3>
                    <div
                      className={styles.collectiveAvg}
                      style={{ backgroundColor: getRatingColor(Math.round(catAvg)) }}
                    >
                      {catAvg > 0 ? catAvg.toFixed(1) : "—"}
                    </div>
                  </div>
                  <div className={styles.collectiveSkills}>
                    {category.skills.map((skill) => {
                      const avg = getSkillAverage(skill);
                      return (
                        <div key={skill} className={styles.collectiveSkill}>
                          <span className={styles.collectiveSkillName}>{skill}</span>
                          <div className={styles.collectiveBar}>
                            <div
                              className={styles.collectiveBarFill}
                              style={{
                                width: `${(avg / 5) * 100}%`,
                                backgroundColor: getRatingColor(Math.round(avg)),
                              }}
                            ></div>
                          </div>
                          <span className={styles.collectiveSkillValue}>
                            {avg > 0 ? avg.toFixed(1) : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Individual Member Results */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>👤 Individual Board Member Results</h2>
          <p className={styles.sectionDescription}>
            Click on a board member to view their detailed assessment
          </p>

          <div className={styles.memberTabs}>
            {membersWithSkills.map((member) => {
              const skillCount = member.skills_count;
              return (
                <button
                  key={member.user_email}
                  className={`${styles.memberTab} ${selectedMember === member.user_email ? styles.active : ""}`}
                  onClick={() => setSelectedMember(selectedMember === member.user_email ? null : member.user_email)}
                >
                  {member.user_avatar && (
                    <img src={member.user_avatar} alt={member.user_name} className={styles.memberAvatar} />
                  )}
                  <div className={styles.memberTabInfo}>
                    <span className={styles.memberName}>{member.user_name}</span>
                    <span className={styles.memberSkillCount}>
                      {skillCount > 0 ? `${skillCount} skills rated` : "Not assessed"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedMember && (
            <div className={styles.memberDetail}>
              {(() => {
                const member = membersWithSkills.find((m) => m.user_email === selectedMember);
                const memberSkills = getMemberSkills(selectedMember);

                if (!member) return null;

                return (
                  <>
                    <div className={styles.memberDetailHeader}>
                      {member.user_avatar && (
                        <img src={member.user_avatar} alt={member.user_name} className={styles.memberDetailAvatar} />
                      )}
                      <div className={styles.memberDetailInfo}>
                        <h3 className={styles.memberDetailName}>{member.user_name}</h3>
                        <p className={styles.memberDetailMeta}>
                          {memberSkills.length} skills assessed
                          {member.last_updated && (
                            <> • Last updated: {new Date(member.last_updated).toLocaleDateString()}</>
                          )}
                        </p>
                      </div>
                    </div>

                    {memberSkills.length === 0 ? (
                      <div className={styles.noSkills}>
                        This board member has not completed their skills assessment yet.
                      </div>
                    ) : (
                      <div className={styles.memberSkillsGrid}>
                        {skillCategories.map((category) => {
                          const categorySkills = memberSkills.filter(
                            (s) => s.skill_category === category.name
                          );
                          if (categorySkills.length === 0) return null;

                          return (
                            <div key={category.name} className={styles.memberCategoryCard}>
                              <h4 className={styles.memberCategoryTitle} style={{ color: category.color }}>
                                {category.name}
                              </h4>
                              <table className={styles.skillsTable}>
                                <thead>
                                  <tr>
                                    <th>Skill</th>
                                    <th>Level</th>
                                    <th>Rating</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {categorySkills.map((skill) => (
                                    <tr key={skill.id}>
                                      <td>{skill.skill_name}</td>
                                      <td>
                                        <span
                                          className={styles.levelBadge}
                                          style={{ backgroundColor: getRatingColor(skill.proficiency_level) }}
                                        >
                                          {skill.proficiency_level}
                                        </span>
                                      </td>
                                      <td>{getRatingText(skill.proficiency_level)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
