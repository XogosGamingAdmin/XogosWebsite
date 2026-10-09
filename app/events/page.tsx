"use client";

import Link from "next/link";
import React from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "@/components/Marketing/InfoPage.module.css";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "tournament" | "class" | "community" | "special";
  description: string;
  location: string;
  registrationUrl?: string;
}

const upcomingEvents: Event[] = [
  {
    id: "lightning-round-tournament",
    title: "Lightning Round Tournament",
    date: "Every Saturday",
    time: "2:00 PM - 4:00 PM EST",
    type: "tournament",
    description:
      "Weekly history trivia competition! Test your knowledge across all eras and earn bonus iPlay coins. Top 3 players each week win special badges.",
    location: "Online via myXogos.com",
  },
  {
    id: "monthly-spelling-bee",
    title: "Monthly Spelling Bee",
    date: "First Friday of each month",
    time: "4:00 PM EST",
    type: "tournament",
    description:
      "Compete against other students in our monthly spelling competition. All grade levels welcome with age-appropriate word lists.",
    location: "Online via myXogos.com",
  },
  {
    id: "kitchenlab-live",
    title: "KitchenLab Live Cook-Along",
    date: "Every Wednesday",
    time: "5:00 PM EST",
    type: "class",
    description:
      "Join our live cooking sessions where students follow along and create real recipes. Parents encouraged to participate!",
    location: "Online via myXogos.com",
  },
  {
    id: "game-design-workshop",
    title: "Game Design Workshop",
    date: "Second Saturday of each month",
    time: "11:00 AM EST",
    type: "class",
    description:
      "Learn the basics of game design in The Forge. This month: Creating engaging puzzles and challenges.",
    location: "Online via myXogos.com",
  },
  {
    id: "parent-info-session",
    title: "Parent Information Session",
    date: "Last Thursday of each month",
    time: "7:00 PM EST",
    type: "community",
    description:
      "Monthly Q&A for parents and educators. Learn about new features, ask questions, and connect with other Xogos families.",
    location: "Online via Zoom",
  },
  {
    id: "volunteer-day",
    title: "iServ Community Volunteer Day",
    date: "Third Saturday of each month",
    time: "9:00 AM - 12:00 PM (local time)",
    type: "community",
    description:
      "Earn iPlay coins while making a difference! Join coordinated volunteer activities in your local community through our iServ partners.",
    location: "Various local organizations",
  },
];

const pastHighlights = [
  {
    title: "Summer History Challenge 2026",
    description: "Over 500 students competed in our biggest tournament yet!",
    winner: "Congratulations to all participants",
  },
  {
    title: "Back to School Kickoff",
    description: "New academies launched: Marine Biology and Journalism",
    winner: "200+ students enrolled in the first week",
  },
  {
    title: "Financial Literacy Month",
    description: "Special Debt-Free Millionaire challenges all April",
    winner: "Players collectively saved over 50,000 virtual dollars",
  },
];

const typeColors: Record<Event["type"], string> = {
  tournament: "#e62739",
  class: "#7928ca",
  community: "#22c55e",
  special: "#e6bb84",
};

const typeLabels: Record<Event["type"], string> = {
  tournament: "Tournament",
  class: "Class",
  community: "Community",
  special: "Special Event",
};

export default function EventsPage() {
  return (
    <MarketingLayout>
      <PageTracker pagePath="/events" pageName="Events" />
      <div className={styles.page}>
        <div className={styles.gridBackground} aria-hidden="true"></div>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>XOGOS EVENTS</span>
          <h1 className={styles.heroTitle}>Join the Fun</h1>
          <p className={styles.heroSubtitle}>
            Tournaments, live classes, community days, and special events.
            There&apos;s always something happening on Xogos!
          </p>
        </section>

        <section className={styles.contactSection}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2
              className={styles.cardTitle}
              style={{ marginBottom: "24px", fontSize: "28px" }}
            >
              Upcoming Events
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={styles.card}
                  style={{ padding: "24px 28px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#fff",
                          background: typeColors[event.type],
                          borderRadius: "999px",
                          marginBottom: "8px",
                        }}
                      >
                        {typeLabels[event.type]}
                      </span>
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: 800,
                          color: "#fff",
                          margin: 0,
                        }}
                      >
                        {event.title}
                      </h3>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#e6bb84",
                        }}
                      >
                        {event.date}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "rgba(229, 229, 229, 0.7)",
                        }}
                      >
                        {event.time}
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: "rgba(229, 229, 229, 0.85)",
                      margin: "0 0 12px 0",
                    }}
                  >
                    {event.description}
                  </p>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "rgba(229, 229, 229, 0.6)",
                    }}
                  >
                    <strong>Location:</strong> {event.location}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "48px" }}>
              <h2
                className={styles.cardTitle}
                style={{ marginBottom: "24px", fontSize: "24px" }}
              >
                Recent Highlights
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "20px",
                }}
              >
                {pastHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className={styles.card}
                    style={{
                      padding: "20px 24px",
                      background:
                        "linear-gradient(135deg, rgba(121, 40, 202, 0.15) 0%, rgba(230, 39, 57, 0.1) 100%)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: "8px",
                      }}
                    >
                      {highlight.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.6,
                        color: "rgba(229, 229, 229, 0.8)",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {highlight.description}
                    </p>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#22c55e",
                        fontWeight: 600,
                      }}
                    >
                      {highlight.winner}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Never Miss an Event</h2>
            <p className={styles.ctaText}>
              All events are announced in the myXogos dashboard and via email to
              members. Sign up to join the community!
            </p>
            <div className={styles.ctaButtons}>
              <a
                href="https://www.myXogos.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryBtn}
              >
                Sign Up Now
              </a>
              <Link href="/faq" className={styles.secondaryBtn}>
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
