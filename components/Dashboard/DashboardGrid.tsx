"use client";

import { ComponentProps, useEffect, useState } from "react";
import {
  BoardMemberProfileCard,
  XogosStatisticsCard,
  XogosFinancialsCard,
  RecentBoardInsightsCard,
  MonthlyMeetingChecklistCard,
  MultiRSSFeedCard,
  AddRSSFeedCard,
} from "./Cards";
import { getRssSubscriptions } from "@/lib/actions";
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
  const [subscriptions, setSubscriptions] = useState<RSSSubscription[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* Display all RSS feed subscriptions */}
      {!loading && subscriptions.map((sub) => (
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
