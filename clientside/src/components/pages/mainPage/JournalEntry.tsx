import { useState } from "react";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";
import { useNavigate } from "react-router-dom";

interface JournalEntryProps {
  onJournalSubmit: any;
  hasJournaledToday: boolean;
  resetJournalState: () => void; // New callback function for resetting the journal state
}
function JournalEntry({
  onJournalSubmit,
  hasJournaledToday,
  resetJournalState,
}: JournalEntryProps) {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  //   const [hasJournaledToday, setHasJournaledToday] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`flex-1 w-full h-full rounded-md bg-white shadow-md  ${
        hasJournaledToday
          ? " flex items-center justify-center p-10 shadow-md"
          : "p-4"
      }`}
    >
      {hasJournaledToday ? (
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-gray-700">
            You've already journaled for today.
          </p>
          <p className="text-md text-gray-500">
            Want to journal again or start fresh?
          </p>

          <button
            className="mt-4 px-6 py-3 bg-rich-green text-white font-medium rounded-lg shadow hover:bg-blue-600 transition-colors"
            onClick={resetJournalState}
          >
            Journal Again
          </button>
          <p>Or</p>
          <p className="text-md text-gray-500">
            Get actionable insights to start improving?
          </p>
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition-colors"
            onClick={() => navigate("/improvements")}
          >
            Get Actionable Insights
          </button>
        </div>
      ) : (
        <>
          <div className="">
            <MoodRating setParentMoodRating={setMoodRating} />
            <JournalSection
              moodRating={moodRating}
              onJournalSubmit={onJournalSubmit}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default JournalEntry;
