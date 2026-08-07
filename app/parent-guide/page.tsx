"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "./page.module.css";

interface Step {
  keyword: string;
  accent: string;
  title: string;
  body: string;
  points: string[];
}

interface Faq {
  question: string;
  answer: string;
}

const steps: Step[] = [
  {
    keyword: "PLAY",
    accent: "red",
    title: "They play games they actually want to play",
    body: "Xogos games are built to be 70% fun and 30% educational. That ratio is deliberate: the more your child enjoys playing, the more often they come back, and every session teaches a little more. Nothing here feels like a worksheet with a cartoon on top.",
    points: [
      "18 educational games across math, history, science, literature, STEM, and personal finance",
      "No ads, no microtransactions, no dark patterns engineered to keep kids scrolling",
      "Ages 6-19, with difficulty levels from beginner to advanced",
    ],
  },
  {
    keyword: "LEARN",
    accent: "purple",
    title: "Games are only half of it",
    body: "A Xogos membership also unlocks free elective classes that push learning off the screen and into the real world. Cooking, astronomy, wilderness survival, personal finance—taught as things your child actually does, not things they read about.",
    points: [
      "15 free elective classes included with every membership",
      "Real-world, hands-on assignments rather than more screen time",
      "Slots into any curriculum as an elective or enrichment block",
    ],
  },
  {
    keyword: "EARN",
    accent: "gold",
    title: "Effort turns into scholarship money",
    body: "Students earn iPlay coins for the things you already want them doing—playing and finishing educational games, keeping their grades up, volunteering, and staying physically active. Coins can be spent in-game, or saved and converted into real scholarship funds.",
    points: [
      "Coins are earned on and off the screen, including for service and exercise",
      "Saved coins convert quarterly into real scholarship funds",
      "Usable toward universities, trade schools, and certificate programs",
    ],
  },
];

const faqs: Faq[] = [
  {
    question: "Is this a curriculum, or a supplement?",
    answer:
      "A supplement. Xogos is designed to sit alongside whatever curriculum you already use—it covers electives, enrichment, and reinforcement rather than replacing your core instruction. Most families use it as a daily elective block or as reward-based practice for subjects their child resists.",
  },
  {
    question: "How much screen time does this actually add?",
    answer:
      "Less than you would expect, and that is intentional. The elective classes are built around real-world activities, and the incentive programs reward volunteering and physical activity—things that happen away from the device. We do not run ads or microtransactions, so we have no financial reason to keep your child on a screen longer.",
  },
  {
    question: "Can my child talk to strangers?",
    answer:
      "No. There is no open in-game chat, the platform is restricted to ages 6-19, and students can only connect with people they already know. Every student account is linked to a parent account. See the Student Protection page for the full breakdown.",
  },
  {
    question: "What is an iPlay coin actually worth?",
    answer:
      "There is no fixed dollar value per coin, and we deliberately avoid quoting one. Each quarter, a scholarship pot is funded and divided proportionally among the students who convert coins that quarter. If your child holds a larger share of the coins converted, they receive a larger share of that quarter's funds.",
  },
  {
    question: "Do I need to supervise every session?",
    answer:
      "No. Your linked parent account shows you what your child is playing, how long they played, and what they are learning, so you can check in on your own schedule instead of hovering. You can also set time limits, and join the games yourself if you want to play along.",
  },
  {
    question: "What happens when my child turns 19?",
    answer:
      "Memberships cover students through age 19, which is the window in which coins can be earned and converted toward post-secondary education. The lifetime membership covers that entire span with a single payment.",
  },
];

const safetyBadges = [
  {
    src: "/images/security/parent-linked.png",
    label: "Parent Linked Accounts",
  },
  { src: "/images/security/no-chat.png", label: "No In-Game Chats" },
  { src: "/images/security/age-restricted.png", label: "Ages 6-19 Only" },
  {
    src: "/images/security/known-connections.png",
    label: "Known Connections Only",
  },
  {
    src: "/images/security/know-customers.png",
    label: "We Know Our Customers",
  },
  {
    src: "/images/security/software-safeguards.png",
    label: "Software Safeguards",
  },
];

const electives = [
  { src: "/images/programs/survival_academy.png", label: "Survival Academy" },
  {
    src: "/images/programs/kitchenlab_academy.png",
    label: "KitchenLab Academy",
  },
  { src: "/images/programs/starfall_academy.png", label: "StarFall Academy" },
  {
    src: "/images/programs/debt_free_millionaire_investor.png",
    label: "DFM Investor",
  },
];

export default function ParentGuidePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const accentClass = (accent: string): string =>
    accent === "red"
      ? styles.accentRed
      : accent === "purple"
        ? styles.accentPurple
        : styles.accentGold;

  return (
    <MarketingLayout>
      <PageTracker pagePath="/parent-guide" pageName="Parent's Guide" />
      <div className={styles.page}>
        <div className={styles.gridBackground} aria-hidden="true"></div>

        {/* Hero */}
        <section className={styles.hero}>
          <div
            className={`${styles.heroInner} ${isLoaded ? styles.visible : ""}`}
          >
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>
                FOR PARENTS &amp; EDUCATORS
              </span>
              <h1 className={styles.heroTitle}>
                The Parent&apos;s Guide to Xogos
              </h1>
              <p className={styles.heroSubtitle}>
                Your kids want to play games. You want them learning something
                that matters. Xogos is built so those two things stop competing
                &mdash; and so the hours they spend actually build toward
                college or trade school.
              </p>
              <div className={styles.heroActions}>
                <a
                  href="https://www.myXogos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  Start Playing
                </a>
                <Link
                  href="/student-protection"
                  className={styles.secondaryBtn}
                >
                  🛡️ How We Keep Kids Safe
                </Link>
              </div>
            </div>
            <div className={styles.heroPhotoWrap}>
              <Image
                src="/images/homeschool-family.png"
                alt="A parent and student exploring Xogos together on a laptop"
                width={460}
                height={460}
                className={styles.heroPhoto}
                priority
              />
            </div>
          </div>
        </section>

        {/* The pitch */}
        <section className={styles.pitchSection}>
          <div className={styles.pitchCard}>
            <h2 className={styles.pitchTitle}>
              The deal we make with your family
            </h2>
            <p className={styles.pitchText}>
              Most &quot;educational&quot; games are a worksheet wearing a
              costume, and most games kids love teach them nothing. Xogos is a
              subscription platform with no ads and no microtransactions, which
              means we make money only if your family finds it genuinely worth
              paying for &mdash; not by keeping your child glued to a screen.
              Everything below follows from that.
            </p>
          </div>
        </section>

        {/* Play / Learn / Earn */}
        <section className={styles.stepsSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>How Xogos Works</h2>
            <p className={styles.sectionSubtitle}>
              Three things happen every time your child logs in.
            </p>
          </div>
          <div className={styles.steps}>
            {steps.map((step, index) => (
              <article key={step.keyword} className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>0{index + 1}</span>
                  <span
                    className={`${styles.stepKeyword} ${accentClass(step.accent)}`}
                  >
                    {step.keyword}
                  </span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
                <ul className={styles.stepPoints}>
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Electives */}
        <section className={styles.electiveSection}>
          <div className={styles.electiveContent}>
            <div className={styles.electiveText}>
              <h2 className={styles.sectionTitle}>
                Classes that get them off the screen
              </h2>
              <p className={styles.bodyText}>
                Every membership includes free elective classes taught as
                real-world practice. Your child cooks the meal, finds the
                constellation, builds the shelter, balances the budget. These
                are the classes that produce something you can actually see at
                the end of the week.
              </p>
              <Link href="/classes" className={styles.textLink}>
                Browse all elective classes &rarr;
              </Link>
            </div>
            <div className={styles.electiveGrid}>
              {electives.map((item) => (
                <Link
                  key={item.label}
                  href="/classes"
                  className={styles.electiveCard}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={120}
                    height={120}
                    className={styles.electiveLogo}
                  />
                  <span className={styles.electiveLabel}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Off-screen incentives */}
        <section className={styles.incentiveSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              We reward what happens away from the device
            </h2>
            <p className={styles.sectionSubtitle}>
              Coins are not just for playing. They are for the habits you are
              already trying to build.
            </p>
          </div>
          <div className={styles.incentiveGrid}>
            <Link href="/incentives" className={styles.incentiveCard}>
              <Image
                src="/images/games/new_iserv_volunteer.png"
                alt="iServ Volunteering"
                width={130}
                height={130}
                className={styles.incentiveLogo}
              />
              <h3 className={styles.incentiveTitle}>iServ Volunteering</h3>
              <p className={styles.incentiveText}>
                Community service hours earn coins toward their scholarship
                balance.
              </p>
            </Link>
            <Link href="/incentives" className={styles.incentiveCard}>
              <div className={styles.incentiveImageWrap}>
                <Image
                  src="/images/games/new_pryde_gym.png"
                  alt="Pryde Gym"
                  width={130}
                  height={130}
                  className={styles.incentiveLogo}
                />
                <span className={styles.comingSoon}>Coming 2026</span>
              </div>
              <h3 className={styles.incentiveTitle}>Pryde Gym</h3>
              <p className={styles.incentiveText}>
                Physical activity earns coins, because staying active should
                count for something.
              </p>
            </Link>
            <div className={styles.incentiveCard}>
              <div className={styles.incentiveEmoji}>📝</div>
              <h3 className={styles.incentiveTitle}>Good Grades</h3>
              <p className={styles.incentiveText}>
                Academic achievement earns bonus coins, whatever curriculum you
                teach from.
              </p>
            </div>
          </div>
        </section>

        {/* Safety — links to Student Protection */}
        <section className={styles.safetySection}>
          <div className={styles.safetyInner}>
            <div className={styles.safetyHeading}>
              <span className={styles.safetyShield}>🛡️</span>
              <h2 className={styles.sectionTitle}>
                The safety question, answered first
              </h2>
              <p className={styles.bodyText}>
                We built this platform for children, so the protections are not
                settings you have to go find and switch on &mdash; they are how
                the platform works by default. There is no open chat. Students
                can only connect with people they already know. Every student
                account is linked to a parent or teacher account with real
                visibility into what their child plays and learns.
              </p>
            </div>
            <div className={styles.safetyGrid}>
              {safetyBadges.map((badge) => (
                <div key={badge.label} className={styles.safetyBadge}>
                  <Image
                    src={badge.src}
                    alt={badge.label}
                    width={92}
                    height={92}
                    className={styles.safetyImage}
                  />
                  <span className={styles.safetyLabel}>{badge.label}</span>
                </div>
              ))}
            </div>
            <Link href="/student-protection" className={styles.safetyCta}>
              Read the full Student Protection policy &rarr;
            </Link>
          </div>
        </section>

        {/* Scholarships */}
        <section className={styles.scholarshipSection}>
          <div className={styles.scholarshipContent}>
            <div className={styles.scholarshipText}>
              <h2 className={styles.sectionTitle}>
                Where the coins actually go
              </h2>
              <p className={styles.bodyText}>
                This is the part most parents want explained plainly. There is
                no fixed dollar value per coin. Each quarter, Innovate the
                Future announces the total raised, and students who choose to
                convert their coins that quarter split that pot in proportion to
                how many coins each of them converted.
              </p>
              <p className={styles.bodyText}>
                So if $5,000 is raised and ten students each convert ten coins,
                each student holds ten percent of the coins converted and
                receives ten percent of the fund. Balances are tracked digitally
                in the Xogos Bank and audited quarterly.
              </p>
              <div className={styles.scholarshipLinks}>
                <Link href="/scholarships" className={styles.textLink}>
                  How scholarships work &rarr;
                </Link>
                <Link href="/audits" className={styles.textLink}>
                  Audit results &rarr;
                </Link>
              </div>
            </div>
            <div className={styles.scholarshipVisual}>
              <Image
                src="/images/coin-to-diploma.png"
                alt="iPlay coins converting into scholarship funds"
                width={400}
                height={300}
                className={styles.scholarshipImage}
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className={styles.pricingSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>What it costs</h2>
            <p className={styles.sectionSubtitle}>
              One membership unlocks every game, every elective class, and coin
              earning toward scholarships.
            </p>
          </div>
          <div className={styles.pricingRow}>
            <div className={styles.priceCard}>
              <span className={styles.priceTier}>MONTHLY</span>
              <span className={styles.priceAmount}>$7</span>
              <span className={styles.pricePeriod}>per month</span>
              <a
                href="https://www.myXogos.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.priceBtn}
              >
                Start Monthly
              </a>
            </div>
            <div className={`${styles.priceCard} ${styles.priceFeatured}`}>
              <span className={styles.priceFlag}>2 MONTHS FREE</span>
              <span className={styles.priceTier}>YEARLY</span>
              <span className={styles.priceAmount}>$70</span>
              <span className={styles.pricePeriod}>per year</span>
              <a
                href="https://www.historicalconquest.com/xogos-gaming"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.priceBtn}
              >
                Go Yearly
              </a>
            </div>
            <div className={`${styles.priceCard} ${styles.priceLifetime}`}>
              <span className={styles.priceFlag}>2026 LAUNCH SPECIAL</span>
              <span className={styles.priceTier}>LIFETIME</span>
              <span className={styles.priceAmount}>$150</span>
              <span className={styles.pricePeriod}>
                one time, through age 19
              </span>
              <a
                href="https://www.historicalconquest.com/xogos-gaming"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.priceBtn}
              >
                Unlock Lifetime
              </a>
            </div>
          </div>
          <p className={styles.pricingNote}>
            The lifetime membership is a 2026-only promotion celebrating the
            opening of Xogos Gaming this year.
          </p>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Questions parents ask</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className={styles.faqToggle}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && <p className={styles.faqAnswer}>{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready when your family is</h2>
            <p className={styles.ctaText}>
              Start playing today, or read exactly how we protect your child
              before you decide. Both are good places to begin.
            </p>
            <div className={styles.ctaButtons}>
              <a
                href="https://www.myXogos.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryBtn}
              >
                Start Playing
              </a>
              <Link href="/student-protection" className={styles.secondaryBtn}>
                Student Protection
              </Link>
              <Link href="/games" className={styles.secondaryBtn}>
                See the Games
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
