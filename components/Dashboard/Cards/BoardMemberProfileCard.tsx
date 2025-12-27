"use client";

import { useSession } from "next-auth/react";
import { Avatar } from "@/primitives/Avatar";
import styles from "./BoardMemberProfileCard.module.css";

export function BoardMemberProfileCard() {
  const { data: session } = useSession();

  if (!session?.user?.info) {
    return (
      <div className={styles.card}>
        <div className={styles.content}>
          <p className={styles.emptyState}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Board Member Profile</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.profileInfo}>
          <Avatar
            className={styles.avatar}
            name={session.user.info.name}
            size={96}
            src={session.user.info.avatar}
          />
          <div className={styles.details}>
            <h3 className={styles.name}>{session.user.info.name}</h3>
            <p className={styles.email}>{session.user.info.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
