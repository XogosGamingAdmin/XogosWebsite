"use client";

import { useState, FormEvent } from "react";
import styles from "./NewsletterForm.module.css";

interface NewsletterFormProps {
  source?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function NewsletterForm({
  source = "website",
  className,
  inputClassName,
  buttonClassName,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={className}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={inputClassName || styles.input}
          disabled={status === "loading"}
          required
        />
        <button
          type="submit"
          className={buttonClassName || styles.button}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          className={`${styles.message} ${status === "success" ? styles.success : styles.error}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
