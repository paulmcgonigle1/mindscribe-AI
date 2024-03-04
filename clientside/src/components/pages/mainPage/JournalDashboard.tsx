import { useState } from "react";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";

import Calendar from "./Calendar";
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
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-2/3">
          <Calendar />
          {/* <RecentJournals /> */}
        </div>
      </div>
    </div>
  );
}
