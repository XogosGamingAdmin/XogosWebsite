"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./signin.module.css";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  useEffect(() => {
    // Get callback URL from query params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const callback = params.get("callbackUrl");
      const errorParam = params.get("error");

      if (callback) setCallbackUrl(callback);
      if (errorParam) {
        // Map error codes to messages
        const errorMessages: Record<string, string> = {
          AccessDenied: "Your email is not authorized for board access.",
          Configuration: "Server configuration error. Please contact support.",
          Verification: "Sign-in link expired. Please try again.",
        };
        setError(
          errorMessages[errorParam] || "Authentication error. Please try again."
        );
      }
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Trigger Google OAuth sign-in
      await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Failed to initiate sign-in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2 className={styles.title}>Board Members Sign-In</h2>
        <p className={styles.description}>
          Sign in with your authorized Google account to access the Board of
          Directors portal
        </p>

        {error && (
          <div className={styles.error}>
            <p>❌ {error}</p>
            <p className={styles.errorDetails}>
              Only authorized board members can access this area. If you believe
              this is an error, please contact the administrator.
            </p>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={styles.googleButton}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              fontWeight: 500,
            }}
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>

        <div style={{ marginTop: "2rem", fontSize: "14px", color: "#666" }}>
          <p>Authorized board members:</p>
          <ul style={{ textAlign: "left", marginTop: "0.5rem" }}>
            <li>zack@xogosgaming.com</li>
            <li>braden@kennyhertzperry.com</li>
            <li>enjoyweaver@gmail.com</li>
            <li>mckaylaareece@gmail.com</li>
            <li>sturs49@gmail.com</li>
          </ul>
        </div>
      </main>
      <aside className={styles.aside} />
    </div>
  );
}
