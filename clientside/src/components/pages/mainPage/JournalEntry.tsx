import React, { useContext, useEffect, useState } from "react";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";

interface JournalEntryProps {
  onJournalSubmit: any;
  hasJournaledToday: boolean;
  resetJournalState: () => void; // New callback function for resetting the journal state
  fetchInsightsCallback: () => void; // Callback function to trigger fetchInsights
}
function JournalEntry({
  onJournalSubmit,
  hasJournaledToday,
  resetJournalState,
  fetchInsightsCallback,
}: JournalEntryProps) {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  //   const [hasJournaledToday, setHasJournaledToday] = useState(false);

  return (
    <div
      className={`flex-1 w-full h-full rounded-md  ${
        hasJournaledToday
          ? "bg-white flex items-center justify-center p-10"
          : "p-4"
      }`}
    >
      {hasJournaledToday ? (
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-gray-700">
            You've already journaled for today.
          </p>
          <p className="text-sm text-gray-500">
            Reflect on your entry or start fresh?
          </p>

          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition-colors"
            onClick={resetJournalState}
          >
            Journal Again
          </button>
          <p>Or</p>
          <button
            className="mt-4 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition-colors"
            onClick={resetJournalState}
          >
            Get Actionable Insights
          </button>
        </div>
      ) : (
        <>
          <MoodRating setParentMoodRating={setMoodRating} />
          <JournalSection
            moodRating={moodRating}
            onJournalSubmit={onJournalSubmit}
            fetchInsightsCallback={fetchInsightsCallback} // Pass fetchInsightsCallback to JournalSection
          />
        </>
      )}
    </div>
  );
}

export default JournalEntry;
