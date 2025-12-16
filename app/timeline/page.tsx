// app/timeline/page.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "./page.module.css";

// Utility function to get the current month and upcoming months
const getMonths = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const currentMonth = today.getMonth();

  return [
    months[currentMonth], // Current month
    months[(currentMonth + 1) % 12], // Next month
    months[(currentMonth + 2) % 12], // Two months from now
    months[(currentMonth + 3) % 12], // Three months from now
  ];
};

// Timeline data structure with monthly summaries
const generateTimelineData = () => {
  const [currentMonth, nextMonth, twoMonthsAhead, threeMonthsAhead] =
    getMonths();

  return {
    // Overall monthly summaries
    monthlySummaries: {
      currentMonth:
        "Risk assessment and educational content development focus with legal compliance evaluation",
      nextMonth:
        "Website migration to XogosGaming.com and RSS feed customization for each board role",
      twoMonthsAhead:
        "Monthly newsletter launch requiring one paragraph from each board member",
      threeMonthsAhead:
        "Partnership expansion and pilot program implementation with quarterly progress review",
    },

    // Detailed initiatives
    currentMonth: [
      {
        title: "Enterprise Risk Register",
        description:
          "Creating a dynamic risk register tracking organizational liabilities, particularly around student data, volunteer apps, and compliance changes.",
        owner: "Michael Weaver",
        status: "In Progress",
      },
      {
        title: "Game Development Pipeline",
        description:
          "Ensuring timely release of educational games aligned with K-12 curriculum updates and pilot school feedback.",
        owner: "Zack Edwards",
        status: "Ongoing",
      },
      {
        title: "Legal Aspects of Crypto Integration",
        description:
          "Examining legal ramifications of crypto-based rewards for students, ensuring compliance with SEC, FinCEN, and COPPA regulations.",
        owner: "Braden Perry",
        status: "Research Phase",
      },
      {
        title: "Financial Reporting Improvements",
        description:
          "Implementing updated financial reporting that integrates iServ-based scholarships and forecasts cash flow.",
        owner: "Kevin Stursberg",
        status: "Starting",
      },
    ],

    nextMonth: [
      {
        title: "Website Domain Migration",
        description:
          "Updating website to the new version and migrating to XogosGaming.com from the current vercel.app URL.",
        owner: "Technical Team",
        status: "Planned",
      },
      {
        title: "RSS Feed Customization",
        description:
          "Enhancing RSS feed implementation to be tailored to each board role. Each member to provide their RSS specifics by next meeting.",
        owner: "All Board Members",
        status: "Preparation",
      },
      {
        title: "Secure Student Wallet Systems",
        description:
          "Enhancing security, user experience, and age-appropriate features in the Xogos wallet for children's accounts.",
        owner: "Terrance Gatsby",
        status: "Planning",
      },
      {
        title: "Regulatory Review for Scholarship Program",
        description:
          "Auditing scholarship program processes and documentation to confirm compliance in all served districts.",
        owner: "Braden Perry",
        status: "Scheduled",
      },
    ],

    twoMonthsAhead: [
      {
        title: "Monthly Newsletter Launch",
        description:
          "Starting our monthly newsletter requiring one paragraph from each board member each month.",
        owner: "All Board Members",
        status: "Upcoming",
      },
      {
        title: "Educational Content Roadmap",
        description:
          "Expanding game-based curricula to cover more advanced financial topics, civics, and trades education.",
        owner: "McKayla Reece",
        status: "Planning",
      },
      {
        title: "Crypto Tax Reporting Framework",
        description:
          "Designing robust tax-reporting processes for iServ tokens and scholarship-related transactions.",
        owner: "Kevin Stursberg",
        status: "Research",
      },
      {
        title: "Exchange Listings & Partnerships",
        description:
          "Exploring new exchange listings for iServ and forming partnerships with fiat-crypto gateways.",
        owner: "Terrance Gatsby",
        status: "Initial Outreach",
      },
    ],

    threeMonthsAhead: [
      {
        title: "New Partnerships & Market Expansion",
        description:
          "Pursuing relationships with educational and corporate organizations to accelerate brand awareness and growth.",
        owner: "Zack Edwards",
        status: "Strategy Development",
      },
      {
        title: "Pilot Program for Curriculum Integration",
        description:
          "Bringing Xogos tools directly into classrooms with a pilot group of teachers across multiple states.",
        owner: "McKayla Reece",
        status: "Planning",
      },
      {
        title: "Board Initiative Review",
        description:
          "Quarterly assessment of all ongoing initiatives with progress reports and strategic adjustments.",
        owner: "Michael Weaver",
        status: "Scheduled",
      },
      {
        title: "Website Phase 2 Implementation",
        description:
          "Rolling out additional features and improvements to the website based on user feedback.",
        owner: "Technical Team",
        status: "Planning",
      },
    ],
  };
};

export default function TimelinePage() {
  const [currentMonth, nextMonth, twoMonthsAhead, threeMonthsAhead] =
    getMonths();
  const timelineData = generateTimelineData();
  const [expandedSections, setExpandedSections] = useState({
    currentMonth: false,
    nextMonth: false,
    twoMonthsAhead: false,
    threeMonthsAhead: false,
  });
  type SectionName =
    | "currentMonth"
    | "nextMonth"
    | "twoMonthsAhead"
    | "threeMonthsAhead";

  // Toggle section expansion
  const toggleSection = (section: SectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <MarketingLayout>
      <div className={styles.timelinePage}>
        <div className={styles.container}>
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Xogos Board Timeline</h1>
            <p className={styles.heroLead}>
              A four-month roadmap of our key initiatives and operational
              milestones
            </p>
          </div>

          <div className={styles.timelineContainer}>
            {/* Current Month */}
            <div className={styles.timelineColumn}>
              <div className={styles.monthHeader}>
                <h2 className={styles.monthTitle}>{currentMonth}</h2>
                <div className={styles.monthStatus}>Current</div>
              </div>

              <div className={styles.monthlySummary}>
                {timelineData.monthlySummaries.currentMonth}
              </div>

              <div
                className={styles.expandToggle}
                onClick={() => toggleSection("currentMonth")}
              >
                {expandedSections.currentMonth
                  ? "Hide Details"
                  : "Show Details"}
              </div>

              {expandedSections.currentMonth && (
                <div className={styles.itemsContainer}>
                  {timelineData.currentMonth.map((item, index) => (
                    <div
                      key={`current-${index}`}
                      className={styles.timelineItem}
                    >
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemDescription}>
                        {item.description}
                      </p>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemOwner}>
                          Owner: {item.owner}
                        </span>
                        <span
                          className={`${styles.itemStatus} ${styles[item.status.toLowerCase().replace(/\s+/g, "")]}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Next Month */}
            <div className={styles.timelineColumn}>
              <div className={styles.monthHeader}>
                <h2 className={styles.monthTitle}>{nextMonth}</h2>
                <div className={styles.monthStatus}>Next Month</div>
              </div>

              <div className={styles.monthlySummary}>
                {timelineData.monthlySummaries.nextMonth}
              </div>

              <div
                className={styles.expandToggle}
                onClick={() => toggleSection("nextMonth")}
              >
                {expandedSections.nextMonth ? "Hide Details" : "Show Details"}
              </div>

              {expandedSections.nextMonth && (
                <div className={styles.itemsContainer}>
                  {timelineData.nextMonth.map((item, index) => (
                    <div key={`next-${index}`} className={styles.timelineItem}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemDescription}>
                        {item.description}
                      </p>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemOwner}>
                          Owner: {item.owner}
                        </span>
                        <span
                          className={`${styles.itemStatus} ${styles[item.status.toLowerCase().replace(/\s+/g, "")]}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Two Months Ahead */}
            <div className={styles.timelineColumn}>
              <div className={styles.monthHeader}>
                <h2 className={styles.monthTitle}>{twoMonthsAhead}</h2>
                <div className={styles.monthStatus}>2 Months Ahead</div>
              </div>

              <div className={styles.monthlySummary}>
                {timelineData.monthlySummaries.twoMonthsAhead}
              </div>

              <div
                className={styles.expandToggle}
                onClick={() => toggleSection("twoMonthsAhead")}
              >
                {expandedSections.twoMonthsAhead
                  ? "Hide Details"
                  : "Show Details"}
              </div>

              {expandedSections.twoMonthsAhead && (
                <div className={styles.itemsContainer}>
                  {timelineData.twoMonthsAhead.map((item, index) => (
                    <div key={`two-${index}`} className={styles.timelineItem}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemDescription}>
                        {item.description}
                      </p>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemOwner}>
                          Owner: {item.owner}
                        </span>
                        <span
                          className={`${styles.itemStatus} ${styles[item.status.toLowerCase().replace(/\s+/g, "")]}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Three Months Ahead */}
            <div className={styles.timelineColumn}>
              <div className={styles.monthHeader}>
                <h2 className={styles.monthTitle}>{threeMonthsAhead}</h2>
                <div className={styles.monthStatus}>3 Months Ahead</div>
              </div>

              <div className={styles.monthlySummary}>
                {timelineData.monthlySummaries.threeMonthsAhead}
              </div>

              <div
                className={styles.expandToggle}
                onClick={() => toggleSection("threeMonthsAhead")}
              >
                {expandedSections.threeMonthsAhead
                  ? "Hide Details"
                  : "Show Details"}
              </div>

              {expandedSections.threeMonthsAhead && (
                <div className={styles.itemsContainer}>
                  {timelineData.threeMonthsAhead.map((item, index) => (
                    <div key={`three-${index}`} className={styles.timelineItem}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemDescription}>
                        {item.description}
                      </p>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemOwner}>
                          Owner: {item.owner}
                        </span>
                        <span
                          className={`${styles.itemStatus} ${styles[item.status.toLowerCase().replace(/\s+/g, "")]}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.timelineFooter}>
            <Link href="/board" className={styles.backButton}>
              Return to Board Room
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
