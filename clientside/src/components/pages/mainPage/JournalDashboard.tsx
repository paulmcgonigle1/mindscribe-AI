import { useState } from "react";
import DashboardStatsGrid from "../statsPage/DashboardStatsGrid";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";
import RecentJournals from "./RecentJournals";

export default function JournalDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardStatsGrid />
      <div className="flex flex-row gap-4 w-full">
        <JournalSection />
        <RecentJournals />
      </div>
      <div className="flex flex-row gap-4 w-full">
        <MoodRating />
      </div>
    </div>
  );
}
