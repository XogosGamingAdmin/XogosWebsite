"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "./page.module.css";

// Real board members with proper seating positions
const boardMembers = [
  {
    name: "Michael Weaver",
    title: "President",
    role: "Insurance & Risk",
    imagePath: "/images/board/weaver.jpg",
    seatPosition: "rightOne",
    status: "present",
  },
  {
    name: "Zack Edwards",
    title: "CEO",
    role: "Executive Oversight",
    imagePath: "/images/board/zack.png",
    seatPosition: "head",
    status: "present",
  },
  {
    name: "Braden Perry",
    title: "Legal Director",
    role: "Legal & Regulatory",
    imagePath: "/images/board/braden.jpg",
    seatPosition: "leftOne", // Left of head
    status: "present",
  },
  {
    name: "Terrance Gatsby",
    title: "Crypto & Exchanges Director",
    role: "Cryptocurrency Integration",
    imagePath: "/images/board/terrance.jpg",
    seatPosition: "rightTwo", // Right middle
    status: "present",
  },
  {
    name: "Kevin Stursberg",
    title: "Accounting Director",
    role: "Financial Oversight",
    imagePath: "/images/board/kevin.jpg",
    seatPosition: "leftTwo", // Left middle
    status: "present",
  },
  {
    name: "McKayla Reece",
    title: "Education Director",
    role: "Educational Strategy",
    imagePath: "/images/board/mckayla.jpg",
    seatPosition: "leftThree", // Left far
    status: "present",
  },
  {
    name: "Open Position",
    title: "Compliance Director",
    role: "Regulatory Oversight",
    imagePath: null,
    seatPosition: "rightThree", // Right far
    status: "vacant",
  },
];

// Factual platform metrics from whitepaper
const platformMetrics = [
  { label: "iServ Max Supply", value: "106,000,000 Tokens", trend: "fixed" },
  { label: "Daily iPlay Cap", value: "4 Tokens Per Student", trend: "stable" },
  {
    label: "Savings Multiplier",
    value: "2X Maximum (180 Days)",
    trend: "active",
  },
  {
    label: "Platform Status",
    value: "PRE-LAUNCH DEVELOPMENT",
    trend: "progress",
  },
  {
    label: "Token Economy",
    value: "DUAL-TOKEN ARCHITECTURE",
    trend: "designed",
  },
  { label: "Governance", value: "3-TIER SYSTEM", trend: "structured" },
  {
    label: "Meeting Schedule",
    value: "LAST THURSDAY MONTHLY",
    trend: "regular",
  },
];

// Real documents from the system
const boardDocuments = [
  {
    name: "Xogos Dual-Token Economy Whitepaper",
    type: "Strategic",
    status: "Published",
    date: "December 2024",
    link: "/docs/tokenomics",
    icon: "📊",
  },
  {
    name: "Technical Architecture Specification",
    type: "Technical",
    status: "Final",
    date: "December 2024",
    link: "/docs/technical",
    icon: "⚙️",
  },
  {
    name: "Enterprise Risk Management",
    type: "Risk",
    status: "Active",
    date: "January 2025",
    link: "/risk",
    icon: "⚠️",
  },
  {
    name: "Board Initiatives Framework",
    type: "Governance",
    status: "In Progress",
    date: "January 2025",
    link: "/initiatives",
    icon: "📋",
  },
];

export default function BoardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [nextMeeting, setNextMeeting] = useState<Date | null>(null);
  const [timeToMeeting, setTimeToMeeting] = useState("");
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [tickerPosition, setTickerPosition] = useState(0);

  // Calculate next board meeting (last Thursday of month at 5 PM ET)
  const getNextMeeting = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Find last Thursday of current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const lastThursday = new Date(lastDayOfMonth);
    lastThursday.setDate(
      lastDayOfMonth.getDate() - ((lastDayOfMonth.getDay() + 3) % 7)
    );
    lastThursday.setHours(17, 0, 0, 0); // 5 PM ET

    // If meeting already passed this month, get next month
    if (now > lastThursday) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const nextMonthLastDay = new Date(nextYear, nextMonth + 1, 0);
      const nextLastThursday = new Date(nextMonthLastDay);
      nextLastThursday.setDate(
        nextMonthLastDay.getDate() - ((nextMonthLastDay.getDay() + 3) % 7)
      );
      nextLastThursday.setHours(17, 0, 0, 0);
      return nextLastThursday;
    }

    return lastThursday;
  };

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/board");
    }
  }, [status, router]);

  // Main effect for time and ticker updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Update current Eastern Time
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/New_York",
        })
      );

      // Calculate next meeting
      const meeting = getNextMeeting();
      setNextMeeting(meeting);

      // Check if currently in meeting window
      const timeDiff = meeting.getTime() - now.getTime();
      const isActive = timeDiff > -7200000 && timeDiff < 0; // Within 2 hours after start
      setIsMeetingActive(isActive);

      // Calculate countdown
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeToMeeting(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeToMeeting(`${hours}h ${minutes}m`);
        } else {
          setTimeToMeeting(`${minutes}m`);
        }
      } else {
        setTimeToMeeting("Meeting in session");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Ticker animation
    const tickerInterval = setInterval(() => {
      setTickerPosition((prev) => (prev >= 100 ? -100 : prev + 0.5));
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(tickerInterval);
    };
  }, []);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <MarketingLayout>
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </MarketingLayout>
    );
  }

  // Don't render board content if not authenticated
  if (!session) {
    return null;
  }

  return (
    <MarketingLayout>
      <div className={styles.boardRoom}>
        {/* Live Streaming Stats Ticker */}
        <div className={styles.liveStatsTicker}>
          <div className={styles.tickerBar}>
            <div
              className={styles.tickerContent}
              style={{ transform: `translateX(${tickerPosition}%)` }}
            >
              {[...platformMetrics, ...platformMetrics].map((metric, index) => (
                <div key={index} className={styles.tickerItem}>
                  <span className={styles.tickerLabel}>{metric.label}:</span>
                  <span
                    className={`${styles.tickerValue} ${styles[metric.trend]}`}
                  >
                    {metric.value}
                  </span>
                  <span className={styles.tickerSeparator}>•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Atmosphere */}
        <div className={styles.roomAtmosphere}>
          <div className={styles.ceilingLights}></div>
          <div className={styles.ambientGlow}></div>
          <div className={styles.roomShadows}></div>
        </div>

        {/* Board Room Header */}
        <div className={styles.roomHeader}>
          <div className={styles.roomInfo}>
            <h1 className={styles.roomTitle}>Xogos Gaming Board Room</h1>
            <div className={styles.meetingStatus}>
              <div className={styles.statusIndicator}>
                <div
                  className={`${styles.statusLight} ${isMeetingActive ? styles.active : styles.inactive}`}
                ></div>
                <span className={styles.statusText}>
                  {isMeetingActive
                    ? "Board Meeting in Session"
                    : "Room Available"}
                </span>
              </div>
              <div className={styles.timeDisplay}>
                <div className={styles.currentTime}>
                  <span className={styles.timeLabel}>Eastern Time:</span>
                  <span className={styles.timeValue}>{currentTime}</span>
                </div>
                <div className={styles.nextMeeting}>
                  <span className={styles.meetingLabel}>Next Meeting:</span>
                  <span className={styles.meetingValue}>
                    {nextMeeting
                      ? `${nextMeeting.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at 5:00 PM ET`
                      : "Calculating..."}
                  </span>
                </div>
                {timeToMeeting && !isMeetingActive && (
                  <div className={styles.countdown}>
                    <span className={styles.countdownLabel}>Countdown:</span>
                    <span className={styles.countdownValue}>
                      {timeToMeeting}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Board Room Layout */}
        <div className={styles.roomContainer}>
          {/* Conference Table Section */}
          <div className={styles.conferenceArea}>
            <div className={styles.tableContainer}>
              {/* Conference Table */}
              <div className={styles.conferenceTable}>
                <div className={styles.tableTop}>
                  <div className={styles.tableLogo}>
                    <span className={styles.logoText}>XOGOS</span>
                    <div className={styles.logoUnderline}></div>
                  </div>
                </div>

                {/* Board Member Seats - Properly Positioned */}
                {boardMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`${styles.boardSeat} ${styles[member.seatPosition]}`}
                    onClick={() =>
                      setSelectedMember(
                        selectedMember === member.name ? null : member.name
                      )
                    }
                  >
                    {/* Executive Chair */}
                    <div className={styles.executiveChair}>
                      <div className={styles.chairBack}></div>
                      <div className={styles.chairSeat}>
                        {member.imagePath ? (
                          <div className={styles.memberPresence}>
                            <img
                              src={member.imagePath}
                              alt={member.name}
                              className={styles.memberPhoto}
                            />
                            <div
                              className={`${styles.presenceIndicator} ${styles[member.status]}`}
                            ></div>
                          </div>
                        ) : (
                          <div className={styles.vacantSeat}>
                            <div className={styles.vacantIcon}>+</div>
                            <span className={styles.vacantText}>
                              Open Position
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={styles.chairBase}></div>
                    </div>

                    {/* Name Plate */}
                    <div className={styles.namePlate}>
                      <div className={styles.memberName}>{member.name}</div>
                      <div className={styles.memberTitle}>{member.title}</div>
                    </div>

                    {/* Member Details Popup */}
                    {selectedMember === member.name && (
                      <div className={styles.memberDetailsPopup}>
                        <div className={styles.popupHeader}>
                          <h3>{member.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMember(null);
                            }}
                            className={styles.closeButton}
                          >
                            ×
                          </button>
                        </div>
                        <div className={styles.popupContent}>
                          <p>
                            <strong>Title:</strong> {member.title}
                          </p>
                          <p>
                            <strong>Focus Area:</strong> {member.role}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {member.status === "present"
                              ? "Present"
                              : "Vacant Position"}
                          </p>
                          <Link
                            href="/boardmembers"
                            className={styles.viewProfileButton}
                          >
                            View Full Profile →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Table Center Piece */}
                <div className={styles.tableCenter}>
                  <div className={styles.conferencePhone}>
                    <div className={styles.phoneBase}></div>
                    <div className={styles.phoneDisplay}>SECURE LINE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div className={styles.sidePanels}>
            {/* Documents & Resources Panel */}
            <div className={styles.documentsPanel}>
              <h3 className={styles.panelTitle}>Board Documents</h3>
              <div className={styles.documentGrid}>
                {boardDocuments.map((doc, index) => (
                  <Link
                    key={index}
                    href={doc.link}
                    className={styles.documentCard}
                  >
                    <div className={styles.docIcon}>{doc.icon}</div>
                    <div className={styles.docInfo}>
                      <div className={styles.docName}>{doc.name}</div>
                      <div className={styles.docMeta}>
                        <span className={styles.docType}>{doc.type}</span>
                        <span className={styles.docStatus}>{doc.status}</span>
                      </div>
                      <div className={styles.docDate}>{doc.date}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Meeting Information Panel */}
            <div className={styles.meetingPanel}>
              <h3 className={styles.panelTitle}>Meeting Information</h3>
              <div className={styles.meetingDetails}>
                <div className={styles.scheduleInfo}>
                  <h4>Regular Schedule</h4>
                  <p>Last Thursday of every month</p>
                  <p>5:00 PM Eastern Time</p>
                  <p>Duration: Approximately 2 hours</p>
                </div>
                {nextMeeting && (
                  <div className={styles.nextMeetingInfo}>
                    <h4>Next Meeting</h4>
                    <p className={styles.meetingDate}>
                      {nextMeeting.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className={styles.meetingTime}>5:00 PM Eastern Time</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.quickActions}>
            <Link href="/board/members" className={styles.actionButton}>
              <span className={styles.actionIcon}>👥</span>
              <span className={styles.actionText}>View Directors</span>
            </Link>
            <Link href="/board/initiatives" className={styles.actionButton}>
              <span className={styles.actionIcon}>📋</span>
              <span className={styles.actionText}>Board Initiatives</span>
            </Link>
            <Link href="/board/risk" className={styles.actionButton}>
              <span className={styles.actionIcon}>⚠️</span>
              <span className={styles.actionText}>Risk Management</span>
            </Link>
            <Link href="/board/tokenomics" className={styles.actionButton}>
              <span className={styles.actionIcon}>📊</span>
              <span className={styles.actionText}>Tokenomics</span>
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
