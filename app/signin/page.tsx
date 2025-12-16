import { redirect } from "next/navigation";
import { auth, getProviders } from "@/auth";
import { DemoLogin } from "./DemoLogin";
import { NextAuthLogin } from "./NextAuthLogin";
import styles from "./signin.module.css";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const session = await auth();

  // If logged in, redirect to callback URL or board
  if (session) {
    redirect(searchParams.callbackUrl || "/board");
  }

  const providers = await getProviders();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2 className={styles.title}>Sign in to Board Members Section</h2>
        <p className={styles.description}>
          Access the Board of Directors portal with your authorized account
        </p>
        {providers && providers.credentials ? (
          <DemoLogin />
        ) : (
          <NextAuthLogin
            providers={providers}
            callbackUrl={searchParams.callbackUrl}
          />
        )}
      </main>
      <aside className={styles.aside} />
    </div>
  );
}
