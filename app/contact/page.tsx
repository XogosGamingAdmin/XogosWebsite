"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { PageTracker } from "@/components/Analytics";
import { MarketingLayout } from "@/layouts/Marketing";
import styles from "@/components/Marketing/InfoPage.module.css";

// Platform API (api/generic/contact.php): emails each message to zack@xogosgaming.com via SES with
// Reply-To set to the visitor. It accepts requests only from xogosgaming.com and rate-limits by IP.
const CONTACT_ENDPOINT = "https://api.myxogos.com/api/generic/contact.php";

const TOPICS = [
  "General question",
  "Parents & families",
  "Schools & teachers",
  "Game & academy partners",
  "Scholarships",
  "Account help",
  "Press",
  "Other",
];

const MAX_MESSAGE = 5000;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [isHuman, setIsHuman] = useState(false); // human verification checkbox
  const pageLoadTime = useRef(Date.now()); // track when page loaded for timing check

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Human verification check
    if (!isHuman) {
      setError("Please confirm you are not a robot.");
      return;
    }

    // Timing check - if submitted too quickly (under 3 seconds), likely a bot
    const timeSinceLoad = Date.now() - pageLoadTime.current;
    if (timeSinceLoad < 3000) {
      setError("Please wait a moment before submitting.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Please write a little more in your message.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message, website }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setStatus("sent");
        return;
      }
      setError(
        data?.message ||
          "Your message could not be sent. Please try again later."
      );
      setStatus("error");
    } catch {
      setError(
        "We couldn't reach our server. Please check your connection and try again."
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setName("");
    setEmail("");
    setTopic(TOPICS[0]);
    setMessage("");
    setIsHuman(false);
    setStatus("idle");
    pageLoadTime.current = Date.now(); // reset timing
  };

  return (
    <MarketingLayout>
      <PageTracker pagePath="/contact" pageName="Contact" />
      <div className={styles.page}>
        <div className={styles.gridBackground} aria-hidden="true"></div>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>CONTACT US</span>
          <h1 className={styles.heroTitle}>We&apos;d love to hear from you</h1>
          <p className={styles.heroSubtitle}>
            Questions about membership, a sign-in problem, a classroom or
            partnership idea: send us a note and a real person on the Xogos team
            will reply by email.
          </p>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.contactGrid}>
            <div className={styles.card}>
              {status === "sent" ? (
                <div className={styles.success} role="status">
                  <div className={styles.successIcon}>✅</div>
                  <h2 className={styles.cardTitle}>Message sent. Thank you!</h2>
                  <p className={styles.cardText}>
                    We&apos;ll reply to <strong>{email}</strong>, usually within
                    one to two business days.
                  </p>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={reset}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className={styles.cardTitle}>Send us a message</h2>
                  <p className={styles.cardText}>All fields are required.</p>
                  <form className={styles.form} onSubmit={submit}>
                    <div className={styles.formRow}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="contact-name">
                          Your name
                        </label>
                        <input
                          id="contact-name"
                          className={styles.input}
                          type="text"
                          autoComplete="name"
                          maxLength={100}
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="contact-email">
                          Email address
                        </label>
                        <input
                          id="contact-email"
                          className={styles.input}
                          type="email"
                          autoComplete="email"
                          maxLength={254}
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="contact-topic">
                        What is this about?
                      </label>
                      <select
                        id="contact-topic"
                        className={styles.select}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      >
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="contact-message">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        className={styles.textarea}
                        required
                        minLength={10}
                        maxLength={MAX_MESSAGE}
                        placeholder="How can we help?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <span className={styles.hint}>
                        {message.length.toLocaleString()} /{" "}
                        {MAX_MESSAGE.toLocaleString()}
                      </span>
                    </div>

                    <div className={styles.trap} aria-hidden="true">
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>

                    {/* Human verification checkbox */}
                    <div className={styles.humanCheck}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={isHuman}
                          onChange={(e) => setIsHuman(e.target.checked)}
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>
                          I confirm I am not a robot or AI
                        </span>
                      </label>
                    </div>

                    {error && (
                      <div className={styles.alertError} role="alert">
                        {error}
                      </div>
                    )}

                    <div className={styles.formActions}>
                      <button
                        type="submit"
                        className={styles.primaryBtn}
                        disabled={status === "sending"}
                      >
                        {status === "sending" ? "Sending…" : "Send Message"}
                      </button>
                      <span className={styles.privacyNote}>
                        We use your details only to answer you.
                      </span>
                    </div>
                  </form>
                </>
              )}
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Other ways to reach us</h2>
              <p className={styles.cardText}>
                Many common questions are already answered in our FAQ.
              </p>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon} aria-hidden="true">
                    ❓
                  </span>
                  <div>
                    <div className={styles.infoLabel}>FAQ</div>
                    <div className={styles.infoText}>
                      Membership, coins, scholarships and safety.{" "}
                      <Link href="/faq" className={styles.textLink}>
                        Read the FAQ
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon} aria-hidden="true">
                    🔑
                  </span>
                  <div>
                    <div className={styles.infoLabel}>Sign-in help</div>
                    <div className={styles.infoText}>
                      Try &quot;Forgot password&quot; at{" "}
                      <a
                        href="https://www.myXogos.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.textLink}
                      >
                        myXogos.com
                      </a>
                      . If that doesn&apos;t work, choose &quot;Account
                      help&quot; in the form.
                    </div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon} aria-hidden="true">
                    🤝
                  </span>
                  <div>
                    <div className={styles.infoLabel}>
                      Game studios &amp; educators
                    </div>
                    <div className={styles.infoText}>
                      Want to bring your game or class to Xogos? Choose
                      &quot;Game &amp; academy partners&quot; and tell us about
                      it.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to start playing?</h2>
            <p className={styles.ctaText}>
              Create your family account and let the learning, and the
              scholarship coins, begin.
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
              <Link href="/parent-guide" className={styles.secondaryBtn}>
                Parent&apos;s Guide
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
