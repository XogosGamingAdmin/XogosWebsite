"use client";

import { useSession } from "next-auth/react";
import { ComponentProps, useEffect, useState } from "react";
import { getRssSubscriptions } from "@/lib/actions";
import { isAdmin } from "@/lib/auth/admin";
import {
  AddRSSFeedCard,
  AllBoardMemberTasksCard,
  BoardMemberProfileCard,
  ErrorLoggingCard,
  MonthlyMeetingChecklistCard,
  MultiRSSFeedCard,
  RecentBoardInsightsCard,
  XogosFinancialsCard,
  XogosStatisticsCard,
} from "./Cards";
import styles from "./DashboardGrid.module.css";

interface Props extends ComponentProps<"div"> {}

interface RSSSubscription {
  id: string;
  userId: string;
  topic: string;
  displayName: string;
  createdAt: string;
}

export function DashboardGrid({ ...props }: Props) {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<RSSSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const userIsAdmin = session?.user?.email
    ? isAdmin(session.user.email)
    : false;

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    setLoading(true);
    const result = await getRssSubscriptions();
    if (result.data) {
      setSubscriptions(result.data);
    }
    setLoading(false);
  }

  return (
    <div className={styles.grid} {...props}>
      <BoardMemberProfileCard />
      <XogosStatisticsCard />
      <XogosFinancialsCard />
      <RecentBoardInsightsCard />
      <MonthlyMeetingChecklistCard />

      {/* Admin-only: All Board Member Tasks */}
      {userIsAdmin && <AllBoardMemberTasksCard />}

      {/* Admin-only: Error Logging & Monitoring */}
      {userIsAdmin && <ErrorLoggingCard />}

      {/* Display all RSS feed subscriptions */}
      {!loading &&
        subscriptions.map((sub) => (
          <MultiRSSFeedCard
            key={sub.id}
            id={sub.id}
            topic={sub.topic}
            displayName={sub.displayName}
            onRemove={loadSubscriptions}
          />
        ))}

      {/* Add new RSS feed card */}
      {!loading && <AddRSSFeedCard onAdd={loadSubscriptions} />}
    </div>
  );
}
