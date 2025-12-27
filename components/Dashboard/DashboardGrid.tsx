import { ComponentProps } from "react";
import {
  BoardMemberProfileCard,
  XogosStatisticsCard,
  XogosFinancialsCard,
  RecentBoardInsightsCard,
  MonthlyMeetingChecklistCard,
  RSSFeedCard,
} from "./Cards";
import styles from "./DashboardGrid.module.css";

interface Props extends ComponentProps<"div"> {}

export function DashboardGrid({ ...props }: Props) {
  return (
    <div className={styles.grid} {...props}>
      <BoardMemberProfileCard />
      <XogosStatisticsCard />
      <XogosFinancialsCard />
      <RecentBoardInsightsCard />
      <MonthlyMeetingChecklistCard />
      <RSSFeedCard />
    </div>
  );
}
