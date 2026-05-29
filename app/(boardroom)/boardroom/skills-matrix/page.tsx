"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface SkillCategory {
  name: string;
  color: string;
  skills: { id: string; name: string; description: string }[];
}

const defaultSkillCategories: SkillCategory[] = [
  {
    name: "Core Governance Skills",
    color: "#e62739",
    skills: [
      { id: "strategic", name: "Strategic Planning", description: "Long-term vision and planning" },
      { id: "leadership", name: "Board Leadership", description: "Leading board discussions and decisions" },
      { id: "financial", name: "Financial Oversight", description: "Budget review and financial governance" },
      { id: "risk", name: "Risk Management", description: "Identifying and mitigating risks" },
      { id: "legal", name: "Legal/Regulatory Compliance", description: "Understanding legal requirements" },
      { id: "tech", name: "Technology Governance", description: "Overseeing technology decisions" },
    ],
  },
  {
    name: "Educational Content & Assessment",
    color: "#7928ca",
    skills: [
      { id: "curriculum", name: "K-12 Curriculum Standards", description: "Knowledge of education standards" },
      { id: "gamedesign", name: "Educational Game Design", description: "Designing engaging learning games" },
      { id: "assessment", name: "Learning Assessment Methods", description: "Evaluating student progress" },
      { id: "edtech", name: "Education Technology Trends", description: "Current EdTech landscape" },
      { id: "accessibility", name: "Accessibility in Education", description: "Inclusive learning design" },
    ],
  },
  {
    name: "Cryptocurrency & Blockchain",
    color: "#2dd4bf",
    skills: [
      { id: "blockchain", name: "Blockchain Fundamentals", description: "Understanding blockchain technology" },
      { id: "crypto", name: "Cryptocurrency Operations", description: "Managing digital assets" },
      { id: "tokenomics", name: "Token Economics", description: "Token design and economics" },
      { id: "cryptoreg", name: "Crypto Regulatory Landscape", description: "Compliance requirements" },
      { id: "security", name: "Digital Asset Security", description: "Protecting digital assets" },
    ],
  },
  {
    name: "Youth Protection & Data Privacy",
    color: "#f59e0b",
    skills: [
      { id: "studentprotection", name: "Student Online Protection", description: "COPPA and safety measures" },
      { id: "dataprivacy", name: "Student Data Privacy", description: "FERPA and data protection" },
      { id: "gaming", name: "Responsible Gaming Practices", description: "Ethical gaming principles" },
      { id: "identity", name: "Identity Verification", description: "Age and identity verification" },
      { id: "citizenship", name: "Digital Citizenship", description: "Online behavior education" },
    ],
  },
  {
    name: "Scholarship & Financial Education",
    color: "#8b5cf6",
    skills: [
      { id: "scholaradmin", name: "Scholarship Administration", description: "Managing scholarship programs" },
      { id: "highered", name: "Higher Education Financing", description: "College funding knowledge" },
      { id: "finlit", name: "Financial Literacy Education", description: "Teaching money management" },
      { id: "incentive", name: "Incentive Program Design", description: "Reward system design" },
      { id: "impact", name: "Impact Measurement", description: "Measuring educational outcomes" },
    ],
  },
  {
    name: "Marketing & Communications",
    color: "#3b82f6",
    skills: [
      { id: "branding", name: "Brand Development", description: "Building brand identity" },
      { id: "socialmedia", name: "Social Media Marketing", description: "Digital marketing strategies" },
      { id: "pr", name: "Public Relations", description: "Media and stakeholder relations" },
      { id: "content", name: "Content Strategy", description: "Content planning and creation" },
      { id: "analytics", name: "Marketing Analytics", description: "Measuring marketing effectiveness" },
    ],
  },
];

interface SkillRating {
  category: string;
  skillId: string;
  level: number;
}

export default function SkillsMatrixPage() {
  const { data: session } = useSession();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "";

  useEffect(() => {
    loadMySkills();
  }, [session]);

  const loadMySkills = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/skills/my");
      if (res.ok) {
        const data = await res.json();
        const ratingsMap: Record<string, number> = {};
        (data.mySkills || []).forEach((skill: { skill_category: string; skill_name: string; proficiency_level: number }) => {
          const key = `${skill.skill_category}|${skill.skill_name}`;
          ratingsMap[key] = skill.proficiency_level;
        });
        setRatings(ratingsMap);
      }
    } catch (error) {
      console.error("Error loading skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category: string, skillId: string, skillName: string, level: number) => {
    const key = `${category}|${skillName}`;
    setRatings((prev) => ({ ...prev, [key]: level }));
  };

  const handleSave = async () => {
    if (!session?.user?.email) {
      setMessage({ type: "error", text: "You must be signed in to save" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const skills: { skillCategory: string; skillName: string; proficiencyLevel: number }[] = [];

      Object.entries(ratings).forEach(([key, level]) => {
        if (level > 0) {
          const [category, skillName] = key.split("|");
          skills.push({
            skillCategory: category,
            skillName: skillName,
            proficiencyLevel: level,
          });
        }
      });

      const res = await fetch("/api/skills/my", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ type: "success", text: "Your skills assessment has been saved!" });
    } catch (error) {
      console.error("Error saving skills:", error);
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
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
      default: return "Not Rated";
    }
  };

  const countRated = () => Object.values(ratings).filter((r) => r > 0).length;
  const totalSkills = defaultSkillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);

  if (loading) {
    return (
      <div className={styles.skillsPage}>
        <div className={styles.skillsBackground}>
          <div className={styles.skillsGrid}></div>
          <div className={styles.bgGlow}></div>
          <div className={styles.bgGlow}></div>
          <div className={styles.bgGlow}></div>
        </div>
        <Container className={styles.container}>
          <div className={styles.loadingState}>Loading your skills assessment...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.skillsPage}>
      <div className={styles.skillsBackground}>
        <div className={styles.skillsGrid}></div>
        <div className={styles.bgGlow}></div>
        <div className={styles.bgGlow}></div>
        <div className={styles.bgGlow}></div>
      </div>

      <Container className={styles.container}>
        <div className={styles.backLink}>
          <Link href="/boardroom">← Back to Board Room</Link>
        </div>

        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>My Skills Assessment</h1>
          <p className={styles.heroDescription}>
            {userName
              ? `Welcome, ${userName}. Rate your proficiency level (1-5) for each skill area.`
              : "Rate your proficiency level (1-5) for each skill area."}
          </p>
          <div className={styles.heroActions}>
            <Link href="/boardroom/skills-matrix/results" className={styles.viewResultsBtn}>
              📊 View Team Results & Gap Analysis
            </Link>
          </div>
        </div>

        {message && (
          <div className={`${styles.messageBar} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.progressBar}>
          <div className={styles.progressInfo}>
            <span>Assessment Progress</span>
            <span>{countRated()} / {totalSkills} skills rated</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${(countRated() / totalSkills) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className={styles.legendSection}>
          <h3 className={styles.legendTitle}>Proficiency Rating Scale</h3>
          <div className={styles.legendGrid}>
            {[
              { level: 5, label: "Expert", desc: "Recognized authority; extensive professional experience" },
              { level: 4, label: "Proficient", desc: "Solid working knowledge and practical experience" },
              { level: 3, label: "Intermediate", desc: "Good understanding with some experience" },
              { level: 2, label: "Basic", desc: "Fundamental understanding but limited experience" },
              { level: 1, label: "Novice", desc: "Minimal knowledge; needs development" },
            ].map((item) => (
              <div key={item.level} className={styles.legendItem}>
                <div
                  className={styles.legendBadge}
                  style={{ backgroundColor: getRatingColor(item.level) }}
                >
                  {item.level}
                </div>
                <div className={styles.legendContent}>
                  <span className={styles.legendLabel}>{item.label}</span>
                  <span className={styles.legendDesc}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.matrixSection}>
          {defaultSkillCategories.map((category) => (
            <div key={category.name} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle} style={{ color: category.color }}>
                  {category.name}
                </h2>
                <div className={styles.categoryAccent} style={{ backgroundColor: category.color }}></div>
              </div>

              <div className={styles.skillsTable}>
                {category.skills.map((skill) => {
                  const key = `${category.name}|${skill.name}`;
                  const currentRating = ratings[key] || 0;

                  return (
                    <div key={skill.id} className={styles.skillRow}>
                      <div className={styles.skillInfo}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillDescription}>{skill.description}</span>
                      </div>
                      <div className={styles.ratingButtons}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            className={`${styles.ratingBtn} ${currentRating === level ? styles.selected : ""}`}
                            style={currentRating === level ? { backgroundColor: getRatingColor(level), borderColor: getRatingColor(level) } : {}}
                            onClick={() => handleRatingChange(category.name, skill.id, skill.name, level)}
                            title={getRatingText(level)}
                          >
                            {level}
                          </button>
                        ))}
                        <span className={styles.ratingLabel}>{getRatingText(currentRating)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.saveSection}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving || !session}
          >
            {saving ? "Saving..." : "💾 Save My Assessment"}
          </button>
          <p className={styles.saveHint}>
            Your assessment is saved to the database and can be updated anytime.
          </p>
        </div>
      </Container>
    </div>
  );
}
