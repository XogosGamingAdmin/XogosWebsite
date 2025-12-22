"use client";

import { signIn, useSession } from "next-auth/react";
import { ComponentProps, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/primitives/Button";
import styles from "./signin.module.css";

interface Props extends ComponentProps<"div"> {
  callbackUrl?: string;
}

export function NextAuthLogin({ callbackUrl }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl || "/dashboard");
    }
  }, [status, session, router, callbackUrl]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className={styles.actions}>
        <p>Loading...</p>
      </div>
    );
  }

  // Show sign-in button if not authenticated
  return (
    <div className={styles.actions}>
      <Button
        onClick={() =>
          signIn("google", { callbackUrl: callbackUrl || "/dashboard" })
        }
      >
        Sign in with Google
      </Button>
    </div>
  );
}
