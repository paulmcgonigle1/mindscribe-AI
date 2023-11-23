import { useState } from "react";
import DashboardStatsGrid from "../statsPage/DashboardStatsGrid";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";
import RecentJournals from "./RecentJournals";
import Summary from "./Summary";
export default function JournalDashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <DashboardStatsGrid />
      <div className="flex flex-row gap-4 w-full">
        <JournalSection />
        <RecentJournals />
      </div>
      <div className="flex flex-row gap-4 w-full">
        <MoodRating />
        <Summary />
      </div>
    </div>
  );
}
