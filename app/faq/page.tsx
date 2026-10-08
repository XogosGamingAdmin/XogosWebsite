"use client";

import Link from "next/link";
import React, { useState } from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "@/components/Marketing/InfoPage.module.css";

interface Faq {
  question: string;
  answer: string[]; // paragraphs
  bullets?: string[];
}

interface FaqGroup {
  id: string;
  icon: string;
  title: string;
  faqs: Faq[];
}

const groups: FaqGroup[] = [
  {
    id: "about",
    icon: "🎮",
    title: "About Xogos",
    faqs: [
      {
        question: "What is Xogos Gaming?",
        answer: [
          "Xogos is an educational gaming platform for students ages 6 to 19. One membership gives a student a library of learning games, hands-on elective classes (we call them academies), and the iPlay coin system, which turns time spent learning into real scholarship money.",
          "Our games are built to be about 70% fun and 30% educational. Kids come back because they enjoy them, and every session teaches a little more.",
        ],
      },
      {
        question: "Who is Xogos for?",
        answer: [
          "Students ages 6 to 19 and the adults who guide them: homeschool families, parents looking for better screen time, and teachers and schools who want engaging electives and enrichment.",
        ],
      },
      {
        question: "Who built Xogos?",
        answer: [
          "Xogos was founded by Zack Edwards, a game designer with more than 20 years in educational games and the creator of Historical Conquest. Teachers and parents loved his physical games but asked for a digital version, plus math, science, English and personal finance, without ads or pay-to-win tricks. Xogos is the answer to that request.",
          "Today the platform is built with a team of developers and partner game studios, with guidance from a Board of Advisors.",
        ],
      },
      {
        question: "Is Xogos a curriculum or a supplement?",
        answer: [
          "A supplement. Xogos sits alongside whatever curriculum you already use. Families and schools use it for electives, enrichment and reinforcement, often as a daily elective block or as reward-based practice for subjects a student resists.",
        ],
      },
      {
        question: "Where do students play?",
        answer: [
          "At www.myXogos.com in a web browser on a computer, Chromebook or tablet. Most games launch straight from the student's dashboard with one sign-in, so there is nothing to install.",
        ],
      },
    ],
  },
  {
    id: "learning",
    icon: "📚",
    title: "Games & Academies",
    faqs: [
      {
        question: "What kinds of games are on Xogos?",
        answer: [
          "Games cover history, math, science, typing and literacy, health, STEM and personal finance. A few examples:",
        ],
        bullets: [
          "Historical Conquest: strategy and history",
          "Debt Free Millionaire: real-world money decisions",
          "Monster Math: math practice that feels like a game",
          "Turbo Type: keyboarding speed and accuracy",
          "Medical Diagnosis: solve patient cases with real science",
          "Totally Medieval and Lightning Round: history challenges",
        ],
      },
      {
        question: "What are the academies (elective classes)?",
        answer: [
          "Academies are elective classes included with the membership. They push learning off the screen with real-world assignments: cooking in KitchenLab, astronomy and science in the Science Hub, personal finance in the DFM Learning Academy, game design in The Forge, languages in ABC Language Academy, and career paths in our trade and medical academies.",
          "When a student finishes quizzes and activities, their grades appear on the parent's dashboard, one card per course.",
        ],
      },
      {
        question: "What is Academy XP?",
        answer: [
          "Many academies award XP (experience points) as students progress. Academy XP is separate from iPlay coins. As academies join the program, students can move XP from an academy into their Xogos XP wallet, then send it into any other participating academy for free.",
          "Moving XP into Xogos has a small 5% transfer fee. A transfer always starts with the student, on the Classes page.",
        ],
      },
      {
        question: "Are new games and classes added?",
        answer: [
          "Yes. We work with independent studios and educators to add new games and academies throughout the year. Every membership includes them automatically.",
        ],
      },
    ],
  },
  {
    id: "coins",
    icon: "🪙",
    title: "iPlay Coins & Scholarships",
    faqs: [
      {
        question: "How do students earn iPlay coins?",
        answer: ["Coins reward the things you already want students doing:"],
        bullets: [
          "Playing and completing educational games",
          "Keeping their grades up (report cards earn bonus coins)",
          "Volunteering: each verified hour of community service through iServ earns coins",
          "Staying active through Pryde Gym (coming soon)",
        ],
      },
      {
        question: "What can students do with their coins?",
        answer: [
          "Coins can be spent in games, or saved in the Xogos Bank. Saved coins grow through a savings multiplier, so students learn how saving and compound growth work. Students can also convert coins toward a real scholarship.",
        ],
      },
      {
        question: "How do coins become scholarship money?",
        answer: [
          "Each quarter, our partner non-profit Innovate the Future announces how much it has raised for scholarships. Students who convert coins that quarter share the funds in proportion to the coins they converted.",
          "For example, if ten students each convert 10 coins, each student contributed 10% of the coins and receives 10% of that quarter's funds.",
        ],
      },
      {
        question: "How much is one coin worth?",
        answer: [
          "There is no fixed dollar value, and we deliberately don't quote one. A coin's value depends on that quarter's scholarship funds and how many coins are converted.",
        ],
      },
      {
        question: "Where can scholarship funds be used?",
        answer: [
          "Toward post-secondary education: universities, community colleges, trade schools, certificate programs and other accredited programs. Each student's earnings are tracked in their Xogos Bank.",
        ],
      },
    ],
  },
  {
    id: "safety",
    icon: "🛡️",
    title: "Safety & Privacy",
    faqs: [
      {
        question: "Can my child talk to strangers?",
        answer: [
          "No. There is no open in-game chat, no public profiles and no way to search for other users. Students connect only with people they already know: family, classmates, and members of the same organization. Parents can see who their child is connected to.",
        ],
      },
      {
        question: "What can parents see and control?",
        answer: [
          "Every student account is linked to a parent account. From the parent dashboard you can:",
        ],
        bullets: [
          "See which games your child plays and for how long",
          "Set daily time limits; partner games respect them",
          "See academy grades, one card per course",
          "Follow coin earnings and scholarship progress",
          "Play the games alongside your child",
        ],
      },
      {
        question: "Who else is on the platform?",
        answer: [
          "Only students ages 6 to 19, their verified parents, and verified teachers. There are no influencers, no anonymous accounts and no random adults.",
        ],
      },
      {
        question: "Are there ads or in-game purchases?",
        answer: [
          "No. Xogos has no ads and no microtransactions. We earn money from memberships, not from keeping your child on a screen, so we have no reason to design for endless scrolling.",
        ],
      },
      {
        question: "How is my family's data protected?",
        answer: [
          "Accounts are protected by encrypted connections, rate-limited and verified sign-ins, and regular security reviews. Children's data is handled in line with COPPA. Read more on our Student Protection page.",
        ],
      },
    ],
  },
  {
    id: "membership",
    icon: "💳",
    title: "Membership & Accounts",
    faqs: [
      {
        question: "How much does a membership cost?",
        answer: [
          "One membership unlocks every game, every academy, and coin earning toward scholarships.",
        ],
        bullets: [
          "Monthly: $7 per month",
          "Yearly: $70 per year",
          "Lifetime: $150 one time, covering the student through age 19 (a 2026 launch promotion)",
        ],
      },
      {
        question: "How do we sign up?",
        answer: [
          "A parent or guardian creates the family account at www.myXogos.com and adds each student. Student accounts are always created through a parent, which keeps every child linked to a responsible adult.",
        ],
      },
      {
        question: "What happens when my child turns 19?",
        answer: [
          "Memberships cover students through age 19, the window in which coins can be earned and converted toward post-secondary education. The lifetime membership covers that whole span with one payment.",
        ],
      },
      {
        question: "My child or I can't sign in. What should we do?",
        answer: [
          'Use "Forgot password" on the sign-in page at www.myXogos.com. Students usually sign in with the email address on their account. After a few wrong tries, the sign-in page asks for a quick "I\'m human" check; that is normal.',
          "Still stuck? Send us a message from the Contact page and we'll help you get back in.",
        ],
      },
      {
        question: "Can schools, teachers or organizations use Xogos?",
        answer: [
          "Yes. Teachers can connect classrooms, and organizations such as scout troops, 4-H and honor societies can group their students. Contact us for classroom and group options.",
        ],
      },
      {
        question: "I make educational games. Can I publish on Xogos?",
        answer: [
          'We work with outside studios and educators. Partner games get single sign-on, play-time tracking, coins, badges and cloud saves through our integration. Choose "Game & academy partners" on the Contact page and tell us about your game.',
        ],
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: [...f.answer, ...(f.bullets || [])].join(" "),
      },
    }))
  ),
};

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>("about-0");

  return (
    <MarketingLayout>
      <PageTracker pagePath="/faq" pageName="FAQ" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className={styles.page}>
        <div className={styles.gridBackground} aria-hidden="true"></div>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>FREQUENTLY ASKED QUESTIONS</span>
          <h1 className={styles.heroTitle}>Questions about Xogos</h1>
          <p className={styles.heroSubtitle}>
            Everything families, teachers and partners ask us most: the games,
            the academies, iPlay coins and scholarships, safety, and membership.
          </p>
        </section>

        <section>
          <nav className={styles.topicNav} aria-label="FAQ topics">
            {groups.map((g) => (
              <a key={g.id} href={`#${g.id}`} className={styles.topicChip}>
                {g.icon} {g.title}
              </a>
            ))}
          </nav>
        </section>

        {groups.map((g) => (
          <section key={g.id} id={g.id} className={styles.faqSection}>
            <h2 className={styles.faqGroupTitle}>
              <span className={styles.faqGroupIcon} aria-hidden="true">
                {g.icon}
              </span>
              {g.title}
            </h2>
            <div className={styles.faqList}>
              {g.faqs.map((faq, index) => {
                const key = `${g.id}-${index}`;
                const isOpen = open === key;
                return (
                  <div
                    key={key}
                    className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.faqQuestion}
                      onClick={() => setOpen(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <span className={styles.faqToggle}>
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className={styles.faqAnswer}>
                        {faq.answer.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                        {faq.bullets && (
                          <ul>
                            {faq.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Didn&apos;t find your answer?</h2>
            <p className={styles.ctaText}>
              Send us a message and a real person will get back to you, or read
              the Parent&apos;s Guide for the full picture.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className={styles.primaryBtn}>
                Contact Us
              </Link>
              <Link href="/parent-guide" className={styles.secondaryBtn}>
                Parent&apos;s Guide
              </Link>
              <Link href="/student-protection" className={styles.secondaryBtn}>
                🛡️ Student Protection
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
