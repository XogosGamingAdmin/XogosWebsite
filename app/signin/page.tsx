import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NextAuthLogin } from "./NextAuthLogin";
import styles from "./signin.module.css";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await auth();

  // If already signed in, redirect to board
  if (session) {
    redirect(searchParams.callbackUrl || "/board");
  }

  // Map NextAuth error codes to user-friendly messages
  const errorMessages: Record<string, { title: string; details: string }> = {
    AccessDenied: {
      title: "Access Denied",
      details:
        "Your email address is not authorized for Board access. Only specific board members can sign in. Please contact the administrator if you believe this is an error.",
    },
    Configuration: {
      title: "Configuration Error",
      details:
        "There is a problem with the authentication configuration. Please contact the administrator.",
    },
    Verification: {
      title: "Verification Error",
      details: "The sign in link is no longer valid. Please try again.",
    },
    Default: {
      title: "Authentication Error",
      details:
        "An error occurred during sign-in. Please try again or contact the administrator.",
    },
  };

  const errorInfo =
    errorMessages[searchParams.error || ""] || errorMessages.Default;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2 className={styles.title}>Board Members Sign-In</h2>
        <p className={styles.description}>
          Sign in with your authorized Google account to access the Board of
          Directors portal
        </p>

        {searchParams.error && (
          <div className={styles.error}>
            <p>❌ {errorInfo.title}</p>
            <p className={styles.errorDetails}>{errorInfo.details}</p>
            {searchParams.error === "AccessDenied" && (
              <p className={styles.errorDetails} style={{ marginTop: "1rem" }}>
                <strong>Authorized emails only:</strong> If you are a board
                member, make sure you're signing in with the email address that
                was registered with the administrator.
              </p>
            )}
          </div>
        )}

        <NextAuthLogin callbackUrl={searchParams.callbackUrl} />
      </main>
      <aside className={styles.aside} />
    </div>
  );
}
