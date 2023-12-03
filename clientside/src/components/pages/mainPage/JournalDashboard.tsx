import { useState } from "react";
import DashboardStatsGrid from "../statsPage/DashboardStatsGrid";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";
import RecentJournals from "./RecentJournals";
import Summary from "./Summary";
export default function JournalDashboard() {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex md:flex-row gap-6">
        <div className="flex-1 flex">
          <div className="flex-1 w-full">
            <MoodRating setParentMoodRating={setMoodRating} />
            <JournalSection moodRating={moodRating} />
          </div>
          <div className="w-1/4"></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-2/3">
          <RecentJournals />
        </div>
        <div className="w-full md:w-1/3">
          <Summary />
        </div>
      </div>
    </div>
  );
}
