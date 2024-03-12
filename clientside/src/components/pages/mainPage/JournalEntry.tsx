import React, { useContext, useEffect, useState } from "react";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";
import AuthContext from "../../../context/AuthContext";
import { fetchJournalEntryForToday } from "../../../services/JournalService";

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
  const { authTokens } = useContext(AuthContext) ?? {};

  return (
    <div className={`flex-1 w-full ${hasJournaledToday ? "bg-gray-100" : ""}`}>
      {hasJournaledToday ? (
        <div className="text-center p-4">
          <p>You've already journaled for today.</p>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={resetJournalState}
          >
            Journal Again
          </button>
        </div>
      ) : (
        <>
          <MoodRating setParentMoodRating={setMoodRating} />
          {/* Ensure JournalSection can call onJournalSubmit upon successful entry submission */}
          <JournalSection
            moodRating={moodRating}
            onJournalSubmit={onJournalSubmit}
          />
        </>
      )}
    </div>
  );
}

export default JournalEntry;
