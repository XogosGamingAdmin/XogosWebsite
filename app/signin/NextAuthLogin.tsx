"use client";

import { signIn } from "next-auth/react";
import { ComponentProps } from "react";
import { Button } from "@/primitives/Button";
import styles from "./signin.module.css";

interface Props extends ComponentProps<"div"> {
  callbackUrl?: string;
}

export function NextAuthLogin({ callbackUrl }: Props) {
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
