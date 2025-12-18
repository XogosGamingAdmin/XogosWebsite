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
            <p>
              ❌ Access Denied: Your email is not authorized for Board access.
            </p>
            <p className={styles.errorDetails}>
              Please contact the administrator if you believe this is an error.
            </p>
          </div>
        )}

        <NextAuthLogin callbackUrl={searchParams.callbackUrl} />
      </main>
      <aside className={styles.aside} />
    </div>
  );
}
