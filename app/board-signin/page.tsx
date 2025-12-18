"use client";

import { useEffect } from "react";
import styles from "../signin/signin.module.css";

export default function BoardSignInPage() {
  useEffect(() => {
    // Get Google OAuth credentials from the page
    const clientId = "1020785079037-7921ohj4rp89cjtu7msslljhfa6r7ag4.apps.googleusercontent.com";
    const redirectUri = "https://www.histronics.com/api/auth/callback/google";

    // Construct Google OAuth URL
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    // Redirect to Google
    window.location.href = googleAuthUrl.toString();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2 className={styles.title}>Redirecting to Google Sign-In...</h2>
        <p className={styles.description}>
          Please wait while we redirect you to Google for authentication.
        </p>
      </main>
    </div>
  );
}
